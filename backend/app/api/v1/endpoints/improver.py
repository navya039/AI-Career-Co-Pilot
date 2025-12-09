# backend/app/api/v1/endpoints/improver.py

from fastapi import APIRouter
from app.schemas.improver import (
    ImproverRequest,
    ImproverResponse,
    RoadmapRequest,
)
from app.services.gemini import (
    generate_bullet_point_suggestion,
    generate_learning_roadmap,
)

router = APIRouter()

# Bullet Point Builder (not currently used by UI, but kept for later)
@router.post("/bullet", response_model=ImproverResponse)
async def improve_bullet_point(request: ImproverRequest):
    improved_text = await generate_bullet_point_suggestion(
        bullet_point=request.bullet_point,
        improvement_type=request.improvement_type,
    )
    return ImproverResponse(improved_text=improved_text)


# Skill Gap Career Planner (used by the UI)
@router.post("/roadmap", response_model=ImproverResponse)
async def get_learning_roadmap(request: RoadmapRequest):
    # Here we use request.skill_name, not bullet_point
    roadmap_text = await generate_learning_roadmap(skill=request.skill_name)
    return ImproverResponse(improved_text=roadmap_text)
