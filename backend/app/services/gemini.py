# backend/app/services/gemini.py

import google.generativeai as genai
from app.core.config import GEMINI_API_KEY
import logging

# Configure the Gemini API
try:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use a stable, supported model name
    model = genai.GenerativeModel("gemini-pro")
except Exception as e:
    logging.error(f"Failed to configure Gemini API or create model: {e}")
    model = None  # Set model to None if configuration fails


# Function 1: For the main analyzer page's suggestions
async def generate_ai_suggestions(
    resume_text: str, job_description_text: str, missing_skills: list
) -> str:
    if not model:
        return "Error: Gemini API is not configured."

    prompt = f"""
    Act as an expert career coach reviewing a candidate's resume against a job description.
    Based on the provided resume text and job description, give 3-4 concise, actionable suggestions for improvement.
    Focus on how the candidate can better align their resume with the job description.
    Also, consider the list of missing skills: {missing_skills}.

    Please format your response using Markdown. Use bullet points for each suggestion,
    and use bold text for key skills or action items to make them stand out.

    RESUME:
    ---
    {resume_text}
    ---

    JOB DESCRIPTION:
    ---
    {job_description_text}
    ---
    """
    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error calling Gemini API for suggestions: {e}")
        return "Error: Could not generate AI suggestions at this time."


# Function 2: For the Improver page's bullet point builder
async def generate_bullet_point_suggestion(
    bullet_point: str, improvement_type: str = "make it more impactful"
) -> str:
    if not model:
        return "Error: Gemini API is not configured."

    prompt = f"""
    You are an expert resume writer. Your task is to rewrite a single resume bullet point based on a specific instruction.
    Only return the rewritten bullet point, nothing else. Do not add any introductory phrases.

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


# Function 3: For the Improver page's skill gap planner
async def generate_learning_roadmap(skill: str) -> str:
    if not model:
        return "Error: Gemini API is not configured."

    prompt = f"""
    Act as a senior software engineer and mentor. A junior developer wants to learn the skill "{skill}" to fill a gap on their resume.
    Create a structured, practical, step-by-step learning roadmap for them. 
    The plan should include small, actionable projects they can build.

    Please format your entire response using Markdown. Use headings for sections, subheadings, bold text,
    and bullet points to make the plan clear and easy to read.
    """
    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error calling Gemini API for roadmap: {e}")
        return f"Error: Could not generate a learning plan for {skill}."


# Function 4: For the Interview Simulator
async def generate_interview_questions(
    resume_text: str, job_description_text: str
) -> str:
    if not model:
        return "Error: Gemini API is not configured."

    prompt = f"""
    Act as a hiring manager for a top tech company. You are preparing to interview a candidate for a role.
    Based on the provided Resume and Job Description, generate a list of 5-7 insightful interview questions.
    The questions should probe the candidate's experience, skills, and cultural fit, specifically in relation to this job.
    Include a mix of behavioral, technical, and project-based questions.

    Please format your response using Markdown. Use a main heading for the list and numbered points for each question.

    JOB DESCRIPTION:
    ---
    {job_description_text}
    ---

    CANDIDATE'S RESUME:
    ---
    {resume_text}
    ---
    """
    try:
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error calling Gemini API for interview questions: {e}")
        return "Error: Could not generate interview questions at this time."
