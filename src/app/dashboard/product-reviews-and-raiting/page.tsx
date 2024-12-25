'use client'
import { Collapse, Card, Rate, Button, Input, Form, Space } from 'antd';
import { Typography, Box } from '@mui/material';
import { useState } from 'react';

const { Panel } = Collapse;

interface Review {
  key: string;
  customer: string;
  reviewText: string;
  rating: number;
}

interface Product {
  productName: string;
  reviews: Review[];
}

const ProductReview = () => {
  // Sample Data for Reviews (replace with actual data from API)
  const products: Product[] = [
    {
      productName: 'Product A',
      reviews: [
        {
          key: '1',
          customer: 'John Doe',
          reviewText: 'Great product! Highly recommended.',
          rating: 5,
        },
        {
          key: '2',
          customer: 'Jane Smith',
          reviewText: 'Good quality, but could be improved.',
          rating: 4,
        },
      ],
    },
    {
      productName: 'Product B',
      reviews: [
        {
          key: '3',
          customer: 'Mike Johnson',
          reviewText: 'Not bad, but delivery was slow.',
          rating: 3,
        },
      ],
    },
  ];

  // State for new review and the selected product
  const [newReview, setNewReview] = useState({
    rating: 0,
    reviewText: '',
  });

  // State for tracking selected product for review submission (string or null)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // State for product search
  const [searchTerm, setSearchTerm] = useState('');

  // Handle form submission to add a new review
  const handleReviewSubmit = () => {
    if (newReview.rating === 0 || newReview.reviewText.trim() === '') {
      alert('Please provide both a rating and a review text.');
      return;
    }
    alert('Review submitted!');
    setNewReview({ rating: 0, reviewText: '' }); // Reset review form
    setSelectedProduct(null); // Reset selected product
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle collapse behavior to keep track of opened panel
  const [activeKey, setActiveKey] = useState<string[]>(['0']); // Default first panel open

  const handleCollapseChange = (key: string | string[]) => {
    // Ensure first panel remains open even if others collapse
    if (Array.isArray(key)) {
      if (key.length === 0) {
        setActiveKey(['0']); // If no panel is open, set first panel open
      } else {
        setActiveKey(key);
      }
    } else {
      setActiveKey([key]);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Search Field for Filtering Products */}
      <div className="mb-6">
        <Input
          placeholder="Search for a product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Product Review Section */}
      <Card>
        <Typography variant="h6" className="mb-4">
          Product Reviews & Ratings
        </Typography>

        {/* Collapsible Panel for Each Product */}
        <Collapse
          accordion
          activeKey={activeKey} // Set the active key to control which panel is open
          onChange={handleCollapseChange} // Handle panel change
        >
          {filteredProducts.map((product, index) => (
            <Panel header={product.productName} key={index.toString()}>
              {/* Existing Reviews for the Product */}
              <Box className="mb-6">
                <Typography variant="subtitle1" className="mb-4">
                  Customer Reviews
                </Typography>
                {product.reviews.length > 0 ? (
                  <div>
                    {product.reviews.map((review) => (
                      <Card className="w-full mb-4" key={review.key}>
                        <Typography variant="subtitle2">{review.customer}</Typography>
                        <Rate disabled value={review.rating} />
                        <Typography variant="body2" className="mt-2">
                          {review.reviewText}
                        </Typography>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" className="text-gray-600">
                    No reviews yet.
                  </Typography>
                )}
              </Box>

              {/* New Review Form for the Product */}
              <Typography variant="subtitle1" className="mb-4">
                Submit Your Review
              </Typography>
              <Form
                layout="vertical"
                onFinish={handleReviewSubmit}
                initialValues={{ product: product.productName }}
              >
                <Form.Item label="Rating">
                  <Rate
                    value={newReview.rating}
                    onChange={(value) => {
                      setNewReview({ ...newReview, rating: value });
                      setSelectedProduct(product.productName); // Set selected product name
                    }}
                  />
                </Form.Item>

                <Form.Item label="Review">
                  <Input.TextArea
                    rows={4}
                    value={newReview.reviewText}
                    onChange={(e) =>
                      setNewReview({ ...newReview, reviewText: e.target.value })
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Submit Review
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  );
};

export default ProductReview;
