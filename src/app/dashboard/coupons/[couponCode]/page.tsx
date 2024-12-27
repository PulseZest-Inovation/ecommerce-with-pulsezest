'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import ManageCoupons from '@/components/manage-coupons/manage-coupons'
import { Col, Row, Spin, Card, Button, Popover,  } from 'antd'
const { Meta } = Card;
type Props = {}

export default function EditViewCoupons({}: Props) {
    const { couponCode } = useParams();  // Destructure couponId

    // Handle cases where couponId is undefined or not available yet
    if (!couponCode) {
        return <Spin/>;
    }

    return (
        <div>
            <Row>
                <Col flex={4}>
                    <ManageCoupons id={couponCode} />  
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
            {couponCode}
          </h1>

          <p className=" mt-4 text-gray-600">
            Couponse are always case Sensitive*.
          </p>
        </Card>

       
     
        
        
          </div>
      </Col>
            </Row>
            
            {/* Pass couponId as prop */}
        </div>
    )
}
