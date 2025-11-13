import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv'


dotenv.config();


let transporter: Transporter;

try {
  
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
 

  if (!emailUser || !emailPass ) {
    throw new Error('Missing critical email environment variables (EMAIL_USER, EMAIL_PASS, or EMAIL_HOST).');
  }

  
 

  transporter = nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

 

} catch (err) {

  console.error('EMAIL CONFIGURATION FAILED:', err);
  
  throw err; 
}





export const sendEmail = async ({ to, subject, html, text }: { to: string; subject: string; html?: string; text?: string }) => {
  

  if (!to) {
    const error = new Error('Email recipient "to" address is missing.');
    
    error.name = 'MissingRecipientError';
    throw error; 
  }

  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: text || '',
    html: html || '',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (err) {
   
    console.error(`Email sending failed for recipient ${to}:`, err);
    
    const sendError = new Error('Failed to send email .');
    sendError.name = 'EmailSendFailure';
    
   
    throw sendError; 
  }
};