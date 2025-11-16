import { Request, Response, NextFunction } from 'express';
// Assuming you have IUserDocument and IJobDocument types from your models
import { IUserDocument } from '../models/User';
import Job from '../models/Job';
import Application from '../models/Application';
// import Transaction from '../models/Transaction';
import mongoose from 'mongoose'; // Added for checking ObjectId casting

// Define the custom Request type with the authenticated user object
interface AuthRequest extends Request {
  user?: IUserDocument;
}

// --- 1. Create Job Controller ---
export const createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case: Check for successful authentication (Crucial if roleMiddleware isn't used)
  if (!req.user || req.user.role !== 'employer') {
    // Should be caught by roleMiddleware, but double-checking provides robust security.
    return res.status(403).json({ success: false, message: 'Forbidden: Only employers can create jobs' });
  }
  
  try {
    const { title, company, location, salary, description, category, experienceLevel, isPremium, perks } = req.body;

    // Edge Case: Ensure the postedBy field is a valid ObjectId and set from the authenticated user
    const postedBy = req.user._id;

    const job = new Job({
      title,
      company,
      location,
      salary,
      description,
      category,
      experienceLevel,
      // Robustly cast isPremium to a boolean
      isPremium: !!isPremium, 
      perks,
      postedBy
    });
    
    await job.save();

    // Edge Case: Handling optional Socket.io event emission failure gracefully
    try {
      const io = req.app.get('io') as any;
      if (io) io.emit('newJob', { jobId: job._id, title: job.title, company: job.company, isPremium: job.isPremium });
    } catch (socketErr) {
      console.warn('Socket.io emission failed but is non-critical:', socketErr);
    }
    
    // 201 Created: Standard successful status for creating a new resource.
    res.status(201).json({ success: true, job });
  } catch (err) {
    // Delegates Mongoose Validation/DB errors (e.g., missing required fields) to global handler
    next(err);
  }
};

export const getJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '10', q, location, category, experienceLevel, isPremium } = req.query as any;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    const filter: any = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (category) filter.category = category;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    
    if (isPremium !== undefined) {
      const premiumValue = String(isPremium).toLowerCase();
      if (premiumValue === 'true' || premiumValue === 'false') {
        filter.isPremium = premiumValue === 'true';
      }
    }

    const skip = Math.max(0, (pageNum - 1) * limitNum);

    const total = await Job.countDocuments(filter);
    
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('postedBy', 'name email'); 

    // 200 OK
    res.status(200).json({ 
      success: true,
      jobs, 
      total, 
      page: pageNum, 
      pages: Math.ceil(total / limitNum) 
    });
  } catch (err) {
    next(err);
  }
};

// --- 3. Get Job By ID Controller ---
export const getJobById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;
    
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }
    
    const job = await Job.findById(jobId).populate('postedBy', 'name email');
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // 200 OK
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const  jobId = req.params.id;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to update this job' });
    }

    delete req.body.postedBy; 

    // Update fields and save
    Object.assign(job, req.body);
    await job.save(); 
    // 200 OK
    res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

// --- 5. Delete Job Controller ---
export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user!._id.toString()) {
      // 403 Forbidden
      return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to delete this job' });
    }

    
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({ success: true, message: 'Job and associated applications deleted successfully' });
  } catch (err) {
    
    next(err);
  }
};