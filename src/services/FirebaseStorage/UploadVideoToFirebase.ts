import { ApplicationConfig } from "@/utils/ApplicationConfig";
import { storage } from "@/utils/firbeaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

/**
 * Uploads a video to Firebase Storage and returns the URL.
 * @param videoFile - The video file to upload (e.g., File or Blob).
 * @param path - The specific path in Firebase Storage where the video should be stored.
 * @param onProgress - Optional callback function to track upload progress.
 * @returns The URL of the uploaded video.
 */
export const UploadVideoToFirebase = async (
  videoFile: File | Blob,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Ensure videoFile is of type File
    if (!(videoFile instanceof File)) {
      throw new Error("The provided video is not a valid file.");
    }

    // Use the current timestamp for a unique file name
    const fileName = `${ApplicationConfig?.securityKey}/${path}/${Date.now()}-${videoFile.name}`;
    const storageRef = ref(storage, fileName);

    // Create a resumable upload task
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    // Track progress
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate upload progress percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress)); // Pass progress back to the callback
          }
        },
        (error) => {
          console.error("Error Uploading Video:", error);
          reject(new Error("Failed to upload video. Please try again."));
        },
        async () => {
          // Upload completed, get the download URL
          try {
            const downloadUrl = await getDownloadURL(storageRef);
            resolve(downloadUrl);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(new Error("Failed to get video URL. Please try again."));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error Uploading Video:", error);
    throw new Error("Failed to upload video. Please try again.");
  }
};
