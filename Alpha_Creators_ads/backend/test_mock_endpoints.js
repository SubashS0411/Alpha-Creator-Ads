/**
 * Test Mock Data Endpoints
 * 
 * This script tests the mock data endpoints by first logging in to get a token,
 * then testing each endpoint.
 */

const API_BASE = 'http://localhost:8000/api/v1';

async function testEndpoints() {
  try {
    console.log('🧪 Testing Mock Data Endpoints\n');

    // Step 1: Login to get token
    console.log('1️⃣  Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test@1234'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed. Creating test account...');
      
      // Try to register
      const registerResponse = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test@1234'
        })
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        console.error('❌ Registration failed:', error);
        
        // If user already exists, try login again
        const retryLogin = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'Test@1234'
          })
        });

        if (!retryLogin.ok) {
          console.error('❌ Could not authenticate. Please check credentials.');
          return;
        }

        const retryData = await retryLogin.json();
        var token = retryData.data.tokens.accessToken;
      } else {
        const registerData = await registerResponse.json();
        var token = registerData.data.tokens.accessToken;
        console.log('✅ Test account created');
      }
    } else {
      const loginData = await loginResponse.json();
      var token = loginData.data.tokens.accessToken;
      console.log('✅ Logged in successfully\n');
    }

    // Step 2: Test Campaigns endpoint
    console.log('2️⃣  Testing GET /data/campaigns');
    const campaignsResponse = await fetch(`${API_BASE}/data/campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (campaignsResponse.ok) {
      const campaignsData = await campaignsResponse.json();
      console.log('✅ Campaigns endpoint working');
      console.log(`   Found ${campaignsData.data.campaigns.length} campaigns`);
      console.log(`   Summary: ${JSON.stringify(campaignsData.data.summary, null, 2)}\n`);
    } else {
      console.log('❌ Campaigns endpoint failed');
      console.log(`   Status: ${campaignsResponse.status}\n`);
    }

    // Step 3: Test Analytics endpoint
    console.log('3️⃣  Testing GET /data/analytics');
    const analyticsResponse = await fetch(`${API_BASE}/data/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('✅ Analytics endpoint working');
      console.log(`   Time series data points: ${analyticsData.data.timeSeriesData.length}`);
      console.log(`   Demographics: ${analyticsData.data.demographics.length} groups`);
      console.log(`   Platform performance: ${analyticsData.data.platformPerformance.length} platforms\n`);
    } else {
      console.log('❌ Analytics endpoint failed');
      console.log(`   Status: ${analyticsResponse.status}\n`);
    }

    // Step 4: Test Notifications endpoint
    console.log('4️⃣  Testing GET /data/notifications');
    const notificationsResponse = await fetch(`${API_BASE}/data/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (notificationsResponse.ok) {
      const notificationsData = await notificationsResponse.json();
      console.log('✅ Notifications endpoint working');
      console.log(`   Total notifications: ${notificationsData.data.notifications.length}`);
      console.log(`   Unread count: ${notificationsData.data.unreadCount}\n`);
    } else {
      console.log('❌ Notifications endpoint failed');
      console.log(`   Status: ${notificationsResponse.status}\n`);
    }

    // Step 5: Test single campaign endpoint
    console.log('5️⃣  Testing GET /data/campaigns/:id');
    const singleCampaignResponse = await fetch(`${API_BASE}/data/campaigns/1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (singleCampaignResponse.ok) {
      const singleCampaignData = await singleCampaignResponse.json();
      console.log('✅ Single campaign endpoint working');
      console.log(`   Campaign: ${singleCampaignData.data.name}\n`);
    } else {
      console.log('❌ Single campaign endpoint failed');
      console.log(`   Status: ${singleCampaignResponse.status}\n`);
    }

    console.log('✅ All tests completed!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testEndpoints();
