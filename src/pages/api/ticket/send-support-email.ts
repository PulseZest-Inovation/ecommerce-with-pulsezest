import { EmailConfig } from "@/config/EmailConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { ticketCreatedTemplate, ticketClosedTemplate, ticketReplyTemplate, devNotificationTemplate } from "@/utils/Ticket/TicketEmailTemplate";

import nodemailer from "nodemailer";

const SUPPORT_EMAIL = EmailConfig.supportEmail;
const SUPPORT_PASSWORD = EmailConfig.supportPassword;
const SMTP_HOST = EmailConfig.SMTP_HOST;
const SMTP_PORT = parseInt(EmailConfig.SMTP_PORT || "587", 10);
const DEV_EMAIL = EmailConfig.devEmail;
const ADMIN_EMAIL = EmailConfig.adminEmail;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // ✅ Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle Preflight Request (CORS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { ticketId, subject, clientEmail, appName, content, eventType, senderType } = req.body;

    // ✅ Validate Required Fields
    if (!eventType || !clientEmail || !content) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // ✅ Define Email Variables
    let emailSubject = "";
    let emailBody = "";

    // ✅ Handle Different Ticket Events
    switch (eventType) {
      case "ticket_created":
        emailSubject = "Your Support Ticket is Open";
        emailBody = ticketCreatedTemplate(ticketId, subject, content);
        break;
      
      case "ticket_closed":
        emailSubject = "Your Ticket is Closed";
        emailBody = ticketClosedTemplate(ticketId, subject);
        break;
      
      case "ticket_reply":
        emailSubject = `PulseZest Replied to Your Support Ticket`;
        emailBody = ticketReplyTemplate(ticketId, subject, content, senderType);
        break;
      

      default:
        return res.status(400).json({ success: false, message: "Invalid event type." });
    }

    // ✅ Send Email Notifications
    await sendEmail(clientEmail, emailSubject, emailBody, true);

    if (eventType === "ticket_created") {
      // Notify Dev/Admin for new tickets only
      const devEmailBody = devNotificationTemplate(ticketId, subject, clientEmail);
      await sendEmail(DEV_EMAIL, "New Support Ticket - PulseZest", devEmailBody, true);
      await sendEmail(ADMIN_EMAIL, "New Support Ticket - PulseZest", devEmailBody, true);
      

    }

    return res.status(200).json({ success: true, message: `Email sent for ${eventType}!` });
  } catch (error) {
    console.error("❌ Error handling ticket event:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// ✅ Reusable Email Sending Function
async function sendEmail(to: string, subject: string, body: string, isHtml: boolean) {
  try {
    console.log(`📧 Sending email to: ${to}`);

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
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
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
}
