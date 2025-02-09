"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Define Type for Row Data
interface SearchConsoleRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr?: number;
  position: number;
}

const SearchConsole = () => {
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
  }, []);

  useEffect(() => {
    if (!selectedProperty) return;

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
  }, [selectedProperty]);

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Google Search Console Data</h2>

      {/* Dropdown to select property */}
      <select
        value={selectedProperty || ""}
        onChange={(e) => setSelectedProperty(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-md"
      >
        {properties.map((site) => (
          <option key={site} value={site}>
            {site}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <>
          {/* Total Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Total Clicks</h3>
              <p className="text-xl font-bold">{summary.totalClicks}</p>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Total Impressions</h3>
              <p className="text-xl font-bold">{summary.totalImpressions}</p>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Average CTR</h3>
              <p className="text-xl font-bold">{summary.avgCTR.toFixed(2)}%</p>
            </div>
            <div className="bg-white shadow-lg p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Average Position</h3>
              <p className="text-xl font-bold">{summary.avgPosition.toFixed(2)}</p>
            </div>
          </div>

          {/* Graphs */}
          <h3 className="text-xl font-semibold mb-2">Clicks & Impressions Over Time</h3>
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keys[0]" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" name="Clicks" />
                <Line type="monotone" dataKey="impressions" stroke="#82ca9d" name="Impressions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchConsole;
