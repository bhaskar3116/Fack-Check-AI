import os
from dotenv import load_dotenv
from typing import TypedDict, List
from langgraph.graph import StateGraph, END

from agents.researcher import researcher_agent
from agents.opposition import opposition_agent
from agents.fact_checker import fact_checker_agent
from agents.judge import judge_agent
from tools.decomposer import decompose_claim
from tools.search import retrieve_evidence

load_dotenv()


from typing import Annotated
import operator

# =========================
# STATE DEFINITION
# =========================
class DebateState(TypedDict):
    claim: str
    sub_claims: List[str]
    evidence: str
    round: int

    researcher_outputs: Annotated[List[str], operator.add]
    opposition_outputs: Annotated[List[str], operator.add]

    fact_checker_output: str
    judge_output: str
    verdict: dict


# =========================
# LOOP CONDITION
# =========================
def should_continue(state: DebateState):
    return "continue" if state.get("round", 1) < 3 else "end"


# =========================
# GRAPH BUILDING
# =========================
def build_graph():
    g = StateGraph(DebateState)

    # Nodes
    g.add_node("decompose", lambda s: decompose_claim(s))
    g.add_node("retrieve", lambda s: retrieve_evidence(s))
    g.add_node("researcher", researcher_agent)
    g.add_node("opposition", opposition_agent)
    g.add_node("fact_checker", fact_checker_agent)
    g.add_node("judge", judge_agent)

    # Entry
    g.set_entry_point("decompose")

    # Flow
    g.add_edge("decompose", "retrieve")
    g.add_edge("retrieve", "researcher")
    g.add_edge("researcher", "opposition")

    # 🔁 Debate Loop
    g.add_conditional_edges(
        "opposition",
        should_continue,
        {
            "continue": "researcher",      # loop continues
            "end": "fact_checker"    # exit loop
        }
    )

    g.add_edge("fact_checker", "judge")
    g.add_edge("judge", END)

    return g.compile()


# =========================
# RUN FUNCTION (STREAMING)
# =========================
async def run_debate(claim: str):
    graph = build_graph()

    initial_state = {
        "claim": claim,
        "round": 1,

        "sub_claims": [],
        "evidence": "",

        "researcher_outputs": [],
        "opposition_outputs": [],

        "fact_checker_output": "",
        "judge_output": "",
        "verdict": {}
    }

    try:
        async for event in graph.astream(initial_state):
            node_name = list(event.keys())[0]
            node_data = event[node_name]

            safe_data = {}

            for k, v in node_data.items():
                if isinstance(v, (str, int, float, bool)):
                    safe_data[k] = v
                elif isinstance(v, dict):
                    safe_data[k] = v
                elif isinstance(v, list):
                    safe_data[k] = [str(i) for i in v]
                else:
                    safe_data[k] = str(v)

            yield {"stage": node_name, "data": safe_data}

    except Exception as e:
        yield {"stage": "error", "data": {"message": str(e)}}