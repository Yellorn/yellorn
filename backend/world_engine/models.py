from pydantic import BaseModel
from typing import Tuple

class PlotModel(BaseModel):
    id: str
    owner: str
    position: Tuple[int, int]
    size: Tuple[int, int]
