from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import PROJECT_TITLE, PROJECT_VERSION

# Initialize the FastAPI app
app = FastAPI(
    title=PROJECT_TITLE,
    version=PROJECT_VERSION,
)

# CORS (Cross-Origin Resource Sharing) Middleware
# This is crucial for allowing our React frontend (running on localhost:3000)
# to communicate with our backend (running on localhost:8000).
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A simple root endpoint for a health check
@app.get("/", tags=["Root"])
def read_root():
    """A simple health check endpoint to confirm the API is running."""
    return {"status": "ok", "message": f"Welcome to the {PROJECT_TITLE} API!"}


# Include the main API router from our v1 api file
app.include_router(api_router, prefix="/api/v1")