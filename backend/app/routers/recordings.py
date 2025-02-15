from fastapi import APIRouter

from ..services import recording_service


router = APIRouter(prefix="/recording", tags=["recordings"])


@router.get("/start")
def start_recording():
    recording_service.start_recording()


@router.get("/stop")
def stop_recording():
    recording_service.stop_recording()
