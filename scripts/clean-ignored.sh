#!/bin/bash

# Script to clean files and folders that match .gitignore patterns

echo "🔍 Checking for files and folders matching .gitignore patterns..."
echo ""

# Show what would be deleted
IGNORED=$(git clean -fdXn)

if [ -z "$IGNORED" ]; then
  echo "✅ No ignored files or folders found. Repository is clean!"
  exit 0
fi

echo "The following files and folders will be deleted:"
echo "$IGNORED"
echo ""

# Ask for confirmation
read -p "⚠️  Are you sure you want to delete these? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
  echo ""
  echo "🗑️  Deleting ignored files and folders..."
  git clean -fdX
  echo "✅ Done! Ignored files and folders have been deleted."
else
  echo "❌ Cancelled. Nothing was deleted."
  exit 1
fi
