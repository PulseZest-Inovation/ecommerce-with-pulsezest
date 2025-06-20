import React, { useState, useEffect } from 'react';
import { ProductType } from '@/types/Product';
import { Input, Rate, message } from 'antd';

interface RatingProp {
  formData: ProductType;
  onFormDataChange: (key: keyof ProductType, value: any) => void;
}

export default function Rating({ formData, onFormDataChange }: RatingProp) {
  const [rating, setRating] = useState<string>(formData.averageRating?.toString() || '0'); // Store as string

  // Handle changes to the input value
  const handleRatingChange = (value: string) => {
    // Validate the value (allow numbers between 0 and 5, including decimals)
    const numericValue = parseFloat(value);
    if (numericValue >= 0 && numericValue <= 5 && !isNaN(numericValue)) {
      setRating(value); // Store rating as string
      onFormDataChange('averageRating', value); // Update form data with the string rating
    } else {
      message.error('Please enter a number between 0 and 5.');
    }
  };

  // Convert rating from string to number for Rate component
  const numericRating = parseFloat(rating);

  useEffect(() => {
    // Sync the rating with the formData if it is initially set
    if (formData.averageRating) {
      setRating(formData.averageRating.toString());
    }
  }, [formData.averageRating]);

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Custom Average Rating
        </label>
        <Input
          placeholder="Enter Average Rating"
          value={rating}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="w-full"
          type="number"
          min={0}
          max={5}
          step="0.1"  // Allow decimal input with step 0.1
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Star Rating
        </label>
        <Rate
          value={numericRating} // Use numeric value for Rate component
          onChange={(value) => {
            const ratingString = value.toString();
            setRating(ratingString); // Store rating as string
            onFormDataChange('averageRating', ratingString); // Update form data with the string rating
          }}
          allowHalf // Enable half-star ratings
        />
      </div>
    </div>
  );
}
