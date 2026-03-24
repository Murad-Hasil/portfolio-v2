import os

from groq import AsyncGroq
from openai import AsyncOpenAI


def get_llm_client() -> AsyncGroq | AsyncOpenAI:
    """Return an async LLM client based on LLM_PROVIDER env var.

    Defaults to Groq (free tier, fast).
    Set LLM_PROVIDER=openai to use OpenAI GPT-4o-mini.
    """
    provider = os.getenv("LLM_PROVIDER", "groq").lower()
    if provider == "openai":
        return AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))


def get_llm_model() -> str:
    """Return the model name for the active provider."""
    provider = os.getenv("LLM_PROVIDER", "groq").lower()
    if provider == "openai":
        return os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    return os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
