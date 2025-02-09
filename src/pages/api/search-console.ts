import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("🚀 Using Access Token:", session.accessToken);

  const response = await fetch(
    "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fyourwebsite.com/searchAnalytics/query",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: "2024-01-01",
        endDate: "2024-02-01",
        dimensions: ["query"],
      }),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
