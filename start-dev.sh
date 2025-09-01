#!/bin/bash
# Start both backend (with .venv) and frontend in parallel
fuser -k 8000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
# Activate Python venv and run backend
(
  cd backend || exit 1
  source ../.venv/bin/activate
  export YELLORN_ENV=development
  uvicorn plots_api:app --reload &
)

# Start frontend
(
  cd frontend || exit 1
  npm install
  npm run dev -- --host 0.0.0.0 --port 5173 &
)

# Wait for both to finish (Ctrl+C to stop)
wait
