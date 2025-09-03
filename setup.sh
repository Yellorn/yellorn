#!/usr/bin/env bash
# Yellorn Project Setup Script
# This script sets up the backend and frontend for local development.
# Usage: bash setup.sh

set -e

# Backend setup
if [ -d "backend" ]; then
  echo "[Backend] Setting up Python virtual environment..."
  cd backend
  if [ ! -d ".venv" ]; then
    python3 -m venv .venv
  fi
  source .venv/bin/activate
  echo "[Backend] Installing Python dependencies..."
  pip install --upgrade pip
  pip install -r requirements.txt
  deactivate
  cd ..
else
  echo "[Backend] Directory not found, skipping backend setup."
fi

# Frontend setup
if [ -d "frontend" ]; then
  echo "[Frontend] Installing Node.js dependencies..."
  cd frontend
  if [ -f "package.json" ]; then
    npm install
  else
    echo "[Frontend] package.json not found, skipping npm install."
  fi
  cd ..
else
  echo "[Frontend] Directory not found, skipping frontend setup."
fi

echo "\n✅ Yellorn setup complete!"
echo "- To start backend: cd backend && source .venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo "- To start frontend: cd frontend && npm run dev"
