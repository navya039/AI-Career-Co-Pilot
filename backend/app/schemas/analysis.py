from pydantic import BaseModel
from typing import List, Optional

# This defines the shape of the data we expect in the request
# For now, we only need the job description text. The file is handled separately.
class AnalysisInput(BaseModel):
    job_description: str

# This defines the shape of the data our API will send back
class AnalysisResult(BaseModel):
    match_score: int
    verified_skills: List[str]
    missing_skills: List[str]
    ai_suggestions: List[str]