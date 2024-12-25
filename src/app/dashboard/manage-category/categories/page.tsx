import React from 'react'
import { Col, Row } from 'antd'
import CreateCategory from '@/components/CategoryComponent/CreateCategory'
import FetchCategory from '@/components/CategoryComponent/FetchCategory'

export default function Categories() {
  return (
    <div> 
    <Row gutter={16}>
        {/* Create the Categories here*/}
      <Col span={12}>
        <CreateCategory/>
      </Col>

      {/* Show the Categoires here */}
      <Col span={12}>
        <FetchCategory/>
      </Col>
    </Row>
    </div>
  )
}