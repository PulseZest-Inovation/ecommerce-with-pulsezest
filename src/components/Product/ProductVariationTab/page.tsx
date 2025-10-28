"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import { Select, Input, Button, message, Modal, Spin, Popconfirm } from "antd";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Product } from "@/types/Product";
import { db } from "@/config/firbeaseConfig";
import { collection, getDocs } from "firebase/firestore";

const { Option } = Select;

interface Variation {
  color: string;
  size: string[];
  images: GalleryImage[];
  [key: string]: any;
}

interface ProductVariationTabProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

interface ColorAttributeValue {
  id: string;
  value: string;
  colorCode: string;
}

interface SizeAttributeValue {
  id: string;
  value: string;
}

interface GalleryImage {
  id: string;
  url: string;
  name?: string;
}

const ProductVariationTab: React.FC<ProductVariationTabProps> = ({
  formData,
  onFormDataChange,
}) => {
  const [variations, setVariations] = useState<Variation[]>(
    (formData as any).variation || [{ color: "", size: [], images: [] }]
  );

  const [colorOptions, setColorOptions] = useState<ColorAttributeValue[]>([]);
  const [sizeOptions, setSizeOptions] = useState<SizeAttributeValue[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState(true);

  // Gallery States
  const [availableGallery, setAvailableGallery] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number | null>(null);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<GalleryImage[]>([]);

  const attributeList = [
    "Price",
    "Shipping",
    "Return & Exchange",
    "Ready",
    "Rating",
    "Guide",
    "Product Stock",
    "Volume",
    "SKU",
    "Bag",
    "GST Rate",
    "HSN Code",
  ];

  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  // ✅ Fetch color and size attributes
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const colors = await getAllDocsFromCollection<ColorAttributeValue>(
          "attributes/color/values"
        );
        setColorOptions(colors);

        const sizes = await getAllDocsFromCollection<SizeAttributeValue>(
          "attributes/size/values"
        );
        setSizeOptions(sizes);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setLoadingAttributes(false);
      }
    };
    fetchAttributes();
  }, []);

  // ✅ Add a new variation
  const handleAddVariation = () => {
    const newVariation: Variation = { color: "", size: [], images: [] };
    selectedAttributes.forEach((attr) => {
      newVariation[attr.toLowerCase().replace(/ & | /g, "_")] = "";
    });
    const updated = [...variations, newVariation];
    setVariations(updated);
    onFormDataChange("variation" as keyof Product, updated);
  };

  // ✅ Remove a variation
  const handleRemoveVariation = (index: number) => {
    const updated = variations.filter((_, i) => i !== index);
    setVariations(updated);
    onFormDataChange("variation" as keyof Product, updated);
  };

  // ✅ Update variation field
  const handleVariationChange = (index: number, field: string, value: any) => {
    const updated = [...variations];
    updated[index][field] = value;
    setVariations(updated);
    onFormDataChange("variation" as keyof Product, updated);
  };

  // ✅ Fetch gallery images
  const fetchGalleryImages = async (index: number) => {
    setSelectedVariationIndex(index);
    setLoadingGallery(true);
    try {
      const appKey = localStorage.getItem("securityKey");
      if (!appKey) throw new Error("No security key found in localStorage!");

      const colRef = collection(db, "app_name", appKey, "gallery");
      const querySnapshot = await getDocs(colRef);

      const images: GalleryImage[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as GalleryImage),
        id: doc.id,
      }));

      setAvailableGallery(images);
      setShowGalleryModal(true);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch gallery images");
    } finally {
      setLoadingGallery(false);
    }
  };

  // ✅ Toggle gallery selection
  const toggleSelectGalleryImage = (image: GalleryImage) => {
    if (selectedGalleryImages.find((img) => img.id === image.id)) {
      setSelectedGalleryImages(selectedGalleryImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedGalleryImages([...selectedGalleryImages, image]);
    }
  };

  // ✅ Apply selected images to variation
  const applySelectedImages = () => {
    if (selectedVariationIndex !== null) {
      const updated = [...variations];
      const existingImages = updated[selectedVariationIndex].images || [];
      updated[selectedVariationIndex].images = [...existingImages, ...selectedGalleryImages];
      setVariations(updated);
      onFormDataChange("variation" as keyof Product, updated);
    }
    setSelectedGalleryImages([]);
    setShowGalleryModal(false);
  };

  // ✅ Remove an image from variation
  const handleRemoveSelectedImage = (variationIndex: number, imageId: string) => {
    const updated = [...variations];
    updated[variationIndex].images = updated[variationIndex].images.filter(
      (img) => img.id !== imageId
    );
    setVariations(updated);
    onFormDataChange("variation" as keyof Product, updated);
  };

  return (
    <div className="p-6 bg-white text-gray-800 rounded-2xl shadow-lg space-y-8 border border-gray-200">
      <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 text-gray-700">
        Product Variations
      </h2>

      {/* Attribute selection */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Select Extra Attributes
        </label>
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Select attributes like Price, Shipping, etc."
          value={selectedAttributes}
          onChange={setSelectedAttributes}
        >
          {attributeList.map((attr) => (
            <Option key={attr} value={attr}>
              {attr}
            </Option>
          ))}
        </Select>
      </div>

      {loadingAttributes ? (
        <p className="text-gray-500">Loading attributes...</p>
      ) : (
        variations.map((variation, index) => (
          <div
            key={index}
            className="p-5 border border-gray-300 rounded-xl bg-gray-50 space-y-4 relative hover:shadow-md transition-shadow"
          >
            {variations.length > 1 && (
              <button
                onClick={() => handleRemoveVariation(index)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-600 transition"
              >
                <DeleteOutlined />
              </button>
            )}

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Select Color
              </label>
              <select
                className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:ring focus:ring-green-200 focus:border-green-400 transition"
                value={variation.color}
              onChange={(e) => {
  const selected = JSON.parse(e.target.value);
  handleVariationChange(index, "color", selected.value);
  handleVariationChange(index, "colorCode", selected.code); // ✅ store color code separately
}}

              >
                <option value="">Select Color</option>
                {colorOptions.map((color) => (
                 <option
  key={color.id}
  value={JSON.stringify({ value: color.value, code: color.colorCode })}
>
  {color.value}
</option>

                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Select Sizes
              </label>
              <Select
                mode="multiple"
                allowClear
                placeholder="Select Sizes"
                value={variation.size}
                onChange={(values) => handleVariationChange(index, "size", values)}
                className="w-full"
              >
                {sizeOptions.map((size) => (
                  <Option key={size.id} value={size.value}>
                    {size.value}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Dynamic Extra Attributes */}
            {selectedAttributes.map((attr) => {
              const fieldKey = attr.toLowerCase().replace(/ & | /g, "_");
              return (
                <div key={attr}>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    {attr}
                  </label>
                  <Input
                    placeholder={`Enter ${attr}`}
                    value={variation[fieldKey] || ""}
                    onChange={(e) =>
                      handleVariationChange(index, fieldKey, e.target.value)
                    }
                  />
                </div>
              );
            })}

            {/* Gallery Image Section */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Variation Images
              </label>
              <Button
                icon={<PictureOutlined />}
                onClick={() => fetchGalleryImages(index)}
                type="default"
              >
                Select from Gallery
              </Button>

              {/* Show selected images */}
              {variation.images?.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {variation.images.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.url}
                        alt={img.name || "variation"}
                        className="w-full h-24 object-cover rounded-md border border-gray-300"
                      />
                      <Popconfirm
                        title="Remove this image?"
                        onConfirm={() => handleRemoveSelectedImage(index, img.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          size="small"
                          danger
                          className="absolute top-1 right-1"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Add Variation Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAddVariation}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition"
        >
          <PlusOutlined /> Add Variation
        </button>
      </div>

      {/* Gallery Modal */}
      <Modal
        title="Select Images from Gallery"
        open={showGalleryModal}
        onCancel={() => setShowGalleryModal(false)}
        onOk={applySelectedImages}
        okText="Add Selected"
        width={750}
      >
        {loadingGallery ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : availableGallery.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No images found in gallery.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {availableGallery.map((image) => {
              const isSelected = selectedGalleryImages.find((img) => img.id === image.id);
              return (
                <div
                  key={image.id}
                  className={`relative cursor-pointer border ${
                    isSelected ? "border-green-500" : "border-transparent"
                  } rounded-md`}
                  onClick={() => toggleSelectGalleryImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-semibold">
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductVariationTab;
