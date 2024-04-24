"""Synthesizes speech from the input string of text."""

from fastapi.responses import StreamingResponse
from google.cloud import texttospeech


client = texttospeech.TextToSpeechClient()

def text2speechgoogle(text, lng):
    input_text = texttospeech.SynthesisInput(text=text)

    languageCode = 'en-US';
    name = 'en-US-Neural2-G';

    if (lng == "ar"):
        languageCode = 'ar-XA';
        name = 'ar-XA-Standard-D';

    # Note: the voice can also be specified by name.
    # Names of voices can be retrieved with client.list_voices().
    voice = texttospeech.VoiceSelectionParams(
        language_code=languageCode,
        name=name,
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,
        speaking_rate=1
    )

    response = client.synthesize_speech(
        request={"input": input_text, "voice": voice, "audio_config": audio_config}
    )


    return StreamingResponse(
        iter([response.audio_content]),
        media_type="audio/wav"
    )

# if __name__ == "__main__":
#     print(text2speechgoogle("hello world", "ar"))
