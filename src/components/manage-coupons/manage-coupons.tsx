import React, { useState, useEffect } from 'react';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { CouponsType } from '@/types/CouponType';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import {
  Row,
  Col,
  Input,
  Button,
  Select,
  InputNumber,
  Form,
  Popover,
  message,
  Spin,
} from 'antd';

const { Option } = Select;

const defaultCoupon: CouponsType = {
  id: '',
  couponTitle: '',
  couponSubtitle: '',
  code: '',
  amount: 0,
  slug: '',
  createdAt: Timestamp.now(),
  dateModifiedAt: Timestamp.now(),
  discountType: 'fixed',
  description: '',
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
          setCoupon(fetchedCoupon);
        } else {
          setCoupon({ ...defaultCoupon, id });
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
        message.error('Failed to fetch coupon data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleInputChange = (field: keyof CouponsType, value: any) => {
    setCoupon((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleSave = async () => {
    if (!coupon) {
      message.error('No coupon data to save.');
      return;
    }

    if (!coupon.slug || coupon.slug.trim() === '') {
      message.error('Invalid coupon ID.');
      return;
    }

    try {
      // Log the coupon data for debugging
      console.log('Saving coupon data:', coupon);

      const couponData = {
        ...coupon,
        dateModifiedAt: serverTimestamp(),
      };

      const success = await setDocWithCustomId('coupons', coupon.slug, couponData);

      if (success) {
        message.success('Coupon saved successfully!');
      } else {
        message.error('Failed to save coupon. Please try again.');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      message.error('An error occurred while saving the coupon.');
    }
  };

  if (loading)
    return (
      <div className="justify-center flex items-center h-screen">
        <Spin />
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Coupon</h1>
      {coupon ? (
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

          <Form.Item>
            <Button type="primary" onClick={handleSave} style={{ width: '100%' }}>
              Save Coupon
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>Failed to load coupon data.</div>
      )}
    </div>
  );
};

export default ManageCoupons;
