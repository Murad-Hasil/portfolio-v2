import os
from typing import cast

_fastembed_model = None


def get_embedding(text: str) -> list[float]:
    """Generate an embedding vector for the given text.

    Uses fastembed (BAAI/bge-small-en-v1.5, 384 dims) by default.
    Set EMBEDDING_PROVIDER=openai to use text-embedding-3-small (1536 dims).

    Note: switching providers requires rebuilding the Qdrant collection
    because vector dimensions differ (384 vs 1536).
    """
    provider = os.getenv("EMBEDDING_PROVIDER", "fastembed").lower()

    if provider == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        model = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
        response = client.embeddings.create(input=[text], model=model)
        return response.data[0].embedding

    # fastembed (default)
    global _fastembed_model
    if _fastembed_model is None:
        from fastembed import TextEmbedding

        model_name = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
        _fastembed_model = TextEmbedding(model_name=model_name)

    embeddings = list(_fastembed_model.embed([text]))
    return cast(list[float], embeddings[0].tolist())
