from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.gemini_service import ask_bharat_ai
from app.data.heritage import HERITAGE_SITES


router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    heritage_id: int
    previous_interaction_id: str | None = None
    language: str = "English"


@router.post("/chat")
async def chat(request: ChatRequest):

    # Empty question check
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )


    heritage = None
    if request.heritage_id is not None:
        # Find heritage site using its ID
        heritage = next(
            (
                site
                for site in HERITAGE_SITES
                if site.get("id") == request.heritage_id
            ),
            None
        )

        # Heritage site not found
        if heritage is None:
            raise HTTPException(
                status_code=404,
                detail="Heritage site not found."
            )


    try:

        # Ask Gemini
        result = ask_bharat_ai(
            question=request.question,
            heritage=heritage,
            previous_interaction_id=request.previous_interaction_id,
            language=request.language,
        )


        return {
            "success": True,
            **result
        }


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )