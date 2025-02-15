from fastapi import APIRouter, HTTPException
from ..models.transcription import Transcription
from ..services import transcription_service

router = APIRouter(prefix="/transcriptions", tags=["transcriptions"])


@router.post("/", response_model=Transcription)
def create_transcription(transcription: Transcription):
    return transcription_service.create_transcription(transcription)


@router.get("/", response_model=list[Transcription])
def read_transcriptions():
    return transcription_service.get_transcriptions()


@router.get("/{transcription_id}", response_model=Transcription)
def read_transcription(transcription_id: int):
    transcription = transcription_service.get_item(transcription_id)
    if transcription is None:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return transcription


@router.put("/{transcription_id}", response_model=Transcription)
def update_transcription(transcription_id: int, transcription: Transcription):
    updated_transcription = transcription_service.update_transcription(
        transcription_id, transcription
    )
    if updated_transcription is None:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return updated_transcription


@router.delete("/{transcription_id}")
def delete_transcription(transcription_id: int):
    if not transcription_service.delete_item(transcription_id):
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Transcription deleted successfully"}
