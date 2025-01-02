'use client'

import { List, Button } from 'antd';
import React from 'react';

interface Testimonial {
  id: string;
  text: string;
  name: string;
  imageUrl?: string;
}

interface TestimonialListProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
}

const TestimonialList: React.FC<TestimonialListProps> = ({ testimonials, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className='text-2xl font-bold text-center'> Testimonials</h2>
      <List
        itemLayout="horizontal"
        dataSource={testimonials}
        renderItem={(testimonial) => (
          <List.Item
            actions={[
              <Button key="edit" onClick={() => onEdit(testimonial)} type="link">
                Edit
              </Button>,
              <Button key="delete" onClick={() => onDelete(testimonial.id)} type="link" danger>
                Delete
              </Button>
            ]}
          >
            <List.Item.Meta
              title={testimonial.name}
              description={testimonial.text}
            />
            {testimonial.imageUrl ? (
              <img
                src={testimonial.imageUrl}
                alt={testimonial.name}
                style={{
                  width: '50px',
                  height: '75px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <div style={{ width: '50px', height: '75px', backgroundColor: '#f0f0f0', borderRadius: '8px' }} />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default TestimonialList;
