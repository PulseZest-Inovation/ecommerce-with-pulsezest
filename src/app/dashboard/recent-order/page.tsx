import { Card, Table, Tag } from 'antd';
import { Typography, Box } from '@mui/material';

const RecentOrders = () => {
  // Sample Data for Recent Orders (this should be replaced by actual API data)
  const orders = [
    {
      key: '1',
      orderId: 'ORD12345',
      customer: 'Rishab Chauhan',
      date: '2024-12-24',
      amount: 200,
      status: 'Delivered',
    },
    {
      key: '2',
      orderId: 'ORD12346',
      customer: 'Abhiniav Yadav',
      date: '2024-12-23',
      amount: 150,
      status: 'Shipped',
    },
    {
      key: '3',
      orderId: 'ORD12347',
      customer: 'Divya Yadav',
      date: '2024-12-22',
      amount: 300,
      status: 'Pending',
    },
  ];

  // Table columns definition
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount ($)',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color = '';
        if (status === 'Delivered') color = 'green';
        if (status === 'Shipped') color = 'blue';
        if (status === 'Pending') color = 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Recent Orders Section */}
      <Card>
        <Typography variant="h6" className="mb-4">
          Recent Orders
        </Typography>
        <Box className="p-4">
          <Table
            columns={columns}
            dataSource={orders}
            pagination={false}
            bordered
          />
        </Box>
      </Card>
    </div>
  );
};

export default RecentOrders;
