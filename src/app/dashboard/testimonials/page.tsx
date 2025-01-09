'use client'

import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Spin } from 'antd';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { createDocWithAutoId } from '@/services/FirestoreData/postFirestoreData';
import { updateDocFields } from '@/services/FirestoreData/postFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';
import TestimonialForm from '@/components/Testimonials/TestimonialForm';
import TestimonialList from '@/components/Testimonials/TestimonialList';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState<any | null>(null); // For editing purposes
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for spinner

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true); // Show the spinner when fetching data
      const data = await getAllDocsFromCollection<any>('testimonials');
      setTestimonials(data);
      setLoading(false); // Hide the spinner once data is fetched
    };
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = async (testimonialData: { text: string; name: string; imageUrl?: string }) => {
    setLoading(true); // Show spinner while adding
    const newDocId = await createDocWithAutoId('testimonials', testimonialData);
    if (newDocId) {
      setTestimonials([...testimonials, { id: newDocId, ...testimonialData }]);
    }
    setLoading(false); // Hide spinner after adding
  };

  const handleEditTestimonial = (testimonial: any) => {
    setCurrentTestimonial(testimonial);
    setModalVisible(true);
  };

  const handleSaveTestimonial = async (testimonialData: { text: string; name: string; imageUrl?: string }) => {
    if (currentTestimonial) {
      setLoading(true); // Show spinner while updating
      const success = await updateDocFields('testimonials', currentTestimonial.id, testimonialData);
      if (success) {
        setTestimonials(
          testimonials.map((testimonial) =>
            testimonial.id === currentTestimonial.id ? { ...testimonial, ...testimonialData } : testimonial
          )
        );
        setModalVisible(false);
        setCurrentTestimonial(null);
      }
      setLoading(false); // Hide spinner after updating
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    setLoading(true); // Show spinner while deleting
    const success: boolean = await deleteDocFromCollection('testimonials', id);
    if (success) {
      setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
    }
    setLoading(false); // Hide spinner after deleting
  };

  return (
    <div>
      {/* Show spinner while loading testimonials */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <TestimonialForm onSubmit={handleAddTestimonial} />
        </Col>

        <Col span={12}>
          <TestimonialList
            testimonials={testimonials}
            onEdit={handleEditTestimonial}
            onDelete={handleDeleteTestimonial}
          />
        </Col>
      </Row>

      {/* <Modal
        title="Edit Testimonial"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => handleSaveTestimonial({ text: '', name: '', imageUrl: '' })} disabled={loading}>
            Save
          </Button>,
        ]}
      >
        {currentTestimonial && (
          <TestimonialForm onSubmit={handleSaveTestimonial}  />
        )}
      </Modal> */}
    </div>
  );
}
