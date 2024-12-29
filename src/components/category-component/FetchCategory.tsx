'use client';
import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Input, Upload, message, Switch } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { updateDocFields } from '@/services/FirestoreData/postFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';
import { UploadImageToFirebase } from '@/services/FirebaseStorage/UploadImageToFirebase';
import { deleteImageFromFirebase } from '@/services/FirebaseStorage/deleteImageToFirebase';
import { ApplicationConfig } from '@/utils/ApplicationConfig';
import { Categories } from '@/types/categories';

type Props = {};


const FetchCategory = (props: Props) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    category: Categories | null;
  }>({
    visible: false,
    category: null,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDocsFromCollection<Categories>('categories');
        const categoryMap: Record<string, Categories> = {};
        data.forEach((category) => {
          categoryMap[category.cid] = { ...category, children: [] };
        });

        const nestedCategories: Categories[] = [];
        Object.values(categoryMap).forEach((category) => {
          if (category.parent === 'none') {
            nestedCategories.push(category);
          } else {
            const parent = categoryMap[category.parent];
            if (parent) {
              parent.children?.push(category);
            }
          }
        });

        setCategories(nestedCategories);
        setFilteredCategories(nestedCategories); // Initialize filtered categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const toggleVisibility = async (category: Categories) => {
    try {
      await updateDocFields('categories', category.cid, { isVisible: !category.isVisible });
      message.success('Visibility updated!');
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cid === category.cid ? { ...cat, isVisible: !category.isVisible } : cat
        )
      );
      setFilteredCategories((prev) =>
        prev.map((cat) =>
          cat.cid === category.cid ? { ...cat, isVisible: !category.isVisible } : cat
        )
      );
    } catch (error) {
      message.error('Failed to update visibility.');
    }
  };

  const handleEditSubmit = async (updatedData: Partial<Categories>, categoryId: string) => {
    try {
      await updateDocFields('categories', categoryId, updatedData);
      message.success('Category updated!');
      setCategories((prev) =>
        prev.map((cat) =>
          cat.cid === categoryId ? { ...cat, ...updatedData } : cat
        )
      );
      setFilteredCategories((prev) =>
        prev.map((cat) =>
          cat.cid === categoryId ? { ...cat, ...updatedData } : cat
        )
      );
      setEditModal({ visible: false, category: null });
    } catch (error) {
      message.error('Failed to update category.');
    }
  };

  const handleDelete = async (category: Categories) => {
    Modal.confirm({
      title: 'Are you sure to delete this category?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          // Delete the image from Firebase Storage before deleting the category
          if (category.image) {
            await deleteImageFromFirebase(category.image);
          }
          await deleteDocFromCollection('categories', category.cid);
          message.success('Category deleted!');
          setCategories((prev) => prev.filter((cat) => cat.cid !== category.cid));
          setFilteredCategories((prev) => prev.filter((cat) => cat.cid !== category.cid));
        } catch (error) {
          message.error('Failed to delete category.');
        }
      },
    });
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    if (draggedIndex !== targetIndex) {
      const updatedCategories = [...categories];
      const [draggedCategory] = updatedCategories.splice(draggedIndex, 1);
      updatedCategories.splice(targetIndex, 0, draggedCategory);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories); // Update filtered categories

      // Update Firestore with new positions
      updateCategoryPositions(updatedCategories);
    }
  };

  const updateCategoryPositions = async (updatedCategories: Categories[]) => {
    try {
      await Promise.all(updatedCategories.map((cat, index) =>
        updateDocFields('categories', cat.cid, { isPosition: index + 1 })
      ));
      message.success('Category positions updated!');
    } catch (error) {
      message.error('Failed to update category positions.');
    }
  };

  const renderMenu = (items: Categories[]) => {
    return items.map((item, index) => (
      <div
        key={item.cid}
        draggable
        onDragStart={(event) => handleDragStart(event, index)}
        onDrop={(event) => handleDrop(event, index)}
        onDragOver={(event) => event.preventDefault()}
        className="flex justify-between items-center p-2 bg-white border-b last:border-b-0"
      >
        <div className="flex items-center space-x-2">
          <div
            className="cursor-grab"
            style={{ cursor: 'grab' }}
            draggable
          >
            <span className="text-gray-600">⋮⋮⋮</span> {/* Three dots for drag */}
          </div>
          <span>{item.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={item.isVisible}
            onChange={() => toggleVisibility(item)}
            checkedChildren="Visible"
            unCheckedChildren="Hidden"
          />
          <Button size="small" onClick={() => setEditModal({ visible: true, category: item })}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(item)}>
            Delete
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <Input
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      {loading ? (
        <Spin tip="Loading categories..." />
      ) : (
        <div className="bg-white rounded-md shadow">
          {renderMenu(filteredCategories)} {/* Render filtered categories */}
        </div>
      )}

      <Modal
        title="Edit Category"
        visible={editModal.visible}
        onCancel={() => setEditModal({ visible: false, category: null })}
        footer={null}
      >
        {editModal.category && (
          <EditCategoryForm
            category={editModal.category}
            onSubmit={handleEditSubmit}
          />
        )}
      </Modal>
    </div>
  );
};

type EditFormProps = {
  category: Categories;
  onSubmit: (data: Partial<Categories>, categoryId: string) => void;
};

const EditCategoryForm: React.FC<EditFormProps> = ({ category, onSubmit }) => {
  const [name, setName] = useState<string>(category.name || '');
  const [description, setDescription] = useState<string>(category.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async () => {
    const key = ApplicationConfig.secuityKey;

    if (image) {
      const imagePath = `${key}/categories`;
      // Delete old image before uploading the new one
      if (category.image) {
        await deleteImageFromFirebase(category.image);
      }
      const imageUrl = await UploadImageToFirebase(image, imagePath);
      return imageUrl;
    }
    return category.image; // Return old image if no new image is uploaded
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      message.error('Name cannot be empty.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const imageUrl = await handleImageUpload();
      onSubmit({ name, description, image: imageUrl }, category.cid);
    } catch (error) {
      message.error('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeUpload = (file: File) => {
    setImage(file);
    return false;
  };

  return (
    <div>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: '8px' }}
      />
      <Input.TextArea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: '8px' }}
      />
      <Upload
        beforeUpload={handleBeforeUpload}
        multiple={false} // Ensure only one file can be selected
        fileList={image ? [image as any] : []} // Display the selected image in the upload list
        onRemove={() => setImage(null)} // Clear the image on removal
      >
        <Button icon={<UploadOutlined />}>Change Image</Button>
      </Upload>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit} type="primary" loading={loading}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default FetchCategory;
