import { Request, Response, NextFunction } from 'express';
import Job from '../models/Job';
// import Application from '../models/Application'; // <-- REMOVED: No longer strictly necessary due to aggregation
import { IUserDocument } from '../models/User'; 

interface AuthRequest extends Request {
  user?: IUserDocument;
}

/**
 * Controller to fetch key statistics for an authenticated employer.
 */
export const employerStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Check for Authentication and Role
  if (!req.user || req.user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to employers' });
  }

  try {
    const employerId = req.user._id;

    // --- Data Retrieval using Aggregation ---
    const result = await Job.aggregate([
      { 
        $match: { postedBy: employerId } 
      },
      {
        // The `$lookup` stage uses the data from the 'applications' collection
        $lookup: {
          from: 'applications', 
          localField: '_id',
          foreignField: 'job',
          as: 'applications'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          applicationCount: { $size: '$applications' },
        }
      },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          totalApplicants: { $sum: '$applicationCount' },
          perJob: { 
            $push: { 
              jobId: '$_id', 
              title: '$title', 
              applicants: '$applicationCount' 
            } 
          }
        }
      }
    ]);
    
    // Edge Case 2: Handle case where the employer has no jobs
    const stats = result[0];
    if (!stats) {
      return res.status(200).json({
        success: true,
        totalJobs: 0,
        totalApplicants: 0,
        conversionRate: 0,
        perJob: [],
      });
    }
    
    const { totalJobs, totalApplicants, perJob } = stats;

    // Edge Case 3: Conversion Rate Calculation
    const conversionRate = totalJobs > 0 
      ? parseFloat(((totalApplicants / totalJobs) * 100).toFixed(2)) 
      : 0;

    res.status(200).json({ 
      success: true,
      totalJobs, 
      totalApplicants, 
      conversionRate, 
      perJob 
    });
  } catch (err) {
    next(err);
  }
};


