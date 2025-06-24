# backend/app/services/gemini.py

import google.generativeai as genai
from app.core.config import GEMINI_API_KEY
import logging

try:
    genai.configure(api_key=GEMINI_API_KEY)
except Exception as e:
    logging.error(f"Failed to configure Gemini API: {e}")

model = genai.GenerativeModel('gemini-1.5-flash')

# Function 1: For the main analyzer page
async def generate_ai_suggestions(resume_text: str, job_description_text: str, missing_skills: list) -> list[str]:
    prompt = f"""
    Act as an expert career coach... (rest of prompt is unchanged)
    """
    try:
        response = await model.generate_content_async(prompt)
        suggestions_text = response.text.replace('*', '').strip()
        return [s.strip() for s in suggestions_text.split('\n') if s.strip()]
    except Exception as e:
        logging.error(f"Error calling Gemini API for suggestions: {e}")
        return ["Error: Could not generate AI suggestions."]

# --- THIS IS THE MISSING FUNCTION THAT WE ARE ADDING BACK ---
async def generate_bullet_point_suggestion(bullet_point: str, improvement_type: str) -> str:
    """
    Generates a single, improved bullet point using a specific instruction.
    """
    prompt = f"""
    You are an expert resume writer. Your task is to rewrite a single resume bullet point based on a specific instruction.
    Only return the rewritten bullet point, nothing else. Do not add any introductory phrases like "Here is the rewritten bullet point:".

    Original Bullet Point: "{bullet_point}"
    Instruction: "{improvement_type}"

    Rewritten Bullet Point:
    """
    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error calling Gemini API for bullet points: {e}")
        return "Error: Could not generate AI suggestion at this time."

# Function 3: For the skill gap planner
async def generate_learning_roadmap(skill: str) -> str:
    prompt = f"""
    Act as a senior software engineer and mentor... (rest of prompt is unchanged)
    """
    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error calling Gemini API for roadmap: {e}")
        return f"Error: Could not generate a learning plan for {skill}."