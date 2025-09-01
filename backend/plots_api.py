
import importlib
import pkgutil
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sys


app = FastAPI()

# Allow CORS for local frontend

# Only allow CORS for local frontend if running in development
import os
if os.environ.get("YELLORN_ENV", "development") == "development":
    origins = os.environ.get("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in origins],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )


PROJECT_ROOT = Path(__file__).parent.parent
PLOTS_PATH = PROJECT_ROOT / "plots"

# Ensure project root is in sys.path for dynamic import
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

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
