from typing import TypedDict, List
from langgraph.graph import StateGraph, END
import asyncio

class DebateState(TypedDict):
    round: int
    outputs: List[str]

def researcher_agent(state: dict) -> dict:
    print("researcher gets state round:", state.get("round"))
    outputs = state.get("outputs", [])
    outputs.append("r")
    return {"outputs": outputs}

def opposition_agent(state: dict) -> dict:
    print("opposition gets state round:", state.get("round"))
    outputs = state.get("outputs", [])
    outputs.append("o")
    state["round"] += 1
    return {"outputs": outputs, "round": state["round"]}

def should_continue(state: DebateState):
    print("should_continue evaluates round:", state["round"])
    return state["round"] < 3

g = StateGraph(DebateState)
g.add_node("researcher", researcher_agent)
g.add_node("opposition", opposition_agent)
g.set_entry_point("researcher")
g.add_edge("researcher", "opposition")
g.add_conditional_edges("opposition", should_continue, {True: "researcher", False: END})
graph = g.compile()

async def run():
    async for event in graph.astream({"round": 1, "outputs": []}):
        print("yields:", event)

asyncio.run(run())
