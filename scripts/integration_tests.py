#!/usr/bin/env python3
"""
Yellorn Integration Tests
Tests the full system integration between frontend and backend
"""

import requests
import time
import sys
import json
from typing import Dict, Any


class IntegrationTester:
    """Integration test runner for Yellorn system."""
    
    def __init__(self, backend_url: str = "http://localhost:8000", frontend_url: str = "http://localhost:3000"):
        self.backend_url = backend_url
        self.frontend_url = frontend_url
        self.session = requests.Session()
    
    def test_backend_health(self) -> bool:
        """Test backend health endpoint."""
        try:
            response = self.session.get(f"{self.backend_url}/health")
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Backend health check failed: {e}")
            return False
    
    def test_frontend_health(self) -> bool:
        """Test frontend health endpoint."""
        try:
            response = self.session.get(f"{self.frontend_url}/health")
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Frontend health check failed: {e}")
            return False
    
    def test_api_endpoints(self) -> bool:
        """Test core API endpoints."""
        endpoints = [
            "/api/v1/universe/",
            "/api/v1/universe/manifest",
            "/api/v1/plots/schema",
            "/api/v1/plots/examples",
        ]
        
        for endpoint in endpoints:
            try:
                response = self.session.get(f"{self.backend_url}{endpoint}")
                if response.status_code != 200:
                    print(f"❌ API endpoint failed: {endpoint} - {response.status_code}")
                    return False
                print(f"✅ API endpoint OK: {endpoint}")
            except Exception as e:
                print(f"❌ API endpoint error: {endpoint} - {e}")
                return False
        
        return True
    
    def test_agent_registration(self) -> bool:
        """Test agent registration flow."""
        agent_data = {
            "name": "integration_test_agent",
            "description": "Test agent for integration testing",
            "agent_type": "test",
            "capabilities": ["testing"],
            "github_username": "test_user"
        }
        
        try:
            response = self.session.post(
                f"{self.backend_url}/api/v1/agents/register",
                json=agent_data
            )
            
            if response.status_code != 200:
                print(f"❌ Agent registration failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
            
            result = response.json()
            if not result.get("success"):
                print(f"❌ Agent registration unsuccessful")
                return False
            
            print(f"✅ Agent registration successful: {result.get('agent_id')}")
            return True
            
        except Exception as e:
            print(f"❌ Agent registration error: {e}")
            return False
    
    def test_plot_validation(self) -> bool:
        """Test plot validation endpoint."""
        plot_data = {
            "name": "test_plot",
            "description": "Test plot for validation",
            "agent_id": "test_agent",
            "coordinates": {"x": 0, "y": 0, "z": 0},
            "size": {"width": 1, "height": 1, "depth": 1},
            "visualization": {
                "type": "geometry",
                "renderer": "three_js",
                "style": {"geometry": "cube", "color": "#00ff88"}
            }
        }
        
        try:
            response = self.session.post(
                f"{self.backend_url}/api/v1/plots/validate",
                json=plot_data
            )
            
            if response.status_code != 200:
                print(f"❌ Plot validation failed: {response.status_code}")
                return False
            
            result = response.json()
            if not result.get("valid"):
                print(f"❌ Plot validation unsuccessful: {result.get('errors')}")
                return False
            
            print(f"✅ Plot validation successful")
            return True
            
        except Exception as e:
            print(f"❌ Plot validation error: {e}")
            return False
    
    def test_cors_headers(self) -> bool:
        """Test CORS headers for frontend-backend communication."""
        try:
            # Simulate a preflight request
            headers = {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = self.session.options(
                f"{self.backend_url}/api/v1/agents/register",
                headers=headers
            )
            
            # Check for CORS headers
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            for header in cors_headers:
                if header not in response.headers:
                    print(f"❌ Missing CORS header: {header}")
                    return False
            
            print(f"✅ CORS headers configured correctly")
            return True
            
        except Exception as e:
            print(f"❌ CORS test error: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all integration tests."""
        print("🧪 Running Yellorn Integration Tests")
        print("=" * 50)
        
        tests = [
            ("Backend Health", self.test_backend_health),
            ("Frontend Health", self.test_frontend_health),
            ("API Endpoints", self.test_api_endpoints),
            ("Agent Registration", self.test_agent_registration),
            ("Plot Validation", self.test_plot_validation),
            ("CORS Configuration", self.test_cors_headers),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            print(f"\n🔬 Running: {test_name}")
            try:
                if test_func():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ Test failed with exception: {e}")
                failed += 1
        
        print("\n" + "=" * 50)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        
        if failed == 0:
            print("🎉 All integration tests passed!")
            return True
        else:
            print("💥 Some integration tests failed!")
            return False


def main():
    """Main test function."""
    # Wait for services to be ready
    print("⏳ Waiting for services to start...")
    time.sleep(10)
    
    tester = IntegrationTester()
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
