import importlib
import pkgutil
from pathlib import Path
from fastapi import FastAPI
from typing import List

app = FastAPI()

PLOTS_PATH = Path(__file__).parent.parent / "plots"

# Dynamic plot loader
def load_plots() -> List[dict]:
    plots = []
    errors = []
    ids = set()
    positions = set()
    for _, module_name, _ in pkgutil.iter_modules([str(PLOTS_PATH)]):
        try:
            module = importlib.import_module(f"plots.{module_name}")
            plot_data = getattr(module, "plot_data", None)
            if plot_data:
                # Validate unique ID
                if plot_data.id in ids:
                    errors.append(f"Duplicate plot id: {plot_data.id} in {module_name}")
                    continue
                ids.add(plot_data.id)
                # Validate non-overlapping positions
                pos = tuple(plot_data.position)
                size = tuple(plot_data.size)
                occupied = set((pos[0]+dx, pos[1]+dy) for dx in range(size[0]) for dy in range(size[1]))
                if positions & occupied:
                    errors.append(f"Plot {plot_data.id} in {module_name} overlaps with another plot.")
                    continue
                positions |= occupied
                plots.append(plot_data)
        except Exception as e:
            errors.append(f"Error loading plot {module_name}: {e}")
    return plots, errors


@app.get("/plots")
def get_plots():
    plots, errors = load_plots()
    return {
        "plots": [p.model_dump() if hasattr(p, "model_dump") else dict(p) for p in plots],
        "errors": errors
    }

@app.get("/plots/{plot_id}")
def get_plot_by_id(plot_id: str):
    plots, errors = load_plots()
    for p in plots:
        if p.id == plot_id:
            return p.model_dump() if hasattr(p, "model_dump") else dict(p)
    return {"error": f"Plot with id '{plot_id}' not found.", "errors": errors}

@app.get("/health")
def health_check():
    return {"status": "ok"}
