import React from 'react';
import { Col, Row } from 'antd';
import TagForm from '@/components/Tags/CreateTag';
import TagsList from '@/components/Tags/ViewTags';

type Props = {};

export default function Tags({}: Props) {
  return (
    <div>
      <Row gutter={16}>
        {/* Create the Categories here */}
        <Col span={12}>
          <div className="sticky top-0 z-10 ">
            <TagForm />
          </div>
        </Col>

        {/* Show the Categories here */}
        <Col span={12}>
          <TagsList />
        </Col>
      </Row>
    </div>
  );
}
