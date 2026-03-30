from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from graph import run_debate
import json
import traceback

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class ClaimRequest(BaseModel):
    claim: str

@app.post("/debate")
async def debate_claim(req: ClaimRequest):
    async def stream():
        try:
            async for event in run_debate(req.claim):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            error_event = {"stage": "error", "data": {"message": str(e)}}
            yield f"data: {json.dumps(error_event)}\n\n"
            traceback.print_exc()
    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )

@app.get("/health")
def health():
    return {"status": "ok"}