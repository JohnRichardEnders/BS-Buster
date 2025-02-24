from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BS Buster Backend"
    API_V1_STR: str = "/api/v1"
    # Add other configuration settings here

settings = Settings()
