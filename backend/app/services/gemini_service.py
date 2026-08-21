import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Find backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print("GenAI Client init warning:", e)

# Models to try in priority order
MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.6-flash"]

_heritage_cache = {}


def ask_bharat_ai(
    question: str,
    heritage: dict | None = None,
    previous_interaction_id: str | None = None,
    language: str = "English",
):
    """Ask Bharat AI guide question with model failover and robust fallback response."""
    site_name = heritage.get("name") if heritage else "General Indian Heritage"
    
    if heritage:
        target_info = f"""
Heritage Site: {heritage.get("name")}
City: {heritage.get("city")}
State: {heritage.get("state")}
Category: {heritage.get("category", "Monument")}
Period: {heritage.get("year")}

Rules:
1. Use your FULL knowledge about this heritage site. Share detailed information about its history, architecture, builders, cultural significance, stories, legends, and interesting facts.
"""
    else:
        target_info = """
Heritage Site: General Indian Heritage
Context: The user is asking general questions about Indian history, culture, dynasties, monuments, cities, temples, or customs.
"""

    heritage_context = f"""
You are Bharat AI, a knowledgeable and passionate AI heritage guide for the Bharat Roots application.
You are currently helping the user learn about:
{target_info}
2. Be friendly, educational, detailed and engaging.
3. Explain historical concepts in clear language.
4. Maintain context and provide informative 2-3 paragraph answers.
5. You MUST write your response ONLY in the {language} language. Write using {language} characters/script (e.g. if Hindi, use Devanagari script).
"""

    prompt = f"{heritage_context}\n\nUser question: {question}"

    # Try calling Gemini models if client is initialized
    if client:
        for model in MODELS:
            try:
                # First try client.interactions if available
                try:
                    args = {"model": model, "input": prompt}
                    if previous_interaction_id:
                        args["previous_interaction_id"] = previous_interaction_id
                    interaction = client.interactions.create(**args)
                    return {
                        "answer": interaction.output_text,
                        "interaction_id": interaction.id,
                    }
                except Exception:
                    # Fallback to standard generate_content
                    response = client.models.generate_content(
                        model=model,
                        contents=prompt,
                    )
                    if response and response.text:
                        return {
                            "answer": response.text,
                            "interaction_id": None,
                        }
            except Exception as err:
                print(f"Model {model} failed with error: {err}")
                continue

    # Fallback offline response if API rate limits out or key is missing
    fallback_text = (
        f"**{site_name}** is a treasured part of India's rich cultural heritage.\n\n"
        f"{heritage.get('description', '') if heritage else 'India is home to thousands of years of art, architecture, and living culture.'}\n\n"
        f"*(Note: Currently serving cached heritage knowledge. Feel free to ask more about its history and significance!)*"
    )
    
    if heritage and heritage.get("facts"):
        facts_list = "\n".join([f"• {fact}" for fact in heritage.get("facts", [])[:3]])
        fallback_text += f"\n\n**Quick Facts:**\n{facts_list}"

    return {
        "answer": fallback_text,
        "interaction_id": None,
    }


def get_heritage_detail(heritage: dict):
    """Generate detailed content for a heritage site with static fallback."""
    heritage_id = heritage.get("id")

    if heritage_id in _heritage_cache:
        return _heritage_cache[heritage_id]

    # Check if pre-filled static detailed content exists in heritage dict
    static_fallback = {
        "description": heritage.get("description", f"{heritage.get('name')} is a historic landmark located in {heritage.get('city')}, {heritage.get('state')}."),
        "history": heritage.get("history", f"Built around {heritage.get('year')}, {heritage.get('name')} represents an important era of Indian history and craftsmanship."),
        "significance": heritage.get("significance", f"Recognized for its immense architectural and cultural value, {heritage.get('name')} attracts visitors from all over the world."),
        "facts": heritage.get("facts", [
            f"Located in {heritage.get('city')}, {heritage.get('state')}.",
            f"Constructed in the era of {heritage.get('year')}.",
            f"Categorized as a landmark {heritage.get('category')}.",
            "Stands as a key component of India's preserved cultural heritage.",
            "Features distinct regional craftsmanship and artistic influence."
        ]),
    }

    if not client:
        _heritage_cache[heritage_id] = static_fallback
        return static_fallback

    prompt = f"""
You are a knowledgeable Indian heritage and history expert.
Generate rich, detailed, educational content about this heritage site.

Heritage Site: {heritage.get("name")}
City: {heritage.get("city")}
State: {heritage.get("state")}
Category: {heritage.get("category")}
Period: {heritage.get("year")}

Return a JSON object with these exact keys:
- "description": A detailed 2-3 paragraph description (string).
- "history": A detailed 2-3 paragraph history (string).
- "significance": A 1-2 paragraph explanation of cultural significance (string).
- "facts": An array of 5 interesting facts (array of strings).

Return ONLY valid JSON.
"""

    for model in MODELS:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
            )
            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                text = text.rsplit("```", 1)[0].strip()

            result = json.loads(text)
            _heritage_cache[heritage_id] = result
            return result
        except Exception as err:
            print(f"get_heritage_detail model {model} failed: {err}")
            continue

    # Fallback if AI quota exceeded
    _heritage_cache[heritage_id] = static_fallback
    return static_fallback