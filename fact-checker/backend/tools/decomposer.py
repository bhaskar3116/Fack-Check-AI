import os
from langchain_google_genai import ChatGoogleGenerativeAI

def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.2,
        max_retries=5
    )

def decompose_claim(state: dict) -> dict:
    llm = get_llm()
    claim = state.get("claim", "")
    
    prompt = f"""Break this claim into atomic sub-claims for fact-checking.
Claim: "{claim}"

List 2-4 specific, verifiable sub-claims. One per line, numbered.
Keep each sub-claim short and independently verifiable."""

    try:
        response = llm.invoke(prompt)
        lines = [l.strip() for l in response.content.split("\n") if l.strip()]
        sub_claims = [l for l in lines if l[0].isdigit()]
    except Exception:
        sub_claims = [claim]
    
    return {"sub_claims": sub_claims}