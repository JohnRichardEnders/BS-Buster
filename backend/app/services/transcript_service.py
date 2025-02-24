import tempfile
from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import openai
from scipy.io import wavfile
import numpy as np

# Configuration for audio assumptions ## TODO - move these to configuration
SAMPLE_RATE = 16000         # samples per second
BYTES_PER_SAMPLE = 2        # 16-bit audio: 2 bytes per sample

# Update configuration (at top of file)
OVERLAP_SECONDS = 0.5  # Reduced from 1 second
THRESHOLD_SECONDS = 2   # Process every 2 seconds
OVERLAP_BYTES = int(SAMPLE_RATE * BYTES_PER_SAMPLE * OVERLAP_SECONDS)
THRESHOLD_BYTES = int(SAMPLE_RATE * BYTES_PER_SAMPLE * THRESHOLD_SECONDS)

async def transcribe_audio(audio_bytes: bytes) -> str:
    """Transcribes audio using OpenAI Whisper with proper WAV formatting"""
    def sync_transcribe():
        with tempfile.NamedTemporaryFile(suffix=".wav") as temp_audio_file:
            processed_audio = audio_bytes
            
            # Ensure even number of bytes for 16-bit samples
            if len(processed_audio) % 2 != 0:
                processed_audio = processed_audio[:-1]

            if not processed_audio:
                return ""

            audio_array = np.frombuffer(processed_audio, dtype=np.int16)
            wavfile.write(temp_audio_file, SAMPLE_RATE, audio_array)
            
            # Prepare file for OpenAI API with explicit format
            temp_audio_file.seek(0)
            
            # Create a tuple with filename and file content
            file_tuple = (temp_audio_file.name, temp_audio_file.read(), 'audio/wav')
            
            transcription = openai.audio.transcriptions.create(
                model="whisper-1",
                file=file_tuple
            )
            print(transcription)
            return transcription.text

    transcript_text = await asyncio.to_thread(sync_transcribe)
    return transcript_text


# Update configuration (at top of file)
OVERLAP_SECONDS = 0.5  # Reduced from 1 second
THRESHOLD_SECONDS = 2   # Process every 2 seconds
OVERLAP_BYTES = int(SAMPLE_RATE * BYTES_PER_SAMPLE * OVERLAP_SECONDS)
THRESHOLD_BYTES = int(SAMPLE_RATE * BYTES_PER_SAMPLE * THRESHOLD_SECONDS)

async def websocket_transcript(websocket: WebSocket):
    await websocket.accept()
    audio_buffer = bytearray()
    try:
        while True:
            chunk = await websocket.receive_bytes()
            audio_buffer.extend(chunk)
            print(f"Received audio chunk of size: {len(chunk)} bytes (Total: {len(audio_buffer)})")

            while len(audio_buffer) >= THRESHOLD_BYTES:
                # Extract exactly THRESHOLD_BYTES from the buffer
                process_bytes = bytes(audio_buffer[:THRESHOLD_BYTES])
                del audio_buffer[:THRESHOLD_BYTES - OVERLAP_BYTES]  # Advance buffer by threshold - overlap
                
                # Ensure even alignment
                if len(process_bytes) % 2 != 0:
                    process_bytes = process_bytes[:-1]

                if process_bytes:
                    transcript = await transcribe_audio(process_bytes)
                    await websocket.send_text(transcript)
                    print(f"Sent transcript: {transcript}")

    except WebSocketDisconnect:
        print("WebSocket disconnected")
        if audio_buffer:
            process_bytes = bytes(audio_buffer)
            if len(process_bytes) % 2 != 0:
                process_bytes = process_bytes[:-1]
            if process_bytes:
                transcript = await transcribe_audio(process_bytes)
                await websocket.send_text(transcript)
                print(f"Sent final transcript: {transcript}")