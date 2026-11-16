const fs = require('fs');

async function extractAllModels() {
  const targets = [
    { slug: 'mg-5', url: 'https://www.mgmotor.com.eg/model/mg5/' },
    { slug: 'mg-zs', url: 'https://www.mgmotor.com.eg/model/zs/' },
    { slug: 'mg-gt', url: 'https://www.mgmotor.com.eg/model/mg-gt/' },
    { slug: 'mg-g50-plus', url: 'https://www.mgmotor.com.eg/model/g50-plus/' },
    { slug: 'mg-one', url: 'https://www.mgmotor.com.eg/model/mg-one/' },
    { slug: 'mg-rx5-plus', url: 'https://www.mgmotor.com.eg/model/rx5-plus/' },
    { slug: 'mg-hs', url: 'https://www.mgmotor.com.eg/model/all-new-mg-hs/' }, // note: check url
    { slug: 'mg-7', url: 'https://www.mgmotor.com.eg/model/mg7/' }
  ];

  const map = {};

  for (const t of targets) {
    let res = await fetch(t.url);
    if (res.status === 404 && t.slug === 'mg-hs') {
      res = await fetch('https://www.mgmotor.com.eg/model/mg-hs/');
    }
    const html = await res.text();
    const matches = [...html.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
    const unique = [...new Set(matches)].filter(u => 
      !u.includes('logo') && !u.includes('favicon') && !u.includes('icon') &&
      !u.includes('facebook') && !u.includes('insta') && !u.includes('Youtube') &&
      !u.includes('RX9') && !u.includes('tik-tok') && !u.includes('egypt')
    );
    map[t.slug] = unique;
    console.log(`=== ${t.slug} (found ${unique.length}) ===`);
    console.log(unique.slice(0, 15));
  }

  fs.writeFileSync('mg_all_clean_assets.json', JSON.stringify(map, null, 2));
}

extractAllModels();
