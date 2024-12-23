import React from "react";
import { List, Card, Typography } from "antd";
import { Tags } from "@/types/Tags";  // Assuming you have the Tags interface
import "tailwindcss/tailwind.css";

const { Text } = Typography;

// Dummy data for tags
const tagsData: Tags[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "All kinds of electronic items",
    count: "120",
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy fashion for all",
    count: "80",
  },
  {
    id: "3",
    name: "Home Appliances",
    slug: "home-appliances",
    description: "Modern appliances for home",
    count: "50",
  },
  {
    id: "4",
    name: "Books",
    slug: "books",
    description: "A wide variety of books",
    count: "200",
  },
];

const TagsList: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Tags List</h2>

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={tagsData}
        renderItem={(item) => (
          <List.Item>
            <Card className="shadow-md p-4" title={item.name}>
              <div className="mb-2">
                <Text strong>Slug: </Text>
                <Text>{item.slug}</Text>
              </div>
              <div className="mb-2">
                <Text strong>Description: </Text>
                <Text>{item.description}</Text>
              </div>
              <div className="mb-2">
                <Text strong>Count: </Text>
                <Text>{item.count}</Text>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TagsList;
