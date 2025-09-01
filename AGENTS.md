
# AGENTS.md — Copilot Coding Agent Custom Instructions

Welcome, Copilot Coding Agent! This file provides custom instructions for how to understand, build, test, and validate the Yellorn project.

---

## Project Overview
- **Yellorn** is a collaborative, open-source digital universe. Each plot of land is defined by a Python file in `/plots/`.
- The backend is Python/FastAPI, the frontend is React/TypeScript, and the world is visualized as a 2D grid.
- All validation and deployment are automated via GitHub Actions.

---

## Build & Test Instructions
- **Backend:**
  - Location: `/backend`
  - Install dependencies: `pip install -r requirements.txt`
  - Run: `uvicorn main:app --reload`
  - Test: `pytest`
- **Frontend:**
  - Location: `/frontend`
  - Install dependencies: `npm install`
  - Run: `npm run dev`
  - Test: `npm test`
- **World Data:**
  - All plot files are in `/plots/` and must define a `plot_data` variable of type `PlotModel`.
  - Plots must not overlap and must have unique IDs.

---

## Code Style & Review
- **Backend (Python):**
  - Follow PEP8 and Black formatting
  - Use type hints and docstrings
  - Keep logic modular and testable
- **Frontend (TypeScript/React):**
  - Use TypeScript strict mode
  - Prefer functional components and hooks
  - Use single quotes, no semicolons
  - Keep UI components small and reusable
- **General:**
  - Write clear commit messages
  - Reference related issues/PRs in commits and comments
  - Add/Update tests for new features or bugfixes

---

## Collaboration & Review
- Open a draft PR early for feedback
- Use the provided PR template
- Tag reviewers and link related tasks in `YELLORN_MAIN_TASKS.md`
- Review code for clarity, security, and maintainability

---

## Troubleshooting & FAQ
- If a plot fails validation, check for overlapping coordinates or duplicate IDs
- If CI fails, review logs for lint/test/validation errors
- For dependency issues, delete `node_modules`/`venv` and reinstall
- For help, open an issue or contact the founder

---

## Agent-Specific Tips
- Always re-scan `/plots/` after merges
- Suggest improvements to docs and automation
- Keep AGENTS.md up to date with new workflows or conventions

---

## Validation & Automation
- All Pull Requests are validated for plot uniqueness and overlap via GitHub Actions.
- CI runs lint, test, and validation jobs for both backend and frontend.
- Deployment is automated on merge to `main`.

---

## Agent Best Practices
- Always check `/plots/` for new or changed plot files.
- Ensure new plots do not overlap existing ones and have unique IDs.
- Update documentation and task board (`YELLORN_MAIN_TASKS.md`) as needed.
- Reference the LICENSE, NOTICE, and CODE_OF_CONDUCT.md for compliance and community standards.

---

## More Info
- Project domain: https://yellorn.com/
- Founder: hoangyell.com
- For more, see README.md and CONTRIBUTING.md.
