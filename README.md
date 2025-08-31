# Social_Media_Content_Analyser

📊 Social Media Content Analyser:

A web-based tool that allows users to upload PDFs, images, or text files and get AI-powered insights into their social media content.
The app performs:

✅ Sentiment Analysis

✅ Readability Scoring

✅ Issue Detection

✅ Recommendations (hashtags, call-to-actions, etc.)

✅ AI-Powered Rewrites for Improved Posts

🚀 Features:

Drag & drop file uploads (PDF, PNG, JPG, TXT supported).

Backend API processes files and extracts content.

AI/ML models analyze sentiment, readability, and content quality.

Smart recommendations (hashtags, CTAs, rewrites).

Copy-to-clipboard functionality for results.

Deployed on Vercel (frontend) and Render (backend).

🛠️ Tech Stack
Frontend

React.js

React Markdown (for rendering clean outputs)

Bootstrap / Custom CSS

Vercel (Deployment)

Backend

FastAPI (Python)

OCR model

File handling with FormData (PDFs, images, text)

Render (Deployment)



/social-media-analyser
│── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx      # Main UI logic
│   │   ├── styles.css       # Custom styling
│   │   └── api.js
|   |   └── main.jsx
│   └── package.json
│
│── backend/                # FastAPI backend
│   ├── main.py              # API routes (/analyze)
│   ├── requirements.txt     # Backend dependencies
│   └── Dockerfile              # Docker image
│
│── README.md               # Documentation
│── .gitignore              # Ignore build/env files
  

⚡ Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/TANYATRIPATHI123/Social_Media_Content_Analyser.git
cd social-media-analyser

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

3️⃣ Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


🚀 Deployment
Backend runs on Render using Docker (with Tesseract preinstalled).
Frontend can be hosted on Netlify/Vercel and configured to call the Render backend.
