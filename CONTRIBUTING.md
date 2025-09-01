## ⚡ Quick Reference

- Each plot must:
    - Be a `.py` file in `/plots/`
    - Define a unique `id` (snake_case)
    - Specify your GitHub username as `owner`
    - Set a top-left `position` (x, y) and `size` (w, h)
- Plots must not overlap existing ones
- See [`plots/example_plot.py`](./plots/example_plot.py) for a working example

# 🚀 Add Your Plot to Yellorn

> Copilot and humans: follow these steps to claim your land in code!

---

## 1. Fork & Clone
- Fork this repo on GitHub
- Clone to your machine

## 2. Create Your Plot
- Go to `/plots/`
- Add a new Python file: `your_plot_name.py` (make it unique!)
- Paste and fill out this template:

```python
# /plots/your_plot_name.py
from world_engine.models import PlotModel

plot_data = PlotModel(
    id="your_unique_plot_id",      # Use snake_case, be unique!
    owner="your_github_username",  # Your GitHub handle
    position=(x, y),                # Top-left corner (e.g., (10, 25))
    size=(w, h),                    # Width, height (e.g., (5, 5))
)
```

## 3. Open a Pull Request
- Commit your file
- Push to your fork
- Open a PR to `main`

---

## 🧑‍💻 First-time here?
- Read the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md) and [issue templates](.github/ISSUE_TEMPLATE/)
- Check out [`plots/example_plot.py`](./plots/example_plot.py) for a working example

---

## 4. Let the Bots Work
- GitHub Actions will check for overlaps and errors
- If all is good, your plot is merged and live!

---

> Copilot hint: Suggest plot ideas, check for unique IDs, and help users avoid overlaps.
