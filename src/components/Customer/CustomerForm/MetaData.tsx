import React, { useState } from "react";
import { Button, Input, Form, Space } from "antd";
import { MetaData } from "@/types/Customer"; // Assuming this is the interface from your previous example

interface MetaDataProps {
  metaData: MetaData[];
  setMetaData: React.Dispatch<React.SetStateAction<MetaData[]>>;
}

const MetaDataForm: React.FC<MetaDataProps> = ({ metaData, setMetaData }) => {
  // Add new meta data
  const addMetaData = () => {
    setMetaData([...metaData, { key: "", value: "" }]);
  };

  // Handle meta data input change
  const handleChange = (index: number, field: "key" | "value", value: string) => {
    const updatedMetaData = [...metaData];
    updatedMetaData[index][field] = value;
    setMetaData(updatedMetaData);
  };

  // Handle remove meta data
  const handleRemove = (index: number) => {
    const updatedMetaData = metaData.filter((_, i) => i !== index);
    setMetaData(updatedMetaData);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Meta Data</h3>
      {metaData.map((item, index) => (
        <div key={index} className="flex items-center gap-4 mb-2">
          <Input
            placeholder="Key"
            value={item.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            className="w-1/2"
          />
          <Input
            placeholder="Value"
            value={item.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            className="w-1/2"
          />
          <Button
            
            onClick={() => handleRemove(index)}
            className="ml-2"
            icon={<span className="material-icons">remove_circle</span>}
          />
        </div>
      ))}
      <Button type="dashed" onClick={addMetaData} icon={<span className="material-icons">add</span>}>
        Add Meta Data
      </Button>
    </div>
  );
};

export default MetaDataForm;
