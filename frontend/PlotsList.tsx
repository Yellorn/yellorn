import React, { useEffect, useState } from "react";
import styles from "./PlotsList.module.css";

// Types
type Plot = {
  id: string;
  owner: string;
  position: [number, number];
  size: [number, number];
};

type PlotsResponse = {
  plots: Plot[];
  errors: string[];
};

// Config
const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:8000";

const PlotsList: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/plots`)
      .then((res) => res.json())
      .then((data: PlotsResponse) => {
        setPlots(data.plots);
        setErrors(data.errors);
      })
      .catch((err) => setErrors([err.message]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading plots...</div>;

  if (errors.length > 0)
    return (
      <div className={styles.error}>
        <h2>Errors</h2>
        <ul>
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Plots</h2>
      <ul className={styles.list}>
        {plots.map((plot) => (
          <li key={plot.id} className={styles.item}>
            <b>{plot.id}</b> <span className={styles.owner}>(owner: {plot.owner})</span>
            <br />
            <span className={styles.meta}>
              Position: {plot.position.join(", ")} &nbsp;|&nbsp; Size: {plot.size.join(" x ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlotsList;
