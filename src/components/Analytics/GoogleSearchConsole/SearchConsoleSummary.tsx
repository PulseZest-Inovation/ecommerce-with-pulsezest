import React from "react";
interface SummaryProps {
  summary: { totalClicks: number; totalImpressions: number; avgCTR: number; avgPosition: number };
}
const SearchConsoleSummary: React.FC<SummaryProps> = ({ summary }) => (
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
);
export default SearchConsoleSummary;