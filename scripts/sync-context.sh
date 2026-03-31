#!/usr/bin/env bash
# Sync projects-manifest.json and skills-manifest.json from root context/
# to frontend/context/ and backend/context/
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/context"

for file in projects-manifest.json skills-manifest.json; do
  cp "$SRC/$file" "$ROOT/frontend/context/$file"
  cp "$SRC/$file" "$ROOT/backend/context/$file"
  echo "synced: $file"
done

echo "Done. Run 'python scripts/seed-rag.py' to update chatbot."
