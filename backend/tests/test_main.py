import pytest
# Import ASGITransport along with AsyncClient
from httpx import AsyncClient, ASGITransport
from app.main import app # Import our main FastAPI app

# This is the base URL for our running application during tests
BASE_URL = "http://test"

@pytest.mark.asyncio
async def test_read_root():
    """
    Tests that the root endpoint ("/") is working correctly.
    """
    # The corrected line: use 'transport' instead of 'app'
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.get("/")

    # Assert that the HTTP status code is 200 (OK)
    assert response.status_code == 200

    # Assert that the response JSON matches what we expect
    expected_json = {"status": "ok", "message": "Welcome to the Smart Resume Ranker API!"}
    assert response.json() == expected_json