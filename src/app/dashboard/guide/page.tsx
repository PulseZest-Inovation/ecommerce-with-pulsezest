'use client'
import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, List, message, Spin, Card, Row, Col } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { createDocWithAutoId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { UploadImageToFirebase } from "@/services/FirebaseStorage/UploadImageToFirebase";
import { UploadVideoToFirebase } from "@/services/FirebaseStorage/UploadVideoToFirebase";
import { updateDocWithCustomId } from "@/services/FirestoreData/updateFirestoreData";
import { deleteDocFromCollection } from "@/services/FirestoreData/deleteFirestoreData";

const { Option } = Select;

interface Guide {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
}

export default function GuidePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    const data = await getAllDocsFromCollection<Guide>("guides");
    setGuides(data);
  };

  const handleUpload = async () => {
    if (!title || !type || !file) {
      message.error("Please fill all fields and upload a file.");
      return;
    }

    setLoading(true);
    try {
      let fileUrl = "";
      if (type === "image") {
        fileUrl = await UploadImageToFirebase(file, "guides/images");
      } else if (type === "video") {
        fileUrl = await UploadVideoToFirebase(file, "guides/videos");
      }

      const newGuide = { title, type, fileUrl };
      if (editingId) {
        await updateDocWithCustomId("guides", editingId, newGuide);
        message.success("Guide updated successfully!");
        setEditingId(null);
      } else {
        await createDocWithAutoId("guides", newGuide);
        message.success("Guide added successfully!");
      }
      fetchGuides();
      setTitle("");
      setType(undefined);
      setFile(null);
      setFileName("");
    } catch (error) {
      message.error("Failed to upload guide.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocFromCollection("guides", id);
      message.success("Guide deleted successfully!");
      fetchGuides();
    } catch (error) {
      message.error("Failed to delete guide.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guide: Guide) => {
    setEditingId(guide.id);
    setTitle(guide.title);
    setType(guide.type);
    setFileName(guide.fileUrl);
  };

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title={editingId ? "Edit Guide" : "Create a Guide"}>
            <Input placeholder="Guide Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 10 }} />
            <Select placeholder="Select Type" value={type} onChange={setType} style={{ width: "100%", marginBottom: 10 }}>
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
            </Select>
            {type && (
              <Upload 
                beforeUpload={(file) => { setFile(file); setFileName(file.name); return false; }} 
                showUploadList={false} 
                accept={type === "image" ? "image/*" : "video/*"}>
                <Button icon={<UploadOutlined />}>Upload {type}</Button>
              </Upload>
            )}
            {fileName && <p>Selected File: {fileName}</p>}
            <Button type="primary" onClick={handleUpload} style={{ marginTop: 10 }} disabled={loading}>
              {loading ? <Spin /> : editingId ? "Update Guide" : "Save Guide"}
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Saved Guides">
            <List
              bordered
              dataSource={guides}
              renderItem={(item) => (
                <List.Item actions={[
                  <Button icon={<EditOutlined />} onClick={() => handleEdit(item)} />, 
                  <Button icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)} danger />
                ]}>
                  <strong>{item.title}</strong> - {item.type}
                  {item.type === "image" ? <img src={item.fileUrl} alt={item.title} style={{ width: 50, marginLeft: 10 }} /> : null}
                  {item.type === "video" ? <video src={item.fileUrl} controls style={{ width: 100, marginLeft: 10 }} /> : null}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
