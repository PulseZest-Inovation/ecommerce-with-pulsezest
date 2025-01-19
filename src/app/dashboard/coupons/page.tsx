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
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData'; // Import the delete function

type Props = {};

export default function Coupons({}: Props) {
  const [coupons, setCoupons] = useState<CouponsType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponsType | null>(null);
  const [form] = Form.useForm();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete modal visibility
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null); // State for the coupon to delete
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
        slug: slug,
        code: formData.couponCode,
        createdAt: editingCoupon ? editingCoupon.createdAt : Timestamp.now(),
        dateModifiedAt: Timestamp.now(),
      };

      if (editingCoupon) {
        await setDocWithCustomId('coupons', slug, couponData);
        message.success('Coupon updated successfully');
      } else {
        await setDocWithCustomId('coupons', slug, couponData);
        message.success('Coupon created successfully');
      }

      fetchCoupons();
      setOpen(false);
      form.resetFields();
      setEditingCoupon(null);
    } catch (error) {
      message.error('An error occurred while saving the coupon');
    }
  };

  const handleEdit = (record: CouponsType) => {
    router.push(`/dashboard/coupons/${record.id}`);
  };

  const handleDelete = async () => {
    if (couponToDelete) {
      try {
        await deleteDocFromCollection('coupons', couponToDelete); // Delete the coupon from Firestore
        message.success('Coupon deleted successfully');
        fetchCoupons(); // Refresh the coupons table
        setDeleteModalVisible(false); // Hide the delete modal
        setCouponToDelete(null); // Reset the coupon to delete
      } catch (error) {
        message.error('An error occurred while deleting the coupon');
      }
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
          <DeleteOutlined
            onClick={() => {
              setCouponToDelete(record.id); // Set the coupon to delete
              setDeleteModalVisible(true); // Show the delete confirmation modal
            }}
          />
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

      {/* Delete Confirmation Modal */}
      <Modal
        title="Are you sure?"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this coupon?</p>
      </Modal>
    </div>
  );
}
