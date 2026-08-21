import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types


# backend/.env path
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def detect_landmark(image_bytes: bytes):
    """Identify an Indian heritage site or landmark from image bytes using Gemini 3.6 Flash."""

    key = GEMINI_API_KEY
    if key:
        key = key.strip().strip('"').strip("'")

    if not key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured."
        )

    client = genai.Client(
        api_key=key
    )

    # Wrap the raw image bytes for Gemini
    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type="image/jpeg"
    )

    prompt = """
Analyze this image of an Indian heritage site, monument, or temple.
1. Identify the name of the monument/landmark (e.g. "Taj Mahal", "Hawa Mahal", "Qutub Minar", "Konark Sun Temple", etc.).
2. Return a JSON object with these exact keys:
   - "detected_name": The exact name of the monument or landmark (string). E.g. "Taj Mahal", "Hawa Mahal", "Qutub Minar", "Konark Sun Temple". If it is not a known Indian monument, set to "Unknown".
   - "confidence": Float between 0.0 and 1.0 indicating your confidence score (number).

Rules:
- Be highly accurate. If you are not confident or if it is not an Indian heritage site, return a low confidence score (e.g. less than 0.5) and set "detected_name" to "Unknown".
- Return ONLY valid JSON. No markdown code blocks, no trailing comments.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[image_part, prompt]
    )

    text = response.text.strip()

    # Remove markdown code blocks if wrapped by Gemini
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0].strip()

    try:
        data = json.loads(text)
        return {
            "name": data.get("detected_name", "Unknown"),
            "confidence": float(data.get("confidence", 0.0)),
            "locations": []
        }
    except Exception:
        # Fallback extraction in case JSON is malformed
        # Search for known heritage site names in the raw text
        raw_text_lower = text.lower()
        if "taj mahal" in raw_text_lower:
            return {"name": "Taj Mahal", "confidence": 0.8, "locations": []}
        elif "hawa mahal" in raw_text_lower:
            return {"name": "Hawa Mahal", "confidence": 0.8, "locations": []}
        elif "qutub minar" in raw_text_lower:
            return {"name": "Qutub Minar", "confidence": 0.8, "locations": []}
        elif "konark" in raw_text_lower:
            return {"name": "Konark Sun Temple", "confidence": 0.8, "locations": []}

        return None