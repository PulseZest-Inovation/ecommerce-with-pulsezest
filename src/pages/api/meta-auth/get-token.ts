// api/meta-auth/get-token.ts

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const appId = "1121410479289575";
    const appSecret = "89b1db419392438a0908a14ce1a78602"; // Don't expose this in frontend
    const redirectUri = "http://localhost:3000/dashboard/setting/meta-marketing";

    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`;

    const response = await fetch(tokenUrl, { method: "GET" });
    const data = await response.json();

    if (data.access_token) {
      return res.status(200).json({ access_token: data.access_token });
    } else {
      return res.status(400).json({ error: "Failed to get access token", details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
