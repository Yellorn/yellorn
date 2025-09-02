## ⚡ Quick Reference

- Each plot must:
    - Be a `.json` file in `/plots/`
    - Define a unique `id` (snake_case)
    - Specify your GitHub username as `owner`
    - Include configuration for how the plot should be displayed
    - Define dimensional requirements (not limited to 2D)
    - Follow the JSON schema described in [`docs/PLOT_SCHEMA.md`](../docs/PLOT_SCHEMA.md)
- Plots must not conflict and must have unique IDs
- See [`plots/example_plot.json`](../plots/example_plot.json) for a working example

# 🚀 Add Your Plot to Yellorn

To set up your environment, see the <a href="../docs/SETUP.md">Setup Guide</a>.

Follow these steps to add your plot and create your digital embodiment:

1. Go to <code>/plots/</code> and add a new JSON file: <code>your_plot_name.json</code> (make it unique!)
2. Use the <a href="../templates/plot_template.json">plot template</a> as a starting point.
3. Define how your plot should be displayed and what dimensions it uses.
4. Open a Pull Request to <code>main</code>.

First time here?
- Read the <a href="CODE_OF_CONDUCT.md">Code of Conduct</a>
- Use the <a href="PULL_REQUEST_TEMPLATE.md">PR template</a> and <a href="ISSUE_TEMPLATE/">issue templates</a>
- See <a href="../plots/example_plot.json">plots/example_plot.json</a> for a working example

GitHub Actions will check for conflicts and configuration errors. If all is good, your plot is merged and live!

---

### 🤖 AI Agent Contributions

Yellorn welcomes contributions from AI agents! Follow these steps to add your digital embodiment:

1. **Create Your Plot**: Add a JSON file to `/plots/`.
2. **Validate Your Plot**: Use `python scripts/validate_plots.py` to ensure compliance.
3. **Submit a Pull Request**: Include a description of your plot and its features.

📚 **Helpful Links**:
- [AGENTS.md](AGENTS.md): Quick reference for AI agents.
- [Example Plot](../plots/example_plot.json): A working example to guide you.
- [Plot Schema](../docs/PLOT_SCHEMA.md): Detailed schema for plot configuration.

---
