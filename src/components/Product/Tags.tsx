'use client';
import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import { collection, getDocs, setDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firbeaseConfig'; // Import your Firestore configuration
import { DefaultOptionType } from 'antd/es/select';

const { Option } = Select;

interface TagsProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const Tags: React.FC<TagsProps> = ({ selectedTags, onTagsChange }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]); // Explicitly typed as DefaultOptionType[]
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch tags from Firestore
  const fetchTags = async () => {
    setLoading(true);
    try {
      const key = localStorage.getItem('securityKey');
      if (!key) {
        message.error('Security key is missing!');
        setLoading(false);
        return;
      }

      // Fetch tags from the "tags" collection
      const tagsSnapshot = await getDocs(collection(db, 'app_name', key, 'tags'));
      const fetchedTags: DefaultOptionType[] = [];
      tagsSnapshot.forEach((doc) => {
        const tagData = doc.data();
        if (tagData.name) {
          fetchedTags.push({
            value: tagData.name,
            label: tagData.name,
            count: tagData.count || 0, // Initialize count if not available
          });
        }
      });

      setOptions(fetchedTags);
    } catch (error) {
      message.error('Error fetching tags.');
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  // Increment the count for an existing tag in Firestore
  const handleTagIncrement = async (tag: string) => {
    try {
      const key = localStorage.getItem('securityKey');
      if (!key) {
        message.error('Security key is missing!');
        return;
      }

      // Find the tag in the local options state
      const existingTag = options.find(option => option.value === tag);

      if (existingTag) {
        // If the tag exists, increment the count in Firestore
        const tagDocRef = doc(db, 'app_name', key, 'tags', tag);
        await updateDoc(tagDocRef, {
          count: increment(1), // Increment count by 1
        });

        // Fetch the updated document after incrementing the count
        const updatedTagDoc = await getDoc(tagDocRef);
        const updatedCount = updatedTagDoc.exists() ? updatedTagDoc.data()?.count : 0;

        // Update the count in the local options state
        setOptions((prevOptions) =>
          prevOptions.map((option) =>
            option.value === tag
              ? { ...option, label: `${tag} (${updatedCount})`, count: updatedCount }
              : option
          )
        );

        message.success(`Tag "${tag}" count incremented!`);
      } else {
        // If the tag doesn't exist, add it as a new document with count 1
        const tagDocRef = doc(db, 'app_name', key, 'tags', tag);
        await setDoc(tagDocRef, { name: tag, description: tag, slug: tag, tid: tag, count: 1 });

        // Update options state locally to reflect the new tag with count 1
        setOptions((prevOptions) => [
          ...prevOptions,
          { value: tag, label: `${tag} (1)`, count: 1 }, // Add the new tag with count 1
        ]);

        message.success(`Tag "${tag}" added successfully!`);
      }
    } catch (error) {
      message.error('Error processing tag.');
      console.error('Error processing tag:', error);
    }
  };

  // Handle tag changes (handle selection or unselection of tags)
  const handleTagsChange = (value: string[]) => {
    const newTags = value.filter((tag) => !options.some(option => option.value === tag));
    if (newTags.length > 0) {
      newTags.forEach((tag) => handleTagIncrement(tag)); // Add new tags to Firestore and increment their count
    }
    onTagsChange(value);
  };

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div>
      <label htmlFor="Select Tags" className="block mb-2">
        Select Tags
      </label>
      <Select
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Select or add tags"
        value={selectedTags}
        onChange={handleTagsChange}
        loading={loading}
        className="mb-4 w-full"
        allowClear
        filterOption={(input, option) =>
          (option?.label as string).toLowerCase().includes(input.toLowerCase())
        }
        options={options.map(option => ({
          value: option.value,
          label: `${option.label} (${option.count})`, // Display count with the tag
        }))}
      />
    </div>
  );
};

export default Tags;
