import React, { useEffect, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { subscribeSSE, subscribeSocket, startMockRealtime } from "../../services/api";

export default function GraficoDispersionLive({ variable }) {
  const [data, setData] = useState(() => {
    // inicial: 30 puntos vacíos
    return Array.from({length: 30}).map((_,i)=>({hora: `${i}`, value: null}));
  });
  const bufferRef = useRef(data);

  useEffect(() => {
    let stop;
    const handler = (msg) => {
      // msg puede ser {variable, value, ts} o payload con multiple
      let v, val, time;
      if (msg.variable) { v = msg.variable; val = msg.value; time = msg.ts; }
      else if (msg.payload) { Object.entries(msg.payload).forEach(([k, val2]) => {
        if (k === variable) { v = k; val = val2; time = new Date().toISOString(); }
      });}
      if (v !== variable) return;
      const point = { hora: new Date().toLocaleTimeString(), value: Number(val) };
      bufferRef.current = [...bufferRef.current.slice(-59), point];
      // we update visible state periodically to reduce renders
      setData([...bufferRef.current]);
    };

    if (import.meta.env.VITE_USE_SSE === "true") stop = subscribeSSE(handler);
    else if (import.meta.env.VITE_USE_SOCKET === "true") stop = subscribeSocket(handler);
    else stop = startMockRealtime((p) => { if (p.variable === variable) handler(p); });

    return () => stop && stop();
  }, [variable]);

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hora" tick={{fontSize:10}} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" isAnimationActive={false} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}