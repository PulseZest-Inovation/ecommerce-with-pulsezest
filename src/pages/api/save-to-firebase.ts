import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/config/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {appId, collectionName, docName, data } = req.body;

    // Validation checks
    if (!collectionName || typeof collectionName !== "string") {
      return res.status(400).json({ error: "Invalid or missing collection name" });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "Invalid or missing data object" });
    }

    // Add timestamp
    data.createdAt = new Date();

    let docRef;
    if (docName) {
      // If docName is provided, set the document with that ID
      docRef = db.collection('app_name').doc(appId).collection(collectionName).doc(docName);
      await docRef.set(data, { merge: true }); // Merge to avoid overwriting existing fields
    } else {
      // If no docName, auto-generate a new document
      docRef = await db.collection(collectionName).add(data);
    }

    return res.status(201).json({ message: "Data saved successfully", id: docRef.id });
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}


//req be liike {
// {
//   "appId": "Security_key",
//   "collectionName": "collectionName",
//   "docName": "docName",
//   "data":  {}
// }
// }