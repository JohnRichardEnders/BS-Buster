import re
import sys
import sounddevice as sd
import numpy as np
from scipy.io import wavfile
import threading
import queue
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tempfile
from openai import OpenAI, OpenAIError
from fastapi.middleware.cors import CORSMiddleware

import support_service

app = FastAPI()
client = OpenAI()

live_transcript = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Audio recording settings
SAMPLE_RATE = 16000
CHANNELS = 1
DTYPE = "int16"
MIN_DURATION = 0.1  # Minimum audio duration in seconds

# Global variables
audio_queue = queue.Queue()
is_recording = False
recording_thread = None
last_process_time = time.time()


def audio_callback(indata, frames, time, status):
    if status:
        print(status, file=sys.stderr)
    audio_queue.put(indata.copy())


def record_audio():
    global is_recording
    with sd.InputStream(
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype=DTYPE,
        callback=audio_callback,
    ):
        while is_recording:
            time.sleep(0.1)


@app.post("/start")
async def start_recording():
    global is_recording, recording_thread
    if not is_recording:
        is_recording = True
        recording_thread = threading.Thread(target=record_audio)
        recording_thread.start()
        return {"message": "Recording started"}
    return {"message": "Already recording"}


@app.post("/stop")
async def stop_recording():
    global is_recording, recording_thread
    if is_recording:
        is_recording = False
        if recording_thread:
            recording_thread.join()
            recording_thread = None
        return {"message": "Recording stopped"}
    return {"message": "Not currently recording"}


sentences_set = {}


@app.post("/transcript")
async def get_transcript():
    global is_recording, audio_queue, last_process_time, previous_half_sentence
    if not is_recording:
        raise HTTPException(status_code=400, detail="Not currently recording")

    current_time = time.time()
    if current_time - last_process_time < 0.5:  # Process every 0.5 seconds
        return {"transcription": ""}

    last_process_time = current_time

    # Collect audio data
    audio_data = []
    while not audio_queue.empty():
        audio_data.append(audio_queue.get())

    if not audio_data:
        return {"transcription": ""}

    # Combine audio chunks
    audio_array = np.concatenate(audio_data)

    # Check if audio duration meets minimum requirement
    audio_duration = len(audio_array) / SAMPLE_RATE
    if audio_duration < MIN_DURATION:
        return {"transcription": ""}

    # Save to a temporary file
    with tempfile.NamedTemporaryFile(
        suffix=".wav", delete=False
    ) as temp_audio:
        wavfile.write(temp_audio.name, SAMPLE_RATE, audio_array)
        temp_audio_path = temp_audio.name

    # Transcribe using OpenAI Whisper
    try:

        claims = []
        with open(temp_audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1", file=audio_file, language="en"
            )
            sentences = re.split(r"(?<=[.!?])\s+", transcription.text)
            live_transcript.extend(sentences)

            for s in sentences:
                claim = extract_claim(s)

                if claim != "":
                    print("claim: ", claim)
                    claims.append(claim)
        print("final claims: ", claims)
        return {"transcription": claims}
    except OpenAIError as e:
        print(f"OpenAI API error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Transcription error: {str(e)}"
        )
    finally:
        import os

        os.unlink(temp_audio_path)


def extract_claim(sentence):
    messages = [
        {
            "role": "user",
            "content": (
                "Extract the main factual claim from the following sentence. A factual claim is a statement that asserts a fact about the world. "
                "Remove any extra conversational words, qualifiers, or opinions so that only the core assertion remains. "
                "If the sentence does not contain a clear factual claim or no sentence is given, return an empty string.\n\n"
                "Example 1:\n"
                'Input: "Yes and the other day I heard that Germany actually won the last world cup"\n'
                'Output: "Germany won the last world cup"\n\n'
                "Example 2:\n"
                'Input: "The great wall of china is visible from space"\n'
                'Output: "The great wall of china is visible from space"\n\n'
                f'Sentence: "{sentence}"'
            ),
        }
    ]

    print(f"Execuring completion with message: {sentence}")
    if sentence != " " and len(sentence) > 3:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
        )
    else:
        return ""

    # print(completion.choices[0].message.content.strip('"'))

    claim = completion.choices[0].message.content.strip('"')
    return claim


class Claim(BaseModel):
    text: str


@app.post("/fact-check")
async def fact_check(claim: Claim):
    result = await support_service.verify_claim(claim.text)
    return result


from fastapi import WebSocket
import asyncio


@app.websocket("/ws/transcript")
async def websocket_transcript(websocket: WebSocket):
    await websocket.accept()
    last_index = 0
    while True:
        await asyncio.sleep(0.5)  # Poll every 0.5 seconds
        if len(live_transcript) > last_index:
            # Send only the new sentences
            new_sentences = live_transcript[last_index:]
            await websocket.send_json({"transcript": new_sentences})
            last_index = len(live_transcript)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
