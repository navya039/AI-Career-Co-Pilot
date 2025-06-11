from fastapi import APIRouter
from app.api.v1.endpoints import analysis

api_router = APIRouter()

# We include the router from our analysis endpoint file
api_router.include_router(analysis.router, prefix="/analyze", tags=["Analysis"])