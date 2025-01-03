'use client';
import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import { collection, getDocs, setDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firbeaseConfig'; // Import your Firestore configuration
import { DefaultOptionType } from 'antd/es/select';

const { Option } = Select;

interface TagsProps {
  selectedTags: string[]; // Current selected tags
  onTagsChange: (tags: string[]) => void; // Callback to propagate changes
  productId: string; // ID of the product being edited
}

const Tags: React.FC<TagsProps> = ({ selectedTags, onTagsChange, productId }) => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]); // Tag options
  const [loading, setLoading] = useState<boolean>(true); // Loading state

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

  // Update product tags in Firestore
  const updateProductTags = async (tags: string[]) => {
    if (!tags || !Array.isArray(tags)) {
      console.error('Invalid tags array:', tags);
      return;
    }

    try {
      const key = localStorage.getItem('securityKey');
      if (!key) {
        message.error('Security key is missing!');
        return;
      }

      const productDocRef = doc(db, 'app_name', key, 'products', productId);
      await updateDoc(productDocRef, { tags: tags });
      message.success('Product tags updated successfully!');
    } catch (error) {
      message.error('Error updating product tags.');
      console.error('Error updating product tags:', error);
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

        // Update the count in the local options state
        setOptions((prevOptions) =>
          prevOptions.map((option) =>
            option.value === tag
              ? { ...option, count: option.count + 1 } // Increment count locally
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
          { value: tag, label: tag, count: 1 }, // Add the new tag with count 1
        ]);

        message.success(`Tag "${tag}" added successfully!`);
      }
    } catch (error) {
      message.error('Error processing tag increment.');
      console.error('Error processing tag increment:', error);
    }
  };

  // Decrement the count for an existing tag in Firestore
  const handleTagDecrement = async (tag: string) => {
    try {
      const key = localStorage.getItem('securityKey');
      if (!key) {
        message.error('Security key is missing!');
        return;
      }

      // Find the tag in the local options state
      const existingTag = options.find(option => option.value === tag);

      if (existingTag && existingTag.count > 0) {
        // If the tag exists and count is greater than 0, decrement the count in Firestore
        const tagDocRef = doc(db, 'app_name', key, 'tags', tag);
        await updateDoc(tagDocRef, {
          count: increment(-1), // Decrement count by 1
        });

        // Update the count in the local options state
        setOptions((prevOptions) =>
          prevOptions.map((option) =>
            option.value === tag
              ? { ...option, count: option.count - 1 } // Decrement count locally
              : option
          )
        );

        message.success(`Tag "${tag}" count decremented!`);
      }
    } catch (error) {
      message.error('Error processing tag decrement.');
      console.error('Error processing tag decrement:', error);
    }
  };

  // Handle tag changes (handle selection or unselection of tags)
  const handleTagsChange = (value: string[]) => {
    if (!value || !Array.isArray(value)) {
      console.error('Invalid value array:', value);
      return; // Return early if the value is invalid
    }

    // Identify removed tags
    const removedTags = selectedTags.filter(tag => !value.includes(tag));
    const addedTags = value.filter(tag => !selectedTags.includes(tag));

    // Decrement count for each removed tag
    removedTags.forEach((tag) => {
      handleTagDecrement(tag); // Decrement if tag is removed
    });

    // Increment count for each added tag
    addedTags.forEach((tag) => {
      handleTagIncrement(tag); // Increment if tag is added
    });

    // Update the product's tags in Firestore
    updateProductTags(value); // Update product tags in Firestore
    onTagsChange(value); // Propagate change to parent component
  };

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div  className='mt-3'>
    
      <h2 className='font-bold'>Selct Tags</h2>
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
