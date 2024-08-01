"""..."""

import os

from fastapi import APIRouter, File, Form, UploadFile

from app.routers.speech2text import speech2text
from app.routers.text2llm import text2llm

# from app.routers.text2speech import text2speech
from app.routers.text2speechgoogle import text2speechgoogle
from app.settings import Settings

settings = Settings()
OPENAI_KEY = settings.OPENAI_KEY
os.environ["OPENAI_KEY"] = OPENAI_KEY
SERPER_API_KEY = settings.SERPER_API_KEY
os.environ["SERPER_API_KEY"] = SERPER_API_KEY

router = APIRouter()


@router.get("/")
async def get_answer():
    """..."""
    return "Get answer"


@router.post("/")
async def create_upload_file(file: UploadFile = File(...), lng: str = Form(...)):
    """..."""
    print(f"lng: {lng}")

    # speech to text.
    text = await speech2text(file)
    print(f"transcription: {text}")

    chat_history = [
        {
            "input": "مرحبا انا اسمي سيف الدين",
            "output": "مرحبا سيف الدين انا زييا كيف يمكنني مساعدتك ؟",
        },
    ]

    # text to llm
    response = await text2llm(text, chat_history, lng)

    # text to speech
    # speech = text2speech(response)
    speech = text2speechgoogle(response, lng)

    return speech
