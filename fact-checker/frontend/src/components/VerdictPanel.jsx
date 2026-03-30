import React from "react";
import { motion } from "framer-motion";
import { C } from "./constants";

export function VerdictPanel({ verdict }) {
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
