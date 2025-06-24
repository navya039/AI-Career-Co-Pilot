from fastapi import APIRouter
from app.api.v1.endpoints import analysis
from app.api.v1.endpoints import improver

api_router = APIRouter()

# Include the router for the main analysis endpoint
api_router.include_router(analysis.router, prefix="/analyze", tags=["Analysis"])

# Include the router for the new improver endpoints (/bullet and /roadmap)
api_router.include_router(improver.router, prefix="/improve", tags=["Improver"])