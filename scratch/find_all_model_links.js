const fs = require('fs');

async function findAllModelLinks() {
  const res = await fetch('https://www.bmw-egypt.com/en/all-models.html', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  fs.writeFileSync('scratch/all_models_page.html', html);

  // Look for all /en/all-models/ links
  const links = html.match(/\/en\/all-models\/[^"'\s<>#]+/gi) || [];
  const unique = [...new Set(links.map(l => 'https://www.bmw-egypt.com' + l))];

  console.log('Total model links found:', unique.length);
  unique.sort().forEach(l => console.log(' -', l));
}

findAllModelLinks();
