"use client";
import React, { useEffect, useState } from "react";
import { Button, Image, Input, message, Progress, Select } from "antd";
import { storage } from "@/config/firbeaseConfig"; // Firebase config file
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

type VariationDetailFormProps = {
  formData: any;
  onFormDataChange: (key: string, value: any) => void;
  isManual?: boolean; // 🔹 new
  attributeData?: any[];  // 🔹 new
};

const VariationDetailForm: React.FC<VariationDetailFormProps> = ({
  formData,
  onFormDataChange,
  isManual = false,
  attributeData = [],

}) => {
  const safeVariation = formData || {};

  // image updated
  const [selectedImage, setSelectedImage] = useState<String>(safeVariation.image || "");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  //  Extract color/size dropdown options from Firestore attributes
  const colorAttr = attributeData.find((attr) => attr.name.toLowerCase() === "color");
  const sizeAttr = attributeData.find((attr) => attr.name.toLowerCase() === "size");

  const colorOptions = colorAttr?.values?.map((v: any) => v.value) || [];
  const sizeOptions = sizeAttr?.values?.map((v: any) => v.value) || [];

  // START IMAGEGS UPLOAD HANDLE
  const handleUploadImage = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(!file) return;

    if(!file.type.startsWith("image/")){
      message.error("Please select a valid image file.")
      return;
    }
    const key = localStorage.getItem("securityKey") || "defaultKey";
    const uniqueFileName = `${Date.now()}-${file.name}`;
    const storageRef= ref(storage, `${key}/variations/${uniqueFileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progressPercent);
      },
      (error)=>{
        console.error("Upload error:", error);
        message.error("Failed uploading imgae")
      },
      async() =>{
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setSelectedImage(downloadURL);
        onFormDataChange("image",downloadURL);
        message.success("Image uploaded successfully");
        setUploadProgress(0);
      }
    );
  };
  const handleDeleteImage = () =>{
    setSelectedImage("");
    onFormDataChange("image","");
  };
  // end image upload setup
  // Sync uploaded image from formData whenever it changes
useEffect(() => {
  setSelectedImage(safeVariation.image || "");
}, [safeVariation.image]);



  return (
    <div className="space-y-3">
       {/* 🟡 START: IMAGE UPLOAD UI SECTION */}
      <div className="flex items-center gap-4 mb-4">
        {selectedImage ? (
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Variation"
              width={90}
              height={90}
              className="rounded-md object-cover"
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={handleDeleteImage}
              className="absolute top-1 right-1 bg-white rounded-full shadow-md"
            />
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              style={{ display: "none" }}
              id="variationImageUpload"
            />
            <Button
              icon={<UploadOutlined />}
              type="primary"
              onClick={() =>
                document.getElementById("variationImageUpload")?.click()
              } // ✅ Opens device gallery
            >
              Select from Gallery
            </Button>

            {uploadProgress > 0 && (
              <div className="w-32">
                <Progress percent={Math.round(uploadProgress)} size="small" />
              </div>
            )}
          </>
        )}
      </div>
      {/* 🟡 END: IMAGE UPLOAD UI SECTION */}
      {/* Only show read-only attributes when NOT manual */}
      {!isManual && (
        <div className="flex gap-4 flex-wrap">
          {Object.entries(safeVariation).map(([key, value]) => {
            if (["price", "stock", "color", "size", "weight"].includes(key)) return null;
            return (
              <div key={key} className="text-sm">
                <span className="font-semibold">{key}:</span> {value}
              </div>
            );
          })}
        </div>
      )}

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <Input
          type="number"
          value={safeVariation.price || ""}
          onChange={(e) => onFormDataChange("price", e.target.value)}
          placeholder="Enter price"
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <Input
          type="number"
          value={safeVariation.stock || ""}
          onChange={(e) => onFormDataChange("stock", e.target.value)}
          placeholder="Enter stock"
        />
      </div>

      {/* Color (Dropdown if manual) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        {isManual ? (
          <Select mode="multiple"
            placeholder="Select color"
            value={safeVariation.color || undefined}
            onChange={(value) => onFormDataChange("color", value)}
            className="w-full"
          >
            {colorOptions.map((color) => (
              <Option key={color} value={color}>
                {color}
              </Option>
            ))}
          </Select>
        ) : (
          <Input
            type="text"
            value={safeVariation.color || ""}
            onChange={(e) => onFormDataChange("color", e.target.value)}
            placeholder="Enter color"
          />
        )}
      </div>

      {/* Size (Dropdown if manual) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
        {isManual ? (
          <Select mode="multiple"
            placeholder="Select size"
            value={safeVariation.size || undefined}
            onChange={(value) => onFormDataChange("size", value)}
            className="w-full"
          >
            {sizeOptions.map((size) => (
              <Option key={size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
        ) : (
          <Input
            type="text"
            value={safeVariation.size || ""}
            onChange={(e) => onFormDataChange("size", e.target.value)}
            placeholder="Enter size"
          />
        )}
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Weight</label>
        <Input
          value={safeVariation.weight || ""}
          onChange={(e) => onFormDataChange("weight", e.target.value)}
          placeholder="Enter weight"
        />
      </div>
    </div>
  );
};

export default VariationDetailForm;
