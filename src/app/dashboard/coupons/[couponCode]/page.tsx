'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import ManageCoupons from '@/components/manage-coupons/manage-coupons'

type Props = {}

export default function EditViewCoupons({}: Props) {
    const { couponCode } = useParams();  // Destructure couponId

    // Handle cases where couponId is undefined or not available yet
    if (!couponCode) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Edit Coupon: {couponCode}</h1>
            <ManageCoupons id={couponCode} />  
            {/* Pass couponId as prop */}
        </div>
    )
}
