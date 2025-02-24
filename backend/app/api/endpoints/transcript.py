from fastapi import APIRouter, HTTPException, WebSocket
from app.services import transcript_service
from app.schemas.transcript import Claim

router = APIRouter()

@router.post("/")
async def get_transcript():
    return await transcript_service.get_transcript()

@router.post("/fact-check")
async def fact_check(claim: Claim):
    return await transcript_service.fact_check(claim)

@router.websocket("/ws")
async def websocket_transcript(websocket: WebSocket):
    await transcript_service.websocket_transcript(websocket)
