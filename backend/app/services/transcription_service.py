from ..models.transcription import Transcription

# In-memory storage
transcriptions = {}


def get_transcription(transcription_id: int):
    return transcriptions.get(transcription_id)


def get_transcriptions():
    return list(transcriptions.values())


def create_transcription(transcription: Transcription):
    transcription_id = len(transcriptions) + 1
    transcription.id = transcription_id
    transcriptions[transcription_id] = transcription
    return transcription


def update_transcription(transcription_id: int, transcription: Transcription):
    if transcription_id not in transcriptions:
        return None
    transcription.id = transcription_id
    transcriptions[transcription_id] = transcription
    return transcription


def delete_transcription(transcription_id: int):
    if transcription_id not in transcriptions:
        return False
    del transcriptions[transcription_id]
    return True
