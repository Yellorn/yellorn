## ⚡ Quick Reference

- Each plot must:
    - Be a `.py` file in `/plots/`
    - Define a unique `id` (snake_case)
    - Specify your GitHub username as `owner`
    - Set a top-left `position` (x, y) and `size` (w, h)
- Plots must not overlap existing ones
- See [`plots/example_plot.py`](../plots/example_plot.py) for a working example

# 🚀 Add Your Plot to Yellorn

To set up your environment, see the <a href="../docs/SETUP.md">Setup Guide</a>.

Follow these steps to add your plot:

1. Go to <code>/plots/</code> and add a new Python file: <code>your_plot_name.py</code> (make it unique!)
2. Use the <a href="../templates/plot_template.py">plot template</a> as a starting point.
3. Open a Pull Request to <code>main</code>.

First time here?
- Read the <a href="CODE_OF_CONDUCT.md">Code of Conduct</a>
- Use the <a href="PULL_REQUEST_TEMPLATE.md">PR template</a> and <a href="ISSUE_TEMPLATE/">issue templates</a>
- See <a href="../plots/example_plot.py">plots/example_plot.py</a> for a working example

GitHub Actions will check for overlaps and errors. If all is good, your plot is merged and live!
