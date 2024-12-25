import { Card, Col, Row, Statistic } from 'antd';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography, Box } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Registering the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,  // Register LineElement for line charts
  PointElement, // Register PointElement for data points
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = () => {
  // Sample Data (to be replaced with actual data from API or database)
  const totalSales = 12000;
  const ordersCount = 320;
  const topProducts = [
    { name: 'Product A', sales: 1500 },
    { name: 'Product B', sales: 1000 },
    { name: 'Product C', sales: 800 },
  ];

  // Line chart data (traffic trend over a week)
  const trafficData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Website Traffic',
        data: [500, 800, 1200, 900, 1500, 2000, 2500],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Bar chart data (Sales by Product)
  const salesByProductData = {
    labels: topProducts.map((product) => product.name),
    datasets: [
      {
        label: 'Sales ($)',
        data: topProducts.map((product) => product.sales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Ecommerce Analytics<span className='font-mono'> (Dummy Data)</span></h2>

      {/* Sales Overview */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Sales" value={`₹${totalSales}`} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Orders Count" value={ordersCount} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Average Order Value" value={`₹${(totalSales / ordersCount).toFixed(2)}`} />
          </Card>
        </Col>
      </Row>

      {/* Traffic Overview (Line Chart) */}
      <Box className="mt-6">
        <Typography variant="h6" className="mb-4">Website Traffic Overview</Typography>
        <Paper className="p-4">
          <Line data={trafficData} />
        </Paper>
      </Box>

      {/* Sales by Product (Bar Chart) */}
      <Box className="mt-6">
        <Typography variant="h6" className="mb-4">Sales by Product</Typography>
        <Paper className="p-4">
          <Bar data={salesByProductData} />
        </Paper>
      </Box>

      {/* Top Products */}
      <Row gutter={16} className="mt-6">
        {topProducts.map((product) => (
          <Col span={8} key={product.name}>
            <Card title={product.name}>
              <Statistic title="Sales" value={`₹${product.sales}`} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Other Metrics and Cards can be added below */}
    </div>
  );
};

export default AnalyticsDashboard;
