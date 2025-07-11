import pytest
from httpx import AsyncClient
from main import app
import json
from datetime import datetime
import uuid
@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(base_url="http://test", app=app) as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_chat():
    async with AsyncClient(base_url="http://test", app=app) as ac:
        response = await ac.post("/chat", json={"message": "Hello"})
    assert response.status_code == 200
    assert "response" in response.json()

@pytest.mark.asyncio
async def test_get_chat_history():
    async with AsyncClient(base_url="http://test", app=app) as ac:
        response = await ac.get("/history")
    assert response.status_code == 200
    assert "history" in response.json()
@pytest.mark.asyncio
@pytest.mark.asyncio
async def test_new_chat():
    async with AsyncClient(base_url="http://test", app=app) as ac:
        response = await ac.post("/new-chat")
    assert response.status_code == 200
    assert "session_id" in response.json()
    assert isinstance(response.json()["session_id"], str)



# If you had /new_chat or /current_session endpoints, add them like this:
# @pytest.mark.asyncio
# async def test_new_chat():
#     async with AsyncClient(base_url="http://test", app=app) as ac:
#         response = await ac.post("/new-chat")
#     assert response.status_code == 200
