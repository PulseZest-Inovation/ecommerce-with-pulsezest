import { EmailConfig } from '@/config/EmailConfig';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const SUPPORT_EMAIL = EmailConfig.supportEmail;
const SUPPORT_PASSWORD = EmailConfig.supportPassword;
const SMTP_HOST = EmailConfig.SMTP_HOST;
const SMTP_PORT = parseInt(EmailConfig.SMTP_PORT || '587', 10);
const DEV_EMAIL = EmailConfig.devEmail;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { subject,  clientEmail, appName, content } = req.body;

    if (!subject || !clientEmail || !appName || !content) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
 
    // ✅ Validate Client Email
    if (!clientEmail.includes('@')) {
      console.error('❌ Invalid client email:', clientEmail);
      return res.status(400).json({ success: false, message: 'Invalid client email.' });
    }

    // ✅ Generate Unique Ticket ID
    const ticketId = `T-${Date.now().toString().slice(-6)}`;

    console.log(`🔹 Creating Support Ticket: ${ticketId}`);

    // ✅ Email Content
    const devEmailBody = `
      <p>A new ticket has been opened. Please check GitHub or talk to the admin.</p>
      <strong>Ticket ID:</strong> ${ticketId}<br>
      <strong>Subject:</strong> ${subject}<br>
      <strong>Client:</strong> ${clientEmail}
    `;

    const clientEmailBody = `
      <h3>Your support ticket has been opened successfully.</h3>
      <p><strong>Ticket ID:</strong> ${ticketId}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Status:</strong> Open</p>
      <hr>
      <h4>Message:</h4>
      ${content}
      <hr>
      <p>We will get back to you shortly.</p>
    `;

    // ✅ Send Emails
    const emailResults = await Promise.allSettled([
      sendEmail(DEV_EMAIL, 'New Ticket Opened - PulseZest Support', devEmailBody, true),
      sendEmail(clientEmail, 'Your Support Ticket is Open', clientEmailBody, true),
    ]);

    console.log('📬 Email Results:', emailResults);

    return res.status(200).json({ success: true, message: 'Ticket submitted successfully!' });

  } catch (error) {
    console.error('❌ Error submitting ticket:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// ✅ Improved Nodemailer Function with Debugging
async function sendEmail(to: string, subject: string, body: string, isHtml: boolean) {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // ✅ True for SSL (465), False for STARTTLS (587)
      auth: {
        user: SUPPORT_EMAIL,
        pass: SUPPORT_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"PulseZest Support" <${SUPPORT_EMAIL}>`,
      to,
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    });

    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Email sending failed to ${to}:`, error);
  }
}
