import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

// Initialize SendGrid (preferred for production)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// Nodemailer transporter (backup option)
let transporter: nodemailer.Transporter | null = null

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

interface ContactFormData {
  name: string
  email: string
  organization?: string
  subject: string
  message: string
  interests?: string[]
}

interface SubscriptionData {
  email: string
  name?: string
  researchInterests?: string[]
  subscriptionType?: string
}

// Your email address for receiving notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'lduong@kth.se'
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@scientificblog.com'

export async function sendContactNotification(data: ContactFormData): Promise<boolean> {
  try {
    const subject = `🔔 New Contact Form Submission: ${data.subject}`
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          📧 New Contact Form Submission
        </h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ''}
          ${data.interests && data.interests.length > 0 ? `<p><strong>Research Interests:</strong> ${data.interests.join(', ')}</p>` : ''}
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Subject</h3>
          <p style="font-size: 16px; font-weight: 500;">${data.subject}</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #166534;">Message</h3>
          <div style="white-space: pre-wrap; line-height: 1.6;">${data.message}</div>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            💡 <strong>Quick Actions:</strong><br>
            • Reply directly to this email to respond to ${data.name}<br>
            • Visit your admin dashboard to manage contacts<br>
            • Time: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `

    const textContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}` : ''}
${data.interests && data.interests.length > 0 ? `Research Interests: ${data.interests.join(', ')}` : ''}

Subject: ${data.subject}

Message:
${data.message}

Time: ${new Date().toLocaleString()}
    `

    return await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject,
      html: htmlContent,
      text: textContent
    })

  } catch (error) {
    console.error('Failed to send contact notification:', error)
    return false
  }
}

export async function sendSubscriptionNotification(data: SubscriptionData): Promise<boolean> {
  try {
    const subject = `🎉 New Subscription: ${data.name || data.email}`
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          🎉 New Subscription!
        </h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #166534;">Subscriber Details</h3>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
          <p><strong>Subscription Type:</strong> 
            <span style="background: ${data.subscriptionType === 'premium' ? '#fef3c7' : '#e0f2fe'}; 
                         padding: 4px 8px; border-radius: 4px; font-weight: 500;">
              ${(data.subscriptionType || 'free').toUpperCase()}
            </span>
          </p>
          ${data.researchInterests && data.researchInterests.length > 0 ? 
            `<p><strong>Research Interests:</strong> ${data.researchInterests.join(', ')}</p>` : ''}
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Statistics</h3>
          <p>📅 <strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
          <p>📧 <strong>Total Subscribers:</strong> This requires database integration</p>
          <p>💎 <strong>Premium Subscribers:</strong> This requires database integration</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            💡 <strong>Next Steps:</strong><br>
            • Send a welcome email to the new subscriber<br>
            • Add them to your mailing list<br>
            • Consider sending your latest blog posts<br>
            ${data.subscriptionType === 'premium' ? '• Set up premium content access' : ''}
          </p>
        </div>
      </div>
    `

    const textContent = `
New Subscription!

Email: ${data.email}
Name: ${data.name || 'Not provided'}
Subscription Type: ${(data.subscriptionType || 'free').toUpperCase()}
${data.researchInterests && data.researchInterests.length > 0 ? `Research Interests: ${data.researchInterests.join(', ')}` : ''}

Subscribed: ${new Date().toLocaleString()}
    `

    return await sendEmail({
      to: ADMIN_EMAIL,
      subject,
      html: htmlContent,
      text: textContent
    })

  } catch (error) {
    console.error('Failed to send subscription notification:', error)
    return false
  }
}

interface EmailData {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

async function sendEmail(data: EmailData): Promise<boolean> {
  // Try SendGrid first (recommended for production)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const msg = {
        to: data.to,
        from: FROM_EMAIL,
        subject: data.subject,
        html: data.html,
        text: data.text,
        replyTo: data.replyTo
      }
      
      await sgMail.send(msg)
      console.log('✅ Email sent successfully via SendGrid')
      return true
    } catch (error) {
      console.error('SendGrid email failed:', error)
      // Fall through to try nodemailer
    }
  }

  // Try Nodemailer as backup
  if (transporter) {
    try {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        replyTo: data.replyTo
      })
      console.log('✅ Email sent successfully via Nodemailer')
      return true
    } catch (error) {
      console.error('Nodemailer email failed:', error)
    }
  }

  // If both fail, log the notification (for development)
  console.log('📧 EMAIL NOTIFICATION (No email service configured):')
  console.log('To:', data.to)
  console.log('Subject:', data.subject)
  console.log('Content:', data.text)
  console.log('---')
  
  return false
}

// Webhook notification function (optional - for external services like Slack, Discord, etc.)
export async function sendWebhookNotification(type: 'contact' | 'subscription', data: any): Promise<boolean> {
  const webhookUrl = type === 'contact' ? process.env.CONTACT_WEBHOOK_URL : process.env.SUBSCRIPTION_WEBHOOK_URL
  
  if (!webhookUrl) {
    return false
  }

  try {
    const payload = {
      text: type === 'contact' 
        ? `📧 New contact from ${data.name} (${data.email}): ${data.subject}`
        : `🎉 New subscription: ${data.name || data.email} (${data.subscriptionType || 'free'})`,
      timestamp: new Date().toISOString(),
      data
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(`✅ Webhook notification sent for ${type}`)
      return true
    } else {
      console.error(`Webhook failed for ${type}:`, response.statusText)
      return false
    }
  } catch (error) {
    console.error(`Webhook error for ${type}:`, error)
    return false
  }
}
