"""..."""

import os
from typing import Optional

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


@router.post("/")
# async def create_upload_file(lng: str = Form(...), file: UploadFile = File(...)):
async def create_upload_file(file: UploadFile = File(...), lng: str = Form(...)):
    """..."""
    print(f"lng: {lng}")

    # speech to text.
    text = await speech2text(file)
    print(f"transcription: {text}")

    # text to llm
    response = await text2llm(text, [], lng)

    # text to speech
    # speech = text2speech(response)
    speech = text2speechgoogle(response, lng)

    return speech
