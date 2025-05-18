import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: true,
  });

  const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your ScienceBlog account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3182ce;">Verify your ScienceBlog account</h2>
        <p>Thank you for signing up for ScienceBlog! Please click the button below to verify your email address:</p>
        <a 
          href="${verificationUrl}" 
          style="display: inline-block; background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;"
        >
          Verify Email
        </a>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #4a5568;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not sign up for a ScienceBlog account, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendSubscriptionConfirmationEmail(
  email: string,
  name: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: true,
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to ScienceBlog Premium!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3182ce;">Welcome to ScienceBlog Premium, ${name}!</h2>
        <p>Thank you for subscribing to ScienceBlog! Your premium subscription is now active.</p>
        <p>As a premium subscriber, you now have access to:</p>
        <ul>
          <li>Commenting on all articles</li>
          <li>Access to exclusive content</li>
          <li>Early access to new publications</li>
          <li>Monthly newsletter with scientific insights</li>
        </ul>
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <p>Happy reading!</p>
        <p>The ScienceBlog Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}