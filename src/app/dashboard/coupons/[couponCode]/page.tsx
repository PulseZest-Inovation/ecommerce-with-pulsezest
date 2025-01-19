'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import ManageCoupons from '@/components/manage-coupons/manage-coupons';
import { Col, Row, Spin, Card, Button, Popover } from 'antd';
const { Meta } = Card;

type Props = {};

// Assuming CouponsType is defined with a "code" property
type CouponsType = {
  code: string; // The code field we need
};

export default function EditViewCoupons({}: Props) {
  const { couponCode } = useParams() as { couponCode: string }; // Get couponCode from URL params
  const [coupon, setCoupon] = useState<string | null>(null); // Only store the coupon code
  const [loading, setLoading] = useState(true);

  if (!couponCode) {
    return <Spin />; // If couponCode is not available, show loading spinner
  }

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        // Fetch the coupon by couponCode, ensuring it returns a CouponsType
        const fetchedCoupon = await getDataByDocName<CouponsType>('coupons', couponCode);
        
        if (fetchedCoupon && fetchedCoupon.code) {
          setCoupon(fetchedCoupon.code); // Set only the coupon code
        } else {
          setCoupon(couponCode); // Fallback to the couponCode if not found
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [couponCode]);

  if (loading) {
    return <Spin />; // Show a loading spinner while data is being fetched
  }

  return (
    <div>
      <Row>
        <Col flex={4}>
          <ManageCoupons id={couponCode} /> {/* Pass couponCode to ManageCoupons */}
        </Col>
        <Col flex={2}>
          <div style={{ position: 'sticky', top: '20px' }}>
            <Card style={{ width: 400 }}>
              <Popover
                content={
                  <div>
                    <p><strong>Percentage Discount:</strong> This discount reduces the price by a specified percentage.</p>
                    <p><strong>Fixed Discount:</strong> This discount provides a fixed amount off the total price.</p>
                  </div>
                }
                title="Discount Explanation"
              >
                <Button type="link">When do we use the Percentage and Fixed Discount?</Button>
              </Popover>
            </Card>

            <Card className="mt-5">
              <Meta description="How to use Coupons?" />
              <h1 className="font-mono text-xl font-semibold mt-4 bg-yellow-300 p-4 rounded-lg text-center text-gray-800">
                {coupon} {/* Display coupon code here */}
              </h1>
              <p className="mt-4 text-gray-600">
                Coupons are always case-sensitive*.
              </p>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
