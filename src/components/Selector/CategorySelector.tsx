import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData"; // Adjust the path accordingly
import { Categories } from "@/types/Categories"; // Adjust the path accordingly

const { Option } = Select;

interface ParentCategorySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CategoriesSelector: React.FC<ParentCategorySelectorProps> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<Array<Categories>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from Firestore
        const fetchedCategories = await getAllDocsFromCollection<Categories>("categories");

        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <Select value={value} onChange={onChange} placeholder="Select parent category" className="rounded-md">
      <Option value="none">None</Option>
      {categories.map((category) => (
        <Option key={category.cid} value={category.cid}>
          {category.name}
        </Option>
      ))}
    </Select>
  );
};

export default CategoriesSelector;




 //how to use the categories;

// const ParentComponent: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>("none");

//   const handleCategoryChange = (value: string) => {
//     setSelectedCategory(value);
//     console.log("Selected Category ID:", value);
//   };

//   return (
//     <div className="p-6 bg-gray-100 rounded-md shadow-md">
//       <h2 className="text-xl font-bold mb-4">Select a Category</h2>
//       <CategoriesSelector value={selectedCategory} onChange={handleCategoryChange} />
//       {selectedCategory !== "none" && (
//         <div className="mt-4 text-green-600">
//           Selected Category ID: <strong>{selectedCategory}</strong>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ParentComponent;
