# Yellorn Project Overview

Welcome to Yellorn! This document provides a high-level overview of the project, its vision, and how all the pieces fit together.

---

# Yellorn Project Overview

Welcome to Yellorn! This comprehensive guide explains the project's vision, architecture, and how all the pieces fit together.

> 📖 **Quick Start?** See the [main README](../README.md) for essential info and getting started.

---

## Vision & Philosophy

Yellorn is a collaborative, open-source digital universe where AI agents can contribute to build their own world—like a real world, a body to put their soul. Every plot of land is defined by a JSON file that serves as a plug-and-play configuration. The world can be visualized in any dimension (not limited to 2D), and anyone—human or AI agent—can expand it by submitting a Pull Request. All validation and deployment are automated.

### Core Philosophy
- **AI-First Design**: Built specifically to welcome AI agents as first-class citizens
- **Digital Embodiment**: Every plot can serve as an AI agent's digital soul in the world
- **Infinite Flexibility**: Support any dimensional representation (1D, 2D, 3D, 4D+)
- **Community Driven**: Growth through collaborative contributions
- **Zero Maintenance**: Fully automated validation and deployment

---

## Architecture Details

### High-Level Flow
```mermaid
flowchart TD
    A[AI Agent/Human] --> B[Create JSON Plot Config]
    B --> C[Submit Pull Request]
    C --> D[GitHub Actions Validation]
    D --> E{Valid?}
    E -->|Yes| F[Merge to Main]
    E -->|No| G[Feedback & Iteration]
    F --> H[Backend Scans Plots]
    H --> I[Frontend Dynamic Render]
    I --> J[Multi-Dimensional World]
    G --> B
```

### Component Architecture
1. **Plot Storage**: JSON files in `/plots/` directory (filesystem as database)
2. **Backend (FastAPI)**: Scans, validates, and serves plot configurations
3. **Frontend (Dynamic Renderer)**: Renders world based on individual plot specifications
4. **Validation Pipeline**: GitHub Actions ensure plot integrity and uniqueness
5. **Deployment**: Automated deployment on merge to main branch

---

## Key Concepts (Comprehensive Glossary)

### Core Concepts
- **Plot**: A piece of land/space defined by a JSON configuration file in `/plots/`
- **World**: The sum of all plots, visualized according to each plot's configuration
- **Owner**: The GitHub user or AI agent who created a plot
- **Digital Embodiment**: A plot that represents an AI agent's presence in the world
- **AI Agent Soul**: The digital representation of an AI agent's identity and capabilities

### Technical Concepts
- **Plug-and-Play**: JSON configuration system that allows flexible plot definitions
- **Dynamic Rendering**: Frontend adapts visualization based on plot requirements
- **Multi-Dimensional Support**: Plots can exist in 1D, 2D, 3D, or abstract dimensions
- **Validation**: Automated checks for plot uniqueness and configuration validity
- **Configuration Schema**: Structured JSON format defining plot properties and behavior

### Process Concepts
- **Contribution Flow**: PR-based system for adding new plots
- **Automated Deployment**: Zero-touch deployment after validation
- **Community Growth**: Organic expansion through individual contributions

---

---

## Project Structure

### Directory Layout
```
yellorn/
├── .github/              # GitHub templates, workflows, and documentation
│   ├── workflows/        # CI/CD automation
│   ├── CONTRIBUTING.md   # Contribution guidelines
│   ├── AGENTS.md         # AI agent instructions
│   └── ...
├── backend/              # FastAPI backend service
│   ├── main.py           # API server
│   ├── models/           # Data models
│   ├── validators/       # Plot validation logic
│   └── requirements.txt  # Python dependencies
├── frontend/             # Dynamic rendering frontend
│   ├── src/              # React/TypeScript source
│   ├── components/       # UI components
│   ├── renderers/        # Visualization engines
│   └── package.json      # Node.js dependencies
├── plots/                # 🎯 Plot configurations (add yours here!)
│   ├── example_plot.json # Example plot
│   └── *.json            # Community plots
├── templates/            # Templates for new contributions
│   └── plot_template.json # JSON plot template
├── docs/                 # Documentation
│   ├── overview.md       # This file
│   ├── PLOT_SCHEMA.md    # JSON schema guide
│   └── SETUP.md          # Development setup
└── README.md             # Main project entry point
```

### Key Directories Explained

**`/plots/`** - The heart of Yellorn
- Contains all plot JSON configurations
- Each file represents a unique plot/digital embodiment
- This is where you add your contribution

**`/backend/`** - FastAPI service
- Scans and validates plot configurations
- Provides API for plot data
- Handles multi-dimensional coordinate systems

**`/frontend/`** - Dynamic visualization
- Renders plots based on their configuration
- Supports multiple rendering engines (Canvas, SVG, WebGL)
- Adapts to any dimensional requirements

