import { Collapse } from 'antd';
import { OrderType } from '@/types/orderType';
import React, { useEffect, useState } from 'react';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';

const { Panel } = Collapse;

interface CustomerOrderHistoryProps {
  customerId: string;
}

export default function CustomerOrderHistory({ customerId }: CustomerOrderHistoryProps) {
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const data = await getAllDocsFromCollection<OrderType>(`customers/${customerId}/orders`);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, [customerId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Order History</h3>

      <Collapse defaultActiveKey={[]}>
        {orders.map((order) => (
      <Panel header={`Order ID: #${order.id} - ${order.status}`} key={order.id}>
        <ul className="mb-2">
          <li>
            <strong>Order Number:</strong> {order.orderId}
          </li>
          <li>
            <strong>Order Date:</strong> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ""}
          </li>
          <li>
            <strong>Status:</strong> {order.status}
          </li>
          <li>
            <strong>Customer Name:</strong> {order.fullName}
          </li>
          <li>
            <strong>Total Amount:</strong> {order.totalAmount}
          </li>
          <li>
            <strong>Phone Number:</strong> {order.phoneNumber}
          </li>
          <li>
            <strong>Address:</strong> {order.address}
          </li>
          <li>
            <strong>City:</strong> {order.city}
          </li>
          <li>
            <strong>State:</strong> {order.state}
          </li>
          <li>
            <strong>Country:</strong> {order.country}
          </li>
          <li className="mb-4">
            <strong>Order Items:</strong>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border mt-2">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Image</th>
                    <th className="border px-2 py-1">Title</th>
                    <th className="border px-2 py-1">SKU</th>
                    <th className="border px-2 py-1">Quantity</th>
                    <th className="border px-2 py-1">Price</th>
                    <th className="border px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderDetails?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">
                        <img src={item.image} alt={item.productTitle} style={{ width: 50, height: 50, objectFit: "cover" }} />
                      </td>
                      <td className="border px-2 py-1">{item.productTitle}</td>
                      <td className="border px-2 py-1">{item.sku}</td>
                      <td className="border px-2 py-1">{item.quantity}</td>
                      <td className="border px-2 py-1">{item.price}</td>
                      <td className="border px-2 py-1">{item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </Panel>
        ))}
      </Collapse>
    </div>
  );
}
