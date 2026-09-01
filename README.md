# FresherAI

An AI-powered interview preparation platform with resume scoring, mock interviews, and personalized learning roadmaps — built with microservices architecture.

---

## What It Does

FresherAI helps fresh graduates prepare for tech interviews with:

- **Resume Scoring** — AI analyzes your resume and provides a score with improvement suggestions
- **Mock Interviews** — LLM-powered interview sessions with dynamic question generation
- **Learning Roadmaps** — Personalized skill development paths based on your goals
- **Credit System** — Pay-per-use billing with Razorpay integration

---

## Architecture

```
React Frontend
      ↓
  API Gateway (Express)
  ┌──────┬───────┬──────────┬─────────┐
  ↓      ↓       ↓          ↓         ↓
 Auth  Resume  Interview  Roadmap  Billing
                ↓
         Groq + LangGraph
         (AI Agent)
```

**Services:**

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 8000 | API routing, auth middleware |
| Auth | 8001 | Firebase login, sessions |
| Resume | 6002 | PDF parsing, AI resume scoring |
| Interview | 6003 | Mock interviews with LangGraph agent |
| Roadmap | 6004 | Personalized learning paths |
| Billing | 6005 | Credit system, Razorpay |
| Frontend | 5173 | React + Vite client |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| LLM | Groq (LangChain) |
| Workflow | LangGraph |
| Database | MongoDB (Mongoose) |
| Cache | Redis |
| Auth | Firebase Admin |
| Payments | Razorpay |
| PDF | pdf2json |

---

## Project Structure

```
Fresher-Ai/
├── frontend/               # React + Vite client
├── backend/
│   ├── gateway/            # API gateway
│   ├── shared/             # Shared utilities
│   └── services/
│       ├── auth/           # Firebase authentication
│       ├── resume/         # Resume upload & AI scoring
│       ├── interview/      # Mock interview sessions
│       ├── roadmap/        # Learning roadmap generation
│       └── billing/        # Credits & Razorpay
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis
- Firebase project
- API keys: Groq, Razorpay

### Installation

```bash
git clone https://github.com/DivayJainDJ/Fresher-Ai.git
cd Fresher-Ai

# Install all service dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Environment Setup

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Required variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fresher
REDIS_URL=redis://localhost:6379

# Auth
FIREBASE_SERVICE_ACCOUNT=...

# AI
GROQ_API_KEY=...

# Billing
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

### Run

Start Redis and MongoDB, then:

```bash
# Backend services (each in separate terminal)
cd backend
node gateway/index.js
node services/auth/index.js
node services/resume/index.js
node services/interview/index.js
node services/roadmap/index.js
node services/billing/index.js

# Frontend
cd frontend
npm run dev
```

---

## How It Works

### Resume Scoring
1. User uploads PDF resume
2. Service extracts text with pdf2json
3. Groq LLM analyzes content, structure, and relevance
4. Returns score + detailed feedback

### Mock Interview
1. User selects interview type and difficulty
2. LangGraph agent generates questions dynamically
3. Agent evaluates responses in real-time
4. Provides score and improvement tips after session

### Learning Roadmap
1. User specifies goals and current skills
2. LLM generates a personalized learning path
3. Includes resources, milestones, and timelines

---

## Author

**Divay Jain**
- GitHub: [DivayJainDJ](https://github.com/DivayJainDJ)

---

## License

MIT
