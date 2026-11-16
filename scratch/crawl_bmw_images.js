const fs = require('fs');

const modelPages = {
  '1-series': 'https://www.bmw-egypt.com/en/all-models/1-series/1-series-5doors/bmw-1-series.html',
  '2-series': 'https://www.bmw-egypt.com/en/all-models/2-series/2-series-gran-coupe/bmw-2-series-gran-coupe.html',
  '3-series': 'https://www.bmw-egypt.com/en/all-models/3-series/bmw-3-series-sedan/bmw-3-series-sedan.html',
  '4-series': 'https://www.bmw-egypt.com/en/all-models/4-series/4-series-cabrio/bmw-4-series-convertible.html',
  '5-series': 'https://www.bmw-egypt.com/en/all-models/5-series/sedan/bmw-5-series-sedan-overview.html',
  '7-series': 'https://www.bmw-egypt.com/en/all-models/7-series/sedan/bmw-7-series-sedan.html',
  'x1': 'https://www.bmw-egypt.com/en/all-models/x-series/x1/bmw-x1.html',
  'x2': 'https://www.bmw-egypt.com/en/all-models/x-series/x2/bmw-x2-overview.html',
  'x3': 'https://www.bmw-egypt.com/en/all-models/x-series/x3/bmw-x3.html',
  'x5': 'https://www.bmw-egypt.com/en/all-models/x-series/x5/bmw-x5.html',
  'x6': 'https://www.bmw-egypt.com/en/all-models/x-series/x6/bmw-x6.html',
  'x7': 'https://www.bmw-egypt.com/en/all-models/x-series/x7/bmw-x7.html',
  'i4': 'https://www.bmw-egypt.com/en/all-models/bmw-i-series/i4/bmw-i4-gran-coupe.html',
  'i5': 'https://www.bmw-egypt.com/en/all-models/bmw-i/i5/bmw-i5-overview.html',
  'i7': 'https://www.bmw-egypt.com/en/all-models/i-series/i7/i7-2025-g70bev.html',
  'ix1': 'https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix1/bmw-ix1.html',
  'ix2': 'https://www.bmw-egypt.com/en/all-models/bmw-i-series/ix2/bmw-ix2.html',
  'ix': 'https://www.bmw-egypt.com/en/all-models/bmw-i/ix/bmw-ix.html'
};

async function crawl() {
  const results = {};
  for (const [slug, url] of Object.entries(modelPages)) {
    try {
      console.log(`Fetching ${slug}: ${url}...`);
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (!res.ok) {
        console.log(`  Failed HTTP ${res.status}`);
        results[slug] = { status: res.status, images: [] };
        continue;
      }
      const html = await res.text();
      const regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
      const matches = html.match(regex) || [];
      const clean = [...new Set(matches.map(u => u.replace(/&amp;/g, '&')))];
      
      // Also look for /content/dam/bmw images if scene7 is empty
      const damRegex = /(?:https:\/\/www\.bmw-egypt\.com)?\/content\/dam\/bmw\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)/gi;
      const damMatches = html.match(damRegex) || [];
      const cleanDam = [...new Set(damMatches.map(u => u.startsWith('/') ? 'https://www.bmw-egypt.com' + u : u))]
        .filter(u => !u.includes('footer') && !u.includes('social') && !u.includes('logo'));

      console.log(`  Found ${clean.length} scene7 images, ${cleanDam.length} dam images`);
      results[slug] = {
        status: 200,
        pageUrl: url,
        scene7: clean,
        dam: cleanDam
      };
    } catch (e) {
      console.log(`  Error: ${e.message}`);
      results[slug] = { error: e.message, images: [] };
    }
  }

  fs.writeFileSync('scratch/bmw_crawled_images.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved scratch/bmw_crawled_images.json');
}

crawl();
