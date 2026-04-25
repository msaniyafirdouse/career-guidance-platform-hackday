# 🚀 AI Career & Internship Advisor
### *Your AI-Powered Career Co-Pilot — From Zero Clarity to Internship Offer*

> **Built for gemini.exe Hackday 2026** — An end-to-end AI platform powered entirely by the **Google Gemini API** that guides students from zero career clarity all the way to a verified internship offer. Discover your path, identify skill gaps, build a personalized roadmap, pass a proctored mock interview, and land the right role — all in one seamless AI pipeline.
---
## 🎯 The Problem We Solve
 
Students and fresh graduates face a career bottleneck that starts even before the resume:
 
1. **Many don't know what career to pursue** — no mentor, no direction, no starting point
2. **Those who do know still can't identify what skills they're missing** for their target role
3. **Interview practice is inaccessible** — mock interviews are expensive or generic
4. **They waste hours applying** to internships that don't match their actual profile
We eliminate all four — with a unified, Gemini-powered AI platform that meets every student exactly where they are, whether they have a resume or not.
---
## ✨ Core Features
 
### 1. 🧭 FreshStart — Career Discovery for Undecided Students
> *"For students who don't yet know what to do with their life."*
 
Most career tools assume you already know your direction. FreshStart doesn't. Powered by **Gemini's conversational reasoning**, it meets students from zero:
 
- 💬 **Conversational career discovery** — chat naturally about your interests, strengths, and dislikes
- 🗺️ **Interest-to-career mapping** — Gemini maps vague preferences to concrete career clusters
- 🎓 **Higher studies guidance** — GATE, MS abroad, MBA, MTech — explained simply and personally
- 📋 **Personalized learning roadmap** — from where you are now to job-ready
- 📄 **Starter resume generation** — builds your first resume from scratch, even with no experience
- 🤖 **Lumi** — a friendly AI companion (accessible via the chat button on every page) who holds your hand through every decision
---
 
### 2. 🔍 Dashboard — Intelligent Skill-Gap Analysis
> *"Don't guess what recruiters want."*
 
Upload your **Resume PDF** and the **Job Description PDF**. Gemini acts as a technical recruiter and returns:
- ✅ Skills you already have
- ❌ Skills you're missing (gap badges)
- 💡 AI reasoning behind each gap
- 🗺️ One-click **Personalized Learning Roadmap** with curated resources from YouTube, Udemy, Coursera & NPTEL
- 🧠 **Hindsight Feed** — persistent AI memory that logs your gaps and verified skills across every session
---
 
### 3. 🎙️ Mock Interview Studio
> *"A proctored, voice-driven certification exam — not just a chatbot."*
 
A fully AI-powered technical interview with:
- 🔴 **Live proctoring badge** — simulates real exam pressure
- 🤖 **AI speaks questions** via Text-to-Speech (Web Speech API)
- 🎙️ **Voice recognition** captures and auto-submits your spoken answers
- 🚫 **Noise guard** — ignores background sounds (min 3 words + 0.4 confidence threshold)
- 📊 **Progressive difficulty** — Easy (Q1–3) → Medium (Q4–9) → Hard (Q10)
- 🏆 **Pass/Fail certification** — 8/10 correct = Skill Verified badge added to your profile
- 📹 **Session recording** — download your full exam as `.webm` for self-review
- 📝 **Live transcript sidebar** — full Q&A log during the exam
- 🔒 **Gap Analysis Gate** — blocks access if you haven't completed gap analysis first
---
 
### 4. 📄 Resume Evolution Engine
> *"Your resume, upgraded with AI-verified proof."*
 
After passing mock interview certifications:
- Adds **verified skills** to your Skills section automatically
- Generates **quantified bullet points** under the most relevant experience entry
- Creates an **"AI-Verified Certifications"** section with exam proof
- Exports a professionally formatted **PDF** and **Word (.docx)** resume — no templates needed
---
 
### 5. 💼 Live Internship Recommendations + Job Match Analyzer
> *"Stop guessing. See your exact fit score before you apply."*
 
**Step 1 — Upload Resume:**
- Gemini extracts your top technical skill tags automatically
**Step 2 — Search Live Internships:**
- Gemini generates a targeted search query from your resume
- **Serper API** fetches real-time listings from LinkedIn, Naukri & Internshala
- Returns 6 matched internship cards instantly
**Step 3 — Click Any Listing for Deep Analysis:**
- 📊 **Match percentage** (0–100%)
- ❌ **Missing skills** for that specific role
- 🟢 **AI verdict** — should you apply?
- 💡 **Personalized improvement advice**
---
 
### 6. 🎤 Self-Introduction Coach
> *"The first 60 seconds of every interview decide everything."*
 
