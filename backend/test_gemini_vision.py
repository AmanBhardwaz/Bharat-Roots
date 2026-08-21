import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

BASE_DIR = Path(__file__).resolve().parents[0]
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key exists: {bool(api_key)}")

if api_key:
    client = genai.Client(api_key=api_key)
    try:
        # Simple text model check with gemini-3.6-flash
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents="Hello! Tell me in 1 word if you can hear me."
        )
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error calling generate_content: {e}")
