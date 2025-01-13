import React from 'react'
import { Product } from '@/types/Product';
import ProductFeatureImage from './ProductFeatureImage';
import ProductGalleryImage from './ProductGallery';
import ProductVideo from './ProductVideo';
import { Col, Row, Card } from 'antd';

interface ProductGalleryType {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
  slug: string;
}

export default function ProductGalleryTab({ formData, onFormDataChange }: ProductGalleryType) {
  return (
    <div className="space-y-6">
      {/* Image Section */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} lg={12}>
          <Card title="Feature Image" bordered={false} className="shadow-md bg-slate-300">
            <ProductFeatureImage
              featuredImage={formData.featuredImage}
              onFeaturedImageChange={(url) => onFormDataChange("featuredImage", url)}
              slug={formData.slug}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={12}>
          <Card title="Gallery Images" bordered={false} className="shadow-md bg-slate-300">
            <ProductGalleryImage
              galleryImages={formData.galleryImages}
              onGalleryChange={(images) => onFormDataChange("galleryImages", images)}
              slug={formData.slug}
            />
          </Card>
        </Col>
      </Row>

      {/* Video Section */}
      <Card title="Product Video" bordered={false} className="shadow-md bg-slate-300">
        <ProductVideo
          videoUrl={formData.videoUrl}
          onVideoChange={(url) => onFormDataChange("videoUrl", url)}
          slug={formData.slug}
        />
      </Card>
    </div>
  );
}
