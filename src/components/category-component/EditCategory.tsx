import { ApplicationConfig } from "@/config/ApplicationConfig";
import { Button, Input, message, Upload } from "antd";
import { useState } from "react";
import { Categories } from '@/types/categories';
import { UploadImageToFirebase } from '@/services/FirebaseStorage/UploadImageToFirebase';
import { deleteImageFromFirebase } from "@/services/FirebaseStorage/deleteImageToFirebase";
import { UploadOutlined } from "@mui/icons-material";


type EditFormProps = {
    category: Categories;
    onSubmit: (data: Partial<Categories>, categoryId: string) => void;
  };
  
  const EditCategoryForm: React.FC<EditFormProps> = ({ category, onSubmit }) => {
    const [name, setName] = useState<string>(category.name || '');
    const [description, setDescription] = useState<string>(category.description || '');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
    const handleImageUpload = async () => {
      const key = ApplicationConfig?.securityKey;
  
      if (image) {
        const imagePath = `${key}/categories`;
        // Delete old image before uploading the new one
        if (category.image) {
          await deleteImageFromFirebase(category.image);
        }
        const imageUrl = await UploadImageToFirebase(image, imagePath);
        return imageUrl;
      }
      return category.image; // Return old image if no new image is uploaded
    };
  
    const handleSubmit = async () => {
      if (!name.trim()) {
        message.error('Name cannot be empty.');
        return;
      }
  
      setLoading(true); // Start loading
      try {
        const imageUrl = await handleImageUpload();
        onSubmit({ name, description, image: imageUrl }, category.cid);
      } catch (error) {
        message.error('Failed to upload image.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleBeforeUpload = (file: File) => {
      setImage(file);
      return false;
    };
  
    return (
      <div>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '8px' }}
        />
        <Input.TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '8px' }}
        />
        <Upload
          beforeUpload={handleBeforeUpload}
          multiple={false} // Ensure only one file can be selected
          fileList={image ? [image as any] : []} // Display the selected image in the upload list
          onRemove={() => setImage(null)} // Clear the image on removal
        >
          <Button icon={<UploadOutlined />}>Change Image</Button>
        </Upload>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} type="primary" loading={loading}>
            Save
          </Button>
        </div>
      </div>
    );
  };
  

  export default EditCategoryForm;