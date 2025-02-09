"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { CircularProgress } from "@mui/material";
import SearchConsoleGraph from "./SearchConsoleGraph";
import SearchConsoleSummary from "./SearchConsoleSummary";

// Define Type for Row Data
interface SearchConsoleRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr?: number;
  position: number;
}

const SearchConsole = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [properties, setProperties] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [data, setData] = useState<SearchConsoleRow[]>([]);
  const [summary, setSummary] = useState({
    totalClicks: 0,
    totalImpressions: 0,
    avgCTR: 0,
    avgPosition: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false); // ✅ No session, so stop loading
      return;
    }

    fetch("/api/search-console/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.siteEntry) {
          const sites = data.siteEntry.map((site: any) => site.siteUrl);
          setProperties(sites);
          if (sites.length > 0) {
            setSelectedProperty(sites[0]);
          }
        }
      })
      .catch((err) => console.error("Error fetching properties:", err));
  }, [session]);

  useEffect(() => {
    if (!selectedProperty || !session) return;

    setLoading(true);

    fetch(`/api/search-console/summary?property=${encodeURIComponent(selectedProperty)}`)
      .then((res) => res.json())
      .then((data) => {
        const rows: SearchConsoleRow[] = data.rows || [];

        setSummary({
          totalClicks: rows.reduce((sum, row) => sum + row.clicks, 0),
          totalImpressions: rows.reduce((sum, row) => sum + row.impressions, 0),
          avgCTR: (rows.reduce((sum, row) => sum + (row.ctr || 0), 0) / rows.length) * 100 || 0,
          avgPosition: rows.reduce((sum, row) => sum + row.position, 0) / rows.length || 0,
        });

        setData(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Search Console data:", err);
        setLoading(false);
      });
  }, [selectedProperty, session]);

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <div className="flex justify-center items-center">
        <Image 
          className="mx-auto" 
          src="/images/Google_Search_Console.svg.png" 
          height={500} 
          width={500} 
          alt="google-search-console"
        />
      </div>

      {/* If no session, show login setup button */}
      {!session ? (
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-4">🔴 Not Connected to Google Search Console</p>
          <button
            onClick={() => router.push("/dashboard/setting/search-console")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go to Setup
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center"> <CircularProgress/> </div>
      ) : (
        <>
          {/* Dropdown to select property */}
          <select
            value={selectedProperty || ""}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="mb-4 p-2 border rounded w-full max-w-md mt-2"
          >
            {properties.map((site) => (
              <option key={site} value={site}>
                {site}
              </option>
            ))}
          </select>

          {/* Total Metrics */}
         <SearchConsoleSummary summary={summary}/>

          {/* Graphs */}
         <SearchConsoleGraph data={data} />
        </>
      )}
    </div>
  );
};

export default SearchConsole;
