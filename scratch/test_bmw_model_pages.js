const fs = require('fs');

async function testModelPage() {
  const urls = [
    'https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html',
    'https://www.bmw-egypt.com/en/all-models/3-series/sedan/2022/bmw-3-series-sedan-overview.html',
    'https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const html = await res.text();
      const regex = /(?:https?:\/\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)|\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp))/gi;
      const matches = html.match(regex) || [];
      const clean = [...new Set(matches.map(u => u.startsWith('/') ? 'https://www.bmw-egypt.com' + u : u))]
        .filter(u => u.includes('dam/bmw') && !u.includes('social') && !u.includes('logo') && !u.includes('footer'));
      
      console.log(`URL: ${url}`);
      console.log(`  Found ${clean.length} official vehicle assets`);
      console.log('  Samples:', clean.slice(0, 3));
    } catch (e) {
      console.error(e.message);
    }
  }
}

testModelPage();
