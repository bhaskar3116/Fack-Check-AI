import React from "react";
import { C } from "./constants";

export function AgentConnections({ active }) {
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
