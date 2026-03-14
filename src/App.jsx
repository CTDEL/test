import { useState, useRef, useEffect } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

const COLORS = [
  "#FF6B6B", "#FF9F43", "#FECA57", "#48DBFB",
  "#1DD1A1", "#A29BFE", "#FD79A8", "#6C5CE7",
  "#00CEC9", "#E17055",
];

const GRADE_MAP = [
  { min: 95, grade: "A+", color: "#1DD1A1" },
  { min: 90, grade: "A", color: "#48DBFB" },
  { min: 85, grade: "B+", color: "#A29BFE" },
  { min: 80, grade: "B", color: "#6C5CE7" },
  { min: 75, grade: "C+", color: "#FECA57" },
  { min: 70, grade: "C", color: "#FF9F43" },
  { min: 60, grade: "D", color: "#E17055" },
  { min: 0, grade: "F", color: "#FF6B6B" },
];

function getGrade(score) {
  for (const g of GRADE_MAP) {
    if (score >= g.min) return g;
  }
  return GRADE_MAP[GRADE_MAP.length - 1];
}

function SubjectRow({ index, subject, score, onChange, onRemove, canRemove, animIn }) {
  const [hoverRemove, setHoverRemove] = useState(false);
  const [activeRemove, setActiveRemove] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr minmax(70px, 0.5fr) 34px",
        alignItems: "center",
        gap: "10px",
        opacity: animIn ? 1 : 0,
        transform: animIn ? "translateY(0px)" : "translateY(16px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: COLORS[index % COLORS.length],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "700",
          color: "#0a0a0f",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </span>
      <input
        type="text"
        placeholder="과목명"
        value={subject}
        onChange={(e) => onChange(index, "subject", e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "rgba(255,255,255,0.05)",
          border: "1.5px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          color: "#f0f0f5",
          fontSize: "15px",
          fontFamily: "'Noto Sans KR', sans-serif",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS[index % COLORS.length])}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
      <input
        type="number"
        placeholder="점수"
        min="0"
        max="100"
        value={score}
        onChange={(e) => onChange(index, "score", e.target.value)}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "rgba(255,255,255,0.05)",
          border: "1.5px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          color: "#f0f0f5",
          fontSize: "15px",
          fontFamily: "'Noto Sans KR', sans-serif",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS[index % COLORS.length])}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
      <button
        onClick={() => canRemove && onRemove(index)}
        onMouseEnter={() => canRemove && setHoverRemove(true)}
        onMouseLeave={() => { setHoverRemove(false); setActiveRemove(false); }}
        onMouseDown={() => canRemove && setActiveRemove(true)}
        onMouseUp={() => setActiveRemove(false)}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background: !canRemove ? "transparent" : hoverRemove ? "rgba(255,107,107,0.28)" : "rgba(255,107,107,0.13)",
          border: !canRemove ? "1.5px solid transparent" : hoverRemove ? "1.5px solid rgba(255,107,107,0.5)" : "1.5px solid rgba(255,107,107,0.25)",
          color: canRemove ? "#FF6B6B" : "transparent",
          fontSize: "13px",
          cursor: canRemove ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          pointerEvents: canRemove ? "auto" : "none",
          opacity: canRemove ? 1 : 0,
          transform: !canRemove ? "scale(1)" : activeRemove ? "scale(0.88)" : hoverRemove ? "scale(1.12) rotate(8deg)" : "scale(1)",
          transition: "opacity 0.3s ease, background 0.18s ease, border-color 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        ✕
      </button>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const g = getGrade(d.score);
    return (
      <div
        style={{
          background: "rgba(15,15,25,0.95)",
          border: `1.5px solid ${g.color}`,
          borderRadius: "12px",
          padding: "10px 16px",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        <div style={{ color: g.color, fontWeight: "700", fontSize: "13px" }}>{d.name}</div>
        <div style={{ color: "#f0f0f5", fontSize: "20px", fontWeight: "800" }}>{d.score}점</div>
        <div style={{ color: g.color, fontSize: "13px" }}>{g.grade} 등급</div>
      </div>
    );
  }
  return null;
}

