import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ad_account_id, access_token } = req.query;

  if (!ad_account_id || !access_token) {
    return res.status(400).json({ error: "Missing ad account ID or access token" });
  }

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v18.0/act_${ad_account_id}/campaigns?fields=id,name,status,daily_budget&access_token=${access_token}`
    );
    const fbData = await fbRes.json();

    return res.json(fbData);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return res.status(500).json({ error: "Failed to fetch campaigns" });
  }
}
