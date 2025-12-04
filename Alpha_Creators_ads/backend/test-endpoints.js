/**
 * API Endpoint Verification Script
 * Tests all authentication endpoints
 */

const API_BASE_URL = 'http://localhost:8000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

let accessToken = '';
let refreshToken = '';
let testUser = {
  email: `test${Date.now()}@example.com`,
  username: `testuser${Date.now()}`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

async function testEndpoint(name, testFn) {
  try {
    console.log(`\n${colors.blue}Testing: ${name}${colors.reset}`);
    await testFn();
    console.log(`${colors.green}✓ ${name} passed${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ ${name} failed: ${error.message}${colors.reset}`);
    return false;
  }
}

async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// Test 1: Health Check
async function testHealthCheck() {
  const data = await makeRequest(`${API_BASE_URL}/health`);
  console.log('Health:', data.message);
}

// Test 2: API Status
async function testApiStatus() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/status`);
  console.log('Status:', data.message);
}

// Test 3: Register
async function testRegister() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    body: JSON.stringify(testUser),
  });

  if (data.data && data.data.accessToken) {
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
    console.log('User registered:', data.data.user.email);
  } else {
    throw new Error('No tokens received');
  }
}

// Test 4: Login
async function testLogin() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });

  if (data.data && data.data.accessToken) {
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
    console.log('User logged in:', data.data.user.email);
  } else {
    throw new Error('No tokens received');
  }
}

// Test 5: Get Current User
async function testGetCurrentUser() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (data.data && data.data.user) {
    console.log('Current user:', data.data.user.email);
  } else {
    throw new Error('No user data received');
  }
}

// Test 6: Change Password
async function testChangePassword() {
  const newPassword = 'NewPassword123!';
  
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/change-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      currentPassword: testUser.password,
      newPassword: newPassword,
    }),
  });

  testUser.password = newPassword;
  console.log('Password changed successfully');
}

// Test 7: Refresh Token
async function testRefreshToken() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (data.data && data.data.accessToken) {
    accessToken = data.data.accessToken;
    console.log('Token refreshed successfully');
  } else {
    throw new Error('No new access token received');
  }
}

// Test 8: Request Password Reset
async function testRequestPasswordReset() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/password-reset`, {
    method: 'POST',
    body: JSON.stringify({ email: testUser.email }),
  });

  console.log('Password reset requested');
}

// Test 9: Logout
async function testLogout() {
  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  console.log('User logged out');
}

// Test 10: Delete Account
async function testDeleteAccount() {
  // Login again
  const loginData = await makeRequest(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });

  accessToken = loginData.data.accessToken;

  const data = await makeRequest(`${API_BASE_URL}/api/v1/auth/account`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  console.log('Account deleted');
}

// Run all tests
async function runAllTests() {
  console.log(`\n${colors.yellow}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}🧪 Alpha Creator Ads - API Endpoint Tests${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════════════════${colors.reset}\n`);

  const results = [];

  results.push(await testEndpoint('1. Health Check', testHealthCheck));
  results.push(await testEndpoint('2. API Status', testApiStatus));
  results.push(await testEndpoint('3. Register User', testRegister));
  results.push(await testEndpoint('4. Login User', testLogin));
  results.push(await testEndpoint('5. Get Current User', testGetCurrentUser));
  results.push(await testEndpoint('6. Change Password', testChangePassword));
  results.push(await testEndpoint('7. Refresh Token', testRefreshToken));
  results.push(await testEndpoint('8. Request Password Reset', testRequestPasswordReset));
  results.push(await testEndpoint('9. Logout User', testLogout));
  results.push(await testEndpoint('10. Delete Account', testDeleteAccount));

  // Summary
  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  console.log(`\n${colors.yellow}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}📊 Test Summary${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}✓ Passed: ${passed}/${results.length}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failed}/${results.length}${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════════════════${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}🎉 All tests passed! Backend is working correctly!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
