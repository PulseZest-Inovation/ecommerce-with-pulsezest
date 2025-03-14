import { Col, Row } from 'antd';
import React, { useState } from 'react';
import RecentTicket from './RecentTicket';
import OpenTicket from './OpenTicket';
import TicketDetails from './TicketDetails';
import { TicketType } from '@/types/TicketType';

export default function TicketManager() {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  // Ensure userId is a string (default to an empty string if null)
  const key = localStorage.getItem('securityKey') || '';

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        {/* Recent Tickets Section */}
        <Col xs={24} md={8}>
          <h2 className="text-center text-xl font-semibold py-2">Recent Tickets</h2>
          <RecentTicket onTicketSelect={setSelectedTicket} />
        </Col>

        {/* Open Ticket or Ticket Details Section */}
        <Col xs={24} md={16}>
          {selectedTicket ? (
            <TicketDetails 
              clientEmail=""
              userId={key} 
              senderType="client" 
              ticket={selectedTicket} 
              onBack={() => setSelectedTicket(null)} 
            />
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold py-2">Create a Ticket</h2>
              <OpenTicket />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
