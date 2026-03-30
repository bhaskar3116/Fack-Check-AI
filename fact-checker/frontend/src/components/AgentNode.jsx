import React from "react";
import { motion } from "framer-motion";

export function AgentNode({ label, color, active, pos }) {
  return (
    <motion.div
      animate={{ scale: active ? [1, 1.12, 1] : 1, opacity: active ? 1 : 0.45 }}
      transition={{ repeat: active ? Infinity : 0, duration: 1.2 }}
      style={{
        position: "absolute", ...pos,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        cursor: "default",
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
    </motion.div>
  );
}
