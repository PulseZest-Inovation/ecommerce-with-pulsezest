import { useState, useEffect } from 'react';
import { List, Card, Spin } from 'antd';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';

interface Ticket {
  id: string;
  Subject: string;
  status: string;
  createdAt: any;
}

interface RecentTicketProps {
  onSelectTicket: (ticketId: string) => void;
}

export default function RecentTicket({ onSelectTicket }: RecentTicketProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const allTickets = await getAllDocsFromCollection<Ticket>('tickets');
      // Sort tickets by latest date
      const sortedTickets = allTickets.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      );
      setTickets(sortedTickets);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          dataSource={tickets}
          renderItem={(ticket) => (
            <List.Item onClick={() => onSelectTicket(ticket.id)}>
              <Card hoverable className="w-full cursor-pointer">
                <p className="text-lg font-semibold">{ticket.Subject}</p>
                <p className="text-sm text-gray-500">Status: {ticket.status}</p>
                <p className="text-xs text-gray-400">
                  Created At: {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
