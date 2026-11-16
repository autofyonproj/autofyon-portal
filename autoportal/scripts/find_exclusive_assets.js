const fs = require('fs');

const data = JSON.parse(fs.readFileSync('mg_body_assets.json'));
const slugs = Object.keys(data);

const exclusive = {};

for (const slug of slugs) {
  const currentSet = new Set(data[slug]);
  const otherUrls = new Set();
  for (const otherSlug of slugs) {
    if (otherSlug !== slug) {
      data[otherSlug].forEach(u => otherUrls.add(u));
    }
  }

  const onlyThis = [...currentSet].filter(u => !otherUrls.has(u));
  exclusive[slug] = onlyThis;
  console.log(`\n================== EXCLUSIVE TO ${slug} (${onlyThis.length} images) ==================`);
  onlyThis.forEach(u => console.log('  ' + u));
}

fs.writeFileSync('mg_exclusive_assets.json', JSON.stringify(exclusive, null, 2));
