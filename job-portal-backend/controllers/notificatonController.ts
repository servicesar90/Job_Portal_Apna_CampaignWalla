import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { IUserDocument } from '../models/User'; // Assuming you have IUserDocument
import mongoose from 'mongoose'; // Added for ObjectId validation

// Define the custom Request type with the authenticated user object
interface AuthRequest extends Request {
  user?: IUserDocument;
}

// --- 1. Get Notifications Controller ---
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Check for Authentication (Crucial)
  if (!req.user) {
    // Should be handled by preceding authMiddleware, but defensive check is good.
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required' });
  }

  try {
    const userId = req.user._id;

    // Edge Case 2: Ensure we only fetch notifications for the authenticated user
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-user'); // Optionally exclude the user field from the output for cleaner data

    // Edge Case 3: Empty array is not a 404, it's a 200 success with no data.
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    // Delegates DB/Mongoose errors (500) to global handler
    next(err);
  }
};

// --- 2. Mark Read Controller ---
export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Edge Case 1: Check for Authentication
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required' });
  }

  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Edge Case 2: Validate ID format
    if (!mongoose.isValidObjectId(id)) {
      // 400 Bad Request: Client sent an ID that is syntactically wrong
      return res.status(400).json({ success: false, message: 'Invalid notification ID format' });
    }

    const notif = await Notification.findById(id);

    // Edge Case 3: Notification Not Found
    if (!notif) {
      // 404 Not Found: ID format was correct but no document exists.
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    // Edge Case 4: Authorization Check (Owner Check)
    if (notif.user.toString() !== userId.toString()) {
      // 403 Forbidden: User is authenticated but is not the owner of the resource
      return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to modify this notification' });
    }

    // Edge Case 5: Already Read Check (Avoid unnecessary DB write)
    if (notif.read === true) {
        // 200 OK: State is already what the user requested.
        return res.status(200).json({ success: true, message: 'Notification already marked as read', notif });
    }
    
    // Update and save
    notif.read = true;
    await notif.save();
    
    // 200 OK
    res.status(200).json({ success: true, notif });
  } catch (err) {
    // Delegates DB/Mongoose errors (500) to global handler
    next(err);
  }
};