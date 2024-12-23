import { storage } from "@/utils/firbeaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Compressor from "compressorjs";

/**
 * Uploads an image to Firebase Storage and returns the URL.
 * Compresses the image before uploading.
 * @param imageFile - The image file to upload (e.g., File or Blob).
 * @param path - The specific path in Firebase Storage where the image should be stored.
 * @returns The URL of the uploaded image.
 */
export const UploadImageToFirebase = async (
  imageFile: File | Blob,
  path: string
): Promise<string> => {
  try {
    // Compress the image
    const compressedImage: File | Blob = await new Promise((resolve, reject) => {
      new Compressor(imageFile, {
        quality: 0.8, // Adjust compression quality as needed (0.1 to 1)
        success: (compressedResult) => resolve(compressedResult),
        error: (err) => reject(err),
      });
    });

    const fileName = `${path}/${Date.now()}-${compressedImage instanceof File ? compressedImage.name : "image"}`;
    const storageRef = ref(storage, fileName);

    // Upload the compressed image
    await uploadBytes(storageRef, compressedImage);

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error) {
    console.error("Error Uploading Image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};
