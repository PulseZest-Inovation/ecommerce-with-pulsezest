
export interface Ticket {
  id: string;
  Subject: string;
  content: string;
  status: string;
  createdAt: { seconds: number; nanoseconds: number };
}