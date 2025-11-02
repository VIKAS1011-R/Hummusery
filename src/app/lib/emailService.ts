import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
  },
});

// Verify transporter configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service configuration error:', error);
    return false;
  }
};

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate verification token for fallback link
export const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Send OTP verification email
export const sendOTPEmail = async (
  email: string,
  name: string,
  otp: string,
  fallbackToken: string
): Promise<boolean> => {
  try {
    const fallbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email?token=${fallbackToken}`;
    
    const mailOptions = {
      from: {
        name: 'Hummusery',
        address: process.env.EMAIL_USER || 'noreply@hummusery.com'
      },
      to: email,
      subject: 'Verify Your Hummusery Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Hummusery!</h1>
            <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Authentic Middle Eastern Cuisine</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Thank you for joining Hummusery! To complete your registration and start ordering delicious Middle Eastern food, please verify your email address.
            </p>
            
            <div style="background: #f3f4f6; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #6b7280;">Your verification code is:</p>
              <div style="font-size: 36px; font-weight: bold; color: #f97316; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #9ca3af;">This code expires in 10 minutes</p>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">Having trouble?</h3>
              <p style="color: #92400e; margin: 0 0 15px 0; font-size: 14px;">
                If you can't enter the code above, you can also verify your account by clicking the button below:
              </p>
              <a href="${fallbackUrl}" 
                 style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                If you didn't create an account with Hummusery, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
                Questions? Contact us at <a href="mailto:hummusery1@gmail.com" style="color: #f97316;">hummusery1@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Hummusery. All rights reserved.</p>
            <p>Shop 150, 1st Main Rd, near Christ University, Bengaluru, Karnataka 560073</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Hummusery, ${name}!
        
        Thank you for joining us! To complete your registration, please verify your email address.
        
        Your verification code is: ${otp}
        
        This code expires in 10 minutes.
        
        Alternatively, you can verify your account by visiting: ${fallbackUrl}
        
        If you didn't create an account with Hummusery, you can safely ignore this email.
        
        Questions? Contact us at hummusery1@gmail.com
        
        © 2024 Hummusery. All rights reserved.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: {
        name: 'Hummusery',
        address: process.env.EMAIL_USER || 'noreply@hummusery.com'
      },
      to: email,
      subject: 'Welcome to Hummusery! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Hummusery</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to Hummusery!</h1>
            <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Your account is now verified</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 🍽️</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Congratulations! Your email has been verified and your Hummusery account is now active.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              You can now enjoy:
            </p>
            
            <ul style="font-size: 16px; margin-bottom: 30px; padding-left: 20px;">
              <li style="margin-bottom: 10px;">🥙 Browse our authentic Middle Eastern menu</li>
              <li style="margin-bottom: 10px;">🛒 Easy online ordering and cart management</li>
              <li style="margin-bottom: 10px;">📱 Track your orders in real-time</li>
              <li style="margin-bottom: 10px;">⭐ Save your favorite dishes</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/menu" 
                 style="display: inline-block; background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Start Ordering Now
              </a>
            </div>
            
            <div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #15803d; margin: 0 0 10px 0; font-size: 16px;">🎁 Special Welcome Offer</h3>
              <p style="color: #15803d; margin: 0; font-size: 14px;">
                As a new member, enjoy free delivery on your first order! No minimum order required.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                Need help? Contact us at <a href="mailto:hummusery1@gmail.com" style="color: #f97316;">hummusery1@gmail.com</a> or call 074839 39713
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Hummusery. All rights reserved.</p>
            <p>Shop 150, 1st Main Rd, near Christ University, Bengaluru, Karnataka 560073</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Hummusery, ${name}!
        
        Congratulations! Your email has been verified and your account is now active.
        
        You can now enjoy:
        - Browse our authentic Middle Eastern menu
        - Easy online ordering and cart management
        - Track your orders in real-time
        - Save your favorite dishes
        
        Special Welcome Offer: Enjoy free delivery on your first order!
        
        Start ordering: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/menu
        
        Need help? Contact us at hummusery1@gmail.com or call 074839 39713
        
        © 2024 Hummusery. All rights reserved.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<boolean> => {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'Hummusery',
        address: process.env.EMAIL_USER || 'noreply@hummusery.com'
      },
      to: email,
      subject: 'Reset Your Hummusery Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
            <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Hummusery Account Security</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We received a request to reset the password for your Hummusery account. If you made this request, click the button below to reset your password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset My Password
              </a>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Security Information</h3>
              <ul style="color: #92400e; margin: 0; font-size: 14px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">This link will expire in 1 hour for security reasons</li>
                <li style="margin-bottom: 8px;">If you didn't request this reset, please ignore this email</li>
                <li style="margin-bottom: 8px;">Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; font-weight: bold;">
                Can't click the button? Copy and paste this link into your browser:
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b7280; word-break: break-all;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                If you're having trouble or didn't request this reset, contact us at <a href="mailto:hummusery1@gmail.com" style="color: #f97316;">hummusery1@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Hummusery. All rights reserved.</p>
            <p>Shop 150, 1st Main Rd, near Christ University, Bengaluru, Karnataka 560073</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Hummusery
        
        Hi ${name}!
        
        We received a request to reset the password for your Hummusery account.
        
        If you made this request, click the link below to reset your password:
        ${resetUrl}
        
        Important Security Information:
        - This link will expire in 1 hour for security reasons
        - If you didn't request this reset, please ignore this email
        - Your password will remain unchanged until you create a new one
        
        If you're having trouble or didn't request this reset, contact us at hummusery1@gmail.com
        
        © 2024 Hummusery. All rights reserved.
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};