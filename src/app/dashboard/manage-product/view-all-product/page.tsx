'use client'
import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Image, Tooltip, Rate, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Product } from '@/types/Product';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import moment from 'moment';
import MultipleCategoriesSelector from '@/components/Selector/MultipleCategorySelector'; // Adjust path accordingly
import { Search } from '@mui/icons-material';

type Props = {};

const ViewProduct = (props: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  const fetchProductList = async () => {
    try {
      const productList = await getAllDocsFromCollection<Product>('products');
      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        product.categories.some(category => selectedCategories.includes(category))
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategories, products]);

  const handleEdit = (id: string) => {
    console.log('Edit product with id:', id);
    router.push(`edit-product/${id}`)
    // Implement edit logic here
  };

  const handleDelete = (id: string) => {
    console.log('Delete product with id:', id);
    // Implement delete logic here
  };

  const columns = [
    {
      title: 'Product Details',
      key: 'productDetails',
      render: (_: any, record: Product) => (
        <Space direction="horizontal">
          <Image
            src={record.featuredImage}
            alt="Featured Image"
            width={50}
            height={50}
            style={{ objectFit: 'cover' }}
          />
          <div>
            <div className='font-bold'> {record.id}</div>
            <div>
               {record.shortDescription.split(' ').slice(0, 10).join(' ')}...
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <Space wrap>
          {categories.map((category, index) => (
            <Tag color="blue" key={index}>
              {category}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `₹${price}`,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) => moment(createdAt.toDate()).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Average Rating',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number) => <Rate disabled defaultValue={Math.round(rating)} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.slug)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>

      <div className='justify-between flex'>
        <h1 className='font-bold text-2xl'>Product List</h1>
        <Button type='primary' onClick={()=>{
          router.push('add-new-product')
        }}>Add New Product</Button>
      </div>

        <div className='flex space-x-3 mt-2 mb-4'>
            <Input
              prefix={<Search/>}
              placeholder="Search by ID or Description"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          <div style={{width: '100%'}} >
          <MultipleCategoriesSelector 
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </div>

     
    
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default ViewProduct;