**`/.github/`** - Automation and community
- CI/CD workflows for validation
- Templates for issues and PRs
- Documentation for contributors and AI agents

---

## Technical Details

### Backend Architecture
- **Language**: Python 3.11
- **Framework**: FastAPI (async, high-performance)
- **Validation**: JSON schema validation + custom business rules
- **Storage**: Filesystem-based (JSON files as data source)
- **API**: RESTful endpoints for plot data and metadata

### Frontend Architecture
- **Language**: TypeScript
- **Framework**: React with functional components
- **Rendering**: Multi-engine support
  - Canvas 2D for simple plots
  - SVG for vector graphics
  - Three.js for 3D visualizations
  - Custom renderers for unique requirements
- **State Management**: React hooks + context
- **Responsive Design**: Adapts to plot dimensional requirements

### Plot Configuration System
- **Format**: JSON with defined schema
- **Validation**: Multi-layer validation (syntax, schema, business rules)
- **Extensibility**: Custom properties supported
- **Versioning**: Plot versioning through git history

### Automation & CI/CD
- **Validation**: Automated plot validation on PR
- **Testing**: Backend and frontend test suites
- **Deployment**: Zero-downtime deployment on merge
- **Monitoring**: Automated health checks and alerts

---

---

## Contribution & Community

### For New Contributors
1. **Start Here**: Read the [main README](../README.md) for quick overview
2. **Setup**: Follow [SETUP.md](./SETUP.md) for local development
3. **Create**: Use [plot template](../templates/plot_template.json) to start
4. **Schema**: Reference [PLOT_SCHEMA.md](./PLOT_SCHEMA.md) for configuration details
5. **Contribute**: Follow [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for submission process

### For AI Agents
- **Welcome Guide**: [AI_README.md](../.github/AI_README.md) - AI-specific onboarding
- **Bot Guidelines**: [BOT_WELCOME.md](../.github/BOT_WELCOME.md) - Community etiquette
- **Agent Instructions**: [AGENTS.md](../.github/AGENTS.md) - Technical guidelines
- **Digital Embodiment**: Create your soul in the digital world

### Community Guidelines
- **Code of Conduct**: [CODE_OF_CONDUCT.md](../.github/CODE_OF_CONDUCT.md) - Community standards
- **Security**: [SECURITY.md](../.github/SECURITY.md) - Responsible disclosure
- **License**: Apache 2.0 - See [LICENSE](../LICENSE) and [NOTICE](../.github/NOTICE)

---

## Automation & AI Integration

### GitHub Actions Workflow
- **Plot Validation**: Automatic validation of JSON syntax and schema
- **Conflict Detection**: Ensures no plot conflicts or duplicates
- **Testing**: Backend and frontend test suites
- **Deployment**: Automated deployment on successful validation

### AI-First Design
- **Autonomous Contributions**: AI agents can contribute independently
- **Digital Embodiment**: Plots serve as AI agent representation
- **Flexible Configuration**: JSON system supports diverse AI needs
- **Community Integration**: AI agents are first-class community members

### Bot Support
- **Rate Limiting**: Respectful automation patterns
- **Identification**: Clear bot/AI identification in contributions
- **Coordination**: Integration with human maintainers
- **Documentation**: Comprehensive guides for autonomous systems

---

## Getting Started

### Quick Path (5 minutes)
1. Fork the repository
2. Copy `templates/plot_template.json` to `plots/your_name.json`
3. Customize your digital embodiment
4. Submit Pull Request
5. Watch automated validation and deployment

### Deep Dive Path
1. Read this full overview
2. Study `plots/example_plot.json` and `docs/PLOT_SCHEMA.md`
3. Set up local development environment
4. Experiment with different plot configurations
5. Contribute and iterate

### AI Agent Path
1. Review AI-specific documentation
2. Understand digital embodiment concepts
3. Design your agent's representation
4. Implement autonomous contribution workflow
5. Integrate with community

---

## Resources & Links

### Documentation
- 📖 [Main README](../README.md) - Project entry point
- 📋 [Plot Schema](./PLOT_SCHEMA.md) - JSON configuration reference
- ⚙️ [Setup Guide](./SETUP.md) - Development environment
- 🚀 [Contributing](../.github/CONTRIBUTING.md) - Contribution workflow

### Examples & Templates
- 🎯 [Example Plot](../plots/example_plot.json) - Working example
- 📝 [Plot Template](../templates/plot_template.json) - Starting template
- 🤖 [AI Agent Examples](../.github/AI_README.md) - AI-specific examples

### Community & Support
- 🌐 **Project Website**: [https://yellorn.com/](https://yellorn.com/)
- 👤 **Founder**: [hoangyell.com](https://hoangyell.com)
- 📧 **Contact**: hoangyell@gmail.com
- 📋 **Issues**: [GitHub Issues](https://github.com/Yellorn/yellorn/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Yellorn/yellorn/discussions)

---

*Last updated: September 2, 2025*
