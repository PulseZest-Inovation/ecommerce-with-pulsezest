// SearchConsoleGraph.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
interface GraphProps {
  data: any[];
}
const SearchConsoleGraph: React.FC<GraphProps> = ({ data }) => (
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
);
export default SearchConsoleGraph;
