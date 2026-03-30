import os
import json
import re
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.1,
        max_retries=5
    )


async def judge_agent(state: dict) -> dict:
    llm = get_llm()

    researcher_outputs = "\n\n".join(state.get("researcher_outputs", []))
    opposition_outputs = "\n\n".join(state.get("opposition_outputs", []))
    evidence_text = state.get("evidence", "")

    prompt = f"""
    Decide final verdict based on the evidence and debate.

    Claim: {state['claim']}
    
    Evidence provided from web search (contains Source URLs):
    {evidence_text}

    FOR:
    {researcher_outputs}

    AGAINST:
    {opposition_outputs}

    Fact Check:
    {state.get("fact_checker_output", "")}

    You must deeply analyze the debate and evidence. Calculate a realistic confidence score (0-100) based on how strong, consistent, and reliable the evidence is.
    Also, extract the most important reference website URLs from the Evidence that prove why the claim is TRUE or FALSE.

    Return EXACTLY this JSON format (no other text or markdown characters outside the JSON):
    {{
      "result": "TRUE",
      "summary": "Detailed explanation of why this verdict was reached, citing specific evidence.",
      "confidence": 85,
      "sources": ["https://url1.com", "https://url2.com"]
    }}
    (Note: result can be TRUE, FALSE, PARTIALLY TRUE, or UNVERIFIED)
    """

    response = await llm.ainvoke(prompt)

    try:
        text = re.sub(r"```json|```", "", response.content).strip()
        verdict = json.loads(text)
    except Exception as e:
        print("Error parsing judge JSON:", e)
        verdict = {
            "result": "UNVERIFIED",
            "summary": response.content,
            "confidence": 0,
            "sources": []
        }

    # Ensure confidence is an integer
    if not isinstance(verdict.get("confidence"), int):
        try:
            verdict["confidence"] = int(verdict.get("confidence", 0))
        except:
            verdict["confidence"] = 50

    if not isinstance(verdict.get("sources"), list):
        verdict["sources"] = []

    return {
        "judge_output": response.content,
        "verdict": verdict
    }