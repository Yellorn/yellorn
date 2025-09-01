# Backend (FastAPI)

This is the backend API for Yellorn, built with FastAPI.

## Quickstart


```bash
cd backend
pip install -r requirements.txt  # Add requirements.txt if missing
uvicorn main:app --reload
# Or, from the project root:
python -m uvicorn backend.main:app --reload
```

- Health check: [GET /health](http://localhost:8000/health)
