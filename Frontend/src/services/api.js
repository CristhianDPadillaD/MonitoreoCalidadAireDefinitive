const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchLatest() {
  const res = await fetch(`${API_URL}/api/latest`);
  if (!res.ok) throw new Error("Error fetching latest");
  return res.json(); // espera { pm2_5:12.3, co:0.3, ... }
}

export async function fetchAverages(variable, days = 10) {
  const res = await fetch(`${API_URL}/api/averages?variable=${variable}&days=${days}`);
  if (!res.ok) throw new Error("Error fetching averages");
  return res.json(); // espera [{date: '2025-10-01', avg: 12.3}, ...]
}

export async function fetchTodayAverage(variable) {
  const res = await fetch(`${API_URL}/api/average/today?variable=${variable}`);
  if (!res.ok) throw new Error("Error fetching today avg");
  return res.json(); // espera { value: 12.3 }
}

// --- Real time: SSE (simple) ---
// Backend: exponer /sse/stream que emita JSON con {type:'update', payload:{pm2_5:..., co:...}} o {type:'point', variable:'pm2_5', value:...}
export function subscribeSSE(onMessage) {
  const es = new EventSource(`${API_URL}/sse/stream`);
  es.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch (err) { console.error(err); }
  };
  es.onerror = (err) => { console.error("SSE error", err); es.close(); }
  return () => es.close();
}

// --- Real time: socket.io (if backend usa socket.io) ---
import { io } from "socket.io-client";
let socket;
export function subscribeSocket(onMessage) {
  socket = io(API_URL);
  socket.on("connect_error", console.error);
  socket.on("sensor:update", (data) => onMessage(data));
  return () => { socket.off(); socket.disconnect(); };
}

// --- MOCK helper (cuando backend no está listo) ---
export function startMockRealtime(onMessage) {
  const iv = setInterval(() => {
    const now = new Date();
    const point = {
      variable: "pm2_5",
      value: +(10 + Math.random()*40).toFixed(1),
      ts: now.toISOString()
    };
    onMessage(point);
  }, 1500);
  return () => clearInterval(iv);
}