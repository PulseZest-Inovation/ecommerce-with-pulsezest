import React, { useState } from 'react';
import { Input, Button, Checkbox, Select, DatePicker, Form, InputNumber, Switch, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';

type Props = {};

const { Option } = Select;

const AddProduct = (props: Props) => {
  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    permalink: '',
    type: '',
    status: '',
    featured: false,
    catalog_visibility: '',
    description: '',
    short_description: '',
    sku: '',
    price: '',
    regularPrice: '',
    salePrice: '',
    dateOnSaleTo: '',
    price_html: '',
    onSale: false,
    purchaseSale: false,
    totalSales: 0,
    manageStatus: false,
    stockQuantity: 0,
    stockStatus: '',
    backdoers: '',
    backordersAllowrd: false,
    shipping_taxable: '',
    reviewsAllowed: false,
    averageRating: '',
    ratingCount: 0,
    categories: [],
    tag: [],
    image: [],
    variation: [],
    attributes: [],
    menuOrder: 0,
    metaData: [],
  });

  // Handle form submission
  const handleSubmit = (values: any) => {
    console.log('Form Data:', values);
    message.success('Product Added Successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Add Product</h2>
      <Form
        name="add_product"
        initialValues={formData}
        onFinish={handleSubmit}
        layout="vertical"
        className="space-y-4"
      >
        {/* Product ID */}
        <Form.Item label="Product ID" name="id" rules={[{ required: true, message: 'Please input product ID!' }]}>
          <Input className="input" />
        </Form.Item>

        {/* Product Slug */}
        <Form.Item label="Slug" name="slug">
          <Input className="input" />
        </Form.Item>

        {/* Product Permalink */}
        <Form.Item label="Permalink" name="permalink">
          <Input className="input" />
        </Form.Item>

        {/* Type */}
        <Form.Item label="Product Type" name="type">
          <Select className="input" defaultValue="simple">
            <Option value="simple">Simple</Option>
            <Option value="variable">Variable</Option>
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} className="input" />
        </Form.Item>

        {/* Short Description */}
        <Form.Item label="Short Description" name="short_description">
          <Input.TextArea rows={2} className="input" />
        </Form.Item>

        {/* Price */}
        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input product price!' }]}>
          <Input className="input" />
        </Form.Item>

        {/* Regular Price */}
        <Form.Item label="Regular Price" name="regularPrice">
          <Input className="input" />
        </Form.Item>

        {/* Sale Price */}
        <Form.Item label="Sale Price" name="salePrice">
          <Input className="input" />
        </Form.Item>

        {/* Date on Sale */}
        <Form.Item label="Sale Date" name="dateOnSaleTo">
          <DatePicker className="input" />
        </Form.Item>

        {/* Stock Quantity */}
        <Form.Item label="Stock Quantity" name="stockQuantity">
          <InputNumber className="input" min={0} />
        </Form.Item>

        {/* Featured */}
        <Form.Item label="Featured" name="featured" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* On Sale */}
        <Form.Item label="On Sale" name="onSale" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* Allow Backorders */}
        <Form.Item label="Allow Backorders" name="backordersAllowrd" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* Categories */}
        <Form.Item label="Categories" name="categories">
          <Select mode="multiple" className="input">
            <Option value="electronics">Electronics</Option>
            <Option value="fashion">Fashion</Option>
            <Option value="home">Home</Option>
          </Select>
        </Form.Item>

        {/* Tags */}
        <Form.Item label="Tags" name="tag">
          <Select mode="multiple" className="input">
            <Option value="sale">Sale</Option>
            <Option value="new">New</Option>
            <Option value="popular">Popular</Option>
          </Select>
        </Form.Item>

        {/* Product Image */}
        <Form.Item label="Upload Image" name="image">
          <Upload action="/upload" listType="picture" className="upload-input">
            <Button icon={<PlusOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
