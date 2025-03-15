import React, { useState, useEffect } from 'react';
import { Button, Input, message } from 'antd';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firbeaseConfig';
import { TicketType } from '@/types/TicketType';
import DOMPurify from "dompurify";


interface Reply {
  id: string;
  senderId: string;
  senderType: 'client' | 'support';
  message: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

export default function TicketDetails({
  ticket,
  userId,
  senderType,
  clientEmail,
  onBack,
}: {
  ticket: TicketType;
  userId: string;
  senderType: 'client' | 'support';
  clientEmail: string;
  onBack: () => void;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyMessage, setReplyMessage] = useState('');

  // Fetch replies in real-time
  useEffect(() => {
    const repliesRef = collection(db, `ticket/${ticket.id}/replies`);
    const q = query(repliesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReplies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reply[];
      setReplies(fetchedReplies);
    });

    return () => unsubscribe();
  }, [ticket.id]);

  // Function to send a reply
  const sendReply = async () => {
    if (!replyMessage.trim()) {
      message.error('Reply cannot be empty');
      return;
    }

    console.log(clientEmail);

    try {
      const replyRef = collection(db, `ticket/${ticket.id}/replies`);
      await addDoc(replyRef, {
        senderId: userId,
        senderType,
        message: replyMessage,
        createdAt: serverTimestamp(),
      });

      // Send email notification
      await fetch('/api/ticket/send-reply-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: ticket.id,
          subject: ticket.subject,
          content: replyMessage,
          clientEmail: clientEmail,
          eventType: 'ticket_reply',
          senderType: 'client'
        }),
      });

      message.success('Reply sent successfully!');
      setReplyMessage(''); // Clear input field
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error('Failed to send reply');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ticket Details</h2>
        <Button type="default" onClick={onBack}>
          Back
        </Button>
      </div>

      <p className="text-lg font-semibold">Subject: {ticket.subject}</p>
      <p className='font-mono bg-slate-400 font-bold'>{ticket.id}</p>
      <p className="text-xs text-gray-500">
        Created At: {ticket.createdAt?.seconds ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : 'Timestamp not available'}
      </p>

      <div className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-md ${ticket.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
        {ticket.status}
      </div>

      <div className="mt-4 p-4 border rounded-md bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Content:</h3>
        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: ticket.content }} />
      </div>


<div className="mt-6">
  <h3 className="text-lg font-semibold mb-2">Replies:</h3>
  <div className="space-y-3">
    {replies.length > 0 ? (
      replies.map((reply) => (
        <div
          key={reply.id}
          className={`p-3 rounded-md ${
            reply.senderType === "client" ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <p className="text-sm font-semibold">
            {reply.senderType === "client" ? "You" : "Support Team"}:
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(reply.message),
            }}
          />
          <p className="text-xs text-gray-500">
            {reply.createdAt?.seconds
              ? new Date(reply.createdAt.seconds * 1000).toLocaleString()
              : "Timestamp not available"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm">No replies yet.</p>
    )}
  </div>
</div>


      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Reply:</h3>
        <Input.TextArea rows={4} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." />
        <Button type="primary" className="mt-2" onClick={sendReply}>
          Send Reply
        </Button>
      </div>
    </div>
  );
}
