import type { NextApiRequest, NextApiResponse } from "next";

interface ShiprocketPickupResponse {
  pickupData?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShiprocketPickupResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required." });
  }

  try {
    // Fetch Shiprocket pickup details
    const pickupResponse = await fetch("https://apiv2.shiprocket.in/v1/external/settings/company/pickup", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const pickupData = await pickupResponse.json();

    if (!pickupResponse.ok) {
      return res.status(400).json({ error: pickupData.message || "Failed to fetch pickup details." });
    }

    return res.status(200).json({ pickupData });
  } catch (error) {
    console.error("Error fetching Shiprocket pickup details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
