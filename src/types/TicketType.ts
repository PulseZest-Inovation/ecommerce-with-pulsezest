
export interface Ticket {
  id: string;
  subject: string;
  content: string;
  status: string;
  createdAt: { seconds: number; nanoseconds: number };
}