import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchAverages } from "../../services/api";

export default function Histogram10Days({ variable }) {
  const [data, setData] = useState([]);
  useEffect(()=> {
    fetchAverages(variable, 10).then(setData).catch(()=>setData([]));
  }, [variable]);
  return (
    <div className="bg-white p-4 rounded-lg shadow h-48">
      <h4 className="mb-2 text-sm font-medium">Promedio últimos 10 días</h4>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{fontSize:10}} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avg" barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}