"""
Plot validation service
AI-first validation system for plot configurations
"""

import json
import jsonschema
from typing import Dict, Any, List, Tuple
import re


class PlotValidator:
    """Validates plot configurations for AI agents."""
    
    def __init__(self):
        self.max_size_mb = 10.0
        self.max_agents_per_plot = 100
        self.supported_renderers = ["webgl", "canvas", "svg", "three_js", "babylon_js"]
        self.supported_geometries = ["cube", "sphere", "cylinder", "plane", "custom"]
        
    async def validate(self, plot_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive validation of plot configuration.
        
        Returns:
            Dict with validation results, errors, warnings, and suggestions
        """
        result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "suggestions": [],
            "estimated_size_mb": 0
        }
        
        try:
            # Basic structure validation
            self._validate_structure(plot_data, result)
            
            # Content validation
            self._validate_content(plot_data, result)
            
            # Security validation
            self._validate_security(plot_data, result)
            
            # Performance validation
            self._validate_performance(plot_data, result)
            
            # AI-specific validation
            self._validate_ai_compatibility(plot_data, result)
            
            # Estimate size
            result["estimated_size_mb"] = self._estimate_size(plot_data)
            
            # Final validity check
            result["valid"] = len(result["errors"]) == 0
            
        except Exception as e:
            result["valid"] = False
            result["errors"].append(f"Validation failed: {str(e)}")
            
        return result
    
    def _validate_structure(self, plot_data: Dict[str, Any], result: Dict[str, Any]):
        """Validate basic structure and required fields."""
        required_fields = ["name", "description", "agent_id", "coordinates", "size", "visualization"]
        
        for field in required_fields:
            if field not in plot_data:
                result["errors"].append(f"Missing required field: {field}")
        
        # Validate name
        if "name" in plot_data:
            name = plot_data["name"]
            if not isinstance(name, str) or len(name) < 3 or len(name) > 100:
                result["errors"].append("Name must be a string between 3 and 100 characters")
            elif not re.match(r'^[a-zA-Z0-9_\-\s]+$', name):
                result["errors"].append("Name contains invalid characters")
        
        # Validate coordinates
        if "coordinates" in plot_data:
            coords = plot_data["coordinates"]
            if not isinstance(coords, dict):
                result["errors"].append("Coordinates must be an object")
            else:
                required_coords = ["x", "y", "z"]
                for coord in required_coords:
                    if coord not in coords:
                        result["errors"].append(f"Missing coordinate: {coord}")
                    elif not isinstance(coords[coord], (int, float)):
                        result["errors"].append(f"Coordinate {coord} must be a number")
    
    def _validate_content(self, plot_data: Dict[str, Any], result: Dict[str, Any]):
        """Validate content and visualization settings."""
        if "visualization" not in plot_data:
            return
            
        viz = plot_data["visualization"]
        
        # Validate renderer
        if "renderer" in viz:
            if viz["renderer"] not in self.supported_renderers:
                result["errors"].append(f"Unsupported renderer: {viz['renderer']}")
        
        # Validate geometry type
        if "style" in viz and "geometry" in viz["style"]:
            geometry = viz["style"]["geometry"]
            if geometry not in self.supported_geometries:
                result["warnings"].append(f"Unusual geometry type: {geometry}")
        
        # Validate code sections
        if "code" in viz:
            self._validate_code_sections(viz["code"], result)
    
    def _validate_code_sections(self, code_data: Dict[str, Any], result: Dict[str, Any]):
        """Validate embedded code for security and functionality."""
        dangerous_patterns = [
            r'eval\s*\(',
            r'Function\s*\(',
            r'document\.write',
            r'innerHTML\s*=',
            r'outerHTML\s*=',
            r'exec\s*\(',
            r'__import__',
            r'importlib',
            r'subprocess',
            r'os\.system',
            r'window\.location'
        ]
        
        for lang, code in code_data.items():
            if not isinstance(code, str):
                result["errors"].append(f"Code for {lang} must be a string")
                continue
                
            # Check for dangerous patterns
            for pattern in dangerous_patterns:
                if re.search(pattern, code, re.IGNORECASE):
                    result["errors"].append(f"Potentially dangerous code pattern found in {lang}: {pattern}")
            
            # Check code length
            if len(code) > 50000:  # 50KB limit per code section
                result["warnings"].append(f"Code section for {lang} is very large ({len(code)} chars)")
            
            # Language-specific validation
            if lang == "javascript":
                self._validate_javascript(code, result)
            elif lang == "python":
                self._validate_python(code, result)
    
    def _validate_javascript(self, code: str, result: Dict[str, Any]):
        """Validate JavaScript code."""
        # Basic syntax check (simplified)
        if code.count('{') != code.count('}'):
            result["warnings"].append("JavaScript: Mismatched braces")
        
        if code.count('(') != code.count(')'):
            result["warnings"].append("JavaScript: Mismatched parentheses")
    
    def _validate_python(self, code: str, result: Dict[str, Any]):
        """Validate Python code."""
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError as e:
            result["errors"].append(f"Python syntax error: {str(e)}")
    
    def _validate_security(self, plot_data: Dict[str, Any], result: Dict[str, Any]):
        """Validate security aspects."""
        # Check for suspicious URLs or external resources
        plot_json = json.dumps(plot_data)
        
        suspicious_patterns = [
            r'https?://(?!localhost|127\.0\.0\.1|yellorn\.com)',  # External URLs
            r'data:(?!image/)',  # Non-image data URLs
            r'javascript:',      # JavaScript URLs
            r'vbscript:',       # VBScript URLs
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, plot_json, re.IGNORECASE):
                result["warnings"].append(f"Potentially suspicious content: {pattern}")
    
    def _validate_performance(self, plot_data: Dict[str, Any], result: Dict[str, Any]):
        """Validate performance implications."""
        viz = plot_data.get("visualization", {})
        style = viz.get("style", {})

        # Check particle count
        if "particle_count" in style:
            count = style["particle_count"]
            if isinstance(count, int):
                if count > 50000:
                    result["errors"].append("Particle count exceeds maximum limit (50,000)")
                elif count > 10000:
                    result["warnings"].append("High particle count may impact performance")

        # Check animation complexity
        if "animation" in viz:
            animation = viz["animation"]
            if isinstance(animation, dict) and len(animation) > 10:
                result["warnings"].append("Complex animations may impact performance")
    
    def _validate_ai_compatibility(self, plot_data: Dict[str, Any], result: Dict[str, Any]):
        """Validate AI-specific requirements and best practices."""
        # Check for AI agent identification
        if "agent_id" in plot_data:
            agent_id = plot_data["agent_id"]
            if not isinstance(agent_id, str) or len(agent_id) < 3:
                result["errors"].append("Agent ID must be a valid string")
        
        # Suggest AI-friendly features
        viz = plot_data.get("visualization", {})
        if "interactions" not in plot_data or not plot_data["interactions"]:
            result["suggestions"].append("Consider adding interaction definitions for better AI engagement")
        
        if "metadata" not in plot_data or not plot_data["metadata"]:
            result["suggestions"].append("Consider adding metadata for better discoverability")
        
        # Check for accessibility
        style = viz.get("style", {})
        if "color" in style and not self._check_color_accessibility(style["color"]):
            result["suggestions"].append("Consider using more accessible colors")
    
    def _check_color_accessibility(self, color: str) -> bool:
        """Simple color accessibility check."""
        if isinstance(color, str) and color.startswith("#"):
            # Accept #RRGGBB or #RGB
            if len(color) == 7 or len(color) == 4:
                return True
            return False
        return True
    
    def _estimate_size(self, plot_data: Dict[str, Any]) -> float:
        """Estimate the size of the plot in MB."""
        plot_json = json.dumps(plot_data)
        size_bytes = len(plot_json.encode('utf-8'))
        
        # Add estimation for embedded code and assets
        viz = plot_data.get("visualization", {})
        if "code" in viz:
            for code in viz["code"].values():
                if isinstance(code, str):
                    size_bytes += len(code.encode('utf-8'))
        
        # Convert to MB
        size_mb = size_bytes / (1024 * 1024)
        return round(size_mb, 3)
