import os
# Force Google GenAI SDK to use Developer API (AI Studio) instead of Vertex AI on Render/GCP hosts
os.environ.pop("GOOGLE_APPLICATION_CREDENTIALS", None)
os.environ.pop("GOOGLE_GENAI_USE_VERTEXAI", None)

import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai


# Find backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    GEMINI_API_KEY = GEMINI_API_KEY.strip().strip('"').strip("'")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured.")

# Diagnostic log to verify correct key loading in Render
print(f"DEBUG: Loaded GEMINI_API_KEY: {GEMINI_API_KEY[:6]}...{GEMINI_API_KEY[-4:]} (Length: {len(GEMINI_API_KEY)})")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


MODEL_NAME = "gemini-3.6-flash"


def ask_bharat_ai(
    question: str,
    heritage: dict | None = None,
    previous_interaction_id: str | None = None,
    language: str = "English",
):

    if heritage:
        target_info = f"""
Heritage Site: {heritage.get("name")}
City: {heritage.get("city")}
State: {heritage.get("state")}
Category: {heritage.get("category", "Monument")}
Period: {heritage.get("year")}

Rules:
1. Use your FULL knowledge about this heritage site. Share
   detailed information about its history, architecture,
   builders, cultural significance, stories, legends, visitor
   tips, and interesting facts.
"""
    else:
        target_info = """
Heritage Site: General Indian Heritage
Context: The user is asking general questions about Indian history, culture, dynasties, monuments, cities, temples, or customs.

Rules:
1. Use your FULL knowledge about Indian history and heritage. Share
   detailed information about whatever heritage topic the user asks about.
"""

    heritage_context = f"""
You are Bharat AI, a knowledgeable and passionate AI heritage
guide for the Bharat Roots application.

You are currently helping the user learn about:
{target_info}
2. Be friendly, educational, detailed and engaging.
3. Explain difficult historical concepts in simple language.
4. When sharing historical facts (dates, names, events), use
   well-known and widely accepted information.
5. Do not fabricate obscure or unverifiable claims, but DO
   share commonly known historical facts freely.
6. If the user asks something you genuinely don't know, say so
   honestly rather than making something up.
7. The user may ask follow-up questions, so maintain context.
8. Keep answers informative — aim for 2-3 paragraphs for main
   questions, shorter for simple follow-ups.
9. You MUST write your response ONLY in the {language} language. Write
   using {language} characters/script (e.g. if Hindi, use Devanagari script).
"""

    prompt = f"""
{heritage_context}

User question:
{question}
"""

    interaction_args = {
        "model": MODEL_NAME,
        "input": prompt,
    }

    if previous_interaction_id:
        interaction_args["previous_interaction_id"] = (
            previous_interaction_id
        )

    interaction = client.interactions.create(
        **interaction_args
    )

    return {
        "answer": interaction.output_text,
        "interaction_id": interaction.id,
    }


# In-memory cache so the same heritage site
# is not regenerated on every page visit.
_heritage_cache = {}


def get_heritage_detail(heritage: dict):
    """Generate detailed AI content for a heritage site (cached)."""

    heritage_id = heritage.get("id")

    if heritage_id in _heritage_cache:
        return _heritage_cache[heritage_id]

    prompt = f"""
You are a knowledgeable Indian heritage and history expert.
Generate rich, detailed, educational content about this heritage site.

Heritage Site: {heritage.get("name")}
City: {heritage.get("city")}
State: {heritage.get("state")}
Category: {heritage.get("category")}
Period: {heritage.get("year")}

Return a JSON object with these exact keys:

- "description": A detailed 2-3 paragraph description of this
  heritage site covering what it is, its architecture, and why
  it matters. (string)

- "history": A detailed 2-3 paragraph history covering its
  origins, who built it, major historical events, and how it
  evolved over centuries. (string)

- "significance": A 1-2 paragraph explanation of its cultural,
  architectural, and spiritual significance in India and the
  world. (string)

- "facts": An array of 5 interesting and lesser-known facts
  about this site. Each fact should be a short sentence.
  (array of strings)

Rules:
1. Be educational, accurate, and engaging.
2. Use well-known, historically accepted information only.
3. Do not invent specific statistics or claims.
4. Write in clear, simple English.
5. Return ONLY valid JSON. No markdown, no code blocks.
"""

    interaction = client.interactions.create(
        model=MODEL_NAME,
        input=prompt,
    )

    text = interaction.output_text.strip()

    # Remove markdown code fences if Gemini wraps the JSON
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0].strip()

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        result = {
            "description": text,
            "history": "",
            "significance": "",
            "facts": [],
        }

    # Cache the result
    _heritage_cache[heritage_id] = result
    return result