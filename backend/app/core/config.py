from decouple import config

PROJECT_TITLE: str = "Smart Resume Ranker"
PROJECT_VERSION: str = "0.1.0"

from decouple import config

PROJECT_TITLE: str = "AI Career Co-Pilot"
PROJECT_VERSION: str = "0.1.0"

# This line securely reads the key from your .env file
GEMINI_API_KEY = config("GEMINI_API_KEY")

# This is where we will load secrets like API keys later
# For example: GEMINI_API_KEY = config("GEMINI_API_KEY", default="your_default_key")