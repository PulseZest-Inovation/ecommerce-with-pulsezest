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
    // Ensure imageFile is of type File
    if (!(imageFile instanceof File)) {
      throw new Error("The provided image is not a valid file.");
    }

    // Compress the image
    const compressedImage: File | Blob = await new Promise((resolve, reject) => {
      new Compressor(imageFile, {
        quality: 0.8, // Adjust compression quality as needed (0.1 to 1)
        success: (compressedResult) => resolve(compressedResult),
        error: (err) => reject(err),
      });
    });

    // Use the current timestamp for a unique file name
    const fileName = `${path}/${Date.now()}-${compressedImage instanceof File ? compressedImage.name : "image"}`;
    const storageRef = ref(storage, fileName);

    // Upload the compressed image to Firebase Storage
    await uploadBytes(storageRef, compressedImage);

    // Get the download URL for the uploaded image
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error) {
    console.error("Error Uploading Image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};



 /**
 * Uploads multiple images to Firebase Storage and returns the URLs.
 * Compresses each image before uploading.
 * @param imageFiles - The array of image files to upload (e.g., File or Blob).
 * @param path - The specific path in Firebase Storage where the images should be stored.
 * @returns The array of URLs of the uploaded images.
 */
export const UploadMultipleImagesToFirebase = async (
    imageFiles: (File | Blob)[], // Array of image files to upload
    path: string
  ): Promise<string[]> => {
    try {
      const uploadedUrls: string[] = [];
  
      // Loop over each image file and upload it individually
      for (const imageFile of imageFiles) {
        // Check if the imageFile is a valid instance of File or Blob
        if (!(imageFile instanceof File) && !(imageFile instanceof Blob)) {
          throw new Error("The provided image is not a valid file or blob.");
        }
  
        // Compress the image
        const compressedImage: File | Blob = await new Promise((resolve, reject) => {
          new Compressor(imageFile, {
            quality: 0.8, // Adjust compression quality as needed (0.1 to 1)
            success: (compressedResult) => resolve(compressedResult),
            error: (err) => reject(err),
          });
        });
  
        // Generate a unique file name with timestamp
        const fileName = `${path}/${Date.now()}-${compressedImage instanceof File ? compressedImage.name : "image"}`;
        const storageRef = ref(storage, fileName);
  
        // Upload the compressed image to Firebase Storage
        await uploadBytes(storageRef, compressedImage);
  
        // Get the download URL for the uploaded image
        const downloadUrl = await getDownloadURL(storageRef);
  
        // Add the uploaded URL to the array
        uploadedUrls.push(downloadUrl);
      }
  
      return uploadedUrls; // Return an array of uploaded image URLs
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw new Error("Failed to upload images. Please try again.");
    }
  };