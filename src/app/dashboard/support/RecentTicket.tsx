import React, { useEffect, useState } from 'react';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';

interface Ticket {
  id: string;
  Subject: string;
  status: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function RecentTicket() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const data = await getAllDocsFromCollection<Ticket>('ticket');
      // Sort by latest date
      const sortedTickets = data.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      );
      setTickets(sortedTickets);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-center text-gray-500">No tickets found.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-medium">{ticket.Subject}</h3>
              <p className="text-sm text-gray-500">
                {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}
              </p>
              <span
                className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-md ${
                  ticket.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
