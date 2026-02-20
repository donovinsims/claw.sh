#!/usr/bin/env python3
"""
Backend API testing for Mission Control Dashboard
Tests agent endpoints: GET /api/agents, GET /api/agents/{id}, PUT /api/agents/{id}
"""

import requests
import sys
import json
from datetime import datetime

class MissionControlTester:
    def __init__(self, base_url="https://ai-command-center-38.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            else:
                print(f"❌ Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.content else {}
                    if isinstance(response_data, list) and len(response_data) > 0:
                        print(f"   Response length: {len(response_data)} items")
                    elif isinstance(response_data, dict) and 'id' in response_data:
                        print(f"   Agent ID: {response_data.get('id')}")
                except:
                    response_data = {}
                return success, response_data
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response text: {response.text[:200]}")
                
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "error": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_get_all_agents(self):
        """Test GET /api/agents"""
        success, response = self.run_test(
            "Get All Agents",
            "GET", 
            "api/agents",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} agents")
            # Check expected agent properties
            if len(response) > 0:
                agent = response[0]
                required_fields = ['id', 'name', 'role', 'llmProvider', 'llmModel']
                missing_fields = [f for f in required_fields if f not in agent]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in agent data: {missing_fields}")
                    return False
                print(f"   Sample agent: {agent.get('name')} ({agent.get('role')})")
                return True
        return False

    def test_get_specific_agent(self, agent_id="jarvis"):
        """Test GET /api/agents/{id}"""
        success, response = self.run_test(
            f"Get Specific Agent ({agent_id})",
            "GET",
            f"api/agents/{agent_id}",
            200
        )
        if success and isinstance(response, dict):
            print(f"   Agent: {response.get('name')} - {response.get('role')}")
            print(f"   LLM: {response.get('llmProvider')} / {response.get('llmModel')}")
            return response
        return None

    def test_update_agent(self, agent_id="jarvis"):
        """Test PUT /api/agents/{id}"""
        # First get current agent to preserve data
        current_agent = self.test_get_specific_agent(agent_id)
        if not current_agent:
            print("❌ Cannot test update - agent not found")
            return False

        # Update with test data
        update_data = {
            "name": current_agent.get("name", "Test Name"),
            "role": "Test Role Updated",
            "llmProvider": "Test Provider",
            "llmModel": "Test Model",
            "systemInstructions": "Test instructions updated",
            "status": "WORKING"
        }

        success, response = self.run_test(
            f"Update Agent ({agent_id})",
            "PUT",
            f"api/agents/{agent_id}",
            200,
            data=update_data
        )
        
        if success:
            print(f"   Updated role: {response.get('role')}")
            print(f"   Updated LLM: {response.get('llmProvider')}")
            
            # Restore original data
            restore_data = {
                "name": current_agent.get("name"),
                "role": current_agent.get("role"),
                "llmProvider": current_agent.get("llmProvider"),
                "llmModel": current_agent.get("llmModel"),
                "systemInstructions": current_agent.get("systemInstructions"),
                "status": current_agent.get("status")
            }
            
            restore_success, _ = self.run_test(
                f"Restore Agent ({agent_id})",
                "PUT",
                f"api/agents/{agent_id}",
                200,
                data=restore_data
            )
            
            if restore_success:
                print("   ✅ Original data restored successfully")
            else:
                print("   ⚠️  Failed to restore original data")
            
            return True
        return False

    def test_health_check(self):
        """Test root endpoint for health"""
        success, _ = self.run_test(
            "Health Check",
            "GET",
            "api/",
            200
        )
        return success

def main():
    print("🚀 Mission Control Backend API Testing")
    print("="*50)
    
    tester = MissionControlTester()
    
    # Run all tests
    tests = [
        tester.test_health_check,
        tester.test_get_all_agents,
        lambda: tester.test_get_specific_agent("jarvis"),
        lambda: tester.test_update_agent("jarvis")
    ]
    
    for test in tests:
        test()

    # Print final results
    print(f"\n📊 Final Results:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"  • {failure['test']}: {failure.get('error', 'Status code mismatch')}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())