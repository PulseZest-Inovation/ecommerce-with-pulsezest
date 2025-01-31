import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface ShiprocketOrderResponse {
  orderData?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShiprocketOrderResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required." });
  }

  const orderDetails = req.body;

  if (!orderDetails) {
    return res.status(400).json({ error: "Order details are required." });
  }

  try {
    // Create order in Shiprocket using axios
    const orderResponse = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const orderData = orderResponse.data;

    if (orderResponse.status !== 200) {
      return res.status(400).json({ error: orderData.message || "Failed to create order." });
    }

    return res.status(200).json({ orderData });
  } catch (error) {
    console.error("Error creating Shiprocket order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
