import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

import { sendEmail } from '../utils/email';
import { generateToken } from '../utils/generateToken';



interface RegisterBody {
  name: string;
  email: string
  password?: string; 
  role: 'candidate' | 'employer';
}


interface LoginBody {
  email: string;
  password?: string; 
}

// --- 1. Register Controller ---
export const register = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
 
  const { name, email, password, role } = req.body; 

  try {
    
    const existing = await User.findOne({ email });
    if (existing) {
      
      return res.status(409).json({ 
        success: false, 
        message: 'Conflict: Email already registered' 
      });
    }

    
    const user = new User({ name, email, password, role });
    await user.save(); 
    console.log('User registered:', user);

   
    sendEmail({
      to: user.email,
      subject: 'Welcome to Campaignwala',
      text: `Hi ${user.name}, welcome!`
    })
      .then(() => console.log(`Welcome email successfully queued for ${user.email}`))
      
      .catch(emailErr => {
        console.error(`ERROR: Failed to send welcome email to ${user.email}`, emailErr);
        
      });

   
    const token = generateToken(user);
    console.log('Generated Token:', token);
    
    
    res.status(201).json({ 
      success: true,
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
      token 
    });
  } catch (err) {
    
    next(err);
  }
};

// -----------------------------------

// --- 2. Login Controller ---
export const login = async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    
    
    const isPasswordCorrect = user && password ? await user.comparePassword(password) : false;

    if (!user || !isPasswordCorrect) {
      
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Invalid email or password' 
      });
    }
    
    
    const token = generateToken(user);
    
    
    res.status(200).json({ 
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
      token 
    });
  } catch (err) {
    
    next(err);
  }
};