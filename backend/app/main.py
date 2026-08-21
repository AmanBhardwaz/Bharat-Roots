from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.routes.identify import router as identify_router
from app.routes.heritage_info import router as heritage_info_router


app = FastAPI(
    title="Bharat Roots API",
    version="1.0.0"
)


import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    identify_router,
    prefix="/api"
)
app.include_router(
    chat_router,
    prefix="/api"
)
app.include_router(
    heritage_info_router,
    prefix="/api"
)

@app.get("/")
def root():
    return {
        "project": "Bharat Roots",
        "status": "running"
    }


@app.get("/api/check-key")
def check_key():
    import os
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return {"status": "missing", "message": "GEMINI_API_KEY is not set in environment."}

    clean_key = key.strip().strip('"').strip("'")
    return {
        "status": "loaded",
        "length": len(clean_key),
        "starts_with": clean_key[:6],
        "ends_with": clean_key[-4:] if len(clean_key) > 4 else "",
        "raw_length_before_strip": len(key)
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }