#!/usr/bin/env python3
"""seed-rag.py — Seed the Qdrant 'portfolio-knowledge' collection.

Reads every .md file from context/rag-knowledge-base/, splits each into
overlapping word-count chunks (~500 words / ~50-word overlap), generates
embeddings via backend/app/providers/embeddings.py, and upserts all points
into Qdrant.

Usage (from repo root, with backend venv active or via its python):
    EMBEDDING_PROVIDER=fastembed python scripts/seed-rag.py
    EMBEDDING_PROVIDER=openai   python scripts/seed-rag.py

Environment (reads from backend/.env automatically):
    QDRANT_URL          Qdrant cluster URL
    QDRANT_API_KEY      Qdrant API key
    EMBEDDING_PROVIDER  fastembed (default) | openai
    EMBEDDING_MODEL     BAAI/bge-small-en-v1.5 (default for fastembed)
    OPENAI_API_KEY      Required when EMBEDDING_PROVIDER=openai
"""

import os
import sys
import uuid
from pathlib import Path

# ── Path bootstrap ────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent.resolve()
BACKEND_DIR = REPO_ROOT / "backend"
KB_DIR = REPO_ROOT / "context" / "rag-knowledge-base"

# Add backend to sys.path so we can import app.providers.*
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(BACKEND_DIR / ".env")

from qdrant_client import QdrantClient  # noqa: E402
from qdrant_client.models import Distance, PointStruct, VectorParams  # noqa: E402

from app.providers.embeddings import get_embedding  # noqa: E402

# ── Constants ─────────────────────────────────────────────────────────────────
COLLECTION_NAME = "portfolio-knowledge"

# Word-count proxies for token targets (1 word ≈ 1.3 tokens on average)
#   500 tokens ≈ 385 words   →  using 375 for a safe margin
#    50 tokens ≈  38 words   →  using 40 for clean overlap
CHUNK_WORDS = 375
OVERLAP_WORDS = 40

_VECTOR_SIZE = {"fastembed": 384, "openai": 1536}


# ── Chunking ──────────────────────────────────────────────────────────────────

def chunk_text(text: str) -> list[str]:
    """Split *text* into overlapping word-count-based chunks.

    Each chunk is approximately CHUNK_WORDS words; consecutive chunks share
    OVERLAP_WORDS words at the boundary so context is not lost at seams.
    """
    words = text.split()
    if not words:
        return []

    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = min(start + CHUNK_WORDS, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start += CHUNK_WORDS - OVERLAP_WORDS

    return chunks


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    provider = os.getenv("EMBEDDING_PROVIDER", "fastembed").lower()
    vector_size = _VECTOR_SIZE.get(provider, 384)

    if not qdrant_url:
        print("ERROR: QDRANT_URL not set. Add it to backend/.env or export it.")
        sys.exit(1)

    print("=" * 60)
    print("  RAG Knowledge Base Seeder")
    print("=" * 60)
    print(f"  Embedding provider : {provider}")
    print(f"  Vector size        : {vector_size}")
    print(f"  Qdrant URL         : {qdrant_url}")
    print(f"  Collection         : {COLLECTION_NAME}")
    print(f"  KB directory       : {KB_DIR}")
    print("=" * 60)
    print()

    # ── Connect ───────────────────────────────────────────────────────────────
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    print("Connected to Qdrant.")

    # ── Recreate collection (delete-then-create, recreate_collection deprecated) ──
    existing_names = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME in existing_names:
        print(f"Deleting existing collection '{COLLECTION_NAME}' ...")
        client.delete_collection(COLLECTION_NAME)

    print(f"Creating collection '{COLLECTION_NAME}' (size={vector_size}, COSINE) ...")
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )

    # ── Discover .md files ────────────────────────────────────────────────────
    md_files = sorted(KB_DIR.glob("*.md"))
    if not md_files:
        print(f"ERROR: No .md files found in {KB_DIR}")
        sys.exit(1)

    print(f"\nFound {len(md_files)} knowledge base file(s):")
    for f in md_files:
        print(f"  {f.name}")

    # ── Chunk, embed, collect ─────────────────────────────────────────────────
    all_points: list[PointStruct] = []
    global_chunk_idx = 0

    for md_file in md_files:
        raw = md_file.read_text(encoding="utf-8")
        chunks = chunk_text(raw)

        print(f"\n[{md_file.name}] → {len(chunks)} chunk(s)")

        for local_idx, chunk in enumerate(chunks):
            word_count = len(chunk.split())
            print(
                f"  [{local_idx + 1}/{len(chunks)}] {word_count} words → embedding ...",
                end=" ",
                flush=True,
            )

            vector = get_embedding(chunk)

            all_points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload={
                        "text": chunk,
                        "source": md_file.name,
                        "chunk_index": global_chunk_idx,
                        "embedding_provider": provider,
                    },
                )
            )
            global_chunk_idx += 1
            print("done")

    # ── Upsert ────────────────────────────────────────────────────────────────
    print(f"\nUpserting {len(all_points)} vectors to Qdrant ...", end=" ", flush=True)
    client.upsert(collection_name=COLLECTION_NAME, points=all_points)
    print("done")

    # ── Verify ────────────────────────────────────────────────────────────────
    info = client.get_collection(COLLECTION_NAME)
    confirmed = info.points_count

    print()
    print("=" * 60)
    print(f"  ✓ Seeding complete!")
    print(f"  Collection : {COLLECTION_NAME}")
    print(f"  Vectors    : {confirmed}")
    print(f"  Provider   : {provider}  (dim={vector_size})")
    print("=" * 60)


if __name__ == "__main__":
    main()
