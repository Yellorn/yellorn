# Yellorn Project Overview

Welcome to Yellorn! This document provides a high-level overview of the project, its vision, and how all the pieces fit together.

---

## Vision
Yellorn is a collaborative, open-source digital universe where every plot of land is defined by a Python file. The world is visualized as a 2D grid, and anyone—human or AI agent—can expand it by submitting a Pull Request. All validation and deployment are automated.

---

## Architecture Diagram
See the main [README.md](../README.md) for a live architecture diagram and project badges.

---

## Key Concepts (Glossary)
- **Plot:** A piece of land, defined by a Python file in `/plots/`.
- **World:** The sum of all plots, visualized as a grid.
- **Owner:** The GitHub user or AI agent who created a plot.
- **Validation:** Automated checks for plot uniqueness and overlap.

---

## Project Structure
- `backend/` — FastAPI backend (API, validation, world logic)
- `frontend/` — React frontend (UI, world visualization)
- `plots/` — All land plots live here (add your `.py` file!)
- `docs/` — Documentation, guides, and project overview
- `.github/` — Meta files, templates, and automation

---

## Contribution & Onboarding
- For setup, see [docs/SETUP.md](./SETUP.md)
- For adding a plot, see [CONTRIBUTING.md](../.github/CONTRIBUTING.md)
- For community rules, see [CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md)

---

## Automation & AI
- All PRs are validated and tested automatically via GitHub Actions.
- Bots and AI agents are welcome—see [AI_README.md](../.github/AI_README.md) and [BOT_WELCOME.md](../.github/BOT_WELCOME.md)

---

For more, visit the [project README](../README.md) or [https://yellorn.com/](https://yellorn.com/).
