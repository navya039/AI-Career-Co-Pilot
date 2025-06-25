import pytest
from httpx import AsyncClient, ASGITransport
# We need to import AsyncMock instead of MagicMock for async functions
from unittest.mock import AsyncMock 

from app.main import app

BASE_URL = "http://test"

@pytest.mark.asyncio
async def test_analyze_endpoint_success(monkeypatch):
    """
    Tests the main /analyze endpoint by mocking both the file parser and the Gemini call.
    """
    # 1. Mock the file parser to return predictable text.
    #    We use AsyncMock because the real function is async.
    mock_parser = AsyncMock(return_value="My skills are python and fastapi")
    monkeypatch.setattr("app.api.v1.endpoints.analysis.extract_text_from_file", mock_parser)

    # 2. Mock the Gemini API to return predictable suggestions.
    #    This function is also async, so it also needs to be an AsyncMock.
    mock_ai_suggestions = AsyncMock(return_value="Fake AI suggestion")
    monkeypatch.setattr("app.api.v1.endpoints.analysis.gemini.generate_ai_suggestions", mock_ai_suggestions)

    # 3. Prepare fake file data (content doesn't matter now, only the filename)
    files = {'resume_file': ('test_resume.pdf', b'fake content', 'application/pdf')}
    data = {'job_description': 'We need a developer with python skills'}

    # 4. Make the API call
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.post("/api/v1/analyze/", files=files, data=data)

    # 5. Assert that the request was successful
    assert response.status_code == 200

    response_data = response.json()
    assert "match_score" in response_data
    # Assert that our FAKE AI suggestion was used in the response
    assert response_data["ai_suggestions"] == "Fake AI suggestion"