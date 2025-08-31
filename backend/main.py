import os
import re
import json
from fastapi import FastAPI, Body
from fastapi.responses import JSONResponse
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=api_key)

# Pick your model (can be "gemini-1.5-pro", "gemini-1.5-flash", or "gemini-2.0-pro-exp")
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI(title="Social Media Content Analyzer")

@app.post("/analyze")
async def analyze_post(data: dict = Body(...)):
    post = data.get("post", "")
    platform = data.get("platform", "general")

    if not post:
        return JSONResponse({"error": "Post text is required"}, status_code=400)

    prompt = f"""
    Analyze this social media post for engagement quality:
    ---
    {post}
    ---
    Platform: {platform}

    Return the result as VALID JSON only (no markdown, no code blocks). 
    Structure:
    {{
      "sentiment": "positive/neutral/negative",
      "readability": "easy/medium/hard",
      "issues": ["list of problems"],
      "suggestions": {{
         "improved_post": "rewrite",
         "hashtags": ["list", "of", "hashtags"],
         "call-to-action": "string"
      }}
    }}
    """

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Remove accidental code fences (```json ... ```)
        clean_text = re.sub(r"```json|```", "", raw_text).strip()

        # Parse into JSON
        analysis = json.loads(clean_text)

        return JSONResponse({"original": post, "analysis": analysis})

    except Exception as e:
        return JSONResponse({"error": f"Failed to analyze: {str(e)}"}, status_code=500)
