import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/config/firebaseAdmin"; // Make sure adminAuth is exported

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    return res.status(201).json({ uid: userRecord.uid });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
}