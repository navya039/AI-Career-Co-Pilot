# backend/app/schemas/improver.py

from pydantic import BaseModel


class ImproverRequest(BaseModel):
    bullet_point: str
    improvement_type: str = "make it more impactful"


class RoadmapRequest(BaseModel):
    skill_name: str


class ImproverResponse(BaseModel):
    improved_text: str
