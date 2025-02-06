import { storage } from "@/config/firbeaseConfig";
import { ref, deleteObject } from "firebase/storage";

export const deleteImageFromFirebase = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl); // Adjust if you store full URLs
  try {
    await deleteObject(imageRef);
    console.log('Image deleted successfully from Firebase Storage.');
  } catch (error) {
    console.error('Failed to delete image from Firebase Storage:', error);
    throw new Error('Failed to delete image.');
  }
};
