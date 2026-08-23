# FresherAI

This project is a microservice-based interview prep app with:

- `frontend`: React + Vite client
- `backend/gateway`: API gateway
- `backend/services/auth`: Firebase login + session service
- `backend/services/resume`: resume scoring service
- `backend/services/interview`: AI interview service
- `backend/services/roadmap`: roadmap generation service
- `backend/services/billing`: Razorpay billing service

## What I fixed

- Prevented crashes when interview/report data is missing
- Fixed interview controller validation so missing fields are rejected correctly
- Prevented dashboard aggregation from crashing on unanswered interview questions
- Fixed billing verification error handling to use the correct model
- Prevented resume upload flows from continuing when no file is selected
- Moved interview coin deduction before interview creation to avoid orphan interviews
- Made the resume service wait for MongoDB before accepting requests

## Local setup

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env`
3. Start Redis
4. Start MongoDB
5. Install dependencies if needed with `npm install`

## Suggested local ports

- Gateway: `8000`
- Auth: `8001`
- Resume: `6002`
- Interview: `6003`
- Roadmap: `6004`
- Billing: `6005`
- Frontend: `5173`

## Demo note

For interview/demo use, the app can render and navigate cleanly without all paid integrations active, but these features still require real credentials:

- Firebase admin auth
- Groq LLM calls
- YouTube API roadmap enrichment
- Razorpay checkout
