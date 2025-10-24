'use client'
import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData"; // Adjust the path accordingly

const { Option } = Select;

interface Categories {
  cid: string;
  name: string;
  slug: string;
  parent: string;
  description: string;
  display: string;
  image: string;
  menu_order: string;
  count: number;
}

interface MultipleCategoriesSelectorProps {
  value?: string[]; // Allows the component to accept an array of strings for the selected categories
  onChange?: (value: string[]) => void; // The function that will be called when categories are selected
}

const MultipleCategoriesSelector: React.FC<MultipleCategoriesSelectorProps> = ({ value = [], onChange }) => {
  const [categories, setCategories] = useState<Categories[]>([]); // State to store fetched categories
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading status

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from Firestore
        const fetchedCategories = await getAllDocsFromCollection<Categories>("categories");
        setCategories(fetchedCategories); // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCategories(); // Call the function to fetch categories when the component mounts
  }, []); // Empty dependency array means this runs only once, when the component is mounted

 
  return (
    <Select
      mode="multiple"
      value={value} // Controlled component: Pass the selected categories to the Select
      onChange={(selectedCategories) => onChange?.(selectedCategories)} // Call onChange when categories are selected
      placeholder="Select categories"
      className="rounded-md"
      style={{ width: "100%" }}
    >
      {categories.map((category) => (
        <Option key={category.cid} value={category.cid}>
          {category.name} {/* Display category name */}
        </Option>
      ))}
    </Select>
  );
};

export default MultipleCategoriesSelector;
