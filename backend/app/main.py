from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import items, transcriptions, recordings

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)
app.include_router(transcriptions.router)
app.include_router(recordings.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend"}
