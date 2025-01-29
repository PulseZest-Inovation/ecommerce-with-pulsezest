import React, { useEffect, useState } from "react";
import { Switch, List, Spin, message } from "antd";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { Product } from "@/types/Product";

interface Guide {
  id: string;
  title: string;
}

interface ProductGuideProps {
  formData: Product;
  onFormDataChange: (key: keyof Product, value: any) => void;
}

export default function ProductGuide({ formData, onFormDataChange }: ProductGuideProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const data = await getAllDocsFromCollection<Guide>("guides");
      setGuides(data);
    } catch (error) {
      message.error("Failed to fetch guides.");
    } finally {
      setLoading(false);
    }
  };

  const toggleGuide = (guideId: string, checked: boolean) => {
    const updatedGuides = [...formData.guides];
    const guideIndex = updatedGuides.findIndex((g) => g.guideId === guideId);

    if (guideIndex !== -1) {
      updatedGuides[guideIndex].enabled = checked;
    } else {
      updatedGuides.push({ guideId, enabled: checked });
    }

    onFormDataChange("guides", updatedGuides);
  };

  return (
    <div>
      <h3>Assign Guides to Product</h3>
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={guides}
          renderItem={(item) => (
            <List.Item>
              <span>{item.title}</span>
              <Switch
                checked={formData.guides?.some((g) => g.guideId === item.id && g.enabled)}
                onChange={(checked) => toggleGuide(item.id, checked)}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
