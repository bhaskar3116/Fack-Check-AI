# 🔍 Fact Check AI

A multi-agent AI system that fact-checks any claim through a structured debate between AI agents — powered by **Google Gemini**, **LangGraph**, and **Tavily Search**.

![Demo](https://img.shields.io/badge/status-active-brightgreen) ![Python](https://img.shields.io/badge/python-3.10+-blue) ![React](https://img.shields.io/badge/react-18-61dafb) ![LangGraph](https://img.shields.io/badge/langgraph-latest-orange)

---

## 🧠 How It Works

A claim goes through a **6-stage multi-agent pipeline**:

```
Claim → Decompose → Retrieve Evidence → Researcher ⟷ Opposition (3 rounds) → Fact-Checker → Judge → Verdict
```

| Stage | Agent | Role |
|-------|-------|------|
| 1 | **Decomposer** | Breaks the claim into 2–4 atomic sub-claims |
| 2 | **Retriever** | Fetches real-time web evidence via Tavily Search |
| 3 | **Researcher** | Argues in support of the claim using evidence |
| 4 | **Opposition** | Argues against the claim, counters the researcher |
| 5 | **Fact-Checker** | Analyzes source credibility and evidence quality |
| 6 | **Judge** | Delivers a final verdict with confidence score and sources |

The Researcher and Opposition debate for **3 rounds** before the Judge decides.

---

## 🏗️ Project Structure

```
AI_PROJECT/
├── fact-checker/
│   ├── backend/
│   │   ├── agents/
│   │   │   ├── researcher.py       # Supports the claim
│   │   │   ├── opposition.py       # Opposes the claim
│   │   │   ├── fact_checker.py     # Checks source credibility
│   │   │   └── judge.py            # Final verdict
│   │   ├── tools/
│   │   │   ├── decomposer.py       # Breaks claim into sub-claims
│   │   │   └── search.py           # Tavily web search
│   │   ├── graph.py                # LangGraph pipeline definition
│   │   ├── main.py                 # FastAPI server
│   │   ├── requirements.txt
│   │   ├── .env.example            # API key template
│   │   └── evaluate.py
│   └── frontend/
│       ├── src/
│       │   ├── components/         # UI components
│       │   └── App.jsx             # Main React app
│       ├── index.html
│       └── package.json
└── extension/                      # Browser extension (WIP)
```

---

## ⚙️ Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — REST API with SSE streaming
- [LangGraph](https://langchain-ai.github.io/langgraph/) — Multi-agent state graph
- [LangChain Google GenAI](https://python.langchain.com/docs/integrations/chat/google_generative_ai/) — Gemini 2.5 Flash
- [Tavily](https://tavily.com/) — Real-time web search API

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) — Animations
- Animated canvas star background, live agent nodes, streaming verdict panel

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey)
- A [Tavily API key](https://app.tavily.com/)

---

### 1. Clone the repo

```bash
git clone https://github.com/bhaskar3116/Fack-Check-AI.git
cd Fack-Check-AI
```

### 2. Backend Setup

```bash
cd fact-checker/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```

Edit `.env` and add your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`

---

### 3. Frontend Setup

```bash
cd fact-checker/frontend

npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🖥️ Usage

1. Open `http://localhost:5173` in your browser
2. Enter any claim in the text box (e.g. *"5G causes COVID"*)
3. Click **▶ START DEBATE**
4. Watch the agents debate in real-time on the right panel
5. Get a final verdict: `TRUE` / `FALSE` / `PARTIALLY TRUE` / `UNVERIFIED` with a confidence score and sources

> **No API keys?** Click **⚡ Run Demo** to see a simulated debate without any backend.

---

## 📡 API

### `POST /debate`
Streams the debate as Server-Sent Events (SSE).

**Request:**
```json
{ "claim": "Humans only use 10% of their brain" }
```

**Streamed Response (each event):**
```json
{ "stage": "researcher", "data": { "researcher_outputs": ["..."] } }
```

**Final verdict event:**
```json
{
  "stage": "judge",
  "data": {
    "verdict": {
      "result": "FALSE",
      "summary": "Scientific consensus...",
      "confidence": 92,
      "sources": ["https://scientificamerican.com/..."]
    }
  }
}
```

### `GET /health`
Returns `{ "status": "ok" }` — use to verify the backend is running.

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (used by all agents) |
| `TAVILY_API_KEY` | Tavily Search API key (used for evidence retrieval) |

Never commit your `.env` file. Use `.env.example` as a template.

---

## 📸 Screenshots

> The UI features a dark space-themed interface with animated agent nodes, live debate streaming, and a confidence meter on the verdict.
> 
<img width="2546" height="1397" alt="Screenshot 2026-03-31 003440" src="https://github.com/user-attachments/assets/9f3a80c1-7706-4fcd-9fa4-2d86ec65788d" />

<img width="2547" height="1392" alt="Screenshot 2026-03-31 003502" src="https://github.com/user-attachments/assets/b0a09d54-67c0-4f65-a6c7-1bd5a91b9940" />

<img width="2531" height="1390" alt="Screenshot 2026-03-31 003510" src="https://github.com/user-attachments/assets/ad762d5b-1a97-4382-954f-7d1c1fa538da" />

<img width="2545" height="1397" alt="Screenshot 2026-03-31 003557" src="https://github.com/user-attachments/assets/528eae99-e393-40ea-8456-501eff4431ed" />

<img width="2535" height="1397" alt="Screenshot 2026-03-31 003746" src="https://github.com/user-attachments/assets/77c39a5f-a3c8-4fd1-ae53-020b11d39102" />

<img width="2548" height="1400" alt="Screenshot 2026-03-31 003755" src="https://github.com/user-attachments/assets/9a052a8a-2377-4213-a1ef-eab6ee86ec31" />
---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
