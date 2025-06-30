// Email configuration for nodemailer
export const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "user@example.com",
    pass: process.env.SMTP_PASS || "password",
  },
};

export const adminEmail = process.env.ADMIN_EMAIL || "your.email@university.edu";
