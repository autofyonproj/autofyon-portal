const fs = require('fs');

async function extractToyotaAssets() {
  const models = [
    { slug: 'corolla', url: 'https://toyota.com.eg/en/models/corolla' },
    { slug: 'urban-cruiser', url: 'https://toyota.com.eg/en/models/urban-cruiser' },
    { slug: 'fortuner', url: 'https://toyota.com.eg/en/models/fortuner' },
    { slug: 'yaris', url: 'https://toyota.com.eg/en/models/yaris-hatchback' },
    { slug: 'belta', url: 'https://toyota.com.eg/en/models/belta' },
    { slug: 'rumion', url: 'https://toyota.com.eg/en/models/rumion' },
    { slug: 'land-cruiser', url: 'https://toyota.com.eg/en/models/land-cruiser' }
  ];

  const results = {};

  for (const m of models) {
    try {
      const res = await fetch(m.url);
      if (res.status !== 200) {
        console.log(`Failed ${m.slug}: ${res.status}`);
        continue;
      }
      const text = await res.text();
      // Match storage urls (both normal and escaped JSON)
      const raw = text.replace(/\\/g, '');
      const matches = [...raw.matchAll(/https?:\/\/toyota\.com\.eg\/storage\/[^"'`\s<>]+\.(?:png|jpg|jpeg|webp)/gi)].map(m => m[0]);
      const unique = [...new Set(matches)];
      results[m.slug] = unique;
      console.log(`=== Toyota ${m.slug} (found ${unique.length} official images) ===`);
      unique.slice(0, 10).forEach(u => console.log('  ' + u));
    } catch (e) {
      console.error(`Error ${m.slug}:`, e.message);
    }
  }

  fs.writeFileSync('toyota_official_assets.json', JSON.stringify(results, null, 2));
}

extractToyotaAssets();
