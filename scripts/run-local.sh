#!/usr/bin/env bash
set -euo pipefail

# Local dev helper: clean ignored files, regenerate assets, start dev server

cd "$(dirname "$0")/.."

clean_preview=$(git clean -fdXn)
if [[ -n "$clean_preview" ]]; then
  echo "The following ignored files/folders will be deleted:" >&2
  echo "$clean_preview" >&2
  read -p "Proceed with deletion? (yes/no): " confirm
  if [[ "$confirm" != "yes" ]]; then
    echo "Cancelled. Nothing deleted." >&2
    exit 1
  fi
  git clean -fdX
  echo "Ignored files removed." >&2
else
  echo "No ignored files to delete." >&2
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..." >&2
  npm install
fi

echo "Starting dev server (npm run dev)..." >&2
npm run dev
