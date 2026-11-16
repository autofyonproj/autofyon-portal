const fs = require('fs');

async function extractBodyAssets() {
  const targets = [
    { slug: 'mg-5', url: 'https://www.mgmotor.com.eg/model/mg5/' },
    { slug: 'mg-zs', url: 'https://www.mgmotor.com.eg/model/zs/' },
    { slug: 'mg-gt', url: 'https://www.mgmotor.com.eg/model/mg-gt/' },
    { slug: 'mg-g50-plus', url: 'https://www.mgmotor.com.eg/model/g50-plus/' },
    { slug: 'mg-one', url: 'https://www.mgmotor.com.eg/model/mg-one/' },
    { slug: 'mg-rx5-plus', url: 'https://www.mgmotor.com.eg/model/rx5-plus/' },
    { slug: 'mg-hs', url: 'https://www.mgmotor.com.eg/model/mg-hs/' },
    { slug: 'mg-7', url: 'https://www.mgmotor.com.eg/model/mg7/' }
  ];

  const result = {};

  for (const t of targets) {
    const res = await fetch(t.url);
    const html = await res.text();
    // cut out header and footer
    const bodyStart = html.indexOf('id="main"') !== -1 ? html.indexOf('id="main"') : html.indexOf('<body');
    const bodyEnd = html.indexOf('<footer') !== -1 ? html.indexOf('<footer') : html.length;
    const bodyHtml = html.substring(bodyStart, bodyEnd);

    const matches = [...bodyHtml.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
    const unique = [...new Set(matches)].filter(u =>
      !u.includes('logo') && !u.includes('favicon') && !u.includes('icon') &&
      !u.includes('facebook') && !u.includes('insta') && !u.includes('Youtube') &&
      !u.includes('RX9') && !u.includes('tik-tok') && !u.includes('egypt') &&
      !u.includes('Menu') && !u.includes('150x150') && !u.includes('300x50')
    );

    result[t.slug] = unique;
    console.log(`\n================== ${t.slug} (${unique.length} assets) ==================`);
    unique.forEach(u => console.log('  ' + u));
  }

  fs.writeFileSync('mg_body_assets.json', JSON.stringify(result, null, 2));
}

extractBodyAssets();
