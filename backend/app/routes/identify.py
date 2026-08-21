from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.vision_service import detect_landmark
from app.data.heritage import find_heritage_site


router = APIRouter()


@router.post("/identify")
async def identify_heritage(
    image: UploadFile = File(...)
):

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image."
        )

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Image is empty."
        )

    try:
        detection = detect_landmark(image_bytes)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    if detection is None:
        return {
            "success": False,
            "message": "No landmark could be confidently identified."
        }

    heritage = find_heritage_site(
        detection["name"]
    )

    if heritage is None:
        return {
            "success": False,
            "detected_name": detection["name"],
            "confidence": detection["confidence"],
            "message": (
                "Landmark detected, but it is not yet available "
                "in our verified heritage archive."
            )
        }

    return {
        "success": True,
        "detected_name": detection["name"],
        "confidence": detection["confidence"],
        "locations": detection["locations"],
        "heritage": heritage,
    }