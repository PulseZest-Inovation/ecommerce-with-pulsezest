'use client'
import React, { useEffect } from "react";
import { Input, Checkbox, Card, Row, Col, Typography } from "antd";
import { Product } from "@/types/Product"; // Ensure the Product type is imported

const { Text } = Typography;

interface PriceProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

const Price: React.FC<PriceProps> = ({ formData, onFormDataChange }) => {
  // Handle the 'onSale' logic and update price accordingly
  const handleOnSaleChange = (checked: boolean) => {
    onFormDataChange("onSale", checked);
    if (!checked) {
      // If sale is not active, reset sale price to null
      onFormDataChange("salePrice", "");
    }
  };

  // Update the price when regular or sale price changes
  const handlePriceChange = (key: keyof Product, value: string) => {
    onFormDataChange(key, value);

    // Handle price calculation based on entered fields
    if (key === "salePrice") {
      // If salePrice is entered, price should be set to salePrice
      onFormDataChange("price", value);
    } else if (key === "regularPrice") {
      // If regularPrice is entered, price should be set to regularPrice
      if (!formData.salePrice) {
        onFormDataChange("price", value); // If no sale price, use regular price
      }
    }
  };

  useEffect(() => {
    // Avoid infinite loop by checking if we need to update the price
    if (formData.onSale && formData.salePrice && formData.price !== formData.salePrice) {
      onFormDataChange("price", formData.salePrice);
    } else if (!formData.salePrice && formData.regularPrice && formData.price !== formData.regularPrice) {
      // If no sale price, set price to regular price if not already set
      onFormDataChange("price", formData.regularPrice);
    }
  }, [formData.onSale, formData.salePrice, formData.regularPrice, formData.price, onFormDataChange]);

  // Helper function to safely convert Timestamp to ISO string
  const toISODate = (timestamp: any): string | undefined => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
    }
    return undefined;
  };

  return (
    <div>
        {/* On Sale Checkbox */}
        <Checkbox
          checked={formData.onSale}
          onChange={(e) => handleOnSaleChange(e.target.checked)}
        >
          On Sale
        </Checkbox>

         {/* Regular Price Input */}
         <Input
          placeholder="Regular Price"
          value={formData.regularPrice}
          onChange={(e) => handlePriceChange("regularPrice", e.target.value)}
          className="mb-4"
        />

        {/* Display the prices */}
        <Card className="text-end">
          {formData.regularPrice && formData.salePrice ? (
            <Row align="middle">
              <Col>
                <div className="line-through text-red-500">
                  ₹{formData.regularPrice}
                </div>
              </Col>
              <Col>
                <div className="text-green-400 font-bold">
                  ₹{formData.salePrice}
                </div>
              </Col>
            </Row>
          ) : (
            <div className="text-end">
              Price: ₹{formData.price}
            </div>
          )}
        </Card>

       

        {/* Sale Price Input */}
        {formData.onSale && (
          <Input
            placeholder="Sale Price"
            value={formData.salePrice}
            onChange={(e) => handlePriceChange("salePrice", e.target.value)}
            className="mb-4"
          />
        )}

        {/* Date on Sale From */}
        {formData.onSale && (
          <Input
            type="date"
            placeholder="Sale Starts On"
            value={toISODate(formData.dateOnSaleFrom)}
            onChange={(e) => 
              onFormDataChange("dateOnSaleFrom", e.target.value ? new Date(e.target.value) : null)
            }
            className="mb-4"
          />
        )}

        {/* Date on Sale To */}
        {formData.onSale && (
          <Input
            type="date"
            placeholder="Sale Ends On"
            value={toISODate(formData.dateOnSaleTo)}
            onChange={(e) => 
              onFormDataChange("dateOnSaleTo", e.target.value ? new Date(e.target.value) : null)
            }
            className="mb-4"
          />
        )}
    </div>
  );
};

export default Price;
