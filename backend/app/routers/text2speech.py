"""..."""

# import asyncio
import os
# import io
from openai import OpenAI
from fastapi import HTTPException,  Response
from fastapi.responses import StreamingResponse

from app.settings import Settings

settings = Settings()
OPENAI_KEY = settings.OPENAI_KEY
os.environ["OPENAI_KEY"] = OPENAI_KEY

client = OpenAI(
    api_key=OPENAI_KEY,
)


def text2speech(text):
    """...."""
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=text,
        )

        # Extract the generated speech URL from the response
        return StreamingResponse(
            iter([response.content]),
            media_type="audio/wav"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# if __name__ ==  '__main__':
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(text2speech("hello world"))
    # print(text2speech("hello world"))
