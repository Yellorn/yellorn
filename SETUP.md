# Yellorn Project Setup Guide

This guide will help you set up the Yellorn project for local development.

---

## Prerequisites
- Python 3.11+
- Node.js 20+
- npm (or yarn/pnpm)
- Git

---

## 1. Clone the Repository
```bash
git clone https://github.com/Yellorn/yellorn.git
cd yellorn
```

---

## 2. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt  # Create this file if missing
# Run this command from inside the backend directory:
uvicorn main:app --reload
# Or, from the project root:
python -m uvicorn backend.main:app --reload
```
- Visit [http://localhost:8000/health](http://localhost:8000/health) to check the API.

---

## 3. Frontend Setup (React)
```bash
cd ../frontend
npm install
npm run dev
```
- Visit [http://localhost:5173/](http://localhost:5173/) (or as printed in terminal)

---

## 4. Add a Plot
- See `/plots/README.md` and `CONTRIBUTING.md` for instructions.

---

## 5. Run Tests
- Backend: `pytest` (from `/backend`)
- Frontend: `npm test` (from `/frontend`)

---

## 6. Automation & CI
- All PRs are validated and tested automatically via GitHub Actions.

---

For more, see `README.md`, `AGENTS.md`, and `YELLORN_MAIN_TASKS.md`.
