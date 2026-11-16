const fs = require('fs');

async function testBMW() {
  try {
    const res = await fetch('https://www.bmw-egypt.com/en/all-models.html', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const regex = /(?:https?:\/\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)|\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp))/gi;
    const matches = html.match(regex) || [];
    const clean = [...new Set(matches.map(u => u.startsWith('/') ? 'https://www.bmw-egypt.com' + u : u))]
      .filter(u => !u.includes('logo') && !u.includes('favicon') && !u.includes('icon'));
    
    console.log(`HTTP ${res.status}: Found ${clean.length} images on all-models`);
    console.log('Sample images:', clean.slice(0, 10));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testBMW();
