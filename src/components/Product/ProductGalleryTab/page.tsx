import React from 'react';
import { ProductType } from '@/types/Product';
import ProductFeatureImage from './ProductFeatureImage';
import ProductGalleryImage from './ProductGallery';
import ProductVideo from './ProductVideo';
import { Col, Row, Card } from 'antd';

interface ProductGalleryType {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
  slug: string;
}

export default function ProductGalleryTab({ formData, onFormDataChange }: ProductGalleryType) {
  return (
    <div className="space-y-6 sm:px-6 lg:px-8">
      {/* Image Section */}
      <Row
        gutter={[16, 16]}
        justify="center"
        className="w-full m-0"
        style={{ maxWidth: '100%' }}
      >
        {/* Feature Image */}
        <Col xs={24} sm={24} lg={12}>
          <Card
            title="Feature Image"
            bordered={false}
            className="shadow-md bg-slate-300"
            bodyStyle={{ overflow: 'hidden' }}
          >
            <ProductFeatureImage
              featuredImage={formData.featuredImage}
              onFeaturedImageChange={(url) => onFormDataChange('featuredImage', url)}
              slug={formData.slug}
            />
          </Card>
        </Col>

        {/* Gallery Images */}
        <Col xs={24} sm={24} lg={12}>
          <Card
            title="Gallery Images"
            bordered={false}
            className="shadow-md bg-slate-300"
            bodyStyle={{ overflow: 'hidden' }}
          >
            <ProductGalleryImage
              galleryImages={formData.galleryImages}
              onGalleryChange={(images) => onFormDataChange('galleryImages', images)}
              slug={formData.slug}
            />
          </Card>
        </Col>
      </Row>

      {/* Video Section */}
      <Row
        gutter={[16, 16]}
        justify="center"
        className="w-full m-0"
        style={{ maxWidth: '100%' }}
      >
        {/* Product Video */}
        <Col xs={24}>
          <Card
            title="Product Video"
            bordered={false}
            className="shadow-md bg-slate-300"
            bodyStyle={{ overflow: 'hidden' }}
          >
            <ProductVideo
              videoUrl={formData.videoUrl}
              onVideoChange={(url) => onFormDataChange('videoUrl', url)}
              slug={formData.slug}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
