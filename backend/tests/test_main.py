# backend/tests/test_main.py
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app 

BASE_URL = "http://test"

@pytest.mark.asyncio
async def test_read_root():
    """
    Tests that the root endpoint ("/") is working correctly.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.get("/")

    assert response.status_code == 200

    # --- THIS IS THE FIX ---
    # Update the expected message to match the current one in main.py
    expected_json = {"status": "ok", "message": "Welcome to the AI Career Co-Pilot API!"}
    assert response.json() == expected_json