import { Col, Row } from 'antd';
import React from 'react';
import RecentTicket from './RecentTicket';
import OpenTicket from './OpenTicket';

export default function TicketManager() {
  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        {/* Recent Tickets Section */}
        <Col xs={24} md={8} >
          <h2 className="text-center text-xl font-semibold py-2">Recent Tickets</h2>
          <RecentTicket />
        </Col>

        {/* Open Ticket Section */}
        <Col xs={24} md={16}>
          <h2 className="text-center text-2xl font-bold py-2">Create a Ticket</h2>
          <OpenTicket />
        </Col>
      </Row>
    </div>
  );
}