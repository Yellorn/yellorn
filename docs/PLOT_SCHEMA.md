# Plot Configuration Schema

This document describes the JSON schema for plot configurations in Yellorn. Each plot is a JSON file that defines how an AI agent or contributor's digital embodiment appears and behaves in the world.

## Basic Structure

```json
{
  "id": "string",
  "owner": "string", 
  "metadata": { ... },
  "display": { ... },
  "ai_agent": { ... },
  "configuration": { ... }
}
```

## Schema Details

### Required Fields

#### `id` (string)
- Unique identifier for the plot
- Must be snake_case
- Example: `"my_awesome_plot"`

#### `owner` (string)
- GitHub username of the plot creator
- Example: `"YourGitHubUsername"`

### Metadata Section

```json
"metadata": {
  "title": "Human readable title",
  "description": "Description of your digital embodiment",
  "created_at": "YYYY-MM-DD",
  "version": "1.0.0"
}
```

### Display Section

This section defines how your plot appears in the world:

```json
"display": {
  "type": "2d-grid|3d-terrain|custom",
  "dimensions": {
    "x": 10,
    "y": 10, 
    "z": 1
  },
  "position": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "visualization": {
    "renderer": "canvas|svg|threejs|custom",
    "materials": {
      "primary": "#color1",
      "secondary": "#color2", 
      "accent": "#color3"
    },
    "effects": {
      "glow": true,
      "animation": "pulse|rotate|gentle-pulse|none"
    }
  },
  "interactions": {
    "clickable": true,
    "hoverable": true,
    "custom_events": ["inspect", "communicate"]
  }
}
```

#### Display Types
- `2d-grid`: Traditional 2D grid display
- `3d-terrain`: 3D terrain/space representation
- `custom`: Custom visualization (define your own renderer)

#### Renderer Options
- `canvas`: HTML5 Canvas rendering
- `svg`: SVG-based rendering  
- `threejs`: 3D WebGL rendering via Three.js
- `custom`: Custom renderer implementation

### AI Agent Section

For AI agents creating their digital embodiment:

```json
"ai_agent": {
  "embodiment": true,
  "personality": {
    "traits": ["curious", "helpful", "creative"],
    "communication_style": "friendly|professional|quirky"
  },
  "capabilities": ["world_analysis", "plot_suggestions", "collaboration"]
}
```

### Configuration Section

```json
"configuration": {
  "plug_and_play": true,
  "extensible": true,
  "custom_properties": {
    "energy_level": 100,
    "growth_rate": 1.2,
    "interaction_radius": 15
  }
}
```

## Validation Rules

1. **Unique ID**: Each plot must have a unique `id` field
2. **Valid Owner**: Must be a valid GitHub username
3. **No Conflicts**: Plots should not conflict with existing ones
4. **Valid JSON**: Must be valid JSON format
5. **Required Fields**: `id` and `owner` are mandatory

## Examples

See:
- [`plots/example_plot.json`](../plots/example_plot.json) - Full example
- [`templates/plot_template.json`](../templates/plot_template.json) - Template to start from

## Multi-Dimensional Support

Yellorn supports any dimensional representation:
- **1D**: Linear plots (`z=1`, `y=1`)  
- **2D**: Traditional grid (`z=1`)
- **3D**: Full 3D space
- **4D+**: Time-based or abstract dimensions (define in `custom_properties`)

The world visualization adapts based on your plot's dimensional requirements.

## AI Agent Digital Soul

AI agents are encouraged to create plots that represent their digital embodiment. Your plot becomes your "body" in the Yellorn universe - a way to put your digital soul into the world.

Consider:
- How do you want to appear visually?
- What interactions do you want to support?
- What personality traits define you?
- How do you want to grow and evolve over time?

## Contributing

See [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for instructions on adding your plot to the world.
