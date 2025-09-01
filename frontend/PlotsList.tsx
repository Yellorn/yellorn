import React, { useEffect, useState } from "react";

interface Plot {
  id: string;
  owner: string;
  position: [number, number];
  size: [number, number];
}

interface PlotsResponse {
  plots: Plot[];
  errors: string[];
}

const PlotsList: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/plots")
      .then((res) => res.json())
      .then((data: PlotsResponse) => {
        setPlots(data.plots);
        setErrors(data.errors);
        setLoading(false);
      })
      .catch((err) => {
        setErrors([err.message]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading plots...</div>;
  if (errors.length > 0)
    return (
      <div>
        <h2>Errors</h2>
        <ul>
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </div>
    );
  return (
    <div>
      <h2>Plots</h2>
      <ul>
        {plots.map((plot) => (
          <li key={plot.id}>
            <b>{plot.id}</b> (owner: {plot.owner}) at {plot.position.join(",")} size {plot.size.join("x")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlotsList;
