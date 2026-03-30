import React from "react";
import { motion } from "framer-motion";
import { C } from "./constants";

export function AgentCard({ agent, content, color }) {
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
