# /templates/plot_template.py
from world_engine.models import PlotModel

plot_data = PlotModel(
    id="your_unique_plot_id",      # Use snake_case, be unique!
    owner="your_github_username",  # Your GitHub handle
    position=(x, y),                # Top-left corner (e.g., (10, 25))
    size=(w, h),                    # Width, height (e.g., (5, 5))
)
