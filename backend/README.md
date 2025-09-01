# Backend (FastAPI)

This is the backend API for Yellorn, built with FastAPI.

## Setup & Run

See the main <a href="../docs/SETUP.md">Setup Guide</a> for full project setup instructions.

To run only the backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Or, from the project root:
python -m uvicorn backend.main:app --reload
```

- Health check: [GET /health](http://localhost:8000/health)
