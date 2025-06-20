import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Image, Tag, Rate, Card, Dropdown, Menu } from 'antd';
import { Product } from '@/types/ProductType';
import { EditOutlined, DeleteOutlined, LinkOutlined, CopyOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Link } from '@mui/material';
import moment from 'moment';

interface ProductListProps {
  searchTerm: string;
  selectedCategories: string[];
  onDeleteProduct: (product: Product) => void;
  onEditProduct: (id: string) => void;
  onViewProduct: (id: string, category: string) => void;
  onDuplicateProduct: (product: Product) => void; // Function to handle duplication
  applicationUrl: string;
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({
  searchTerm,
  selectedCategories,
  onDeleteProduct,
  onEditProduct,
  onViewProduct,
  onDuplicateProduct,
  applicationUrl,
  products,
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

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

  const handleShareOnWhatsApp = (product: Product) => {
    const message = `Check out this product: ${product.productTitle}\n${applicationUrl}/collection/${product.categories[0]}/product/${product.slug}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const columns = [
    {
      title: 'Product Details',
      key: 'productDetails',
      render: (_: any, record: Product) => (
        <Space direction="horizontal">
          <Image src={record.featuredImage} alt="Featured Image" width={50} height={50} style={{ objectFit: 'cover' }} />
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
      render: (createdAt: any) => moment(createdAt.toDate()).format('YYYY-MM-DD HH:mm:ss'),
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
      render: (_: any, record: Product) => {
        const menu = (
          <Menu>
            <Menu.Item key="share" onClick={() => handleShareOnWhatsApp(record)}>
              <span className="flex items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="16" className="mr-2" />
                Share on WhatsApp
              </span>
            </Menu.Item>
            <Menu.Item key="duplicate" onClick={() => onDuplicateProduct(record)} icon={<CopyOutlined />}>
              Duplicate
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size="middle">
            <Button
              icon={<LinkOutlined />}
              onClick={() =>
                window.open(
                  `${applicationUrl}/collection/${record.categories[0]}/product/${record.slug}`,
                  '_blank'
                )
              }
            />
            <Button icon={<EditOutlined />} onClick={() => onEditProduct(record.slug)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => onDeleteProduct(record)} />
            <Dropdown overlay={menu} trigger={['click']}>
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          </Space>
        );
      },
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
              <div key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-md hover:bg-blue-600 transition-all">
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
        <Table dataSource={filteredProducts} columns={columns} rowKey="id" pagination={false} bordered />
      </div>

      {/* Card View for Mobile */}
      <div className="md:hidden">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="mb-4">
            <div className="flex space-x-3">
              <Image src={product.featuredImage} alt="Featured Image" width={50} height={50} style={{ objectFit: 'cover' }} />
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
