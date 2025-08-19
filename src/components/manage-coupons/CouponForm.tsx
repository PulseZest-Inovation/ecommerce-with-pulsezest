import React, { useState } from 'react';
import { Product } from '@/types/Product';
import { Form, Row, Col, Input, Button, Select, message, InputNumber, Popover } from 'antd';
import { CouponsType } from '@/types/CouponType';
import CategorySelector from '../Product/ProductDetailTab/CategorySelector';
import MultipleProductSelector from '@/components/Selector/MultipleProductSelector';

const { Option } = Select;

type CouponFormProps = {
  coupon: CouponsType;
  handleInputChange: (field: keyof CouponsType, value: any) => void;
  handleSave: () => void;
};

const CouponForm: React.FC<CouponFormProps> = ({ coupon, handleInputChange, handleSave }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleProductChange = (products: Product[]) => {
    if (products.length > 15) {
      message.warning('You can select up to 15 products only!');
      products = products.slice(0, 15);
    }
    setSelectedProducts(products);
     // ✅ save to coupon object too
  };

  const handleCategoryChange = (categories: string[]) => {
    
  };

  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Title*" required>
            <Input
              value={coupon.couponTitle}
              onChange={(e) => handleInputChange('couponTitle', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Sub title">
            <Input
              value={coupon.couponSubtitle}
              onChange={(e) => handleInputChange('couponSubtitle', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Code*" required>
            <Input
              value={coupon.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Amount/Percentage">
            <InputNumber
              value={coupon.amount}
              onChange={(value) => handleInputChange('amount', value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Discount Type">
            <Popover
              content="Choose between 'Fixed' or 'Percentage' discount type."
              title="Discount Type"
            >
              <Select
                value={coupon.discountType}
                onChange={(value) => handleInputChange('discountType', value)}
              >
                <Option value="fixed">Fixed</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
            </Popover>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Minimum Amount">
            <InputNumber
              value={coupon.minimumAmount}
              onChange={(value) => handleInputChange('minimumAmount', value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* ✅ Product Selector */}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Select Products">
            <MultipleProductSelector value={selectedProducts} onChange={handleProductChange} />
          </Form.Item>
        </Col>
      </Row>

      {/* ✅ Category Selector */}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="">
            <CategorySelector/>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" onClick={handleSave} style={{ width: '100%' }}>
          Save Coupon
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CouponForm;
