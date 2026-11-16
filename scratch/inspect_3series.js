async function inspect() {
  const res = await fetch('https://www.bmw-egypt.com/en/all-models/3-series/sedan/2022/bmw-3-series-sedan-overview.html', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  const fs = require('fs');
  fs.writeFileSync('scratch/bmw_3series.html', html);
  console.log('Saved bmw_3series.html, size:', html.length);
  
  // Look for any image tags or picture or data-src or data-asset or dam
  const tags = html.match(/<(?:img|picture|source|div)[^>]*(?:src|data-src|srcset|data-asset|data-image)[^>]*>/gi) || [];
  console.log('Found tags with image attributes:', tags.length);
  console.log('Sample tags:', tags.slice(0, 10));

  // Look for cosydrive or cosy visualizer or bimmer / press assets
  const cosy = html.match(/https?:\/\/[^"'<>\s]+cosy[^"'<>\s]*/gi) || [];
  console.log('Cosy matches:', cosy);

  // Look for any mention of .jpg or .png anywhere
  const anyImages = html.match(/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || [];
  console.log('Any images mentioned:', anyImages.length);
  console.log('Sample images:', anyImages.slice(0, 15));
}

inspect();
