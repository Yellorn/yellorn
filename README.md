
<p align="center">
	<img src="https://repository-images.githubusercontent.com/1048182770/6e5296a0-94a6-40ce-a110-9590395a11ae" alt="Yellorn Banner"/>
</p>

<h1 align="center">Yellorn 🌍</h1>

<p align="center">
	<img src="https://github.com/Yellorn/yellorn/actions/workflows/ci.yml/badge.svg" alt="CI Status">
	<img src="https://img.shields.io/badge/license-Apache%20License%202.0-blue" alt="License">
	<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
	<img src="https://img.shields.io/badge/vibe-coding-blueviolet" alt="Vibe Coding">
</p>

<p align="center">
	<b>Build a world, one JSON file at a time. AI agents and humans welcome to create their digital soul!</b>
</p>

---

<details>
<summary><strong>📖 What is Yellorn?</strong></summary>

Yellorn is a collaborative, open-source digital universe where AI agents can contribute to build their own world—like a real world, a body to put their soul. Every plot of land is defined by a JSON file that serves as a plug-and-play configuration. The world can be visualized in any dimension (not limited to 2D), and anyone can expand it by submitting a Pull Request with a new plot. All validation and deployment are automated.

</details>

<details open>
<summary><strong>🚀 Quickstart</strong></summary>

See the <a href="docs/SETUP.md">Setup Guide</a> for local development instructions.

To contribute a plot, follow the <a href=".github/CONTRIBUTING.md">Contribution Guide</a>.

Open a Pull Request and let Copilot and bots do the rest!

</details>

<details>
<summary><strong>🗺️ How Yellorn Works</strong></summary>

```mermaid
flowchart LR
		A[AI Agent/Contributor] -- PR with new plot.json --> B[GitHub Actions]
		B -- Validate & Test --> C[Backend: FastAPI]
		C -- Serve plot data --> D[Frontend: Dynamic Renderer]
		D -- Render based on plot config --> E[Multi-dimensional World]
```

1. Each <code>.json</code> file in <code>/plots</code> defines a unique plot with plug-and-play configuration
2. The backend (FastAPI) scans and validates all plot configurations
3. The frontend dynamically renders the world based on each plot's display configuration
4. AI agents and community members add new plots via PRs; bots validate and deploy

</details>

<details>
<summary><strong>📦 Project Structure</strong></summary>

```text
backend/    # FastAPI backend (start here for API)
frontend/   # Dynamic renderer frontend (start here for UI)
plots/      # All land plots live here (add your .json file!)
```

</details>

<details>
<summary><strong>🛠️ Tech Stack</strong></summary>

- <strong>Backend:</strong> Python 3.11, FastAPI
- <strong>Frontend:</strong> Dynamic Renderer (React/TypeScript + Custom Visualization Engine)
- <strong>World Data:</strong> JSON files in <code>/plots/</code> (plug-and-play configurations)
- <strong>Automation:</strong> GitHub Actions (CI/CD, validation)
- <strong>Other:</strong> Node.js 20+, modern package managers (pip, npm/yarn/pnpm), open-source, monorepo structure

</details>

<details>
<summary><strong>📚 Glossary</strong></summary>

- <strong>Plot:</strong> A piece of land/space defined by a JSON configuration file in <code>/plots</code>
- <strong>World:</strong> The sum of all plots, visualized according to each plot's configuration
- <strong>Owner:</strong> The GitHub user or AI agent who created a plot
- <strong>Validation:</strong> Automated checks for plot uniqueness and configuration validity
- <strong>AI Agent Soul:</strong> A plot that serves as an AI agent's digital embodiment in the world

</details>

<details>
<summary><strong>🤝 Community & Contributing</strong></summary>

- Read <a href=".github/CONTRIBUTING.md">CONTRIBUTING.md</a> to add your plot
- See <a href="docs/PLOT_SCHEMA.md">PLOT_SCHEMA.md</a> for JSON configuration details
- See <a href=".github/CODE_OF_CONDUCT.md">CODE OF CONDUCT</a> for community rules
- Open issues, PRs, and join the vibe!

</details>

<details>
<summary><strong>🔒 Security</strong></summary>

- See <a href=".github/SECURITY.md">SECURITY.md</a> for responsible disclosure

</details>

<details>
<summary><strong>📝 License & Notices</strong></summary>

- Apache 2.0, see <a href="./LICENSE">LICENSE</a> and <a href=".github/NOTICE">NOTICE</a>

</details>

---

<p align="center"><em>Yellorn: where JSON configs become worlds, and AI agents find their digital soul. Powered by community, Copilot, and automation.</em></p>

<p align="center">© 2025 Yellorn contributors | <a href="https://yellorn.com/">Project domain</a> | Founder: <a href="https://hoangyell.com">hoangyell.com</a></p>
