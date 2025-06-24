from fastapi import APIRouter, UploadFile, File, Form
from app.schemas.analysis import AnalysisResult
from app.services.parser import extract_text_from_file
from app.services.analyzer import calculate_match_score, extract_skills
# Import our new Gemini service
from app.services.gemini import generate_ai_suggestions

router = APIRouter()

@router.post("/", response_model=AnalysisResult)
async def perform_analysis(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    This endpoint now uses the real NLP engine and the Gemini API for suggestions.
    """
    # Steps 1, 2, and 3 are the same
    resume_text = await extract_text_from_file(resume_file)
    match_score = calculate_match_score(resume_text, job_description)
    matching_skills, missing_skills = extract_skills(resume_text, job_description)

    # --- THIS IS THE BIG CHANGE ---
    # 4. Generate suggestions using the Gemini API, passing it all the context.
    ai_suggestions = await generate_ai_suggestions(resume_text, job_description, missing_skills)

    # 5. Return the REAL results from all our services
    return AnalysisResult(
        match_score=match_score,
        verified_skills=matching_skills,
        missing_skills=missing_skills,
        ai_suggestions=ai_suggestions
    )