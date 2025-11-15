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

// --- 1. Apply for Job Controller ---
export const applyForJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Check for authentication and correct role (Candidate)
  if (!req.user || req.user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Forbidden: Only candidates can apply for jobs' });
  }

  const jobId = req.params.jobId;
  const { resumeLink, coverLetter } = req.body;
  const candidateId = req.user._id;

  try {
    // Edge Case 2: Validate job ID format early
    if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({ success: false, message: 'Invalid job ID format' });
    }

    // Edge Case 3: Job Not Found
    const job = await Job.findById(jobId).select('+postedBy'); // Ensure postedBy is selected if hidden
    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Edge Case 4: Check if already applied (using a dedicated query for clarity)
    const alreadyApplied = await Application.findOne({ job: jobId, candidate: candidateId });
    if (alreadyApplied) {
        // 409 Conflict: Better than 400 when a unique constraint (job + candidate) is violated.
        return res.status(409).json({ success: false, message: 'Conflict: Already applied to this job' });
    }

    // --- Start Critical Operation (Database Atomicity Issue) ---
    // Note: To truly handle atomicity (where multiple saves must succeed or fail together), 
    // a MongoDB transaction is recommended, but we proceed with simple saves here.

    const application = new Application({
      job: job._id,
      candidate: candidateId,
      resumeLink,
      coverLetter
    });

    await application.save(); // Mongoose validation errors delegated to catch block

    // Increment application count robustly
    job.applicationCount = (job.applicationCount || 0) + 1;
    await job.save();

    // Edge Case 5: Get Employer details
    const employer = await User.findById(job.postedBy).select('email');
    if (!employer) {
        console.warn(`Employer for job ${jobId} not found. Cannot send email/notification.`);
        // Non-critical error, continue to 201 response.
    } else {
        // 6. Create Notification
        const notification = new Notification({
            user: employer._id,
            title: 'New Application',
            message: `${req.user.name} applied to ${job.title}`
        });
        await notification.save();

        // 7. Send Email (non-blocking)
        sendEmail({
            to: employer.email,
            subject: `New Application for ${job.title}`,
            text: `${req.user.name} applied to your job`
        }).catch(console.error);

        // 8. Emit Socket Event (non-blocking)
        const io = req.app.get('io') as any;
        if (io) io.to(employer._id.toString()).emit('newApplication', { jobId: job._id, candidateId: candidateId });
    }
    // --- End Critical Operation ---

    // 201 Created
    res.status(201).json({ success: true, application });

  } catch (err) {
    // Edge Case 9: Delegate Mongoose errors (Validation, DB connection)
    next(err);
  }
};

// --- 2. Get Candidate Applications ---
export const getCandidateApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Authorization Check
  if (!req.user || req.user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to candidates' });
  }

  try {
    // Find applications posted by the authenticated user
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

// --- 3. Get Employer Applications ---
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

// --- 4. Update Application Status Controller ---
export const updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Authorization Check
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to employers' });
  }
  
  try {
    const { id } = req.params; // Application ID
    const { status } = req.body;
    
    // Edge Case 2: Validate Application ID format
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }

    // Edge Case 3: Application Not Found
    const application = await Application.findById(id).populate('job');
    if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Edge Case 4: Check if the application's job field is populated and valid
    const job = application.job as any;
    if (!job || !job.postedBy) {
        // Internal server issue: Job data is corrupted or missing
        console.error(`Application ${id} linked to invalid job data.`);
        return res.status(500).json({ success: false, message: 'Internal Server Error: Corrupted application data' });
    }

    // Edge Case 5: Authorization Check - Must be the job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
        // 403 Forbidden
        return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to modify this application status' });
    }
    
    // Edge Case 6: Validate Status value (Should be done by validation middleware, but defensive check)
    const validStatuses = ['Pending', 'Reviewed', 'Interviewed', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    // 7. Notification and Socket event (non-critical)
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

// --- 5. Withdraw Application Controller ---
export const withdrawApplication = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Authorization Check
  if (!req.user || req.user.role !== 'candidate') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to candidates' });
  }
  
  try {
    const { id } = req.params; // Application ID
    const candidateId = req.user._id;

    // Edge Case 2: Validate Application ID format
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }

    const application = await Application.findById(id);
    
    // Edge Case 3: Application Not Found
    if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    // Edge Case 4: Authorization Check - Must be the candidate who applied
    if (application.candidate.toString() !== candidateId.toString()) {
        // 403 Forbidden
        return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to withdraw this application' });
    }

    // Edge Case 5: Check if already withdrawn or finalized (e.g., Hired/Rejected)
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