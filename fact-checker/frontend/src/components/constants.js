export const C = {
  researcher: "#4ade80",
  opposition: "#f87171", 
  factChecker: "#facc15",
  judge: "#a78bfa",
  bg: "#0a0a14",
  panel: "rgba(15,15,30,0.95)",
  border: "rgba(100,100,200,0.25)",
};

export const STAGES = ["decompose","retrieve","researcher","opposition","fact_checker","judge"];
export const STAGE_LABELS = {
  decompose: "Decompose", retrieve: "Retrieve", researcher: "Researcher",
  opposition: "Opposition", fact_checker: "Fact-Check", judge: "Judge"
};
export const AGENT_COLORS = {
  researcher: C.researcher, opposition: C.opposition,
  fact_checker: C.factChecker, judge: C.judge,
  decompose: "#60a5fa", retrieve: "#60a5fa"
};
