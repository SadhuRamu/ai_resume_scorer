# 🤖 AI-Based Resume Quality Scorer

A full-stack MERN application that analyzes resumes using AI (Grok API) and provides detailed scoring on ATS compatibility, keyword matching, readability, and formatting.

---

## 📁 Folder Structure

```
ai_resume_byclaude/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register / Login
│   │   ├── resumeController.js    # Upload / Fetch resumes
│   │   └── analysisController.js  # Analyze & fetch analyses
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   └── uploadMiddleware.js    # Multer file upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Analysis.js
│   │   └── Keyword.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── analysisRoutes.js
│   ├── services/
│   │   ├── aiService.js           # Grok AI API integration
│   │   ├── scoringService.js      # All scoring algorithms
│   │   └── textExtractor.js       # PDF/DOCX text extraction
│   ├── uploads/                   # Uploaded files saved here
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProgressBar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── ScoreCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── Register.jsx
    │   │   ├── Results.jsx
    │   │   └── UploadResume.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── analysisService.js
    │   │   ├── authService.js
    │   │   └── resumeService.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## ⚙️ How to Set Up MongoDB

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community) locally
2. Or use [MongoDB Atlas](https://cloud.mongodb.com/) for a free cloud database
3. Copy your connection URI and set it in `backend/.env`

---

## 🔧 Environment Variables (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_resume_scorer
JWT_SECRET=your_super_secret_jwt_key_change_this

# Grok AI API
GROK_API_KEY=YOUR_GROK_API_KEY_HERE
GROK_API_URL=https://api.x.ai/v1/chat/completions
GROK_MODEL=grok-beta
```

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs (change in production!) |
| `GROK_API_KEY` | Your Grok API key from [x.ai](https://x.ai) |
| `GROK_API_URL` | Grok API endpoint (OpenAI-compatible) |
| `GROK_MODEL` | Grok model to use (grok-beta or grok-2-latest) |

---

## 🚀 How to Run Backend

```bash
cd ai_resume_byclaude/backend
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

---

## 🎨 How to Run Frontend

```bash
cd ai_resume_byclaude/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 API Key Setup (IMPORTANT)

After cloning/setting up the project:

1. Go to [https://x.ai](https://x.ai) and sign up / log in
2. Navigate to API keys section
3. Create a new API key
4. Open `backend/.env`
5. Replace `YOUR_GROK_API_KEY_HERE` with your actual key:
   ```
   GROK_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. Restart the backend server

> ⚠️ NEVER commit your `.env` file to Git. It's already in `.gitignore`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload a resume (PDF/DOCX) |
| GET | `/api/resume/` | Get all user's resumes |
| GET | `/api/resume/:id` | Get a specific resume |

### Analysis
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analysis/` | Analyze a resume |
| GET | `/api/analysis/` | Get all user's analyses |
| GET | `/api/analysis/:id` | Get a specific analysis |

---

## ✨ Features

- 🔐 JWT Authentication (Register / Login)
- 📤 PDF & DOCX file upload (Multer)
- 📝 Text extraction (pdf-parse + mammoth)
- 🤖 AI analysis (Grok API)
- 📊 5-metric scoring: Overall, ATS, Keywords, Readability, Formatting
- 🎯 Job role-specific keyword matching (8 roles)
- 💡 AI-generated strengths, weaknesses, suggestions
- 📥 Download full report as .txt
- 🌙 Beautiful dark glassmorphism UI
