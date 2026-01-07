#!/usr/bin/env bash
set -euo pipefail

# Local dev helper: optionally clean ignored files, then start dev server

cd "$(dirname "$0")/.."

mode="${1:-}"
if [[ -n "$mode" && "$mode" != "c" ]]; then
  echo "Usage: bash ./scripts/run-local.sh [c]" >&2
  echo "  (no args) : start dev server without deleting git-ignored files" >&2
  echo "  c         : delete git-ignored files first, then start dev server" >&2
  exit 2
fi

if [[ "$mode" == "c" ]]; then
  echo "Cleaning git-ignored files (git clean -fdX)..." >&2
  git clean -fdX
else
  echo "Skipping deletion of git-ignored files." >&2
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..." >&2
  npm install
fi

echo "Starting dev server (npm run dev)..." >&2
npm run dev
