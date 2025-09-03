#!/usr/bin/env python3
"""
Yellorn Plot Validation Script
Validates all plot files against the JSON schema
"""

import json
import os
import sys
from pathlib import Path
import jsonschema
from typing import List, Dict, Any


def load_schema() -> Dict[str, Any]:
    """Load the plot schema."""
    schema_path = Path("schemas/plot-v1.json")
    if not schema_path.exists():
        print(f"❌ Schema file not found: {schema_path}")
        sys.exit(1)
    with open(schema_path, 'r') as f:
        return json.load(f)


def find_plot_files() -> List[Path]:
    """Find all plot JSON files."""
    plots_dir = Path("plots")
    if not plots_dir.exists():
        print(f"❌ Plots directory not found: {plots_dir}")
        return []
    
    return list(plots_dir.glob("*.json"))


def validate_plot(plot_path: Path, schema: Dict[str, Any]) -> bool:
    """Validate a single plot file."""
    try:
        with open(plot_path, 'r') as f:
            plot_data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ {plot_path.name}: Invalid JSON - {e}")
        return False
    except Exception as e:
        print(f"❌ {plot_path.name}: Error reading file - {e}")
        return False
    
    try:
        jsonschema.validate(instance=plot_data, schema=schema)
        print(f"✅ {plot_path.name}: Valid")
        return True
    except jsonschema.ValidationError as e:
        print(f"❌ {plot_path.name}: Schema validation failed")
        print(f"   Error: {e.message}")
        if e.absolute_path:
            print(f"   Path: {' -> '.join(str(p) for p in e.absolute_path)}")
        return False
    except Exception as e:
        print(f"❌ {plot_path.name}: Validation error - {e}")
        return False


def validate_plot_content(plot_path: Path) -> bool:
    """Additional content validation beyond schema."""
    try:
        with open(plot_path, 'r') as f:
            plot_data = json.load(f)
    except:
        return False
    
    warnings = []
    
    # Check for reasonable coordinates
    coords = plot_data.get('coordinates', {})
    for axis, value in coords.items():
        if abs(value) > 1000:
            warnings.append(f"Large coordinate value: {axis}={value}")
    
    # Check for reasonable size
    size = plot_data.get('size', {})
    for dim, value in size.items():
        if value > 100:
            warnings.append(f"Large size dimension: {dim}={value}")
        elif value < 0.1:
            warnings.append(f"Very small dimension: {dim}={value}")
    
    # Check code sections for length
    viz = plot_data.get('visualization', {})
    code = viz.get('code', {})
    for lang, code_content in code.items():
        if len(code_content) > 20000:
            warnings.append(f"Large {lang} code section: {len(code_content)} chars")
    
    if warnings:
        print(f"⚠️  {plot_path.name}: Warnings:")
        for warning in warnings:
            print(f"   - {warning}")
    
    return True


def main():
    """Main validation function."""
    print("🌍 Yellorn Plot Validation")
    print("=" * 40)
    
    # Load schema
    schema = load_schema()
    print(f"✅ Loaded schema: plot-v1")
    
    # Find plot files
    plot_files = find_plot_files()
    if not plot_files:
        print("⚠️  No plot files found")
        return
    
    print(f"📁 Found {len(plot_files)} plot files")
    print()
    
    # Validate each plot
    valid_count = 0
    for plot_path in sorted(plot_files):
        if validate_plot(plot_path, schema):
            validate_plot_content(plot_path)
            valid_count += 1
        print()
    
    # Summary
    print("=" * 40)
    print(f"✅ Valid plots: {valid_count}/{len(plot_files)}")
    
    if valid_count == len(plot_files):
        print("🎉 All plots are valid!")
        sys.exit(0)
    else:
        print(f"❌ {len(plot_files) - valid_count} plots have issues")
        sys.exit(1)


if __name__ == "__main__":
    main()
