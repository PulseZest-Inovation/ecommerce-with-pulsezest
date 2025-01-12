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

const ProductVideo: React.FC<VideoUploadProps> = ({ videoUrl, onVideoChange, slug }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVideoUpload = async (videoFile: File) => {
    try {
      setUploading(true);
      const path = "videos";
      const uploadedVideoUrl = await UploadVideoToFirebase(videoFile, path, setProgress);
      await setDocWithCustomId("products", slug, { videoUrl: uploadedVideoUrl });
      message.success("Video uploaded successfully.");
      onVideoChange(uploadedVideoUrl);
    } catch (error) {
      console.error("Failed to upload video:", error);
      message.error("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      await setDocWithCustomId("products", slug, { videoUrl: "" });
      onVideoChange("");
      message.success("Video deleted successfully.");
    } catch (error) {
      console.error("Failed to delete video:", error);
      message.error("Failed to delete video. Please try again.");
    }
  };

  const props = {
    beforeUpload: (file: File) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return Upload.LIST_IGNORE;
      }
      handleVideoUpload(file);
      return false;
    },
    accept: "video/*",
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="mb-6 text-xl font-bold text-center text-gray-800">Product Video Upload</h2>

      {uploading && (
        <Progress
          percent={progress}
          status={progress === 100 ? "success" : "active"}
          className="w-full mb-4"
        />
      )}

      {videoUrl && (
        <div className="relative mb-6">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg shadow-md"
          />
          <button
            className="absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
            onClick={handleDeleteVideo}
          >
            <DeleteOutlined />
          </button>
        </div>
      )}

      <Upload {...props} maxCount={1} showUploadList={false} disabled={uploading}>
        <button
          className={`w-full px-5 py-3 text-sm font-medium text-white rounded-md ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={uploading}
        >
          <UploadOutlined className="mr-2" /> {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </Upload>
    </div>
  );
};

export default ProductVideo;
