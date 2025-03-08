import React from 'react';
import { Button } from 'antd';

interface Ticket {
  id: string;
  Subject: string;
  content: string; // HTML content
  status: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export default function TicketDetails({ ticket, onBack }: { ticket: Ticket; onBack: () => void }) {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
         {/* Back Button */}
        <div className='flex justify-between'>
      <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>

                <Button type="default" className="mt-4" onClick={onBack}>
                Back
            </Button>
        </div>
      
      {/* Ticket Subject */}
      <p className="text-lg font-semibold">Subject: {ticket.Subject}</p>

      {/* Created At */}
      <p className="text-gray-500">
        Created At: {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}
      </p>

      {/* Ticket Status */}
      <div
        className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-md ${
          ticket.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}
      >
        {ticket.status}
      </div>

      {/* Ticket Content (Rendered as HTML) */}
      <div className="mt-4 p-4 border rounded-md bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Content:</h3>
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: ticket.content }} // ✅ Safely render HTML content
        />
      </div>

     
    </div>
  );
}
