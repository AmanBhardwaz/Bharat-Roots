from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.routes.identify import router as identify_router
from app.routes.heritage_info import router as heritage_info_router


app = FastAPI(
    title="Bharat Roots API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }