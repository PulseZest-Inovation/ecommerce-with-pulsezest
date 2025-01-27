'use client';
import React, { useEffect, useState } from 'react';
import MultipleProductSelector from '@/components/Selector/MultipleProductSelector';
import { Product } from '@/types/Product';
import { Switch, message, Button, Spin } from 'antd';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';

export default function VideoSectionOnWebsite() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isEnable, setIsEnable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch saved data from Firestore on component mount
  useEffect(() => {
    const fetchSavedData = async () => {
      setLoading(true);
      try {
        const savedData = await getDataByDocName<{
          isEnable: boolean;
          videos: Product[];
        }>('theme-settings', 'videoOnWebsite');
        if (savedData) {
          setIsEnable(savedData.isEnable ?? true); // Default to true if undefined
          setSelectedProducts(savedData.videos || []);
        } else {
          console.log('No saved video settings found.');
        }
      } catch (error) {
        console.error('Error fetching saved video settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedData();
  }, []);

  const handleProductChange = (products: Product[]) => {
    if (products.length > 15) {
      // Limit selection to 15 products
      message.warning('You can select up to 15 products only!');
      products = products.slice(0, 15);
    }
    setSelectedProducts(products);
  };

  const saveSettings = async () => {
    if (selectedProducts.length === 0) {
      message.warning('Please select at least one product to save settings.');
      return;
    }

    const success = await setDocWithCustomId('theme-settings', 'videoOnWebsite', {
      isEnable,
      videos: selectedProducts.map((product) => ({
        id: product.id,
        videoUrl: product.videoUrl,
        productTitle: product.productTitle || `Product ${product.id}`,
      })),
    });

    if (success) {
      message.success('Video settings saved successfully!');
    } else {
      message.error('Failed to save video settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Video Section - Select Products</h2>

      {/* Enable/Disable Toggle */}
      <div className="mb-4 flex items-center justify-evenly">
      <div>
      <span className="text-lg">Enable:</span>
        <Switch
          checked={isEnable}
          onChange={(checked) => setIsEnable(checked)}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
      </div>

        
        {/* Save Button */}
        <div className="mt-4">
        <Button type="primary" onClick={saveSettings}>
          Save Settings
        </Button>
      </div>

      </div>


      {/* Product Selector */}
      <MultipleProductSelector value={selectedProducts} onChange={handleProductChange} />

   
      {/* Selected Products Video Grid */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Selected Products Videos:</h3>

        {selectedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
              >
                {/* Video Player */}
                <video
                  src={product.videoUrl}
                  autoPlay
                  loop
                  muted
                  className="w-full h-60 object-cover"
                />
                {/* Product Details */}
                <div className="p-2 text-center font-semibold text-sm text-gray-700">
                  {product.productTitle || `Product ${product.id}`} {/* Display product name */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products selected.</p>
        )}
      </div>
    </div>
  );
}
