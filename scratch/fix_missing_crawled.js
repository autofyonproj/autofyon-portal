const fs = require('fs');

async function fixMissing() {
  const crawled = JSON.parse(fs.readFileSync('scratch/bmw_crawled_images.json', 'utf8'));

  // 7-series
  console.log('Fetching 7-series...');
  let res = await fetch('https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  let html = await res.text();
  let regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
  let matches = html.match(regex) || [];
  crawled['7-series'] = {
    status: 200,
    pageUrl: 'https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html',
    scene7: [...new Set(matches.map(u => u.replace(/&amp;/g, '&')))],
    dam: []
  };

  // X7
  console.log('Fetching X7...');
  res = await fetch('https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  html = await res.text();
  matches = html.match(regex) || [];
  crawled['x7'] = {
    status: 200,
    pageUrl: 'https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html',
    scene7: [...new Set(matches.map(u => u.replace(/&amp;/g, '&')))],
    dam: []
  };

  // iX
  console.log('Fetching iX...');
  res = await fetch('https://www.bmw-saudiarabia.com/models/theix/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  html = await res.text();
  const imgRegex = /https:\/\/images\.netdirector\.co\.uk\/gforces-auto\/image\/upload\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)/gi;
  const ixImgs = [...new Set(html.match(imgRegex) || [])].filter(u => u.includes('ix') || u.includes('exterior') || u.includes('interior') || u.includes('performance') || u.includes('shy_tech'));
  crawled['ix'] = {
    status: 200,
    pageUrl: 'https://www.bmw-saudiarabia.com/models/theix/',
    scene7: [],
    dam: ixImgs
  };

  fs.writeFileSync('scratch/bmw_crawled_images.json', JSON.stringify(crawled, null, 2), 'utf8');
  console.log('Updated scratch/bmw_crawled_images.json!');
}

fixMissing();
