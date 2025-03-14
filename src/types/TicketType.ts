
export interface TicketType {
  ticketId: string;
  id: string;
   subject: string;
   content: string;
   status: string;
   clientEmail?: string;
   eventType: 'ticket_created' | 'ticket_closed' | 'ticket_reply';
   appName?: string;
   userId: string;
  createdAt: { seconds: number; nanoseconds: number };
}