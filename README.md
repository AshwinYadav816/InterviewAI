# ✦ InterviewAI

An AI-powered interview preparation platform. Upload your resume and a target job description, and **Google Gemini** generates a tailored interview strategy — a match score, likely technical & behavioral questions (with model answers), your skill gaps, and a day-by-day preparation roadmap. It can also generate an ATS-friendly, job-tailored resume as a downloadable PDF.

## Features

- 🔐 **Authentication** — register/login with JWT stored in httpOnly cookies, bcrypt-hashed passwords, and token blacklisting on logout
- 📄 **Resume upload** — PDF parsing to feed the AI
- 🤖 **AI interview report** — structured output from Gemini (match score, technical/behavioral questions, skill gaps, prep plan)
- 🧾 **AI resume generator** — Gemini writes an ATS-friendly resume, rendered to PDF via Puppeteer
- 👤 **Per-user data** — each user only sees their own reports

## Tech Stack

**Frontend:** React 19, React Router, Vite, Axios, SCSS
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer
**AI:** Google Gemini (`@google/genai`) with structured output, Puppeteer (PDF), pdf-parse

## Project Structure

```
GenAI/
├── Backend/          # Express API
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controller/   # Route handlers
│   │   ├── middlewares/  # Auth + file upload
│   │   ├── models/       # Mongoose schemas
│   │   └── routes/       # API routes
│   └── services/     # AI service (Gemini + Puppeteer)
└── Frontend/         # React app (feature-based)
    └── src/features/     # auth + interview features
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (e.g. MongoDB Atlas)
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Backend
```bash
cd Backend
npm install
cp .env.example .env      # then fill in your values
node server.js            # runs on http://localhost:3000
```

### Frontend
```bash
cd Frontend
npm install
npm run dev               # runs on http://localhost:5173
```

## Environment Variables

Create `Backend/.env` (see `Backend/.env.example`):

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in | Public |
| GET | `/api/auth/logout` | Log out | Public |
| GET | `/api/auth/get-me` | Current user | Private |
| POST | `/api/interview/` | Generate an interview report | Private |
| GET | `/api/interview/` | List my reports | Private |
| GET | `/api/interview/:id` | Get one report | Private |
| GET | `/api/interview/:id/resume` | Download tailored resume PDF | Private |
