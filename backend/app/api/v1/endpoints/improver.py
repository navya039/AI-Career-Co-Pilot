from fastapi import APIRouter
from app.schemas.improver import ImproverRequest, ImproverResponse
from app.services.gemini import generate_bullet_point_suggestion, generate_learning_roadmap

router = APIRouter()

# This endpoint is not currently used by the UI but we can add it back later
@router.post("/bullet", response_model=ImproverResponse)
async def improve_bullet_point(request: ImproverRequest):
    improved_text = await generate_bullet_point_suggestion(
        bullet_point=request.bullet_point,
        improvement_type=request.improvement_type
    )
    return ImproverResponse(improved_text=improved_text)

@router.post("/roadmap", response_model=ImproverResponse)
async def get_learning_roadmap(request: ImproverRequest):
    roadmap_text = await generate_learning_roadmap(skill=request.bullet_point)
    return ImproverResponse(improved_text=roadmap_text)