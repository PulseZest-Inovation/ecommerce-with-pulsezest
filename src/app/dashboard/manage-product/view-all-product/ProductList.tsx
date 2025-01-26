// components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Image, Tag, Rate, Card } from 'antd';
import { Product } from '@/types/Product';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import moment from 'moment';
import MultipleCategoriesSelector from '@/components/Selector/MultipleCategorySelector';
import { Link } from '@mui/material';

interface ProductListProps {
  searchTerm: string;
  selectedCategories: string[];
  onDeleteProduct: (product: Product) => void;
  onEditProduct: (id: string) => void;
  onViewProduct: (id: string, category: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  searchTerm,
  selectedCategories,
  onDeleteProduct,
  onEditProduct,
  onViewProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await getAllDocsFromCollection<Product>('products');
        setProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.productSubtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        product.categories.some((category) => selectedCategories.includes(category))
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategories, products]);

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
            <div className="font-bold">{record.productTitle}</div>
            <div>{record.productSubtitle}</div>
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `₹${price}`,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) =>
        moment(createdAt.toDate()).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Average Rating',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: any) => {
        const numericRating = typeof rating === 'number' ? rating : parseFloat(rating);
        return <Rate disabled value={isNaN(numericRating) ? 0 : numericRating} allowHalf />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button icon={<Link />} onClick={() => onViewProduct(record.slug, record.categories[0])} />
          <Button icon={<EditOutlined />} onClick={() => onEditProduct(record.slug)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => onDeleteProduct(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div>

<div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4 rounded-lg shadow-lg">
  <div className="flex items-center space-x-2">
    <span className="text-2xl font-semibold text-gray-800">
      Total Products: <span className="text-blue-600">{filteredProducts.length}</span>
    </span>
  </div>
  
        <div className="flex items-center space-x-3">
            {selectedCategories.length > 0 ? (
            selectedCategories.map((category, index) => (
                <div 
                key={index}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-md hover:bg-blue-600 transition-all"
                >
                {category}
                </div>
            ))
            ) : (
            <span className="text-gray-600 font-medium">Showing all products</span>
            )}
        </div>
        </div>



      {/* Table for Desktop */}
      <div className="hidden md:block">
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          bordered
        />
      </div>

      {/* Card View for Mobile */}
      <div className="md:hidden">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="mb-4">
            <div className="flex space-x-3">
              <Image
                src={product.featuredImage}
                alt="Featured Image"
                width={50}
                height={50}
                style={{ objectFit: 'cover' }}
              />
              <div>
                <div className="font-bold">{product.productTitle}</div>
                <div>{product.productSubtitle}</div>
                <div className="mt-2">
                  <Button icon={<Link />} onClick={() => onViewProduct(product.slug, product.categories[0])} />
                  <Button icon={<EditOutlined />} onClick={() => onEditProduct(product.slug)} className="ml-2" />
                  <Button danger icon={<DeleteOutlined />} onClick={() => onDeleteProduct(product)} className="ml-2" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
