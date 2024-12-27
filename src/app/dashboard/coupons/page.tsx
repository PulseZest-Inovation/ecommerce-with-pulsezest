'use client';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message, Table, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { CouponsType } from '@/types/CouponType';
import { setDocWithCustomId } from '@/services/FirestoreData/postFirestoreData';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { Timestamp } from 'firebase/firestore';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';  

type Props = {};

export default function Coupons({}: Props) {
  const [coupons, setCoupons] = useState<CouponsType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponsType | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();  

  const handleCancel = () => {
    setOpen(false);
    setEditingCoupon(null); 
    form.resetFields();
  };

  const fetchCoupons = async () => {
    try {
      const data = await getAllDocsFromCollection<CouponsType>('coupons');
      setCoupons(data);
    } catch (error) {
      message.error('Failed to fetch coupons.');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateOrUpdateCoupon = async () => {

   
    try {
      const formData = await form.validateFields();
      const slug = formData.couponCode.replace(/\s+/g, '-').toLowerCase();
      const couponData: any = {
        slug: slug, // Set the coupon code as the id
        code: formData.couponCode,
        createdAt: editingCoupon ? editingCoupon.createdAt : Timestamp.now(),
        dateModifiedAt: Timestamp.now(),
        // Only setting the essential fields (couponCode and amount)
      };

      if (editingCoupon) {
        // Update existing coupon
        await setDocWithCustomId('coupons', slug, couponData);
        message.success('Coupon updated successfully');
      } else {
        // Create new coupon
        await setDocWithCustomId('coupons', slug, couponData);
        message.success('Coupon created successfully');
      }

      fetchCoupons(); // Refresh the coupons table
      setOpen(false);
      form.resetFields();
      setEditingCoupon(null); // Reset editing state
    } catch (error) {
      message.error('An error occurred while saving the coupon');
    }
  };

  const handleEdit = (record: CouponsType) => {
    // Navigate to the edit page when editing the coupon
    console.log(`coupons id : ${record.id}`)

    router.push(`/dashboard/coupons/${record.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // await deleteDocFromCollection('coupons', id); // Assuming delete function exists
      message.success('Coupon deleted successfully');
      fetchCoupons(); // Refresh the coupons table
    } catch (error) {
      message.error('An error occurred while deleting the coupon');
    }
  };

  const columns: ColumnsType<CouponsType> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp: Timestamp) => timestamp.toDate().toLocaleString(),
    },
    {
      title: 'Modified At',
      dataIndex: 'dateModifiedAt',
      key: 'dateModifiedAt',
      render: (timestamp: Timestamp) => timestamp.toDate().toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CouponsType) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleEdit(record)} />
          <DeleteOutlined onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="justify-between flex">
        <h1 className="font-serif text-2xl font-bold">Coupons</h1>
        <Button type="primary" onClick={() => setOpen(true)}>
          {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        </Button>
      </div>

      <Table columns={columns} dataSource={coupons} rowKey="id" />

      <Modal
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        open={open}
        onCancel={handleCancel}
        onOk={handleCreateOrUpdateCoupon}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Coupon Code"
            name="couponCode"
            rules={[{ required: true, message: 'Please enter a coupon code' }]}
          >
            <Input placeholder="Enter coupon code" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
