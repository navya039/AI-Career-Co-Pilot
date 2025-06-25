# backend/app/api/v1/api.py

from fastapi import APIRouter
from app.api.v1.endpoints import analysis
from app.api.v1.endpoints import improver

api_router = APIRouter()

# Including the routers without the trailing_slash argument
api_router.include_router(analysis.router, prefix="/analyze", tags=["Analysis"])
api_router.include_router(improver.router, prefix="/improve", tags=["Improver"])