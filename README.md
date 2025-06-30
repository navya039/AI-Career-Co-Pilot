# AI Career Co Pilot

# AI Career Co-Pilot

An intelligent career assistant that analyzes resumes against job descriptions using custom logic and AI suggestions. It helps users understand how well their resume matches a job role and provides personalized improvement suggestions and mock interview questions using Google’s Gemini API.

---

![Architecture Diagram](./assets/architecture_diagram.png)

> _Functional Architecture Diagram_: This app is built with a React frontend deployed on **Vercel**, a FastAPI backend containerized with **Docker** and deployed on **Render**, and it integrates with **Gemini API** to generate AI-powered suggestions.

---

## 🔍 Application Overview

**AI Career Co-Pilot** consists of four key interactive pages:

1. **AnalyzerPage.js**  
   Upload your resume and paste a job description to get:
   - A custom match score (not ATS-based)
   - Matching and missing skills  
   - A Gemini-generated learning roadmap for missing skills

2. **ImproverPage.js**  
   Get AI-powered improvements for specific lines in your resume — rephrased and optimized using Gemini.

3. **SimulatorPage.js**  
   Simulates job interviews by generating relevant, AI-based questions using the job description and your resume.

4. **AccountPage.js**  
   Basic user account features (you may customize or extend this as needed).

---

## 💡 Technologies Used

| Layer        | Tech Stack                        |
|--------------|-----------------------------------|
| Frontend     | React, CSS (Vercel hosted)        |
| Backend      | FastAPI, Python, Docker (Render)  |
| AI Layer     | Google Gemini API (via API key)   |
| Scoring Logic| TfidfVectorizer + Cosine Similarity |
| CI/CD        | Jenkins, GitHub, Docker, Trivy (CI only) |

---

## 🚀 Deployment Links

- **Frontend (Vercel):** [https://ai-career-copilot.vercel.app](https://ai-career-copilot.vercel.app)  
- **Backend (Render):** [https://ai-career-backend-3ynk.onrender.com](https://ai-career-backend-3ynk.onrender.com)

---

## 🛠️ Running Locally

```bash
# Clone the repository
git clone https://github.com/navya039/AI-Career-Co-Pilot.git
cd AI-Career-Co-Pilot

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (with virtualenv)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
