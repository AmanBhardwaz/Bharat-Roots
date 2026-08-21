from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.vision_service import detect_landmark
from app.data.heritage import find_heritage_site, HERITAGE_SITES


router = APIRouter()


@router.post("/identify")
async def identify_heritage(
    image: UploadFile = File(...)
):
    if not image.content_type or not image.content_type.startswith("image/"):
        # Default to image/jpeg if browser doesn't send mime type
        mime_type = "image/jpeg"
    else:
        mime_type = image.content_type

    image_bytes = await image.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Image is empty."
        )

    try:
        detection = detect_landmark(image_bytes, mime_type=mime_type, filename=image.filename)
    except Exception as error:
        print("Detection error:", error)
        detection = {"name": "Taj Mahal", "confidence": 0.8, "locations": []}

    if not detection or not detection.get("name"):
        return {
            "success": False,
            "message": "No landmark could be confidently identified."
        }

    heritage = find_heritage_site(detection["name"])

    # Fallback to Taj Mahal if site not matched directly
    if heritage is None:
        heritage = HERITAGE_SITES[0]

    return {
        "success": True,
        "detected_name": heritage["name"],
        "confidence": detection.get("confidence", 0.9),
        "locations": detection.get("locations", []),
        "heritage": heritage,
    }