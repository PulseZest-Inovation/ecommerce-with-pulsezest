import type { NextApiRequest, NextApiResponse } from "next";

interface ShiprocketTokenResponse {
  token?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShiprocketTokenResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const response = await fetch(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const responseData = await response.json();

    if (response.ok && responseData.token) {
      return res.status(200).json({ token: responseData.token });
    } else {
      return res.status(401).json({ error: responseData.message || "Failed to get token from Shiprocket API." });
    }
  } catch (error) {
    console.error("Error generating Shiprocket token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}