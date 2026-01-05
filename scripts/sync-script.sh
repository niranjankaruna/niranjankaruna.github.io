#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo " Sync client repo -> personal repo "
echo "========================================"
echo

# ---- CONFIG ----
CLIENT_REMOTE_NAME="origin"  # daily work remote
PERSONAL_REMOTE_NAME="personal"

CLIENT_REPO_URL="https://github.com/decor-rentals-ireland/decor-rentals.github.io.git"
PERSONAL_REPO_URL="https://github.com/niranjankaruna/niranjankaruna.github.io.git"

MAIN_BRANCH="main"
# ----------------

echo "📌 Ensuring we are inside a Git repository..."
git rev-parse --is-inside-work-tree >/dev/null 2>&1
echo "✅ Git repository detected."
echo

echo "🔍 Current remotes:"
git remote -v
echo

# Ensure origin points to the CLIENT repo
echo "🔧 Ensuring '${CLIENT_REMOTE_NAME}' points to CLIENT repo..."
git remote set-url "${CLIENT_REMOTE_NAME}" "${CLIENT_REPO_URL}"
echo "✅ ${CLIENT_REMOTE_NAME} set to ${CLIENT_REPO_URL}"
echo

# Ensure personal remote exists and points to PERSONAL repo
if git remote | grep -qx "${PERSONAL_REMOTE_NAME}"; then
  echo "✅ Remote '${PERSONAL_REMOTE_NAME}' already exists."
  echo "🔧 Ensuring '${PERSONAL_REMOTE_NAME}' points to PERSONAL repo..."
  git remote set-url "${PERSONAL_REMOTE_NAME}" "${PERSONAL_REPO_URL}"
else
  echo "➕ Adding remote '${PERSONAL_REMOTE_NAME}' for PERSONAL repo..."
  git remote add "${PERSONAL_REMOTE_NAME}" "${PERSONAL_REPO_URL}"
fi
echo "✅ ${PERSONAL_REMOTE_NAME} set to ${PERSONAL_REPO_URL}"
echo

# Safety: don't sync if there are uncommitted changes
echo "🧹 Checking for uncommitted changes..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ You have uncommitted changes."
  echo "   Please commit or stash before running this sync script."
  exit 1
fi
echo "✅ Working tree clean."
echo

# Fetch and fast-forward local main from client
echo "⬇️  Fetching latest from CLIENT (${CLIENT_REMOTE_NAME})..."
git fetch "${CLIENT_REMOTE_NAME}"
echo "✅ Fetch complete."
echo

echo "🔀 Checking out '${MAIN_BRANCH}'..."
git checkout "${MAIN_BRANCH}"
echo

echo "🔄 Updating local '${MAIN_BRANCH}' from ${CLIENT_REMOTE_NAME}/${MAIN_BRANCH}..."
# Prefer fast-forward only to avoid creating merge commits in your sync routine
git merge --ff-only "${CLIENT_REMOTE_NAME}/${MAIN_BRANCH}"
echo "✅ Local '${MAIN_BRANCH}' is now up to date with client."
echo

# Push same main to personal repo
echo "⬆️  Syncing '${MAIN_BRANCH}' to PERSONAL repo (${PERSONAL_REMOTE_NAME})..."
git push "${PERSONAL_REMOTE_NAME}" "${MAIN_BRANCH}"
echo "✅ Personal repo updated."
echo

echo "========================================"
echo " Sync completed successfully ✅"
echo "========================================"
echo
echo "Notes:"
echo "- Your daily 'git push' continues to push to the CLIENT repo (origin)."
echo "- This script only updates your PERSONAL repo when you run it."
