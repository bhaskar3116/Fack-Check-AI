import React from "react";
import { STAGES, STAGE_LABELS, C } from "./constants";

export function StageBar({ currentStage }) {
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
