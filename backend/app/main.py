from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import PROJECT_TITLE, PROJECT_VERSION

app = FastAPI(
    title=PROJECT_TITLE,
    version=PROJECT_VERSION,
)

# --- THIS IS THE CHANGE ---
# We are allowing all origins with "*" to resolve the browser security issue.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {"status": "ok", "message": f"Welcome to the {PROJECT_TITLE} API!"}

app.include_router(api_router, prefix="/api/v1")