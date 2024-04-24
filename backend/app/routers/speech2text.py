"""..."""

import os
import io
from fastapi import UploadFile
from typing import Any
from openai import OpenAI

from app.settings import Settings

settings = Settings()
OPENAI_KEY = settings.OPENAI_KEY
os.environ["OPENAI_KEY"] = OPENAI_KEY

client = OpenAI(
    api_key=OPENAI_KEY,
)

async def speech2text(file: UploadFile):
    audio = await file.read()
    buffer = io.BytesIO(audio)
    buffer.name = 'audio.wav'

    transcription = client.audio.transcriptions.create(
        file=buffer,
        model="whisper-1", 
        response_format="text",
    )
    
    return transcription

# if __name__ == "__main__":
#     print(speech2text("output.wav"))
