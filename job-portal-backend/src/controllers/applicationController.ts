import { Request, Response, NextFunction } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';
import Notification from '../models/Notification';
import User, { IUserDocument } from '../models/User';
import { sendEmail } from '../utils/email';
import mongoose from 'mongoose'; 

// Define the custom Request type with the authenticated user object
interface AuthRequest extends Request {
  user?: IUserDocument;
}

export const applyForJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Forbidden: Only candidates can apply for jobs' });
  }

  const jobId = req.params.jobId;
  const { resumeLink, coverLetter } = req.body;
  const candidateId = req.user._id;

  try {
    if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    const job = await Job.findById(jobId).select('+postedBy'); 
    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const alreadyApplied = await Application.findOne({ job: jobId, candidate: candidateId });
    if (alreadyApplied) {
        return res.status(409).json({ success: false, message: 'Conflict: Already applied to this job' });
    }

    

    const application = new Application({
      job: job._id,
      candidate: candidateId,
      resumeLink,
      coverLetter
    });

    await application.save(); 

    job.applicationCount = (job.applicationCount || 0) + 1;
    await job.save();

    // Edge Case 5: Get Employer details
    const employer = await User.findById(job.postedBy).select('email');
    if (!employer) {
        console.warn(`Employer for job ${jobId} not found. Cannot send email/notification.`);
       
    } else {
        const notification = new Notification({
            user: employer._id,
            title: 'New Application',
            message: `${req.user.name} applied to ${job.title}`
        });
        await notification.save();

       
        sendEmail({
            to: employer.email,
            subject: `New Application for ${job.title}`,
            text: `${req.user.name} applied to your job`
        }).catch(console.error);

      
        const io = req.app.get('io') as any;
        if (io) io.to(employer._id.toString()).emit('newApplication', { jobId: job._id, candidateId: candidateId });
    }
    
    // 201 Created
    res.status(201).json({ success: true, application });

  } catch (err) {
    
    next(err);
  }
};

export const getCandidateApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to candidates' });
  }

  try {
    
    const applications = await Application.find({ candidate: req.user._id }).populate({
        path: 'job',
        select: 'title company location salary' // Limit fields to protect employer data
    });
    
    // 200 OK
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

export const getEmployerApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Authorization Check
  
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to employers' });
  }
  
  try {
    const { jobId } = req.query as { jobId?: string };
    const employerId = req.user._id;
    console.log("ghasfghafsgh",jobId,
employerId
    );
    

    // Edge Case 2: Get all jobs posted by the employer (selecting only ID for performance)
    const jobs = await Job.find({ postedBy: employerId }).select('_id');
    const jobIds = jobs.map(j => j._id!.toString());
    
    // Edge Case 3: If employer has no jobs
    if (jobIds.length === 0) {
      return res.status(200).json({ success: true, applications: [] });
    }

    let filter: any = { job: { $in: jobIds } };

    // Edge Case 4: Filter by a specific Job ID provided in query
    if (jobId) {
        // Edge Case 5: Authorization check for the specific jobId
        if (!jobIds.includes(jobId)) {
            // 403 Forbidden: Employer trying to access applications for a job they didn't post
            return res.status(403).json({ success: false, message: 'Forbidden: Not authorized for this job ID' });
        }
        filter.job = jobId;
    }

    // Edge Case 6: Population check - include only necessary candidate data
    const applications = await Application.find(filter)
      .populate('candidate', 'name email') // Removed 'resumeUrl' for privacy; candidates should access their own resume link.
      .populate('job', 'title');
    
    // 200 OK
    res.status(200).json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to employers' });
  }
  
  try {
    const { id } = req.params; 
    const { status } = req.body;
    
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }

    const application = await Application.findById(id).populate('job');
    if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const job = application.job as any;
    if (!job || !job.postedBy) {
        console.error(`Application ${id} linked to invalid job data.`);
        return res.status(500).json({ success: false, message: 'Internal Server Error: Corrupted application data' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
        // 403 Forbidden
        return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to modify this application status' });
    }
    
    const validStatuses = ['Pending', 'Reviewed', 'Interviewed', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

   
    const notification = new Notification({
      user: application.candidate,
      title: `Application Status Update`, // Better title
      message: `Your application for ${job.title} is now ${status}`
    });
    await notification.save().catch(console.error);

    const io = req.app.get('io') as any;
    if (io) io.to(application.candidate.toString()).emit('applicationStatus', { applicationId: application._id, status });

    // 200 OK
    res.status(200).json({ success: true, application });
  } catch (err) {
    next(err);
  }
};


export const withdrawApplication = async (req: AuthRequest, res: Response, next: NextFunction) => {
 
  if (!req.user || req.user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to candidates' });
  }
  
  try {
    const { id } = req.params; // Application ID
    const candidateId = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }

    const application = await Application.findById(id);
    
    if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    if (application.candidate.toString() !== candidateId.toString()) {
        // 403 Forbidden
        return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to withdraw this application' });
    }

    if (application.status === 'Withdrawn') {
         return res.status(400).json({ success: false, message: 'Application is already withdrawn' });
    }
    if (application.status === 'Hired' || application.status === 'Rejected') {
         return res.status(400).json({ success: false, message: `Cannot withdraw application with status: ${application.status}` });
    }

    application.status = 'Withdrawn';
    await application.save();

    // 200 OK
    res.status(200).json({ success: true, message: 'Application withdrawn successfully', application });
  } catch (err) {
    next(err);
  }
};