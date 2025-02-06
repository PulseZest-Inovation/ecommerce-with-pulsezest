"use client";
import { useEffect, useState } from "react";
import { Card, Table, Spin } from "antd";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";

const MetaDashboard = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoredToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchMetaData();
    }
  }, [accessToken]);

  // 🔹 Step 1: Fetch Token from Firebase
  const fetchStoredToken = async () => {
    setLoading(true);
    const storedToken = await getDataByDocName<{ clientMetaToken: string }>(
      "settings",
      "meta-settings"
    );

    if (storedToken?.clientMetaToken) {
      setAccessToken(storedToken.clientMetaToken);
    } else {
      console.error("No access token found in Firestore.");
    }
    setLoading(false);
  };

  // 🔹 Step 2: Fetch Business & Campaign Data from Meta API
  const fetchMetaData = async () => {
    if (!accessToken) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/meta-auth/get-campaigns?access_token=${accessToken}`);
      const data = await res.json();

      if (data && data.campaigns) {
        setMetaData(data.campaigns);
      } else {
        console.error("Failed to fetch Meta data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching Meta data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Campaign Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Campaign ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Daily Budget",
      dataIndex: "daily_budget",
      key: "daily_budget",
      render: (budget: string) => (budget ? `$${(Number(budget) / 100).toFixed(2)}` : "N/A"),
    },
    {
      title: "Total Spend",
      dataIndex: "spend",
      key: "spend",
      render: (spend: string) => `$${spend}`,
    },
    {
      title: "Impressions",
      dataIndex: "impressions",
      key: "impressions",
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Meta Business Dashboard</h1>

      {loading ? (
        <Spin size="large" />
      ) : accessToken ? (
        <Card title="Meta Campaign Data" className="shadow-md">
          <Table columns={columns} dataSource={metaData} rowKey="id" />
        </Card>
      ) : (
        <p className="text-red-500">⚠️ Please connect to Meta first.</p>
      )}
    </div>
  );
};

export default MetaDashboard;
