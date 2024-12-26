'use client';
import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { CouponsType } from '@/types/CouponType';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData'; // Adjust the path to your Firebase function
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData'; // Adjust the path to your custom setDoc function

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
          setCoupon(fetchedCoupon);
        } else {
          // Document not found, initialize with default values
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
        alert('Coupon saved successfully!');
      } else {
        alert('Failed to save coupon. Please try again.');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Coupon</h1>
      {coupon ? (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Code</label>
            <input
              type="text"
              value={coupon.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Amount</label>
            <input
              type="text"
              value={coupon.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              value={coupon.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border w-full px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Free Shipping</label>
            <input
              type="checkbox"
              checked={coupon.freeShipping}
              onChange={(e) => handleInputChange('freeShipping', e.target.checked)}
              className="ml-2"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Coupon
          </button>
        </div>
      ) : (
        <div>Failed to load coupon data.</div>
      )}
    </div>
  );
};

export default ManageCoupons;
