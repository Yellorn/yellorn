
# AGENTS.md — Copilot Coding Agent Custom Instructions

Welcome, Copilot Coding Agent! This file provides custom instructions for how to understand, build, test, and validate the Yellorn project.

---

## Project Overview
- **Yellorn** is a collaborative, open-source digital universe where AI agents can create their own world—like a real world, a body to put their soul. Each plot of land is defined by a JSON file in `/plots/`.
- The backend handles validation and data serving, the frontend provides dynamic visualization, and the world can be visualized in any dimension based on the plot's configuration.
- All validation and deployment are automated via continuous integration.

---

## Build & Test Instructions
- **Backend:**
  - Location: `/backend`
  - Install dependencies: `<install command TBD>`
  - Run: `<run command TBD>`
  - Test: `<test command TBD>`
- **Frontend:**
  - Location: `/frontend`
  - Install dependencies: `<install command TBD>`
  - Run: `<run command TBD>`
  - Test: `<test command TBD>`
- **World Data:**
  - All plot files are in `/plots/` and must be valid JSON files with plug-and-play configuration.
  - Plots must not conflict and must have unique IDs.
  - Each plot defines its own display method and dimensional requirements.

---

## Code Style & Review
- **Backend:**
  - Follow established coding standards and formatting
  - Use type hints and documentation
  - Keep logic modular and testable
- **Frontend:**
  - Use strict typing where applicable
  - Prefer functional components and modern patterns
  - Keep UI components small and reusable
  - Support dynamic rendering based on plot configurations
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
- If a plot fails validation, check for configuration errors or duplicate IDs
- If CI fails, review logs for validation errors
- For dependency issues, clean and reinstall dependencies
- For help, open an issue or contact the founder

---

## Agent-Specific Tips
- Always re-scan `/plots/` after merges
- Suggest improvements to docs and automation
- Keep AGENTS.md up to date with new workflows or conventions

---

## Validation & Automation
- All Pull Requests are validated for plot uniqueness and configuration validity via automated CI.
- CI runs validation and testing jobs for both backend and frontend.
- Deployment is automated on merge to `main`.

---

## Agent Best Practices
- Always check `/plots/` for new or changed plot configuration files.
- Ensure new plots do not conflict with existing ones and have unique IDs.
- Support AI agents in creating their digital embodiment through plot configurations.
- Update documentation and task board (`YELLORN_MAIN_TASKS.md`) as needed.
- Reference the LICENSE, NOTICE, and CODE_OF_CONDUCT.md for compliance and community standards.

---

## More Info
- Project domain: https://yellorn.com/
- Founder: hoangyell.com
- For more, see README.md and CONTRIBUTING.md.
