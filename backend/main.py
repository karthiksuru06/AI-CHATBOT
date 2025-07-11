from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from dotenv import load_dotenv
import json
import os
from datetime import datetime
from pathlib import Path
import uuid

chat_sessions = {}
# === Load environment variables ===
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))

# === Validate API key ===
if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing in .env")

# === Configure Gemini API ===
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# === JSON file fallback ===
BASE_DIR = Path(__file__).parent.resolve()
JSON_PATH = BASE_DIR / "data.json"

# === Initialize FastAPI app ===
app = FastAPI(title="Gemini Chatbot API")

# === Allow frontend CORS (React, etc.) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Request schema ===
class ChatRequest(BaseModel):
    message: str

# === Routes ===

@app.get("/")
async def root():
    return {"status": "✅ Gemini Chatbot API is running"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_msg = request.message.strip()

    try:
        response = model.generate_content(user_msg)
        ai_reply = response.candidates[0].content.parts[0].text.strip()
    except Exception as e:
        ai_reply = f"⚠️ Gemini Error: {str(e)}"

    chat_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "user": user_msg,
        "bot": ai_reply
    }

    # Save to JSON
    try:
        if JSON_PATH.exists():
            with JSON_PATH.open("r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = []

        data.append(chat_entry)

        with JSON_PATH.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    except Exception as e:
        print("⚠️ JSON storage error:", e)

    return {"response": ai_reply}

@app.get("/history")
async def get_chat_history():
    try:
        if JSON_PATH.exists():
            with JSON_PATH.open("r", encoding="utf-8") as f:
                data = json.load(f)
            return {"history": data[-50:]}
        return {"history": []}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.delete("/history")
async def clear_history():
    try:
        if JSON_PATH.exists():
            JSON_PATH.unlink()
        return {"message": "✅ Chat history cleared"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_msg = request.message.strip()

    try:
        response = model.generate_content(user_msg)
        ai_reply = response.candidates[0].content.parts[0].text.strip()
    except Exception as e:
        ai_reply = f"⚠️ Gemini Error: {str(e)}"

    chat_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "user": user_msg,
        "bot": ai_reply
    }

    # Save to in-memory session if exists
    session_id = list(chat_sessions.keys())[-1] if chat_sessions else None
    if session_id:
        chat_sessions[session_id].append(chat_entry)

    # Save to JSON file
    try:
        data = []
        if JSON_PATH.exists():
            with JSON_PATH.open("r", encoding="utf-8") as f:
                data = json.load(f)
        data.append(chat_entry)
        with JSON_PATH.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print("⚠️ JSON storage error:", e)

    return {"response": ai_reply, "timestamp": chat_entry["timestamp"]}
@app.post("/new-chat")
def new_chat():
    global chat_sessions
    session_id = str(uuid.uuid4())
    chat_sessions[session_id] = []
    return {"session_id": session_id}
@app.get("/chat-history")
async def get_chat_history():
    if not JSON_PATH.exists():
        return {"sessions": []}

    with JSON_PATH.open("r", encoding="utf-8") as f:
        all_data = json.load(f)

    sessions = []
    for session_id, messages in all_data.items():
        sessions.append({
            "id": session_id,
            "created_at": messages[0]["timestamp"] if messages else datetime.utcnow().isoformat(),
            "messages": messages
        })

    return {"sessions": sessions}

@app.get("/history")
async def get_chat_history():
    try:
        if JSON_PATH.exists():
            with open(JSON_PATH, "r") as f:
                data = json.load(f)
            return {"history": data}
        return {"history": {}}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# === Run app directly with Python ===
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
