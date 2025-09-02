import axios from 'axios';
import type { Plot, PlotData, UniverseInfo, ValidationResult } from '../types/api';

// Simple API client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Simplified API functions
export const api = {
  // Universe
  universe: {
    getInfo: (): Promise<UniverseInfo> => 
      client.get('/universe').then(res => res.data),
    getManifest: () => 
      client.get('/universe/manifest').then(res => res.data),
  },

  // Plots
  plots: {
    list: (): Promise<Plot[]> =>
      client.get('/plots').then(res => res.data),
    get: (id: string): Promise<PlotData> =>
      client.get(`/plots/${id}`).then(res => res.data),
    validate: (data: Partial<PlotData>): Promise<ValidationResult> =>
      client.post('/plots/validate', data).then(res => res.data),
  },

  // Agents
  agents: {
    list: () => client.get('/agents').then(res => res.data),
    get: (id: string) => client.get(`/agents/${id}`).then(res => res.data),
  },

  // Health
  health: () => client.get('/health').then(res => res.data),
};

// Backward compatibility exports
export const universeApi = api.universe;
export const plotsApi = api.plots;
export const agentsApi = api.agents;
export const healthApi = { check: api.health };

export default client;
