import React from "react";
import { Upload, Button, message } from "antd";
import { UploadVideoToFirebase } from "@/services/FirebaseStorage/UploadVideoToFirebase";
import { UploadOutlined } from "@ant-design/icons";
import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";

interface VideoUploadProps {
slug: string;
  videoUrl: string;
  onVideoChange: (url: string) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ videoUrl, onVideoChange, slug }) => {
  const handleVideoUpload = async (videoFile: File) => {
    try {
      const path = "videos"; // Define your desired storage path
      const videoUrl = await UploadVideoToFirebase(videoFile, path);
      await setDocWithCustomId( 'products' ,slug,{videoUrl: videoUrl})

      // Notify user of successful upload
      message.success("Video uploaded successfully.");
      // Update the parent component with the video URL
      onVideoChange(videoUrl);
    } catch (error) {
      console.error("Failed to upload video:", error);

      // Notify user of the failure
      message.error("Failed to upload video. Please try again.");
    }
  };



  const props = {
    beforeUpload: (file: File) => {
      handleVideoUpload(file);
      return false; // Prevent default upload behavior
    },
  };

  return (
    <div>
      <Upload {...props} maxCount={1} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload Video</Button>
      </Upload>
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          style={{ marginTop: "10px", width: "100%", borderRadius: "4px" }}
        />
      )}
    </div>
  );
};

export default VideoUpload;
