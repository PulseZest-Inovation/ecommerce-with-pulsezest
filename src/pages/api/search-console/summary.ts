import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { property } = req.query;
  if (!property) {
    return res.status(400).json({ error: "Property is required" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
        property as string
      )}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: "2024-01-01",
          endDate: new Date().toISOString().split("T")[0], // Today's date
          dimensions: ["date"],
          aggregationType: "byProperty",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch summary data");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
