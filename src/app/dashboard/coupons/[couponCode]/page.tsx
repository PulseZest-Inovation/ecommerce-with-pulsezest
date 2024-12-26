'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import ManageCoupons from '@/components/manage-coupons/manage-coupons'
import { Spin } from 'antd'

type Props = {}

export default function EditViewCoupons({}: Props) {
    const { couponCode } = useParams();  // Destructure couponId

    // Handle cases where couponId is undefined or not available yet
    if (!couponCode) {
        return <Spin/>;
    }

    return (
        <div>
            
            <ManageCoupons id={couponCode} />  
            {/* Pass couponId as prop */}
        </div>
    )
}
