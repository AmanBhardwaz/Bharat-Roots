from fastapi import APIRouter, HTTPException

from app.services.gemini_service import get_heritage_detail
from app.data.heritage import HERITAGE_SITES


router = APIRouter()


@router.get("/heritage-info/{heritage_id}")
async def heritage_info(heritage_id: int):
    """Return AI-generated detailed content for a heritage site."""

    heritage = next(
        (
            site
            for site in HERITAGE_SITES
            if site.get("id") == heritage_id
        ),
        None
    )

    if heritage is None:
        raise HTTPException(
            status_code=404,
            detail="Heritage site not found."
        )

    try:
        detail = get_heritage_detail(heritage)

        return {
            "success": True,
            **detail
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
