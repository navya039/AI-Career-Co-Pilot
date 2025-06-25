# backend/app/schemas/analysis.py
from pydantic import BaseModel
from typing import List

# This defines the shape of the data our API will send back
class AnalysisResult(BaseModel):
    match_score: int
    verified_skills: List[str]
    missing_skills: List[str]
    # This is now a single string to hold the Markdown formatted text
    ai_suggestions: str