from pydantic import BaseModel


class Transcription(BaseModel):
    id: int
    text: str
    description: str = None
