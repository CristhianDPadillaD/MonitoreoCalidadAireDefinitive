import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchTodayAverage } from "../../services/api";

export default function DonutToday({ variable }) {
  const [value, setValue] = useState(null);
  useEffect(()=> {
    fetchTodayAverage(variable).then(r => setValue(r.value)).catch(()=>setValue(null));
  }, [variable]);

  if (value === null) return <div className="bg-white p-4 rounded shadow h-48">Cargando...</div>;

  const data = [{ name: "avg", value }, { name: "rest", value: 100 - value }];
  return (
    <div className="bg-white p-4 rounded-lg shadow h-48 flex items-center justify-center">
      <ResponsiveContainer width="80%" height="80%">
        <PieChart>
          <Pie data={data} innerRadius={50} outerRadius={70} dataKey="value">
            <Cell />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute text-center">
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm text-gray-500">Promedio hoy</div>
      </div>
    </div>
  );
}