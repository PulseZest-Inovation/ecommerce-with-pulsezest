import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { business_id, access_token } = req.query;

  if (!business_id || !access_token) {
    return res.status(400).json({ error: "Missing business ID or access token" });
  }

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/${business_id}/owned_ad_accounts?fields=id,name&access_token=${access_token}`
    );
    const fbData = await fbRes.json();

    return res.json(fbData);
  } catch (error) {
    console.error("Error fetching ad accounts:", error);
    return res.status(500).json({ error: "Failed to fetch ad accounts" });
  }
}
