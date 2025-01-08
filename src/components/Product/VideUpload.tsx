import React, { useState } from "react";
import { Upload, Button, message, Progress } from "antd";
import { UploadVideoToFirebase } from "@/services/FirebaseStorage/UploadVideoToFirebase";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";

interface VideoUploadProps {
  slug: string;
  videoUrl: string;
  onVideoChange: (url: string) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ videoUrl, onVideoChange, slug }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoUpload = async (videoFile: File) => {
    try {
      setUploading(true); // Set uploading state to true
      const path = "videos"; // Define your desired storage path
      const uploadedVideoUrl = await UploadVideoToFirebase(videoFile, path, setProgress);
      await setDocWithCustomId("products", slug, { videoUrl: uploadedVideoUrl });

      // Notify user of successful upload
      message.success("Video uploaded successfully.");
      // Update the parent component with the video URL
      onVideoChange(uploadedVideoUrl);
    } catch (error) {
      console.error("Failed to upload video:", error);
      // Notify user of the failure
      message.error("Failed to upload video. Please try again.");
    } finally {
      setUploading(false); // Reset uploading state
      setProgress(0); // Reset progress
    }
  };

  const handleDeleteVideo = async () => {
    try {
      // Clear video URL in Firestore
      await setDocWithCustomId("products", slug, { videoUrl: "" });
      // Update the parent component with an empty video URL
      onVideoChange("");

      // Notify user of successful deletion
      message.success("Video deleted successfully.");
    } catch (error) {
      console.error("Failed to delete video:", error);
      message.error("Failed to delete video. Please try again.");
    }
  };

  const props = {
    beforeUpload: (file: File) => {
      // Validate file type
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return Upload.LIST_IGNORE; // Prevent upload
      }

      // Proceed with the upload if validation passes
      handleVideoUpload(file);
      return false; // Prevent default upload behavior
    },
    accept: "video/*", // Accept only video files
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <Upload {...props} maxCount={1} showUploadList={false} disabled={uploading}>
        <Button icon={<UploadOutlined />} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Video"}
        </Button>
      </Upload>
      {uploading && (
        <Progress
          percent={progress}
          status={progress === 100 ? "success" : "active"}
          style={{ width: "100%", marginTop: "10px" }}
        />
      )}
      {videoUrl && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <video
            src={videoUrl}
            controls
            style={{
              width: "70%",
              maxWidth: "500px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteVideo}
            style={{ height: "40px" }}
          >
            Delete Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
