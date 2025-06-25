import nodemailer from "nodemailer";

// Email configuration based on environment variables
function createTransporter() {
  // Check if email is disabled for testing
  if (process.env.EMAIL_DISABLED === 'true') {
    return null;
  }
  
  // Check if SendGrid is configured
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'SG.PASTE_YOUR_ACTUAL_SENDGRID_API_KEY_HERE') {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }
  
  // Fallback to SMTP configuration
  const config: any = {
    host: process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_SERVER_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD,
    },
  };

  // Gmail specific configuration
  if (config.host === 'smtp.gmail.com') {
    config.secure = false;
    config.requireTLS = true;
  }

  return nodemailer.createTransport(config);
}

// Send contact form email to admin
export async function sendContactNotification({
  name,
  email,
  subject,
  message,
  organization,
  interests
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  interests?: string[];
}) {
  if (!process.env.ADMIN_EMAIL) {
    console.log('📧 ADMIN_EMAIL not configured, skipping email notification');
    return;
  }

  try {
    const transporter = createTransporter();
    
    // Handle disabled email mode
    if (!transporter) {
      console.log('📧 Email disabled - Contact form submission logged but no email sent');
      console.log('📨 Contact Details:', { name, email, subject, organization, interests });
      return;
    }
    
    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM || email;

    const interestsText = interests && interests.length > 0 
      ? `\n\nAreas of Interest: ${interests.join(', ')}` 
      : '';

    const organizationText = organization 
      ? `\nOrganization: ${organization}` 
      : '';

    const mailOptions = {
      from: fromEmail,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `📧 Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${organizationText ? `<p><strong>Organization:</strong> ${organization}</p>` : ''}
            ${interestsText ? `<p><strong>Interests:</strong> ${interests?.join(', ')}</p>` : ''}
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Subject</h3>
            <p style="font-weight: 600; color: #1f2937;">${subject}</p>
            
            <h3 style="color: #374151;">Message</h3>
            <div style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${message}</div>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              💡 <strong>Quick Actions:</strong> Reply to this email to respond directly to ${name}, or visit your admin dashboard to manage this contact.
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>This email was sent from your Scientific Blog contact form.</p>
            <p>Received on ${new Date().toLocaleString('en-US', { 
              timeZone: 'UTC',
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} UTC</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error);
    throw error;
  }
}

// Send subscription confirmation email
export async function sendSubscriptionConfirmationEmail(
  email: string,
  name: string
) {
  if (!process.env.ADMIN_EMAIL && !process.env.SMTP_USER && !process.env.SENDGRID_API_KEY) {
    console.log('📧 Email not configured, skipping subscription confirmation');
    return;
  }

  try {
    const transporter = createTransporter();
    
    // Handle disabled email mode
    if (!transporter) {
      console.log('📧 Email disabled - Subscription logged but no email sent');
      console.log('📨 Subscription Details:', { email, name });
      return;
    }
    
    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM;

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Welcome to Scientific Blog!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Welcome to Scientific Blog, ${name || 'Fellow Researcher'}! 🎉
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin-top: 0;">Thank you for subscribing to our scientific blog! You're now part of our research community.</p>
            
            <h3 style="color: #374151;">What's Next?</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>📚 Access to all our research articles and insights</li>
              <li>🔬 Monthly newsletter with the latest scientific developments</li>
              <li>💬 Comment and engage with our research community</li>
              <li>🚀 Early access to new publications and findings</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/blog" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Explore Our Research →
            </a>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Stay Connected:</strong> Follow us for regular updates and feel free to reach out with any questions or collaboration ideas!
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>Best regards,<br>The Scientific Blog Team</p>
            <p style="margin-top: 20px;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscribe?unsubscribe=true" 
                 style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Subscription confirmation email sent successfully');
    
    // Also notify admin of new subscription
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: fromEmail,
        to: process.env.ADMIN_EMAIL,
        subject: `📬 New Subscriber: ${name || email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Subscription Alert</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to send subscription confirmation:', error);
    throw error;
  }
}

// Send verification email for authentication
export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const transporter = createTransporter();
    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM;
    const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}`;

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Verify your Scientific Blog account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Verify your Scientific Blog account</h2>
          <p>Thank you for signing up for Scientific Blog! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${verificationUrl}" 
              style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;"
            >
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #4b5563; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you did not sign up for a Scientific Blog account, you can safely ignore this email.</p>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>Best regards,<br>The Scientific Blog Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  if (!process.env.ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL environment variable is required');
  }

  try {
    const transporter = createTransporter();
    
    // Handle disabled email mode
    if (!transporter) {
      return {
        success: true,
        message: 'Email is disabled for testing. Contact forms will work but no emails will be sent.',
        configuration: {
          mode: 'disabled',
          admin_email: process.env.ADMIN_EMAIL,
          status: 'Email functionality is disabled via EMAIL_DISABLED=true'
        }
      };
    }
    
    // Verify transporter configuration
    await transporter.verify();
    
    // Send test email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: '✅ Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">Email Configuration Successful! ✅</h2>
          <p>Your email system is working correctly.</p>
          <p><strong>Configuration detected:</strong></p>
          <ul>
            <li>Provider: ${process.env.SENDGRID_API_KEY ? 'SendGrid' : 'SMTP'}</li>
            <li>Host: ${process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST || 'SendGrid'}</li>
            <li>From: ${process.env.FROM_EMAIL || process.env.EMAIL_FROM}</li>
            <li>Admin: ${process.env.ADMIN_EMAIL}</li>
          </ul>
          <p>Test sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });
    
    console.log('✅ Email configuration test successful');
    return { success: true, message: 'Email configuration is working correctly' };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    throw error;
  }
}

// Send webhook notification (for Slack, Discord, etc.)
export async function sendWebhookNotification(webhookUrl: string, data: any) {
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Webhook notification sent successfully');
  } catch (error) {
    console.error('❌ Failed to send webhook notification:', error);
    throw error;
  }
}
