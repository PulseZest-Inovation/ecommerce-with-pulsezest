import { ApplicationConfig } from "@/utils/ApplicationConfig";
import { storage } from "@/utils/firbeaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


/**
 * Uploads a video to Firebase Storage and returns the URL.
 * @param videoFile - The video file to upload (e.g., File or Blob).
 * @param path - The specific path in Firebase Storage where the video should be stored.
 * @returns The URL of the uploaded video.
 */
export const UploadVideoToFirebase = async (
  videoFile: File | Blob,
  path: string
): Promise<string> => {
  try {
    // Ensure videoFile is of type File
    if (!(videoFile instanceof File)) {
      throw new Error("The provided video is not a valid file.");
    }

    // Use the current timestamp for a unique file name
    const fileName = `${ApplicationConfig.securityKey}/${path}/${Date.now()}-${videoFile.name}`;
    const storageRef = ref(storage, fileName);

    // Upload the video to Firebase Storage
    await uploadBytes(storageRef, videoFile);

    // Get the download URL for the uploaded video
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error) {
    console.error("Error Uploading Video:", error);
    throw new Error("Failed to upload video. Please try again.");
  }
};
