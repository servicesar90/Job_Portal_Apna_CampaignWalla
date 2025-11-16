import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { IUserDocument } from '../models/User'; 
import mongoose from 'mongoose'; 
interface AuthRequest extends Request {
  user?: IUserDocument;
}

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required' });
  }

  try {
    const userId = req.user._id;

    // Edge Case 2: Ensure we only fetch notifications for the authenticated user
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('-user'); 

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Authentication required' });
  }

  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID format' });
    }

    const notif = await Notification.findById(id);

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    if (notif.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Not authorized to modify this notification' });
    }

    if (notif.read === true) {
        return res.status(200).json({ success: true, message: 'Notification already marked as read', notif });
    }
    
    // Update and save
    notif.read = true;
    await notif.save();
    
    // 200 OK
    res.status(200).json({ success: true, notif });
  } catch (err) {
    
    next(err);
  }
};