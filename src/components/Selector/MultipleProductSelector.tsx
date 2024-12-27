'use client'
import React, { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { Select, Spin } from "antd";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData"; // Adjust the path accordingly

const { Option } = Select;

 

interface MultipleProductSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MultipleProductSelector: React.FC<MultipleProductSelectorProps> = ({ value = [], onChange }) => {
  const [products, setProducts] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from Firestore
        const fetchedProducts = await getAllDocsFromCollection<Product>("products");

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Spin size="small" />;
  }

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      placeholder="Select products"
      className="rounded-md"
      style={{ width: "100%" }}
    >
      {products.map((product) => (
        <Option key={product.slug} value={product.id}>
          {product.id}
        </Option>
      ))}
    </Select>
  );
};

export default MultipleProductSelector;
