const fs = require('fs');

async function fetchMGImages() {
  const models = [
    { name: 'mg-5', url: 'https://www.mgmotor.com.eg/model/mg5/' },
    { name: 'mg-zs', url: 'https://www.mgmotor.com.eg/model/zs/' },
    { name: 'mg-gt', url: 'https://www.mgmotor.com.eg/model/mg-gt/' },
    { name: 'mg-g50-plus', url: 'https://www.mgmotor.com.eg/model/g50-plus/' },
    { name: 'mg-one', url: 'https://www.mgmotor.com.eg/model/mg-one/' },
    { name: 'mg-rx5-plus', url: 'https://www.mgmotor.com.eg/model/rx5-plus/' },
    { name: 'mg-hs', url: 'https://www.mgmotor.com.eg/model/hs/' },
    { name: 'mg-7', url: 'https://www.mgmotor.com.eg/model/mg7/' }
  ];

  const results = {};

  for (const m of models) {
    try {
      const res = await fetch(m.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();
      // find image URLs
      const matches = html.match(/(?:https?:\/\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp)|\/media\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp))/gi) || [];
      const cleaned = matches.map(u => {
        if (u.startsWith('/')) return 'https://www.mgmotor.com.eg' + u;
        return u;
      }).filter(u => !u.includes('logo') && !u.includes('favicon') && !u.includes('icon') && !u.includes('flag'));
      const unique = [...new Set(cleaned)];
      results[m.name] = unique;
      console.log(`Model ${m.name}: status=${res.status}, found ${unique.length} official images`);
      if (unique.length > 0) {
        console.log(`  Sample:`, unique.slice(0, 5));
      }
    } catch (e) {
      console.error(`Failed ${m.name}:`, e.message);
    }
  }

  fs.writeFileSync('mg_scraped_images.json', JSON.stringify(results, null, 2));
}

fetchMGImages();
