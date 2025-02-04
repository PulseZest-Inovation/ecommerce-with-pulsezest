import React, { useEffect, useState } from 'react';
import { getTotalSalesByProduct, getBestSellingProducts, getMostPopularProducts, getOutOfStockProducts, getLowStockProducts, getAverageOrderValuePerProduct } from '@/utils/analytics/ProductPerfromance'; // Import the functions
import { Card, List, Statistic, Row, Col, Table, Tooltip, Input, Button } from 'antd';

export default function ProductPerformance() {
  const [totalSales, setTotalSales] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [mostPopularProducts, setMostPopularProducts] = useState<any[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [averageOrderValue, setAverageOrderValue] = useState<any[]>([]);
  const [viewAllBestSelling, setViewAllBestSelling] = useState(false);
  const [viewAllMostPopular, setViewAllMostPopular] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const totalSalesData = await getTotalSalesByProduct();
      setTotalSales(totalSalesData);

      const bestSelling = await getBestSellingProducts();
      setBestSellingProducts(bestSelling);

      const mostPopular = await getMostPopularProducts();
      setMostPopularProducts(mostPopular);

      const outOfStock = await getOutOfStockProducts();
      setOutOfStockProducts(outOfStock);

      const lowStock = await getLowStockProducts();
      setLowStockProducts(lowStock);

      const averageValue = await getAverageOrderValuePerProduct();
      setAverageOrderValue(averageValue);
    };

    fetchData();
  }, []);

  // Filtered search for product title
  const filteredProducts = (products: any[]) => {
    return products.filter(product =>
      product.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div>
      <h1>Product Performance</h1>

      {/* Search input for all product sections */}
      <Input
        placeholder="Search by product title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* Display total sales by product */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Top Selling Products">
            <List
              dataSource={viewAllBestSelling ? filteredProducts(bestSellingProducts) : filteredProducts(bestSellingProducts).slice(0, 10)}
              renderItem={(item) => (
                <List.Item>
                  <Tooltip title={`Total revenue generated from ${item.productTitle}`}>
                    <Statistic title={item.productTitle} value={`₹${item.totalSales.toFixed(2)}`} />
                  </Tooltip>
                </List.Item>
              )}
            />
            {filteredProducts(bestSellingProducts).length > 10 && !viewAllBestSelling && (
              <Button type="link" onClick={() => setViewAllBestSelling(true)}>
                View All
              </Button>
            )}
            {viewAllBestSelling && (
              <Button type="link" onClick={() => setViewAllBestSelling(false)}>
                Show Less
              </Button>
            )}
          </Card>
        </Col>

        {/* Display most popular products by quantity sold (limit to 10 or 15) */}
        <Col span={8}>
          <Card title="Most Popular Products">
            <List
              dataSource={viewAllMostPopular ? filteredProducts(mostPopularProducts) : filteredProducts(mostPopularProducts).slice(0, 10)} // Limit to 10
              renderItem={(item) => (
                <List.Item>
                  <Tooltip title={`Total quantity sold for ${item.productTitle}`}>
                    <Statistic title={item.productTitle} value={item.quantitySold} />
                  </Tooltip>
                </List.Item>
              )}
            />
            {filteredProducts(mostPopularProducts).length > 10 && !viewAllMostPopular && (
              <Button type="link" onClick={() => setViewAllMostPopular(true)}>
                View All
              </Button>
            )}
            {viewAllMostPopular && (
              <Button type="link" onClick={() => setViewAllMostPopular(false)}>
                Show Less
              </Button>
            )}
          </Card>
        </Col>

        {/* Display out-of-stock products */}
        <Col span={8}>
          <Card title="Out of Stock Products">
            <List
              dataSource={filteredProducts(outOfStockProducts)}
              renderItem={(item) => (
                <List.Item>
                  <Tooltip title={`This product is currently out of stock: ${item.productTitle}`}>
                    <Statistic title={item.productTitle} value="Out of Stock" />
                  </Tooltip>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Display low stock products */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Low Stock Products">
            <Table
              dataSource={filteredProducts(lowStockProducts)}
              columns={[
                { title: 'Product Title', dataIndex: 'productTitle' },
                { title: 'Stock Quantity', dataIndex: 'stockQuantity' },
              ]}
              rowKey="productId"
              pagination={false}
            />
          </Card>
        </Col>

        {/* Display average order value per product */}
        <Col span={12}>
          <Card title="Average Order Value per Product">
            <Table
              dataSource={filteredProducts(averageOrderValue)}
              columns={[
                { title: 'Product Title', dataIndex: 'productTitle' },
                { title: 'Average Order Value', dataIndex: 'averageOrderValue', render: (value) => `₹${value.toFixed(2)}` },
              ]}
              rowKey="productId"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* Display total sales across products */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Total Sales by Product">
            <Table
              dataSource={filteredProducts(totalSales)}
              columns={[
                { title: 'Product Title', dataIndex: 'productTitle' },
                { title: 'Total Sales', dataIndex: 'totalSales', render: (value) => `₹${value.toFixed(2)}` },
              ]}
              rowKey="productId"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
