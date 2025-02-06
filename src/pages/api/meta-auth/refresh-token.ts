import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { access_token } = req.query;
  
  const appId = "1121410479289575";
  const appSecret = "89b1db419392438a0908a14ce1a78602";

  const url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${access_token}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to refresh token" });
  }
}
