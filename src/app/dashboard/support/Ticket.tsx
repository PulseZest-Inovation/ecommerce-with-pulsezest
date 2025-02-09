'use client';
import { useState } from 'react';
import { Col, Row } from 'antd';
import RecentTicket from './RecentTicket';
import OpenTicket from './OpenTicket';

export default function TicketManager() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        {/* Recent Tickets Section */}
        <Col xs={24} md={8}>
          <h2 className="text-center text-xl font-semibold py-2">Recent Tickets</h2>
          <RecentTicket onSelectTicket={setSelectedTicketId} />
        </Col>

        {/* Open Ticket Section */}
        <Col xs={24} md={16}>
          <h2 className="text-center text-2xl font-bold py-2">
            {selectedTicketId ? 'View Ticket' : 'Create a Ticket'}
          </h2>
          <OpenTicket ticketId={selectedTicketId} />
        </Col>
      </Row>
    </div>
  );
}
