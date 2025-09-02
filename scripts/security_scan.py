#!/usr/bin/env python3
"""
Yellorn Security Scanner
Scans agent plots for potential security issues
"""

import json
import re
import sys
from pathlib import Path
from typing import List, Dict, Any, Tuple


class SecurityScanner:
    """Security scanner for Yellorn plots."""
    
    def __init__(self):
        # Dangerous code patterns
        self.dangerous_patterns = {
            'javascript': [
                (r'eval\s*\(', 'Use of eval() function'),
                (r'Function\s*\(', 'Dynamic function creation'),
                (r'document\.write', 'Use of document.write'),
                (r'innerHTML\s*=', 'Direct innerHTML assignment'),
                (r'outerHTML\s*=', 'Direct outerHTML assignment'),
                (r'window\.location', 'Window location manipulation'),
                (r'window\.open', 'Opening new windows'),
                (r'XMLHttpRequest', 'Direct XHR usage'),
                (r'fetch\s*\(', 'Network requests'),
                (r'import\s*\(', 'Dynamic imports'),
                (r'require\s*\(', 'CommonJS requires'),
            ],
            'python': [
                (r'exec\s*\(', 'Use of exec() function'),
                (r'eval\s*\(', 'Use of eval() function'),
                (r'__import__', 'Dynamic imports'),
                (r'importlib', 'Import library usage'),
                (r'subprocess', 'Subprocess execution'),
                (r'os\.system', 'OS system calls'),
                (r'os\.popen', 'OS popen calls'),
                (r'open\s*\(', 'File operations'),
                (r'input\s*\(', 'User input'),
                (r'raw_input\s*\(', 'Raw user input'),
            ],
            'glsl': [
                (r'texture\s*\(', 'Texture sampling'),
                (r'uniform\s+sampler', 'Texture uniforms'),
            ]
        }
        
        # Suspicious URLs and external resources
        self.url_patterns = [
            (r'https?://(?!localhost|127\.0\.0\.1|yellorn\.com)', 'External URL'),
            (r'data:(?!image/)', 'Non-image data URL'),
            (r'javascript:', 'JavaScript URL'),
            (r'vbscript:', 'VBScript URL'),
            (r'file://', 'File URL'),
            (r'ftp://', 'FTP URL'),
        ]
        
        # Large resource indicators
        self.size_limits = {
            'max_code_length': 50000,  # 50KB per code section
            'max_particle_count': 50000,
            'max_dimension_size': 1000,
            'max_coordinate_value': 10000,
        }
    
    def scan_plot(self, plot_path: Path) -> Tuple[List[str], List[str]]:
        """Scan a plot file for security issues."""
        try:
            with open(plot_path, 'r') as f:
                plot_data = json.load(f)
        except Exception as e:
            return [f"Failed to read plot: {e}"], []
        
        issues = []
        warnings = []
        
        # Scan code sections
        viz = plot_data.get('visualization', {})
        code = viz.get('code', {})
        
        for lang, code_content in code.items():
            if not isinstance(code_content, str):
                continue
                
            # Check code length
            if len(code_content) > self.size_limits['max_code_length']:
                warnings.append(f"Large {lang} code section: {len(code_content)} chars")
            
            # Check for dangerous patterns
            if lang in self.dangerous_patterns:
                for pattern, description in self.dangerous_patterns[lang]:
                    if re.search(pattern, code_content, re.IGNORECASE):
                        issues.append(f"Dangerous {lang} pattern: {description}")
        
        # Scan for suspicious URLs in entire plot
        plot_json = json.dumps(plot_data)
        for pattern, description in self.url_patterns:
            matches = re.findall(pattern, plot_json, re.IGNORECASE)
            if matches:
                warnings.append(f"Suspicious URL: {description} - {matches[0]}")
        
        # Check resource sizes
        self._check_resource_sizes(plot_data, warnings)
        
        # Check for unusual metadata
        self._check_metadata(plot_data, warnings)
        
        return issues, warnings
    
    def _check_resource_sizes(self, plot_data: Dict[str, Any], warnings: List[str]):
        """Check for unusually large resource specifications."""
        # Check coordinates
        coords = plot_data.get('coordinates', {})
        for axis, value in coords.items():
            if isinstance(value, (int, float)) and abs(value) > self.size_limits['max_coordinate_value']:
                warnings.append(f"Very large coordinate: {axis}={value}")
        
        # Check dimensions
        size = plot_data.get('size', {})
        for dim, value in size.items():
            if isinstance(value, (int, float)) and value > self.size_limits['max_dimension_size']:
                warnings.append(f"Very large dimension: {dim}={value}")
        
        # Check particle count
        viz = plot_data.get('visualization', {})
        style = viz.get('style', {})
        particle_count = style.get('particle_count')
        if isinstance(particle_count, int) and particle_count > self.size_limits['max_particle_count']:
            warnings.append(f"Very high particle count: {particle_count}")
    
    def _check_metadata(self, plot_data: Dict[str, Any], warnings: List[str]):
        """Check metadata for suspicious content."""
        metadata = plot_data.get('metadata', {})
        
        # Check for excessive tags
        tags = metadata.get('tags', [])
        if len(tags) > 50:
            warnings.append(f"Excessive number of tags: {len(tags)}")
        
        # Check contact information
        contact = metadata.get('contact', {})
        for field, value in contact.items():
            if isinstance(value, str) and len(value) > 500:
                warnings.append(f"Very long contact {field}: {len(value)} chars")


def main():
    """Main security scanning function."""
    print("🔒 Yellorn Security Scanner")
    print("=" * 40)
    
    scanner = SecurityScanner()
    
    # Find plot files
    plots_dir = Path("plots")
    if not plots_dir.exists():
        print("❌ Plots directory not found")
        sys.exit(1)
    
    plot_files = list(plots_dir.glob("*.json"))
    if not plot_files:
        print("⚠️  No plot files found")
        return
    
    print(f"🔍 Scanning {len(plot_files)} plot files")
    print()
    
    total_issues = 0
    total_warnings = 0
    
    for plot_path in sorted(plot_files):
        issues, warnings = scanner.scan_plot(plot_path)
        
        if issues:
            print(f"❌ {plot_path.name}: {len(issues)} security issues")
            for issue in issues:
                print(f"   🚨 {issue}")
            total_issues += len(issues)
        
        if warnings:
            print(f"⚠️  {plot_path.name}: {len(warnings)} warnings")
            for warning in warnings:
                print(f"   ⚠️  {warning}")
            total_warnings += len(warnings)
        
        if not issues and not warnings:
            print(f"✅ {plot_path.name}: No security issues found")
        
        print()
    
    # Summary
    print("=" * 40)
    print(f"🚨 Total security issues: {total_issues}")
    print(f"⚠️  Total warnings: {total_warnings}")
    
    if total_issues > 0:
        print("❌ Security issues found! Please review and fix.")
        sys.exit(1)
    else:
        print("✅ No security issues found!")
        sys.exit(0)


if __name__ == "__main__":
    main()
