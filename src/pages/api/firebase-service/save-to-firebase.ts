import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/config/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { appId, collectionName, data } = req.body;

    if (!appId || !collectionName || !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    data.createdAt = new Date(); // Timestamp add kar raha hoon

    let docRef = db.collection('app_name').doc(appId).collection(collectionName);
    
    const newDoc = await docRef.add(data); // Auto-generate document ID

    return res.status(201).json({ message: "Data saved successfully", id: newDoc.id });
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
