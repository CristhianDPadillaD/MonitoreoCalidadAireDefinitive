import React, { useEffect, useState } from "react";

export default function Boxplot({ variable }) {
    const [box, setBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!variable) return;
        setLoading(true);
        fetch(`http://localhost:3000/api/historial/cuartiles-dia?variable=${variable}`)
            .then((r) => r.json())
            .then((json) => {
                if (json && json.boxplot) {
                    setBox(json.boxplot);
                } else {
                    setBox(null);
                }
            })
            .catch((err) => {
                console.error("Error cargando cuartiles:", err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, [variable]);

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
            Cargando diagrama...
        </div>
    );
    if (error) return <div>Error cargando diagrama de cajas</div>;
    if (!box) return <div>No hay datos del boxplot para este día.</div>;

    const { q1, q2, q3, limite_inferior, limite_superior, valoresAtipicos = [] } = box;

    let min = limite_inferior;
    let max = limite_superior;
    if (min === max) {
        const padding = Math.max(1, Math.abs(min) * 0.1);
        min = min - padding;
        max = max + padding;
    }

    const viewHeight = 160;
    const viewWidth = 1000;
    const paddingLeft = 80;
    const paddingRight = 40;
    const innerWidth = viewWidth - paddingLeft - paddingRight;
    const centerY = viewHeight / 2;

    const scaleX = (val) => {
        const ratio = (val - min) / (max - min);
        return paddingLeft + ratio * innerWidth;
    };

    const xMin = scaleX(limite_inferior);
    const xQ1 = scaleX(q1);
    const xMed = scaleX(q2);
    const xQ3 = scaleX(q3);
    const xMax = scaleX(limite_superior);

    const boxHeight = 36;
    const boxTop = centerY - boxHeight / 2;
    const whiskerY = centerY;
    const outlierRadius = 5;

    const ticks = [
        { label: String(limite_inferior), x: xMin },
        { label: `Q1: ${q1}`, x: xQ1 },
        { label: `Med: ${q2}`, x: xMed },
        { label: `Q3: ${q3}`, x: xQ3 },
        { label: String(limite_superior), x: xMax },
    ];

    return (
        <div style={{ width: "100%", background: "#f9fafb", border: "2px solid #e5e7eb", borderRadius: 16, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151", textAlign: "center" }}>
                Diagrama de cajas y bigotes ({box && box.dia ? box.dia : "día"})
            </h3>

            <div style={{ width: "100%", overflow: "hidden" }}>
                <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width="100%" height={viewHeight}>
                    {/* línea de whiskers */}
                    <line x1={xMin} x2={xMax} y1={whiskerY} y2={whiskerY} stroke="#94a3b8" strokeWidth={2} />

                    {/* extremos (cap lines) */}
                    <line x1={xMin} x2={xMin} y1={whiskerY - 18} y2={whiskerY + 18} stroke="#94a3b8" strokeWidth={2} />
                    <line x1={xMax} x2={xMax} y1={whiskerY - 18} y2={whiskerY + 18} stroke="#94a3b8" strokeWidth={2} />

                    {/* caja Q1 - Q3 */}
                    <rect x={xQ1} y={boxTop} width={Math.max(1, xQ3 - xQ1)} height={boxHeight} fill="#60a5fa22" stroke="#3b82f6" strokeWidth={1.5} rx={6} />

                    {/* mediana */}
                    <line x1={xMed} x2={xMed} y1={boxTop - 6} y2={boxTop + boxHeight + 6} stroke="#1e40af" strokeWidth={2.5} />

                    {/* outliers */}
                    {valoresAtipicos.map((val, idx) => {
                        let vx = scaleX(val);
                        const jitter = ((idx % 3) - 1) * 8;
                        return <circle key={idx} cx={vx} cy={centerY + boxHeight / 2 + 18 + jitter} r={outlierRadius} fill="#ef4444" stroke="#7f1d1d" strokeWidth={1} />;
                    })}

                    {(() => {
                        const MIN_LABEL_DISTANCE = 40;

                        const adjustedTicks = ticks.map((t, i, arr) => {
                            let dy = 0;
                            let dx = 0;

                            if (i > 0) {
                                const delta = Math.abs(t.x - arr[i - 1].x);

                                if (delta < MIN_LABEL_DISTANCE) {
                                    dy = (i % 2 === 0 ? 12 : 26);
                                    dx = (i % 2 === 0 ? -20 : 20);
                                }
                            }

                            return { ...t, dy, dx };
                        });

                        return adjustedTicks.map((t, i) => (
                            <g key={i}>
                                <line
                                    x1={t.x + t.dx}
                                    x2={t.x + t.dx}
                                    y1={centerY + 34 + t.dy}
                                    y2={centerY + 28 + t.dy}
                                    stroke="#cbd5e1"
                                    strokeWidth={1}
                                />
                                <text
                                    x={t.x + t.dx}
                                    y={centerY + 54 + t.dy}
                                    fontSize="12"
                                    fill="#334155"
                                    textAnchor="middle"
                                >
                                    {t.label}
                                </text>
                            </g>
                        ));
                    })()}


                    <text x={paddingLeft} y={16} fontSize="12" fill="#334155">Valor</text>
                </svg>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, background: "#60a5fa22", border: "2px solid #3b82f6", borderRadius: 3 }} />
                    <small style={{ color: "#374151" }}>Caja (Q1 - Q3)</small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 12, height: 12, background: "#ef4444", borderRadius: 12 }} />
                    <small style={{ color: "#374151" }}>Valores atípicos</small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 4, background: "#1e40af" }} />
                    <small style={{ color: "#374151" }}>Mediana</small>
                </div>
            </div>
        </div>
    );
}
