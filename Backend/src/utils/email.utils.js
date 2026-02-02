import nodemailer from 'nodemailer';

// ✅ IMPROVED: Better email transporter creation
const createTransporter = () => {
    try {
        // Check if Gmail credentials are available
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            console.log('📧 Configuring Gmail transporter...');
            console.log('📧 Email User:', process.env.EMAIL_USER);
            
            return nodemailer.createTransporter({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                // ✅ Better timeout and connection settings for Render
                connectionTimeout: 10000,
                greetingTimeout: 5000,
                socketTimeout: 10000,
            });
        } 
        
        // Fallback: Ethereal for testing
        if (process.env.ETHEREAL_EMAIL && process.env.ETHEREAL_PASSWORD) {
            console.log('📧 Configuring Ethereal transporter (testing)...');
            return nodemailer.createTransporter({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.ETHEREAL_EMAIL,
                    pass: process.env.ETHEREAL_PASSWORD,
                },
            });
        }
        
        // No email configured
        console.log('⚠️ No email service configured. Emails will be logged to console only.');
        console.log('⚠️ Please set EMAIL_USER and EMAIL_PASSWORD environment variables');
        return null;
        
    } catch (error) {
        console.error('❌ Error creating email transporter:', error);
        return null;
    }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name
 */
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
    try {
        const transporter = createTransporter();

        // ✅ FIXED: Use FRONTEND_URL from environment (supports both localhost and production)
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';
        const resetLink = `${frontendURL}/reset-password?token=${resetToken}`;

        console.log('📧 Attempting to send password reset email...');
        console.log('📧 To:', email);
        console.log('📧 Frontend URL:', frontendURL);
        console.log('📧 Reset Link:', resetLink);

        // If no transporter, log and throw error
        if (!transporter) {
            console.error('❌ Email transporter not configured!');
            console.log('📧 ===== PASSWORD RESET EMAIL (NOT SENT - NO CONFIG) =====');
            console.log('To:', email);
            console.log('User:', userName);
            console.log('Reset Link:', resetLink);
            console.log('Token:', resetToken);
            console.log('=======================================================');
            
            throw new Error('Email service not configured. Please contact administrator.');
        }
        
        // ✅ Verify transporter before sending
        try {
            await transporter.verify();
            console.log('✅ Email transporter verified successfully');
        } catch (verifyError) {
            console.error('❌ Email transporter verification failed:', verifyError.message);
            throw new Error('Email service configuration error. Please check credentials.');
        }
        
        // Email HTML template
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - InvestBeans</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            margin: 0;
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            color: #facc15;
          }
          .header h1 {
            color: white;
            margin: 10px 0 0 0;
            font-size: 28px;
            font-weight: 700;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .message {
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .button-container {
            text-align: center;
            margin: 35px 0;
          }
          .reset-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          }
          .info-box {
            background: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 16px 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .info-box p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
          }
          .security-notice {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 16px 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .security-notice p {
            margin: 0;
            color: #991b1b;
            font-size: 14px;
          }
          .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            color: #6b7280;
            font-size: 13px;
            margin: 5px 0;
          }
          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">InvestBeans</div>
            <h1>Password Reset Request</h1>
          </div>

          <div class="content">
            <p class="greeting">Hi ${userName || 'there'},</p>
            
            <p class="message">
              We received a request to reset your password for your InvestBeans account. 
              If you made this request, click the button below to create a new password:
            </p>

            <div class="button-container">
              <a href="${resetLink}" class="reset-button">Reset My Password</a>
            </div>

            <div class="info-box">
              <p><strong>⏰ Important:</strong> This link will expire in 1 hour for security purposes.</p>
            </div>

            <p class="message">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="word-break: break-all; color: #2563eb; font-size: 13px; padding: 10px; background: #f9fafb; border-radius: 8px;">
              ${resetLink}
            </p>

            <div class="divider"></div>

            <div class="security-notice">
              <p><strong>🔒 Security Notice:</strong> If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged and your account is secure.</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>InvestBeans</strong></p>
            <p>Smart Investing Made Simple</p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              © 2025 InvestBeans. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        // Plain text version (fallback)
        const textContent = `
Hi ${userName || 'there'},

We received a request to reset your password for your InvestBeans account.

Click the link below to reset your password:
${resetLink}

This link will expire in 1 hour for security purposes.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The InvestBeans Team

© 2025 InvestBeans. All rights reserved.
    `;

        // Send email
        console.log('📧 Sending email via Gmail...');
        
        const info = await transporter.sendMail({
            from: `"InvestBeans" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Reset Your InvestBeans Password',
            text: textContent,
            html: htmlContent,
        });

        console.log('✅ Password reset email sent successfully!');
        console.log('✅ Message ID:', info.messageId);
        console.log('✅ Response:', info.response);

        // Log preview URL for Ethereal (development only)
        if (process.env.ETHEREAL_EMAIL) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                console.log('📧 Preview URL:', previewUrl);
            }
        }

        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Error sending password reset email:');
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);

        // Throw the error so controller can handle it
        throw error;
    }
};

/**
 * Send password reset confirmation email
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 */
export const sendPasswordResetConfirmation = async (email, userName) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            console.log('📧 Password reset confirmation (console only) for:', email);
            return { success: true, mode: 'console' };
        }

        // ✅ Use FRONTEND_URL from environment
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:8080';

        console.log('📧 Sending password reset confirmation to:', email);

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #9333ea); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Successfully Reset</h1>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <p>Hi ${userName || 'there'},</p>
            <p>Your InvestBeans password has been successfully reset.</p>
            <p>You can now sign in with your new password.</p>
            <p style="text-align: center;">
              <a href="${frontendURL}/signin" class="button">Sign In Now</a>
            </p>
            <p style="margin-top: 30px; padding: 15px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
              <strong>Security Alert:</strong> If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

        const info = await transporter.sendMail({
            from: `"InvestBeans" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '✅ Your Password Has Been Reset - InvestBeans',
            html: htmlContent,
        });

        console.log('✅ Password reset confirmation email sent');
        console.log('✅ Message ID:', info.messageId);
        
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Error sending confirmation email:', error);
        // Don't throw error here - password was already reset successfully
        return { success: false, error: error.message };
    }
};