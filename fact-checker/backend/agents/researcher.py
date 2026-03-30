import os
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3,
        max_retries=5
    )


async def researcher_agent(state: dict) -> dict:
    llm = get_llm()

    if state.get("round", 1) == 1:
        prompt = f"""
        Support the claim using evidence.

        Claim: {state['claim']}
        Evidence: {state['evidence']}
        """
    else:
        last_opp = state.get("opposition_outputs", [""])[-1]
        prompt = f"""
        Rebut this opposition argument:

        {last_opp}
        """

    response = await llm.ainvoke(prompt)

    return {"researcher_outputs": [response.content]}