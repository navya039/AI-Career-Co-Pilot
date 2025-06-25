# backend/app/api/v1/endpoints/analysis.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.analysis import AnalysisResult
from app.schemas.simulator import SimulatorRequest
from app.services.parser import extract_text_from_file
from app.services.analyzer import calculate_match_score, extract_skills
from app.services import gemini

# Create the router object for this endpoint file
router = APIRouter()

@router.post("/", response_model=AnalysisResult)
async def perform_analysis(
    resume_file: UploadFile = File(..., description="The user's resume file (PDF or DOCX)."),
    job_description: str = Form(..., description="The job description text.")
):
    """
    This endpoint extracts text, performs analysis, and gets AI suggestions.
    """
    resume_text = await extract_text_from_file(resume_file)
    
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not read text from the uploaded resume file. Please ensure it is a valid PDF or DOCX.")

    # Perform the analysis using our services
    score = calculate_match_score(resume_text, job_description)
    matching, missing = extract_skills(resume_text, job_description)
    suggestions = await gemini.generate_ai_suggestions(resume_text, job_description, missing)

    # Return the real results
    return AnalysisResult(
        match_score=score,
        verified_skills=matching,
        missing_skills=missing,
        ai_suggestions=suggestions
    )


@router.post("/simulate", response_model=dict)
async def simulate_interview(request_data: SimulatorRequest):
    """
    Receives the full resume and JD text and generates interview questions.
    """
    questions = await gemini.generate_interview_questions(
        request_data.resume_text, 
        request_data.job_description_text
    )
    return {"questions": questions}