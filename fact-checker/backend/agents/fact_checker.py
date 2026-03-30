import os
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.1,
        max_retries=5
    )


async def fact_checker_agent(state: dict) -> dict:
    llm = get_llm()

    researcher_outputs = "\n\n".join(state.get("researcher_outputs", []))
    opposition_outputs = "\n\n".join(state.get("opposition_outputs", []))

    prompt = f"""
    Analyze reliability of evidence.

    Claim: {state['claim']}

    Evidence:
    {state['evidence']}

    Researcher:
    {researcher_outputs}

    Opposition:
    {opposition_outputs}

    Give:
    - reliability score
    - weak sources
    - final evidence strength
    """

    response = await llm.ainvoke(prompt)

    return {"fact_checker_output": response.content}