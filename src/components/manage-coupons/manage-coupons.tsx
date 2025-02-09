'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { CouponsType } from '@/types/CouponType';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { message, Spin } from 'antd';
import CouponForm from './CouponForm';

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
  id: string;
};

const ManageCoupons = ({ id }: ManageCouponsProps) => {
  const [coupon, setCoupon] = useState<CouponsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const fetchedCoupon = await getDataByDocName<CouponsType>('coupons', id);
        setCoupon(fetchedCoupon || { ...defaultCoupon, id });
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
    setCoupon((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = useCallback(async () => {
    if (!coupon) {
      message.error('No coupon data to save.');
      return;
    }
    if (!coupon.slug.trim()) {
      message.error('Invalid coupon ID.');
      return;
    }

    try {
      const couponData = { ...coupon, dateModifiedAt: serverTimestamp() };
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
  }, [coupon]);

  if (loading)
    return (
      <div className="justify-center flex items-center h-screen">
        <Spin />
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Coupon</h1>
      {coupon ? <CouponForm coupon={coupon} handleInputChange={handleInputChange} handleSave={handleSave} /> : <p>Failed to load coupon data.</p>}
    </div>
  );
};

export default ManageCoupons;
