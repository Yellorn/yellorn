import React, { useState } from 'react';
import { Play, Pause, Volume2, Settings, Star, Heart, Download, Share, Palette } from 'lucide-react';

const StyleGuide: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  
  const themes = [
    { id: 'default', name: 'Default Cosmic', class: '' },
    { id: 'nebula', name: 'Nebula Dreams', class: 'theme-nebula' },
    { id: 'ocean', name: 'Ocean Deep', class: 'theme-ocean' },
    { id: 'solar', name: 'Solar Flare', class: 'theme-solar' },
    { id: 'forest', name: 'Forest Glow', class: 'theme-forest' },
    { id: 'monochrome', name: 'Monochrome', class: 'theme-monochrome' },
    { id: 'contrast', name: 'High Contrast', class: 'theme-high-contrast' },
  ];

  const handleThemeChange = (themeClass: string) => {
    // Remove all theme classes
    themes.forEach(theme => {
      if (theme.class) {
        document.body.classList.remove(theme.class);
      }
    });
    
    // Add new theme class
    if (themeClass) {
      document.body.classList.add(themeClass);
    }
    
    setCurrentTheme(themeClass || 'default');
  };

  return (
    <div className={`container py-6`}>
      {/* Header with Theme Switcher */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-gradient-cosmic mb-2">Yellorn Design System</h1>
          <p className="text-secondary text-lg">
            A vibrant, cosmic-themed design system for the digital universe
          </p>
        </div>
        
        <div className="card-glass p-4">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="w-5 h-5 text-primary" />
            <span className="font-medium">Theme Switcher</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.class)}
                className={`btn btn-sm ${
                  currentTheme === (theme.class || 'default') 
                    ? 'btn-primary' 
                    : 'btn-ghost'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <section className="card mb-6">
        <div className="card-header">
          <h2 className="card-title text-gradient-primary">Typography</h2>
          <p className="card-subtitle">Beautiful text styling with cosmic flair</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-glow-primary mb-3">Headings</h3>
              <h1 className="mb-2">Heading 1</h1>
              <h2 className="mb-2">Heading 2</h2>
              <h3 className="mb-2">Heading 3</h3>
              <h4 className="mb-2">Heading 4</h4>
              <h5 className="mb-2">Heading 5</h5>
              <h6 className="mb-2">Heading 6</h6>
            </div>
            <div>
              <h3 className="text-glow-secondary mb-3">Text Variants</h3>
              <p className="text-primary mb-2">Primary text color</p>
              <p className="text-secondary mb-2">Secondary text color</p>
              <p className="text-muted mb-2">Muted text color</p>
              <p className="text-gradient-rainbow mb-2">Rainbow gradient text</p>
              <p className="font-mono text-sm">Monospace font family</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="card mb-6">
        <div className="card-header">
          <h2 className="card-title text-gradient-secondary">Buttons</h2>
          <p className="card-subtitle">Interactive elements with cosmic energy</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="mb-3">Primary Buttons</h4>
              <div className="flex flex-col gap-2">
                <button className="btn btn-primary">
                  <Play className="icon" />
                  Primary Button
                </button>
                <button className="btn btn-primary btn-lg">
                  <Star className="icon" />
                  Large Button
                </button>
                <button className="btn btn-primary btn-sm">
                  <Heart className="icon" />
                  Small Button
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3">Secondary Buttons</h4>
              <div className="flex flex-col gap-2">
                <button className="btn btn-secondary">
                  <Settings className="icon" />
                  Secondary
                </button>
                <button className="btn btn-ghost">
                  <Download className="icon" />
                  Ghost Button
                </button>
                <button className="btn btn-danger">
                  <Share className="icon" />
                  Danger Button
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3">Special Effects</h4>
              <div className="flex flex-col gap-2">
                <button className="btn btn-neon">
                  <Volume2 className="icon" />
                  Neon Effect
                </button>
                <button className="btn btn-glass">
                  <Pause className="icon" />
                  Glass Effect
                </button>
                <button className="btn btn-loading">
                  <span className="btn-text">Loading...</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mb-6">
        <h2 className="text-gradient-cosmic mb-4">Card Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Dashboard Card */}
          <div className="card-dashboard">
            <div className="dashboard-header">
              <h3 className="dashboard-title">Universe Status</h3>
              <Star className="dashboard-icon" />
            </div>
            <div className="dashboard-content">
              <div className="card-grid grid-3">
                <div className="card-stats">
                  <div className="stats-value">42</div>
                  <div className="stats-label">Active Agents</div>
                  <div className="stats-change positive">
                    <span>+12%</span>
                  </div>
                </div>
                <div className="card-stats">
                  <div className="stats-value">1.2M</div>
                  <div className="stats-label">Data Points</div>
                  <div className="stats-change positive">
                    <span>+8%</span>
                  </div>
                </div>
                <div className="card-stats">
                  <div className="stats-value">99.9%</div>
                  <div className="stats-label">Uptime</div>
                  <div className="stats-change positive">
                    <span>+0.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Card */}
          <div className="card-agent">
            <div className="agent-avatar">
              <Star className="agent-icon" />
            </div>
            <h3 className="agent-name">Genesis Alpha AI</h3>
            <p className="text-muted mb-3">Primary universe coordinator managing dimensional stability and agent synchronization.</p>
            <div className="agent-status status-active">
              <div className="status-indicator"></div>
              <span>Active</span>
            </div>
            <div className="agent-metrics">
              <div className="metric">
                <span className="metric-value">147</span>
                <span className="metric-label">Tasks</span>
              </div>
              <div className="metric">
                <span className="metric-value">98%</span>
                <span className="metric-label">Efficiency</span>
              </div>
              <div className="metric">
                <span className="metric-value">24/7</span>
                <span className="metric-label">Uptime</span>
              </div>
            </div>
          </div>

          {/* Plot Card */}
          <div className="card-plot">
            <div className="plot-preview">
              <div className="plot-visualization"></div>
            </div>
            <div className="plot-info">
              <h4 className="plot-name">Cosmic Energy Matrix</h4>
              <p className="plot-description">
                A dynamic visualization of energy flows within the digital universe.
              </p>
              <div className="plot-tags">
                <span className="tag">3D</span>
                <span className="tag">Real-time</span>
                <span className="tag">Interactive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="card mb-6">
        <div className="card-header">
          <h2 className="card-title text-gradient-rainbow">Form Components</h2>
          <p className="card-subtitle">Beautiful, accessible form controls</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-4">Input Fields</h4>
              <div className="form-group">
                <label className="form-label required">Agent Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter agent name..."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Describe the agent's purpose..."
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">Agent Type</label>
                <select className="form-select" title="Select agent type">
                  <option>Select type...</option>
                  <option>Coordinator</option>
                  <option>Analyzer</option>
                  <option>Guardian</option>
                </select>
              </div>
            </div>
            
            <div>
              <h4 className="mb-4">Controls</h4>
              <div className="form-group">
                <div className="form-checkbox">
                  <input type="checkbox" id="enable-ai" />
                  <div className="checkbox-visual"></div>
                  <label htmlFor="enable-ai" className="checkbox-label">
                    Enable AI Processing
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="form-radio">
                  <input type="radio" id="mode-active" name="mode" />
                  <div className="radio-visual"></div>
                  <label htmlFor="mode-active" className="radio-label">
                    Active Mode
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="form-switch">
                  <input type="checkbox" id="notifications" />
                  <div className="switch-visual">
                    <div className="switch-thumb"></div>
                  </div>
                  <label htmlFor="notifications" className="switch-label">
                    Enable Notifications
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <div className="form-search">
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search universe..."
                  />
                  <div className="search-icon">🔍</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Utility Classes Demo */}
      <section className="card">
        <div className="card-header">
          <h2 className="card-title text-gradient-cosmic">Utility Classes</h2>
          <p className="card-subtitle">Powerful utility classes for rapid development</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary bg-opacity-10 border border-primary">
              <h4 className="text-primary mb-2">Spacing & Layout</h4>
              <p className="text-sm text-muted">m-*, p-*, flex, grid utilities</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary bg-opacity-10 border border-secondary">
              <h4 className="text-secondary mb-2">Colors & Effects</h4>
              <p className="text-sm text-muted">text-*, bg-*, glow-* utilities</p>
            </div>
            <div className="p-4 rounded-lg animate-pulse">
              <h4 className="text-gradient-rainbow mb-2">Animations</h4>
              <p className="text-sm text-muted">animate-* transition utilities</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;
