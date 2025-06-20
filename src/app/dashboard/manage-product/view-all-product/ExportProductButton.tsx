'use client';
import React from 'react';
import { Button, Tooltip } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { Product } from '@/types/ProductType';

interface ExportProductsButtonProps {
  products: Product[];
}

const ExportProductsButton: React.FC<ExportProductsButtonProps> = ({ products }) => {
  const handleExport = () => {
    // Transform products data dynamically to export format
    const dataToExport = products.map(product => {
      const formattedProduct: Record<string, any> = {};

      // Iterate over each key in the product and format the values if necessary
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'description' && Array.isArray(value)) {
          // Flatten the description array to a readable string
          formattedProduct[key] = value
            .map((item, index) => `(${index + 1}) ${item.heading}: ${item.content}`)
            .join('\n');
        } else if (value instanceof Object && typeof value.toDate === 'function') {
          // Format Firestore Timestamps to ISO strings
          formattedProduct[key] = value.toDate().toISOString();
        } else if (Array.isArray(value)) {
          // Format arrays as comma-separated strings
          formattedProduct[key] = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          // Convert objects to JSON strings
          formattedProduct[key] = JSON.stringify(value);
        } else {
          // Leave primitive values as-is
          formattedProduct[key] = value;
        }
      });

      return formattedProduct;
    });

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Trigger file download
    XLSX.writeFile(workbook, 'Products.xlsx');
  };

  return (
    <Tooltip title="Export to Excel">
      <Button icon={<FileExcelOutlined />} onClick={handleExport}>
        Export Products
      </Button>
    </Tooltip>
  );
};

export default ExportProductsButton;
