import React from 'react';
import { Form, Row, Col, Input, Button, Select, InputNumber, Popover, Switch } from 'antd';
import { CouponsType } from '@/types/CouponType';

const { Option } = Select;

type CouponFormProps = {
  coupon: CouponsType;
  handleInputChange: (field: keyof CouponsType, value: any) => void;
  handleSave: () => void;
  products: { id: string; name: string }[];   
  categories: { id: string; name: string }[];
};

const CouponForm: React.FC<CouponFormProps> = ({ coupon, handleInputChange, handleSave, products, categories }) => {
  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Title*" required>
            <Input value={coupon.couponTitle} onChange={(e) => handleInputChange('couponTitle', e.target.value)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Sub title">
            <Input value={coupon.couponSubtitle} onChange={(e) => handleInputChange('couponSubtitle', e.target.value)} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Code*" required>
            <Input value={coupon.code} onChange={(e) => handleInputChange('code', e.target.value)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Amount/Percentage">
            <InputNumber value={coupon.amount} onChange={(value) => handleInputChange('amount', value)} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      {/* <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Description">
            <Input.TextArea value={coupon.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
          </Form.Item>
        </Col>
      </Row> */}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Discount Type">
            <Popover content="Choose between 'Fixed' or 'Percentage' discount type." title="Discount Type">
              <Select value={coupon.discountType} onChange={(value) => handleInputChange('discountType', value)}>
                <Option value="fixed">Fixed</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
            </Popover>
          </Form.Item>
        </Col>
        <Col span={12}>
          {/* <Form.Item label="Usage Limit">
            <InputNumber value={coupon.usageLimit} onChange={(value) => handleInputChange('usageLimit', value)} style={{ width: '100%' }} />
          </Form.Item> */}
        </Col>
      </Row>
      {/* Products and Categories field */}
      <Row gutter={16}>
        <Col span={12}>
        <Form.Item label="Apply to Products">
            <Select mode='multiple' allowClear value={coupon.productsId || []} onChange={(value) => handleInputChange('productsId', value)} placeholder="Select Products">
             {products.map((product: { id: string; name: string }) => (
              <Option key={product.id} value={product.id}>
              {product.name || product.id}
              </Option>
            ))}
            </Select>
        </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Apply To Categories">
            <Select
              mode="multiple"
              allowClear
              value={coupon.productCategories || []}
              onChange={(value) => handleInputChange('productCategories', value)}
              placeholder="Select Categories"
            >
              {categories.map((category: {id:string, name: string}) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* <Col span={12}>
          <Form.Item label="Usage Limit Per User">
            <InputNumber value={coupon.usageLimitPerUser} onChange={(value) => handleInputChange('usageLimitPerUser', value)} style={{ width: '100%' }} />
          </Form.Item>
        </Col> */}
        <Col span={12}>
          <Form.Item label="Minimum Amount">
            <InputNumber value={coupon.minimumAmount} onChange={(value) => handleInputChange('minimumAmount', value)} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      {/* <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Free Shipping">
            <Switch checked={coupon.freeShipping} onChange={(value) => handleInputChange('freeShipping', value)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Exclude Sale Items">
            <Switch checked={coupon.excludeSaleItems} onChange={(value) => handleInputChange('excludeSaleItems', value)} />
          </Form.Item>
        </Col>
      </Row> */}

       <Form.Item>
        <Button type="primary" onClick={handleSave} style={{ width: '100%' }}>
          Save Coupon
        </Button>
      </Form.Item>
     </Form> 
  );
};

export default CouponForm;
