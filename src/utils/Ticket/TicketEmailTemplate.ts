// emailTemplates.ts

export const ticketCreatedTemplate = (ticketId: string, subject: string, content: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
    <h2 style="color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Your Support Ticket is Open</h2>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Open</span></p>
    <hr>
    <h4 style="color: #333;">Message:</h4>
    <p style="background-color: #fff; padding: 15px; border-radius: 5px;">${content}</p>
    <hr>
    <p>We will get back to you shortly.</p>
    <p style="margin-top: 20px; font-size: 14px; color: #666;">Best regards,<br>
    <strong style="color: #000;">PulseZest Support</strong><br>
    <a href="mailto:support@pulsezest.com" style="color: #007bff; text-decoration: none;">support@pulsezest.com</a><br>
    <a href="https://pulsezest.com" style="color: #007bff; text-decoration: none;">pulsezest.com</a></p>
  </div>
`;

export const ticketClosedTemplate = (ticketId: string, subject: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
    <h2 style="color: red; border-bottom: 2px solid red; padding-bottom: 10px;">Your Support Ticket is Closed</h2>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Status:</strong> <span style="color: red; font-weight: bold;">Closed</span></p>
    <hr>
    <p>Thank you for reaching out to us. If you have further questions, feel free to open a new ticket.</p>
    <p style="margin-top: 20px; font-size: 14px; color: #666;">Best regards,<br>
    <strong style="color: #000;">PulseZest Support</strong><br>
    <a href="mailto:support@pulsezest.com" style="color: #007bff; text-decoration: none;">support@pulsezest.com</a><br>
    <a href="https://pulsezest.com" style="color: #007bff; text-decoration: none;">pulsezest.com</a></p>
  </div>
`;

export const ticketReplyTemplate = (ticketId: string, subject: string, content: string, senderType: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
    <h2 style="color: #007bff;">PulseZest Support Response</h2>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>From:</strong> ${senderType === "admin" ? "PulseZest Support Team" : "Client"}</p>
    <hr>
    <h4>Message:</h4>
    <p style="background-color: #fff; padding: 15px; border-radius: 5px;">${content}</p>
    <hr>
    <p>Please check your ticket for further details.</p>
    <p style="margin-top: 20px; font-size: 14px; color: #666;">Best regards,<br>
    <strong style="color: #000;">PulseZest Support</strong><br>
    <a href="mailto:support@pulsezest.com" style="color: #007bff; text-decoration: none;">support@pulsezest.com</a><br>
    <a href="https://pulsezest.com" style="color: #007bff; text-decoration: none;">pulsezest.com</a></p>
  </div>
`;

export const devNotificationTemplate = (ticketId: string, subject: string, clientEmail: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
    <h2 style="color: #007bff;">New Support Ticket Notification</h2>
    <p>A new support ticket has been created.</p>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Client:</strong> ${clientEmail}</p>
    <hr>
    <p style="margin-top: 20px; font-size: 14px; color: #666;">Best regards,<br>
    <strong style="color: #000;">PulseZest Support</strong><br>
    <a href="mailto:support@pulsezest.com" style="color: #007bff; text-decoration: none;">support@pulsezest.com</a><br>
    <a href="https://pulsezest.com" style="color: #007bff; text-decoration: none;">pulsezest.com</a></p>
  </div>
`;
