


import json
import os
import sys
from pathlib import Path
from typing import List, Tuple, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env variables
load_dotenv(dotenv_path=Path(__file__).parent / ".env")



app = FastAPI()

# --- CORS config for local frontend ---
if os.environ.get("YELLORN_ENV", "development") == "development":
    origins = [o.strip() for o in os.environ.get("FRONTEND_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )



PROJECT_ROOT = Path(__file__).parent.parent
PLOTS_PATH = PROJECT_ROOT / "plots"
# Ensure project root is in sys.path for dynamic import
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


def load_plots() -> Tuple[list, list]:
    """
    Load all plot definitions from .json files in the plots directory, validating uniqueness and overlap.
    Returns:
        plots (list): List of plot dicts.
        errors (list): List of error messages encountered during loading/validation.
    """
    plots: list[dict] = []
    errors: list[str] = []
    ids: set = set()
    positions: set = set()
    for json_file in PLOTS_PATH.glob("*.json"):
        try:
            with open(json_file, "r") as f:
                plot = json.load(f)
            # Validate required fields
            required = ["id", "position", "size"]
            missing = [k for k in required if k not in plot]
            if missing:
                errors.append(f"Plot in {json_file.name} missing fields: {', '.join(missing)}")
                continue
            # Validate unique ID
            if plot["id"] in ids:
                errors.append(f"Duplicate plot id: {plot['id']} in {json_file.name}")
                continue
            ids.add(plot["id"])
            # Validate non-overlapping positions
            pos = tuple(plot["position"])
            size = tuple(plot["size"])
            occupied = set((pos[0]+dx, pos[1]+dy) for dx in range(size[0]) for dy in range(size[1]))
            if positions & occupied:
                errors.append(f"Plot {plot['id']} in {json_file.name} overlaps with another plot.")
                continue
            positions |= occupied
            plots.append(plot)
        except Exception as e:
            errors.append(f"Error loading plot from {json_file.name}: {e}")
    return plots, errors



@app.get("/plots", response_model=dict)
def get_plots() -> dict:
    """Return all plots and any validation errors."""
    plots, errors = load_plots()
    return {
        "plots": plots,
        "errors": errors
    }


@app.get("/plots/{plot_id}", response_model=dict)
def get_plot_by_id(plot_id: str) -> dict:
    """Return a single plot by ID, or an error if not found."""
    plots, errors = load_plots()
    for p in plots:
        if p["id"] == plot_id:
            return p
    return {"error": f"Plot with id '{plot_id}' not found.", "errors": errors}


@app.get("/health", response_model=dict)
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