Paste your self-introduction and Gemini acts as a ruthless placement coach:
- **Effectiveness score** (0–100) with detailed sub-scores across clarity, relevance, impact, and professionalism
- **Mistake analysis** — flags grammar errors, generic claims, irrelevant content, weak closings
- **AI-rewritten version** — a dramatically better intro with specific metrics and confident tone
- **Readiness verdict** — Not Ready / Needs Work / Almost There / Interview Ready
---
 
## 🤖 Powered Entirely by Google Gemini API
 
Every AI feature in this project runs on the **Google Gemini API** — no other LLM provider used anywhere.
 
| Feature | Gemini capability used |
|---|---|
| Skill gap analysis | Gemini 2.5 Flash — structured JSON reasoning |
| Learning roadmap | Gemini 2.5 Flash — domain-specific generation |
| Mock interview | Gemini 2.5 Flash — multi-turn conversation with system instructions |
| Resume evolution | Gemini 2.5 Flash — long-context document rewriting |
| Job match analysis | Gemini 2.5 Flash — comparative reasoning |
| Self-intro coaching | Gemini 2.5 Flash — scoring + rewriting |
| FreshStart chatbot | Gemini 2.5 Flash — conversational career discovery |
| Vision (marksheet scan) | Gemini multimodal — image-to-structured-data |
 
The backend uses an automatic **model cascade**: if `gemini-2.0-flash` quota is hit, it falls back to `gemini-2.5-flash` seamlessly — zero interruption to the user.
 
---
 
## 🧠 The Hindsight Memory System
> *"The scariest part wasn't the LLM calls — it was realizing every 'personalized' interview was just expensive theater without persistent memory."*
 
The platform uses a **dual-path AI architecture** that learns across sessions:
 
```
User Answer
│
├──► Path A: Interviewer LLM (temp=0.7)
│ Warm, conversational, asks next question
│ System prompt injected with known gaps
│
└──► Path B: Judge LLM (temp=0.1) — silent, never shown to user
Evaluates technical correctness
If wrong → saves 1-sentence gap to memory.json
If correct → outputs PASS, nothing saved
```
 
- **30-entry memory cap** — only the most recent, distilled gaps are kept
- **Deduplication** — the same gap is never saved twice
- **Cross-session persistence** — returning users see their gaps and verified skills restored automatically
- **Drives everything downstream** — gaps surface in skill analysis, roadmap, and internship filtering
---
 
## 🏗️ System Architecture
 
```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js 14) │
│ │
│ FreshStart ──► Dashboard ──► Mock Interview │
│ │ │ │ │
│ └────────► Resume Evolution ──► Job Recommendations │
│ │ │
│ Self-Intro Coach ◄──── Lumi Chatbot (all pages) │
└──────────────────────────┬──────────────────────────────────────┘
│ REST API
┌──────────────────────────▼──────────────────────────────────────┐
│ BACKEND (FastAPI) │
│ │
│ /api/analyze-gap → Gemini 2.5 Flash (Gap Analysis) │
│ /api/generate-roadmap → Gemini 2.5 Flash (Roadmap Builder) │
│ /api/chat → Gemini 2.5 Flash (Mock Interview) │
│ /api/chatbot → Gemini 2.5 Flash (FreshStart/Lumi) │
│ /api/chatbot-vision → Gemini Vision (Marksheet Scan) │
│ /api/upload-resume → Gemini 2.5 Flash (Tag Extraction) │
│ /api/search-jobs → Serper API + Gemini Query Gen │
│ /api/match-job → Gemini 2.5 Flash (Resume vs JD) │
│ /api/evolve-resume → Gemini 2.5 Flash (Resume Writer) │
│ /api/generate-resume-docx → ReportLab (PDF Export) │
│ /api/generate-resume-word → python-docx (Word Export) │
│ /api/analyze-intro → Gemini 2.5 Flash (Intro Coach) │
│ /api/signup + /login → SHA-256 Auth + JSON Persistence │
└─────────────────────────────────────────────────────────────────┘
```
 
---
 
## 🛠️ Tech Stack
 
### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | App router, SSR, routing |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth page & component animations |
| **Lucide React** | Icon library |
| **Web Speech API** | Browser-native TTS + STT for mock interview |
| **canvas-confetti** | Celebration on exam pass 🎉 |
 
### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance async Python API |
| **Google Gemini API** | All AI inference — text, JSON, vision, multi-turn chat |
| **google-genai SDK** | Official Python client for Gemini Developer API |
| **Serper API** | Real-time Google internship/job search |
| **ReportLab** | Styled PDF resume generation |
| **python-docx** | Word document resume export |
| **pypdf / PyPDF2** | PDF text extraction |
| **SHA-256** | Password hashing (zero external auth libs) |
| **JSON persistence** | Lightweight user + hindsight memory store |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
- Node.js v18+
- Python v3.10+
- **Google Chrome or Microsoft Edge** *(required for Web Speech API in mock interview)*
- Gemini API key → [aistudio.google.com](https://aistudio.google.com) *(free tier available)*
- Serper API key → [serper.dev](https://serper.dev)
### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-career-internship-advisor.git
cd ai-career-internship-advisor
```
 
### 2. Backend Setup
```bash
cd backend
 
# Create and activate virtual environment
python -m venv venv
 
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
 
# Install dependencies
pip install -r requirements.txt
 
# Create your .env file
GEMINI_API_KEY=your_gemini_key_here
SERPER_API_KEY=your_serper_key_here
 
# Start the server
uvicorn main:app --reload
```
Backend runs at → `http://localhost:8000`
 
### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at → `http://localhost:3000`
 
> **Quota tip:** The Gemini free tier resets every 24 hours. If you hit the per-minute limit during development, wait 60 seconds and try again. For hackathon demos, create 2–3 Google accounts and add each key to `.env` as `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3` — the backend cascade will rotate through them automatically.
 
---
 
## 📁 Project Structure
 
```
ai-career-internship-advisor/
├── frontend/
│ ├── app/
│ │ ├── page.tsx # Dashboard (Gap Analysis + Roadmap + Hindsight)
│ │ ├── freshstart/
│ │ │ └── page.tsx # FreshStart — Career Discovery for Undecided Students
│ │ ├── mock-interview/
│ │ │ └── page.tsx # Proctored Mock Interview Studio
│ │ ├── resume-evolution/
│ │ │ └── page.tsx # AI Resume Upgrade Engine
│ │ ├── job-recommendations/
│ │ │ └── page.tsx # Live Internship Hub + Match Analyzer
│ │ ├── self_intro/
│ │ │ └── page.tsx # Self-Introduction Coach
│ │ ├── higher-studies/
│ │ │ └── page.tsx # GATE / MS / MBA Guidance
│ │ └── login/
│ │ └── page.tsx # Auth (Login / Signup)
│ ├── package.json
│ └── tailwind.config.ts
│
├── backend/
│ ├── main.py # All FastAPI endpoints + Gemini integration
│ ├── memory.json # Persistent hindsight memory + user store
│ ├── requirements.txt
│ └── .env # API keys (never committed)
│
└── README.md
```
 
---
 
## 🔌 API Reference
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze-gap` | Resume + JD gap analysis |
| `GET` | `/api/generate-roadmap` | Generate personalized learning roadmap |
| `POST` | `/api/chat` | Mock interview — Gemini multi-turn exam engine |
| `POST` | `/api/chatbot` | FreshStart / Lumi career discovery chatbot |
| `POST` | `/api/chatbot-vision` | Vision-enabled chatbot (marksheet / certificate scan) |
| `POST` | `/api/upload-resume` | Upload resume for internship matching |
| `GET` | `/api/search-jobs` | Fetch live internship listings via Serper |
| `POST` | `/api/match-job` | Score resume vs job description |
| `POST` | `/api/evolve-resume` | Generate evolved resume JSON |
| `POST` | `/api/generate-resume-docx` | Export resume as styled PDF |
| `POST` | `/api/generate-resume-word` | Export resume as Word (.docx) |
| `POST` | `/api/analyze-intro` | Analyze and score self-introduction |
| `POST` | `/api/regenerate-intro` | Rewrite self-introduction |
| `POST` | `/api/signup` | Create new account |
| `POST` | `/api/login` | Authenticate existing user |
| `GET` | `/api/hindsight` | Retrieve AI hindsight memory |
| `GET` | `/api/user/{user_id}` | Fetch full user profile |
 
---
 
## ⚠️ Known Browser Policies
 
- **Web Speech API** (voice interview) only works in **Google Chrome** or **Microsoft Edge**
- Click anywhere on the page once after loading to **unlock the AI voice engine** (Chrome autoplay policy)
- For best microphone accuracy, use in a **quiet environment** — the noise guard filters short/low-confidence captures automatically
---
 
## 🔒 Security
 
- Passwords hashed with **SHA-256 + fixed salt** before storage — never stored in plain text
- Password hash is **stripped from all API responses** before returning to frontend
- `memory.json` uses **atomic writes** (`.tmp` → rename) to prevent data corruption on concurrent requests
- API keys are loaded from `.env` and never exposed to the frontend
---
 
## 🗺️ What's Next
 
- [ ] Gemini Live API integration for real-time voice conversation in FreshStart
- [ ] Gemini long-context window — ingest full academic transcript for holistic profiling
- [ ] WebRTC remote proctoring with eye-tracking detection
- [ ] Multi-language interview support (Hindi, Tamil, Telugu)
- [ ] LinkedIn OAuth — auto-import profile data
- [ ] AI-generated cover letter tailored per internship listing
- [ ] Leaderboard for certification scores across users
- [ ] Mobile app (React Native)
## 📄 License
 
MIT License — see [LICENSE](LICENSE) for details.
 
---
**⭐ If this helped you find your career direction or land your internship, star the repo! ⭐**
 
*From zero clarity to verified offer — powered entirely by Google Gemini.*
 
Added Gemini-powered skill gap analysis module.
