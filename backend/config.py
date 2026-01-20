import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings"""
    
    # API Settings
    API_TITLE = "ProdLens AI API"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = "Production Readiness Analyzer for Low-Code Apps"
    
    # OpenAI Settings
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_TEMPERATURE = 0.7
    
    # CORS Settings
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Analysis Settings
    MAX_ANALYSIS_TIME = 60  # seconds
    ANALYSIS_BATCH_SIZE = 5
    
    # File Settings
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    # Scoring Settings
    SCORING_WEIGHTS = {
        "scalability": 0.25,
        "security": 0.30,
        "testability": 0.20,
        "maintainability": 0.15,
        "performance": 0.10,
    }

settings = Settings()
