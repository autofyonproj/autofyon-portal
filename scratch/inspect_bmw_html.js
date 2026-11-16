const fs = require('fs');

async function inspectHtml() {
  const res = await fetch('https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  fs.writeFileSync('scratch/bmw_x5_sample.html', html);
  
  // Look for any string containing 'asset' or 'images' or 'cosy'
  const matches = html.match(/[^"'<>\s]+\.(?:jpg|png|webp|jpeg)[^"'<>\s]*/gi) || [];
  console.log('Matches count:', matches.length);
  console.log('First 10 matches:', matches.slice(0, 10));
}

inspectHtml();
