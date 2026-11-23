async function testAnalytics() {
  console.log('Testing OPTIONS preflight...');
  const optRes = await fetch('https://autofyon.com/api/analytics/events', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://autonegypt.com',
      'Access-Control-Request-Method': 'POST'
    }
  });
  console.log('OPTIONS status:', optRes.status);
  console.log('CORS origin:', optRes.headers.get('access-control-allow-origin'));

  console.log('\nTesting POST event from autonegypt.com...');
  const postRes = await fetch('https://autofyon.com/api/analytics/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://autonegypt.com'
    },
    body: JSON.stringify({
      businessId: 'biz_auto_one_egypt',
      eventType: 'whatsapp_click',
      contactTarget: '201222597304',
      path: '/',
      sourceHost: 'autonegypt.com'
    })
  });
  console.log('POST status:', postRes.status);
  console.log('POST CORS header:', postRes.headers.get('access-control-allow-origin'));
}

testAnalytics().catch(console.error);
