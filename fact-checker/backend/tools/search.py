import urllib.request
import urllib.parse
import json
import os

def retrieve_evidence(state):
    claim = state.get("claim", "")
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return {"evidence": f"Fallback evidence for: {claim}"}
    
    try:
        url = "https://api.tavily.com/search"
        data = json.dumps({
            "api_key": api_key, 
            "query": claim, 
            "search_depth": "basic", 
            "include_answer": True,
            "max_results": 4
        }).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode())
            
        results = res_data.get("results", [])
        evidence_texts = []
        for r in results:
            evidence_texts.append(f"Source URL: {r.get('url')}\nContent: {r.get('content')}")
            
        evidence = "\n\n".join(evidence_texts)
        if res_data.get("answer"):
            evidence = f"Summary Answer: {res_data['answer']}\n\n" + evidence
            
        return {"evidence": evidence}
    except Exception as e:
        return {"evidence": f"General knowledge sources indicate information about: {claim}\n(Note: Web search failed with error: {e})"}