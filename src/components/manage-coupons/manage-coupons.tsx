'use client';
import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { CouponsType } from '@/types/CouponType';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import Image from 'next/image';
import { Row, Col, Input, Button, Checkbox, Select, DatePicker, InputNumber, Form, Popover, Divider, Space, message, Spin } from 'antd';
import moment from 'moment';
import { Card } from 'antd';

const { Meta } = Card;
const { Option } = Select;

const defaultCoupon: CouponsType = {
  id: '',
  code: '',
  amount: 0,
  createdAt: new Date() as unknown as Timestamp,
  dateModifiedAt: new Date() as unknown as Timestamp,
  discountType: 'fixed',
  description: '',
  dateExpire: new Date() as unknown as Timestamp,
  usageCount: 0,
  productsId: [],
  excludeProductIds: [],
  usageLimit: 0,
  usageLimitPerUser: 0,
  freeShipping: false,
  productCategories: [],
  excludeSaleItems: false,
  minimumAmount: 0,
  usedBy: [],
  metaData: [],
};

type ManageCouponsProps = {
  id: any;
};

const ManageCoupons = ({ id }: ManageCouponsProps) => {
  const [coupon, setCoupon] = useState<CouponsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const fetchedCoupon = await getDataByDocName<CouponsType>('coupons', id);
        if (fetchedCoupon) {
          setCoupon({
            ...fetchedCoupon,
            dateExpire: fetchedCoupon.dateExpire || Timestamp.fromDate(new Date()), // Default to current date
          });
        } else {
          setCoupon({ ...defaultCoupon, id });
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleInputChange = (field: keyof CouponsType, value: any) => {
    setCoupon((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!coupon) return;

    try {
      const success = await setDocWithCustomId('coupons', coupon.id, {
        ...coupon,
        dateModifiedAt: new Date(),
      });

      if (success) {
        message.success("Update Done")
      } else {
        alert('Failed to save coupon. Please try again.');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      message.error("Something went Wrong!")
    }
  };

  if (loading) return <div className='justify-center flex items-center h-screen'><Spin/></div> ;

  return (
    <Row gutter={[16, 16]}>
      <Col flex={4}>
        <div className="p-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold mb-4">Manage Coupon</h1>
          {coupon ? (
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Code">
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
                <Col span={24}>
                  <Form.Item label="Description">
                    <Input.TextArea
                      value={coupon.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Discount Type">
                    <Popover
                      content="Choose between 'Fixed' or 'Percentage' discount type for the coupon. A 'fixed' discount gives a fixed value while a 'percentage' discount gives a percentage off."
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
                <Col span={12}>
                  <Form.Item label="Date Expire">
                    <DatePicker
                      value={coupon.dateExpire.toDate() ? moment(coupon.dateExpire.toDate()) : undefined}
                      onChange={(date) => handleInputChange('dateExpire', date?.toDate() || new Date())}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Usage Count">
                    <InputNumber
                      value={coupon.usageCount}
                      onChange={(value) => handleInputChange('usageCount', value)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Usage Limit">
                    <InputNumber
                      value={coupon.usageLimit}
                      onChange={(value) => handleInputChange('usageLimit', value)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Usage Limit Per User">
                    <InputNumber
                      value={coupon.usageLimitPerUser}
                      onChange={(value) => handleInputChange('usageLimitPerUser', value)}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Free Shipping">
                    <Checkbox
                      checked={coupon.freeShipping}
                      onChange={(e) => handleInputChange('freeShipping', e.target.checked)}
                    />
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
                <Col span={12}>
                  <Form.Item label="Exclude Sale Items">
                    <Checkbox
                      checked={coupon.excludeSaleItems}
                      onChange={(e) => handleInputChange('excludeSaleItems', e.target.checked)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Product Categories">
                    <Input
                      value={coupon?.productCategories?.join(', ') || ''}
                      onChange={(e) =>
                        handleInputChange('productCategories', e.target.value.split(',').map((item) => item.trim()))
                      }
                      placeholder="Enter categories separated by commas"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleSave}
                  style={{ width: '100%' }}
                >
                  Save Coupon
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div>Failed to load coupon data.</div>
          )}
        </div>
      </Col>

      <Col flex={2}>
          <div style={{position: 'sticky', top: '20px'}} >
          <Card
          style={{ width: 400 }}
        >
          <Popover
            content={
              <div>
                <p><strong>Percentage Discount:</strong> This discount reduces the price by a specified percentage.</p>
                <p><strong>Fixed Discount:</strong> This discount provides a fixed amount off the total price.</p>
              </div>
            }
            title="Discount Explanation"
          >
            <Button type="link">When we use the Percentage and Fixed Discount ?</Button>
          </Popover>
        </Card>

          

        <Card className='mt-5'>
          <Meta description= 'How to use  Coupons ?'></Meta>

          
          <h1 className="font-mono text-xl font-semibold mt-4 bg-yellow-300 p-4 rounded-lg text-center text-gray-800">
            {coupon?.code}
          </h1>

          <p className=" mt-4 text-gray-600">
            Couponse are always case Sensitive*.
          </p>
        </Card>

       
     
        
        
          </div>
      </Col>
    </Row>
  );
};

export default ManageCoupons;
