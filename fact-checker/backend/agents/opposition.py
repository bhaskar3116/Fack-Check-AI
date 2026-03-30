import os
from langchain_google_genai import ChatGoogleGenerativeAI


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3,
        max_retries=5
    )


async def opposition_agent(state: dict) -> dict:
    llm = get_llm()

    if state.get("round", 1) == 1:
        prompt = f"""
        Oppose the claim:

        {state['claim']}
        Evidence: {state['evidence']}
        """
    else:
        last_res = state.get("researcher_outputs", [""])[-1]
        prompt = f"""
        Counter this argument:

        {last_res}
        """

    response = await llm.ainvoke(prompt)

    return {
        "opposition_outputs": [response.content],
        "round": state.get("round", 1) + 1
    }