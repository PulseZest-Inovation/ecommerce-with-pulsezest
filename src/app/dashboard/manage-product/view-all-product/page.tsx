'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Image, Tooltip, Rate, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Product } from '@/types/Product';
import { getAppData } from '@/services/getApp';
import { AppDataType } from '@/types/AppData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import moment from 'moment';
import MultipleCategoriesSelector from '@/components/Selector/MultipleCategorySelector';
import { Link, Search } from '@mui/icons-material';
import DeleteConfirmationModal from './deleteConfirmationModal';
import ExportProductsButton from './ExportProductButton';

const ViewProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [appData, setAppData]= useState<null| AppDataType>(null);
  const router = useRouter();

  // Optimized Fetch Logic
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

  useEffect(() => {
    fetchProducts();
    fetchApplicationData();
  }, []);

  const fetchApplicationData = async()=>{
      const key = localStorage.getItem('securityKey');
      try {
  
        if (!key) {
          console.warn("Security key not found in localStorage.");
          return null; // Return null if key is not available
        }
        const data = await getAppData<AppDataType>('app_name', key)
        setAppData(data);
      } catch (error) {
          console.log(error)
      }
    }
  // Filtering Logic
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productSubtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleEdit = (id: string) => router.push(`edit-product/${id}`);
  

  const handleViewProduct = (id: string, category: string) => {
    const url = `${appData?.callback_url}/collection/${category}/product/${id}`;
    window.open(url, '_blank'); // Opens the link in a new tab
  };
  
  

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsModalVisible(true);
  };

  const handleDeleteSuccess = () => fetchProducts();

  const cancelDelete = () => {
    setIsModalVisible(false);
    setProductToDelete(null);
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
            <div className="font-bold">
              {record.productTitle || 'No Product Title'}
            </div>
            <div>
              {record.productSubtitle
                ? `${record.productSubtitle.split(' ').slice(0, 10).join(' ')}...`
                : 'No Subtitle set'}
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
      sorter: (a: Product, b: Product) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: any) =>
        moment(createdAt.toDate()).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: Product, b: Product) =>
        moment(a.createdAt.toDate()).unix() - moment(b.createdAt.toDate()).unix(),
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
            <Tooltip title="View Product">
            <Button
              icon={< Link />}
              onClick={() => handleViewProduct(record.slug, record.categories[0])}
            />
          </Tooltip>
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
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className='sticky top-0 z-30 bg-white  '>

      <div className="flex justify-between  pt-2 ">
        <h1 className="font-bold text-2xl">Product List</h1>
        <div className="space-x-2">
        <ExportProductsButton products={filteredProducts} />
        <Button type="primary" onClick={() => router.push('add-new-product')}>
          Add New Product
        </Button>
      </div>

      </div>

      <div className="flex space-x-3 mt-2 mb-4 pb-2">
        <Input
          prefix={<Search />}
          placeholder="Search by ID or Description"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div style={{ width: '100%' }}>
          <MultipleCategoriesSelector
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
      </div>

      </div>
    

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />

      <DeleteConfirmationModal
        visible={isModalVisible}
        product={productToDelete}
        onDeleteSuccess={handleDeleteSuccess}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ViewProduct;
