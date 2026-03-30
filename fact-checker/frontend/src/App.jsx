import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const C = {
  researcher: "#4ade80",
  opposition: "#f87171", 
  factChecker: "#facc15",
  judge: "#a78bfa",
  bg: "#111827", // Lightened from #0a0a14
  panel: "rgba(20,25,45,0.95)",
  border: "rgba(100,100,200,0.25)",
};

const STAGES = ["decompose","retrieve","researcher","opposition","fact_checker","judge"];
const STAGE_LABELS = {
  decompose: "Decompose", retrieve: "Retrieve", researcher: "Researcher",
  opposition: "Opposition", fact_checker: "Fact-Check", judge: "Judge"
};
const AGENT_COLORS = {
  researcher: C.researcher, opposition: C.opposition,
  fact_checker: C.factChecker, judge: C.judge,
  decompose: "#60a5fa", retrieve: "#60a5fa"
};

// ── Animated canvas background ──────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const stars = Array.from({length: 180}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      o: Math.random(),
      s: (Math.random() - 0.5) * 0.003,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.o += s.s;
        if (s.o > 1 || s.o < 0) s.s *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,160,255,${s.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ── Animated agent node (CSS only) ──────────────────────────────────────────
function AgentNode({ label, color, active, pos, output, tooltipPos }) {
  return (
    <motion.div
      animate={{ scale: active ? [1, 1.12, 1] : 1, opacity: (active || output) ? 1 : 0.45 }}
      transition={{ repeat: active ? Infinity : 0, duration: 1.2 }}
      style={{
        position: "absolute", ...pos,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        cursor: "default",
        zIndex: active ? 30 : 10,
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        border: `2px solid ${color}`,
        background: active ? `${color}22` : "transparent",
        boxShadow: active ? `0 0 24px ${color}88, 0 0 48px ${color}44` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.4s",
        position: "relative",
      }}>
        {/* Inner rotating ring */}
        <div style={{
          position: "absolute", inset: -8,
          border: `1px solid ${color}44`,
          borderRadius: "50%",
          borderTopColor: active ? color : "transparent",
          animation: active ? "spin 1.5s linear infinite" : "none",
        }}/>
        <div style={{
          width: 20, height: 20,
          background: active ? color : `${color}66`,
          clipPath: "polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)",
          transition: "all 0.4s",
        }}/>
      </div>
      <div style={{
        color: active ? color : `${color}88`,
        fontSize: 9, fontWeight: 700, letterSpacing: 2,
        fontFamily: "monospace", textShadow: active ? `0 0 10px ${color}` : "none",
        transition: "all 0.4s",
      }}>{label}</div>

      <AnimatePresence>
        {output && (
          <motion.div
            initial={{opacity: 0, scale: 0.9, y: 5}}
            animate={{opacity: 1, scale: 1, y: 0}}
            style={{
              position: "absolute", ...tooltipPos,
              width: 250,
              background: "rgba(10,10,24,0.95)",
              border: `1px solid ${color}55`,
              borderTop: `3px solid ${color}`,
              borderRadius: 8,
              padding: "12px 14px",
              color: "#f8fafc",
              fontSize: 11,
              lineHeight: 1.4,
              maxHeight: 160, overflowY: "auto",
              whiteSpace: "pre-wrap",
              textAlign: "left",
              boxShadow: `0 8px 24px rgba(0,0,0,0.6)`,
              pointerEvents: "auto",
              fontFamily: "monospace"
            }}
          >
            {output}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── SVG connections between agents ──────────────────────────────────────────
function AgentConnections({ active }) {
  const lines = [
    { x1:"18%", y1:"50%", x2:"50%", y2:"20%", color: C.factChecker },
    { x1:"82%", y1:"50%", x2:"50%", y2:"20%", color: C.factChecker },
    { x1:"18%", y1:"50%", x2:"82%", y2:"50%",  color: "#818cf8" },
    { x1:"50%", y1:"20%", x2:"50%", y2:"80%",  color: C.judge },
  ];
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
      {lines.map((l,i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.color} strokeWidth={active ? 1.5 : 0.5}
          strokeOpacity={active ? 0.6 : 0.15}
          strokeDasharray={active ? "none" : "4 4"}
          style={{transition:"all 0.5s"}}
        />
      ))}
    </svg>
  );
}

// ── Stage progress bar ───────────────────────────────────────────────────────
function StageBar({ currentStage }) {
  const idx = STAGES.indexOf(currentStage);
  return (
    <div style={{ display:"flex", gap:4, marginBottom:14 }}>
      {STAGES.map((s,i) => (
        <div key={s} style={{flex:1, textAlign:"center"}}>
          <div style={{
            height: 3, borderRadius: 2, marginBottom: 4,
            background: i < idx ? C.judge : i === idx ? "#a78bfa" : "#1e1e3a",
            boxShadow: i === idx ? `0 0 8px #a78bfa` : "none",
            transition: "all 0.4s",
          }}/>
          <div style={{
            fontSize: 8, letterSpacing: 0.5,
            color: i <= idx ? "#a78bfa" : "#334155",
            fontWeight: i === idx ? 700 : 400,
            fontFamily: "monospace",
          }}>{STAGE_LABELS[s]}</div>
        </div>
      ))}
    </div>
  );
}

// ── Agent output card ────────────────────────────────────────────────────────
function AgentCard({ agent, content, color }) {
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      style={{
        background: C.panel,
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8, padding: "16px 20px", marginBottom: 12,
      }}
    >
      <div style={{color, fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:8, fontFamily:"monospace"}}>
        ◆ {agent}
      </div>
      <div style={{color:"#f8fafc", fontSize:13, lineHeight:1.6, maxHeight:250, overflow:"auto", fontFamily:"monospace", whiteSpace:"pre-wrap"}}>
        {content}
      </div>
    </motion.div>
  );
}

// ── Verdict panel ────────────────────────────────────────────────────────────
function VerdictPanel({ verdict }) {
  const pct = verdict.confidence || 72;
  const vc = verdict.result === "TRUE" ? C.researcher
           : verdict.result === "FALSE" ? C.opposition : C.factChecker;
  return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
      style={{
        background:"rgba(8,8,22,0.98)", border:`1px solid ${vc}`,
        borderRadius:12, padding:20, boxShadow:`0 0 30px ${vc}33`,
      }}
    >
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <div style={{
          background:vc, color:"#000", fontWeight:700, fontSize:14,
          letterSpacing:2, padding:"5px 14px", borderRadius:6, fontFamily:"monospace",
        }}>{verdict.result || "UNVERIFIED"}</div>
        <div style={{color:"#94a3b8", fontSize:12, fontFamily:"monospace"}}>
          Confidence: {pct}%
        </div>
      </div>
      <div style={{background:"#1e1e3a", borderRadius:4, height:6, marginBottom:16}}>
        <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
          transition={{duration:1.2, ease:"easeOut"}}
          style={{height:"100%", background:vc, borderRadius:4}}
        />
      </div>
      <div style={{color:"#f1f5f9", fontSize:14, lineHeight:1.7, fontFamily:"monospace", whiteSpace:"pre-wrap"}}>
        {verdict.summary?.replace(/[*#`_~>]+/g, "")}
      </div>
      {verdict.sources?.length > 0 && (
        <div style={{marginTop:12, borderTop:"1px solid #1e1e3a", paddingTop:10}}>
          <div style={{color:"#475569", fontSize:10, letterSpacing:2, marginBottom:6, fontFamily:"monospace"}}>SOURCES</div>
          {verdict.sources.slice(0,3).map((s,i) => (
            <div key={i} style={{color:"#60a5fa", fontSize:11, marginBottom:3, fontFamily:"monospace"}}>→ {s}</div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [claim, setClaim]     = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage]     = useState(null);
  const [outputs, setOutputs] = useState({});
  const [verdict, setVerdict] = useState(null);

  const runDemoMode = async () => {
    const steps = [
      ["decompose",    "Claim decomposed into 3 atomic sub-claims for parallel verification."],
      ["retrieve",     "Retrieved 8 sources: Reuters, BBC, Nature, PubMed. Diversity score: 87%."],
      ["researcher",   "SUPPORTING: Multiple peer-reviewed studies corroborate this claim. Source credibility avg: 8.2/10. Confidence: 74%."],
      ["opposition",   "OPPOSING: Contradictory evidence in 3 studies. Confounding variables identified. Confidence: 61%."],
      ["fact_checker", "Source analysis complete. 2 sources flagged low credibility. Evidence weight adjusted."],
      ["judge",        "VERDICT: PARTIALLY TRUE — Core claim supported but with significant nuance."],
    ];
    for (const [s, data] of steps) {
      setStage(s);
      setOutputs(prev => ({...prev, [s]: data}));
      await new Promise(r => setTimeout(r, 1100));
    }
    setVerdict({
      result: "PARTIALLY TRUE", confidence: 68,
      summary: "The claim contains a verifiable core supported by peer-reviewed literature, but important contextual nuances were omitted. 5 of 8 sources are highly credible.",
      sources: ["reuters.com", "nature.com", "pubmed.ncbi.nlm.nih.gov"],
    });
  };

  const runDebate = async () => {
    if (!claim.trim()) return;
    setLoading(true); setStage(null); setOutputs({}); setVerdict(null);
    try {
      const res = await fetch("http://localhost:8000/debate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({claim}),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {stream:true});
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            setStage(event.stage);

            const cleanText = (() => {
              if (!event.data) return "";
              if (typeof event.data === "string") return event.data.replace(/[*#`_~>]+/g, "");
              let txt = "";
              if (event.data.researcher_outputs) txt = event.data.researcher_outputs.join("\n\n");
              else if (event.data.opposition_outputs) txt = event.data.opposition_outputs.join("\n\n");
              else if (event.data.fact_checker_output) txt = event.data.fact_checker_output;
              else if (event.data.judge_output) txt = event.data.judge_output;
              else if (event.data.sub_claims) txt = event.data.sub_claims.join("\n");
              else if (event.data.evidence) txt = event.data.evidence;
              else txt = JSON.stringify(event.data);
              return txt.replace(/[*#`_~>]+/g, "").replace(/\n{3,}/g, "\n\n").trim();
            })();

            setOutputs(prev => ({...prev, [event.stage]: cleanText}));
            if (event.stage === "judge" && event.data?.verdict) setVerdict(event.data.verdict);
          } catch {}
        }
      }
    } catch (err) {
      console.error("Backend error:", err);
      alert("Backend not reachable - running demo mode. Check console.");
      await runDemoMode();
    } finally { setLoading(false); }
  };

  const agents = [
    { id:"researcher",   label:"RESEARCHER",   color:C.researcher,   pos:{left:"8%",  top:"35%"}, tooltipPos: { top: "100%", left: "0%", marginTop: 16 } },
    { id:"opposition",   label:"OPPOSITION",   color:C.opposition,   pos:{right:"8%", top:"35%"}, tooltipPos: { top: "100%", right: "0%", marginTop: 16 } },
    { id:"fact_checker", label:"FACT-CHECKER", color:C.factChecker,  pos:{left:"50%", top:"6%", transform:"translateX(-50%)"}, tooltipPos: { left: "100%", top: "0%", marginLeft: 24 } },
    { id:"judge",        label:"JUDGE",        color:C.judge,        pos:{left:"50%", bottom:"12%", transform:"translateX(-50%)"}, tooltipPos: { left: "100%", bottom: "0%", marginLeft: 24 } },
  ];

  return (
    <div style={{width:"100vw", height:"100vh", background:C.bg, display:"flex", overflow:"hidden", fontFamily:"monospace"}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width:440, height:"100%", display:"flex", flexDirection:"column",
        padding:24, gap:14, overflowY:"auto", zIndex:10,
        borderRight:`1px solid ${C.border}`,
        background:"rgba(15,20,35,0.97)", // Lightened from rgba(6,6,18,0.97)
        boxSizing:"border-box", // Ensure padding doesn't cause overflow
      }}>
        {/* Header */}
        <div style={{marginBottom:6, flexShrink:0}}>
          <div style={{color:"#6366f1", fontSize:9, letterSpacing:3, marginBottom:4}}>◈ MULTI-AGENT SYSTEM</div>
          <div style={{color:"#e2e8f0", fontSize:20, fontWeight:700, lineHeight:1.2}}>Debate Arena</div>
          <div style={{color:"#334155", fontSize:10, marginTop:3}}>Gemini + LangGraph + RAG</div>
        </div>

        {/* Claim input */}
        <div style={{flexShrink:0}}>
          <div style={{color:"#475569", fontSize:10, letterSpacing:2, marginBottom:8}}>ENTER CLAIM TO FACT-CHECK</div>
          <textarea value={claim} onChange={e=>setClaim(e.target.value)} rows={4}
            placeholder="e.g. Coffee causes cancer..."
            style={{
              width:"100%", background:"rgba(15,15,35,0.8)",
              border:`1px solid ${C.border}`, borderRadius:8,
              color:"#f8fafc", fontSize:14, padding:"12px 14px",
              resize:"none", outline:"none", fontFamily:"monospace", boxSizing:"border-box",
            }}
          />
        </div>

        {/* Example buttons */}
        <div style={{display:"flex", flexWrap:"wrap", gap:5, flexShrink:0}}>
          {["5G causes COVID","Coffee causes cancer","Humans use 10% of brain"].map(ex=>(
            <button key={ex} onClick={()=>setClaim(ex)} style={{
              background:"transparent", border:"1px solid #1e293b",
              color:"#475569", fontSize:9, borderRadius:4,
              padding:"3px 7px", cursor:"pointer", letterSpacing:0.5,
            }}>{ex}</button>
          ))}
        </div>

        {/* Run button */}
        <button onClick={runDebate} disabled={loading || !claim.trim()} style={{
          background: loading ? "#1e1e3a" : "linear-gradient(135deg,#4f46e5,#7c3aed)",
          border:"none", borderRadius:8, color:"#fff",
          fontSize:13, fontWeight:700, letterSpacing:1,
          padding:"11px", cursor: loading?"not-allowed":"pointer",
          opacity: !claim.trim() && !loading ? 0.4 : 1,
          transition:"all 0.2s", flexShrink:0
        }}>
          {loading ? "⟳  DEBATING..." : "▶  START DEBATE"}
        </button>

        {/* Demo button */}
        <button onClick={async()=>{
          setClaim("Coffee causes cancer"); setLoading(true);
          setStage(null); setOutputs({}); setVerdict(null);
          await runDemoMode(); setLoading(false);
        }} style={{
          background:"transparent", border:"1px solid #1e293b",
          color:"#475569", fontSize:11, borderRadius:8,
          padding:"8px", cursor:"pointer", flexShrink:0
        }}>⚡ Run Demo (no API needed)</button>

        {/* Stage bar */}
        {stage && <div style={{flexShrink:0}}><StageBar currentStage={stage} /></div>}

        <div style={{flex: 1}} />

        {/* Verdict */}
        <AnimatePresence>
          {verdict && <VerdictPanel verdict={verdict} />}
        </AnimatePresence>
      </div>

      {/* ── RIGHT 3D-STYLE PANEL ── */}
      <div style={{flex:1, position:"relative", overflow:"hidden"}}>
        <StarCanvas />
        <AgentConnections active={loading || !!verdict} />

        {/* Agent nodes */}
        {agents.map(a => (
          <AgentNode key={a.id} label={a.label} color={a.color}
            active={stage === a.id || (!!verdict && true)}
            pos={a.pos}
            output={outputs[a.id]}
            tooltipPos={a.tooltipPos}
          />
        ))}

        {/* Center status */}
        <div style={{
          position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%)",
          textAlign:"center", pointerEvents:"none",
          width: 320,
        }}>
          <motion.div
            animate={{opacity: stage ? [0.5,1,0.5] : 0.3}}
            transition={{repeat:Infinity, duration:2}}
            style={{
              color: stage ? "#a78bfa" : "#1e293b",
              fontSize:10, letterSpacing:3, fontFamily:"monospace",
              marginBottom: 12
            }}
          >
            {stage ? `◈ ${(STAGE_LABELS[stage] || stage).toUpperCase()} ACTIVE`
                   : verdict ? "◈ DEBATE COMPLETE"
                   : "◈ AWAITING CLAIM"}
          </motion.div>

          <AnimatePresence>
            {(stage === "decompose" || stage === "retrieve") && outputs[stage] && (
              <motion.div
                initial={{opacity: 0, y: 5}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -5}}
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  lineHeight: 1.5,
                  padding: "12px 16px",
                  background: "rgba(15,15,30,0.8)",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  marginBottom: 12,
                  fontFamily: "monospace"
                }}
              >
                {outputs[stage]}
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div style={{color:"#334155", fontSize:9, letterSpacing:2}}>
              {STAGES.map(s => (
                <span key={s} style={{
                  color: stage === s ? "#a78bfa" : STAGES.indexOf(s) < STAGES.indexOf(stage) ? "#4ade8066" : "#1e293b",
                  marginRight:8,
                }}>●</span>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          position:"absolute", bottom:20, right:20,
          background:"rgba(8,8,20,0.9)", border:`1px solid ${C.border}`,
          borderRadius:10, padding:"10px 14px",
        }}>
          {[["Researcher",C.researcher],["Opposition",C.opposition],["Fact-Checker",C.factChecker],["Judge",C.judge]].map(([l,c])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:c,boxShadow:`0 0 5px ${c}`}}/>
              <span style={{color:"#64748b",fontSize:10,fontFamily:"monospace"}}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}