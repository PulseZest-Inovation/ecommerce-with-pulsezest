'use client';
import React, { useEffect } from 'react';
import { Input, Checkbox, Card, Row, Col } from 'antd';
import { Product } from '@/types/Product';

interface PriceProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const Price: React.FC<PriceProps> = ({ formData, onFormDataChange }) => {
  const handleOnSaleChange = (checked: boolean) => {
    onFormDataChange('onSale', checked);
    if (!checked) {
      onFormDataChange('salePrice', '');
    }
  };

  const handlePriceChange = (key: keyof Product, value: string) => {
    onFormDataChange(key, value);
    if (key === 'salePrice') {
      onFormDataChange('price', value);
    } else if (key === 'regularPrice' && !formData.salePrice) {
      onFormDataChange('price', value);
    }
  };

  useEffect(() => {
    if (formData.onSale && formData.salePrice && formData.price !== formData.salePrice) {
      onFormDataChange('price', formData.salePrice);
    } else if (!formData.salePrice && formData.regularPrice && formData.price !== formData.regularPrice) {
      onFormDataChange('price', formData.regularPrice);
    }
  }, [formData.onSale, formData.salePrice, formData.regularPrice, formData.price, onFormDataChange]);

  const toISODate = (timestamp: any): string | undefined => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toISOString().split('T')[0];
    }
    return undefined;
  };

  return (
    <div className="lg:p-3 bg-white shadow-md rounded-md space-y-6">
      {/* On Sale Checkbox */}
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={formData.onSale}
          onChange={(e) => handleOnSaleChange(e.target.checked)}
        />
        <span className="text-lg font-medium text-gray-700">On Sale</span>
      </div>

      {/* Regular Price Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Regular Price
        </label>
        <Input
          placeholder="Enter Regular Price"
          value={formData.regularPrice}
          onChange={(e) => handlePriceChange('regularPrice', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Display Price Card */}
      <Card className="bg-gray-50">
        {formData.regularPrice && formData.salePrice ? (
          <Row className="text-lg flex-wrap">
            <Col xs={12} sm={6}>
              <div className="line-through text-red-500">
                ₹{formData.regularPrice}
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-green-600 font-bold">
                ₹{formData.salePrice}
              </div>
            </Col>
          </Row>
        ) : (
          <div className="text-gray-800 text-lg font-medium text-end">
            Price: ₹{formData.price}
          </div>
        )}
      </Card>

      {/* Sale Price Input */}
      {formData.onSale && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sale Price
          </label>
          <Input
            placeholder="Enter Sale Price"
            value={formData.salePrice}
            onChange={(e) => handlePriceChange('salePrice', e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* Sale Date Inputs */}
      {formData.onSale && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sale Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sale Starts On
            </label>
            <Input
              type="date"
              value={toISODate(formData.dateOnSaleFrom)}
              onChange={(e) =>
                onFormDataChange(
                  'dateOnSaleFrom',
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="w-full"
            />
          </div>

          {/* Sale End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sale Ends On
            </label>
            <Input
              type="date"
              value={toISODate(formData.dateOnSaleTo)}
              onChange={(e) =>
                onFormDataChange(
                  'dateOnSaleTo',
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* ✅ Image Tag Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
       Tag for Image
        </label>
        <Input
          placeholder="Enter image tag (e.g. Bestseller, New Arrival, Trending)"
          value={formData.tagForImage || ''}
          onChange={(e) => onFormDataChange('tagForImage', e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Price;
