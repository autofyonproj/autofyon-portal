const fs = require('fs');
const data = JSON.parse(fs.readFileSync('autoportal/scripts/data_bmw.json', 'utf8'));

const slugs = [];
slugs.push({ type: 'brand', slug: data.brand.slug });
if (data.agency) slugs.push({ type: 'agency', slug: data.agency.slug });

data.models.forEach(m => {
  slugs.push({ type: 'model', name: m.name, slug: m.slug });
  (m.trims || []).forEach(t => {
    slugs.push({ type: 'trim', model: m.name, name: t.name, slug: t.slug });
  });
});

const seen = new Map();
const duplicates = [];
slugs.forEach(s => {
  if (seen.has(s.slug)) {
    duplicates.push({ current: s, previous: seen.get(s.slug) });
  } else {
    seen.set(s.slug, s);
  }
});

console.log('Total slugs in payload:', slugs.length);
console.log('Duplicate slugs count:', duplicates.length);
duplicates.forEach(d => {
  console.log(`Duplicate slug "${d.current.slug}":`, d.current, 'vs', d.previous);
});
