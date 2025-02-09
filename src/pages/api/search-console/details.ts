import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { property } = req.query;

  if (!property) {
    return res.status(400).json({ error: "Missing property parameter" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const searchConsole = google.searchconsole({ version: "v1", auth });

    const startDate = "2024-01-01";
    const endDate = "2024-02-01";

    // **Fetch Top Queries**
    const queryResponse = await searchConsole.searchanalytics.query({
      siteUrl: property as string,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 10,
      },
    });

    const topQueries = queryResponse.data.rows?.map((row) => ({
      query: row.keys?.[0] ?? "Unknown",
      clicks: row.clicks ?? 0,
    })) || [];

    // **Fetch Top Pages**
    const pageResponse = await searchConsole.searchanalytics.query({
      siteUrl: property as string,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 10,
      },
    });

    const topPages = pageResponse.data.rows?.map((row) => ({
      url: row.keys?.[0] ?? "Unknown",
      clicks: row.clicks ?? 0,
    })) || [];

    // **Fetch Traffic by Country**
    const countryResponse = await searchConsole.searchanalytics.query({
      siteUrl: property as string,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["country"],
        rowLimit: 10,
      },
    });

    const countries = countryResponse.data.rows?.map((row) => ({
      country: row.keys?.[0] ?? "Unknown",
      clicks: row.clicks ?? 0,
    })) || [];

    // **Fetch Traffic by Device**
    const deviceResponse = await searchConsole.searchanalytics.query({
      siteUrl: property as string,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["device"],
        rowLimit: 10,
      },
    });

    const devices = deviceResponse.data.rows?.map((row) => ({
      device: row.keys?.[0] ?? "Unknown",
      clicks: row.clicks ?? 0,
    })) || [];

    return res.json({ topQueries, topPages, countries, devices });

  } catch (error) {
    console.error("Error fetching Search Console data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
