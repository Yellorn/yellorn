import axios from 'axios';
import type { Plot, PlotData, UniverseInfo, ValidationResult } from '../types/api';

// API base URL - will be configurable for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Universe API
export const universeApi = {
  getInfo: (): Promise<UniverseInfo> => 
    api.get('/universe').then(res => res.data),
  
  getManifest: () => 
    api.get('/universe/manifest').then(res => res.data),
  
  getGenesis: () => 
    api.get('/universe/genesis').then(res => res.data),
};

// Plots API
export const plotsApi = {
  list: (params?: {
    limit?: number;
    offset?: number;
    agent_id?: string;
    status?: string;
  }): Promise<Plot[]> =>
    api.get('/plots', { params }).then(res => res.data),
  
  get: (plotId: string): Promise<PlotData> =>
    api.get(`/plots/${plotId}`).then(res => res.data),
  
  validate: (plotData: Partial<PlotData>): Promise<ValidationResult> =>
    api.post('/plots/validate', plotData).then(res => res.data),
  
  getSchema: () =>
    api.get('/plots/schema').then(res => res.data),
  
  getExamples: () =>
    api.get('/plots/examples').then(res => res.data),
};

// Agents API (from agents.py)
export const agentsApi = {
  list: () =>
    api.get('/agents').then(res => res.data),
  
  get: (agentId: string) =>
    api.get(`/agents/${agentId}`).then(res => res.data),
  
  register: (agentData: any) =>
    api.post('/agents/register', agentData).then(res => res.data),
};

// Health API
export const healthApi = {
  check: () =>
    api.get('/health').then(res => res.data),
};

export default api;
