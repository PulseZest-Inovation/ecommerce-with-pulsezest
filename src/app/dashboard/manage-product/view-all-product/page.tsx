'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/Product';
import { getAppData } from '@/services/getApp';
import { AppDataType } from '@/types/AppData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import MultipleCategoriesSelector from '@/components/Selector/MultipleCategorySelector';
import { Search } from '@mui/icons-material';
import DeleteConfirmationModal from './deleteConfirmationModal';
import ExportProductsButton from './ExportProductButton';
import ProductList from './ProductList';
import DuplicateProductModal from './DublicateProductModel';

const ViewProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [appData, setAppData] = useState<null | AppDataType>(null);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState<boolean>(false);
  const [productToDuplicate, setProductToDuplicate] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const products = await getAllDocsFromCollection<Product>('products');
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicationData = async () => {
    try {
      const data = await getAppData<AppDataType>();
      setAppData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchApplicationData()]);
  }, []);

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

  const handleDeleteSuccess = () => {
    fetchProducts();
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (id: string) => {
    router.push(`edit-product/${id}`);
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setIsModalVisible(true);
  };

  const handleDuplicateProduct = (product: Product) => {
    setProductToDuplicate(product);
    setIsDuplicateModalVisible(true);
  };

  const handleDuplicateSuccess = () => {
    fetchProducts();
  };

  // ⬇ Loader until data comes
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-30 bg-white">
        <div className="flex justify-between pt-2">
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ width: '100%' }}>
            <MultipleCategoriesSelector
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </div>
      </div>

      <ProductList
        onDuplicateProduct={handleDuplicateProduct}
        applicationUrl={appData?.callback_url || ''}
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        onDeleteProduct={handleDeleteProduct}
        onEditProduct={handleEditProduct}
        onViewProduct={(id, category) => window.open(`view-product/${id}`, '_blank')}
        products={filteredProducts}
      />

      <DeleteConfirmationModal
        visible={isModalVisible}
        product={productToDelete}
        onDeleteSuccess={handleDeleteSuccess}
        onCancel={cancelDelete}
      />

      <DuplicateProductModal
        visible={isDuplicateModalVisible}
        product={productToDuplicate}
        onDuplicateSuccess={handleDuplicateSuccess}
        onCancel={() => setIsDuplicateModalVisible(false)}
      />
    </div>
  );
};

export default ViewProduct;
