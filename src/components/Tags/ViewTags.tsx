'use client';
import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Button, Modal, message, Input, Switch } from 'antd'; 
import { Tags } from '@/types/Tags'; 
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData'; 
import { setDocWithCustomId, updateDocFields } from '@/services/FirestoreData/postFirestoreData'; 
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData'; 
import "tailwindcss/tailwind.css";

const { Text } = Typography;
const { Search } = Input;

const ViewTags: React.FC = () => {
  const [tagsData, setTagsData] = useState<Tags[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tags[]>([]); // State for filtered tags
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tags | null>(null);
  const [tagToEdit, setTagToEdit] = useState<Tags | null>(null);
  const [updatedTagName, setUpdatedTagName] = useState('');
  const [updatedTagDescription, setUpdatedTagDescription] = useState('');

  // Fetching data from Firestore
  const fetchTags = async () => {
    try {
      const data = await getAllDocsFromCollection<Tags>('tags');
      setTagsData(data);
      setFilteredTags(data); // Initialize filtered tags
    } catch (error) {
      console.error('Error fetching tags:', error);
      message.error('Failed to fetch tags. Please try again later.');
    }
  };

  // Automatically fetch new tags every 10 seconds
  useEffect(() => {
    fetchTags(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchTags();
    }, 10000); // Fetch every 10 seconds

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle delete button click
  const showDeleteConfirm = (tag: Tags) => {
    setTagToDelete(tag);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    if (tagToDelete) {
      const success = await deleteDocFromCollection('tags', tagToDelete.slug); // Use the delete function
      if (success) {
        setTagsData((prev) => prev.filter(tag => tag.slug !== tagToDelete.slug)); // Update local state
        setFilteredTags((prev) => prev.filter(tag => tag.slug !== tagToDelete.slug)); // Update filtered tags
        message.success('Tag deleted successfully');
      } else {
        message.error('Failed to delete tag');
      }
      setIsModalVisible(false);
      setTagToDelete(null);
    }
  };

  const handleEdit = (tag: Tags) => {
    setTagToEdit(tag);
    setUpdatedTagName(tag.name);
    setUpdatedTagDescription(tag.description);
  };

  const handleUpdate = async () => {
    if (tagToEdit) {
      const updatedTag = { ...tagToEdit, name: updatedTagName, description: updatedTagDescription };
      const success = await setDocWithCustomId('tags', tagToEdit.slug, updatedTag); // Use the new function to update
      if (success) {
        setTagsData((prev) => prev.map(t => (t.slug === tagToEdit.slug ? updatedTag : t))); // Update local state
        setFilteredTags((prev) => prev.map(t => (t.slug === tagToEdit.slug ? updatedTag : t))); // Update filtered tags
        message.success('Tag updated successfully');
      } else {
        message.error('Failed to update tag');
      }
      setTagToEdit(null);
      setUpdatedTagName('');
      setUpdatedTagDescription('');
    }
  };

  // Toggle the visibility of a tag
  const handleToggleVisibility = async (tag: Tags) => {
    const updatedTag = { ...tag, isVisible: !tag.isVisible }; // Toggle the isVisible state
    const success = await updateDocFields('tags', tag.slug, { isVisible: updatedTag.isVisible }); // Update the visibility
    if (success) {
      setTagsData((prev) => prev.map(t => (t.slug === tag.slug ? updatedTag : t))); // Update local state
      setFilteredTags((prev) => prev.map(t => (t.slug === tag.slug ? updatedTag : t))); // Update filtered tags
      message.success('Tag visibility updated successfully');
    } else {
      message.error('Failed to update tag visibility');
    }
  };

  // Handle search input change
  const handleSearch = (value: string) => {
    const filtered = tagsData.filter(tag => 
      tag.name.toLowerCase().includes(value.toLowerCase()) ||
      tag.slug.toLowerCase().includes(value.toLowerCase()) ||
      tag.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTags(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Tags List</h2>

      {/* Search Bar */}
      <Search
        placeholder="Search tags"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)} // Update filtering on change
        className="mb-4"
      />

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={filteredTags} // Use filtered tags
          renderItem={(item) => (
            <List.Item key={item.slug}>
              <Card className="shadow-md p-4">
                <div className="mb-2">
                  <Text className="text-lg font-semibold">{item.name}</Text>
                </div>
                <Switch
                  checked={item.isVisible}
                  onChange={() => handleToggleVisibility(item)}
                  className="mb-2"
                  checkedChildren="Visible" 
                  unCheckedChildren="Hidden"
                />
                <div className="mb-2">
                  <Text strong>Slug: </Text>
                  <Text>{item.slug}</Text>
                </div>
                <div className="mb-2">
                  <Text strong>Description: </Text>
                  <Text>{item.description}</Text>
                </div>
                <div className="flex items-center">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(item)}
                  />
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(item)}
                    danger
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete this tag?</p>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal
        title="Edit Tag"
        visible={!!tagToEdit}
        onOk={handleUpdate}
        onCancel={() => setTagToEdit(null)}
      >
        <div>
          <label className="block mb-2">Name:</label>
          <Input 
            value={updatedTagName}
            onChange={(e) => setUpdatedTagName(e.target.value)}
            className="mb-4"
          />
          <label className="block mb-2">Description:</label>
          <Input 
            value={updatedTagDescription}
            onChange={(e) => setUpdatedTagDescription(e.target.value)}
            className="mb-4"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ViewTags;