export default function GradeCalculator() {
  const [rows, setRows] = useState([
    { subject: "", score: "", visible: true },
    { subject: "", score: "", visible: true },
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const resultRef = useRef(null);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [activeAdd, setActiveAdd] = useState(false);
  const [hoverCalc, setHoverCalc] = useState(false);
  const [activeCalc, setActiveCalc] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);
  const [activeReset, setActiveReset] = useState(false);

  const handleChange = (idx, field, val) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
    setError("");
  };

  const addRow = () => {
    if (rows.length >= 10) return;
    setRows((prev) => [...prev, { subject: "", score: "", visible: false }]);
    setTimeout(() => {
      setRows((prev) => prev.map((r, i) => (i === prev.length - 1 ? { ...r, visible: true } : r)));
    }, 20);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, visible: false } : r)));
    setTimeout(() => {
      setRows((prev) => prev.filter((_, i) => i !== idx));
    }, 350);
  };

  const calculate = () => {
    const filled = rows.filter((r) => r.subject.trim() !== "" || r.score !== "");
    if (filled.length < 1) {
      setError("최소 1개 이상의 과목을 입력해주세요.");
      return;
    }
    for (const r of filled) {
      if (!r.subject.trim()) { setError("모든 과목명을 입력해주세요."); return; }
      const s = Number(r.score);
      if (r.score === "" || isNaN(s) || s < 0 || s > 100) {
        setError("점수는 0~100 사이의 숫자를 입력해주세요."); return;
      }
    }
    const scores = filled.map((r) => ({ name: r.subject.trim(), score: Number(r.score) }));
    const avg = scores.reduce((a, b) => a + b.score, 0) / scores.length;
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    setResult({ scores, avg, sorted });
    setError("");
  };

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [result]);

  const avgGrade = result ? getGrade(result.avg) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #07070f; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to { opacity:1; transform:translateY(0); }
        }

      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 0%, rgba(108,92,231,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(255,107,107,0.12) 0%, transparent 60%), #07070f",
        fontFamily: "'Noto Sans KR', sans-serif",
        color: "#f0f0f5",
        padding: "0 16px 80px",
      }}>

        {/* Header */}
        <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "56px", animation: "fadeUp 0.6s ease both" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "52px", letterSpacing: "3px", color: "#fff", lineHeight: 1 }}>GRADE</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "52px", letterSpacing: "3px", color: "#6C5CE7", lineHeight: 1 }}>CALC</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", letterSpacing: "0.5px" }}>나의 성적을 분석해보세요</p>
        </div>

        {/* Input Section */}
        <div style={{
          maxWidth: "600px",
          margin: "36px auto 0",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "32px 28px",
          animation: "fadeUp 0.6s 0.1s ease both",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {rows.map((row, i) => (
              <SubjectRow
                key={i}
                index={i}
                subject={row.subject}
                score={row.score}
                onChange={handleChange}
                onRemove={removeRow}
                canRemove={i >= 2 && rows.length > 2}
                animIn={row.visible}
              />
            ))}
          </div>

          {error && (
            <div style={{ marginTop: "14px", padding: "10px 16px", background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: "10px", color: "#FF6B6B", fontSize: "13px" }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
            <button
              onClick={rows.length < 10 ? addRow : undefined}
              onMouseEnter={() => rows.length < 10 && setHoverAdd(true)}
              onMouseLeave={() => { setHoverAdd(false); setActiveAdd(false); }}
              onMouseDown={() => rows.length < 10 && setActiveAdd(true)}
              onMouseUp={() => setActiveAdd(false)}
              disabled={rows.length >= 10}
              style={{
                flex: 1,
                padding: "13px",
                background: hoverAdd ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)",
                border: hoverAdd ? "1.5px dashed rgba(255,255,255,0.3)" : "1.5px dashed rgba(255,255,255,0.15)",
                borderRadius: "14px",
                color: rows.length >= 10 ? "rgba(255,255,255,0.2)" : hoverAdd ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)",
                fontSize: "14px",
                cursor: rows.length >= 10 ? "not-allowed" : "pointer",
                fontFamily: "'Noto Sans KR', sans-serif",
                transform: activeAdd ? "translateY(1px) scale(0.97)" : hoverAdd ? "translateY(-2px)" : "translateY(0)",
                transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              + 과목 추가 {rows.length >= 10 ? "(최대)" : `(${rows.length}/10)`}
            </button>
            <button
              onClick={calculate}
              onMouseEnter={() => setHoverCalc(true)}
              onMouseLeave={() => { setHoverCalc(false); setActiveCalc(false); }}
              onMouseDown={() => setActiveCalc(true)}
              onMouseUp={() => setActiveCalc(false)}
              style={{
                flex: 2,
                padding: "13px",
                background: "linear-gradient(135deg, #6C5CE7, #a29bfe)",
                border: "none",
                borderRadius: "14px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "'Noto Sans KR', sans-serif",
                boxShadow: hoverCalc ? "0 10px 36px rgba(108,92,231,0.55)" : "0 4px 20px rgba(108,92,231,0.3)",
                transform: activeCalc ? "translateY(1px) scale(0.98)" : hoverCalc ? "translateY(-3px) scale(1.02)" : "translateY(0) scale(1)",
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
              }}
            >
              계산하기 →
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div ref={resultRef} style={{ maxWidth: "600px", margin: "32px auto 0", animation: "fadeUp 0.5s ease both" }}>

            {/* Average Card */}
            <div style={{
              background: `linear-gradient(135deg, rgba(108,92,231,0.2), rgba(162,155,254,0.1))`,
              border: `1.5px solid ${avgGrade.color}40`,
              borderRadius: "24px",
              padding: "32px 28px",
              marginBottom: "20px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: `${avgGrade.color}15`, pointerEvents: "none" }} />
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>이번 시험 평균</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "64px", fontWeight: "900", lineHeight: 1, color: avgGrade.color }}>
                  {result.avg.toFixed(1)}
                </span>
                <span style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)" }}>점</span>
                <span style={{
                  marginLeft: "auto",
                  padding: "6px 18px",
                  background: `${avgGrade.color}25`,
                  border: `1.5px solid ${avgGrade.color}60`,
                  borderRadius: "30px",
                  color: avgGrade.color,
                  fontWeight: "800",
                  fontSize: "20px",
                }}>
                  {avgGrade.grade}
                </span>
              </div>
              <div style={{ marginTop: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {[
                  { label: "최고 점수", value: `${result.sorted[0].score}점`, sub: result.sorted[0].name },
                  { label: "최저 점수", value: `${result.sorted[result.sorted.length - 1].score}점`, sub: result.sorted[result.sorted.length - 1].name },
                  { label: "과목 수", value: `${result.scores.length}과목` },
                  { label: "총점", value: `${result.scores.reduce((a, b) => a + b.score, 0)}점` },
                ].map((item) => (
                  <div key={item.label} style={{
                    flex: "1 0 calc(50% - 10px)",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "4px", letterSpacing: "0.5px" }}>{item.label}</div>
                    <div style={{ color: "#f0f0f5", fontWeight: "700", fontSize: "17px" }}>{item.value}</div>
                    {item.sub && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginTop: "2px" }}>{item.sub}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "28px 24px",
              marginBottom: "20px",
            }}>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>과목별 점수</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={result.scores} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "'Noto Sans KR'" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <ReferenceLine y={result.avg} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 4" label={{ value: "평균", fill: "rgba(255,255,255,0.4)", fontSize: 11, position: "insideTopRight" }} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {result.scores.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Grades */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "28px 24px",
            }}>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>과목별 등급</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.sorted.map((s, i) => {
                  const g = getGrade(s.score);
                  const pct = s.score;
                  return (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", minWidth: "20px", textAlign: "right" }}>{i + 1}</span>
                      <span style={{ flex: 1, fontSize: "14px", color: "#f0f0f5", minWidth: "80px" }}>{s.name}</span>
                      <div style={{ flex: 2, height: "8px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: g.color,
                          borderRadius: "4px",
                          transition: "width 0.8s ease",
                        }} />
                      </div>
                      <span style={{ minWidth: "36px", textAlign: "right", fontWeight: "700", fontSize: "14px", color: g.color }}>{g.grade}</span>
                      <span style={{ minWidth: "40px", textAlign: "right", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{s.score}점</span>
                    </div>
                  );
                })
          }
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setRows([{ subject: "", score: "", visible: true }, { subject: "", score: "", visible: true }]); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              onMouseEnter={() => setHoverReset(true)}
              onMouseLeave={() => { setHoverReset(false); setActiveReset(false); }}
              onMouseDown={() => setActiveReset(true)}
              onMouseUp={() => setActiveReset(false)}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "14px",
                background: hoverReset ? "rgba(255,255,255,0.04)" : "transparent",
                border: hoverReset ? "1.5px solid rgba(255,255,255,0.28)" : "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                color: hoverReset ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.4)",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'Noto Sans KR', sans-serif",
                transform: activeReset ? "translateY(1px) scale(0.97)" : hoverReset ? "translateY(-2px)" : "translateY(0)",
                transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              ↺ 다시 계산하기
            </button>
          </div>
        )}
      </div>
    </>
  );
}

