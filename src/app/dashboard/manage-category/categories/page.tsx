'use client'
import React, { useState } from 'react'
import { Col, Row } from 'antd'
import CreateCategory from '@/components/category-component/CreateCategory'
import FetchCategory from '@/components/category-component/FetchCategory'
import type { Categories } from '@/types/categories'

export default function Categories() {
  // ✅ ADDED: Lifted state to manage categories globally
  const [categories, setCategories] = useState<Categories[]>([])

  // ✅ ADDED: Function to update categories when a new one is created
  const handleCategoryCreated = (newCategory: Categories) => {
    setCategories((prev) => [newCategory, ...prev])
  }

  return (
    <div> 
      <Row gutter={16}>
        {/* Create the Categories here */}
        <Col span={12}>
          {/* ✅ PASS CALLBACK */}
          <CreateCategory onCategoryCreated={handleCategoryCreated} />
        </Col>

        {/* Show the Categories here */}
        <Col span={12}>
          {/* ✅ PASS LIFTED STATE */}
          <FetchCategory externalCategories={categories} />
        </Col>
      </Row>
    </div>
  )
}
