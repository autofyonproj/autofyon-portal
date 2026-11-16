async function testIXSA() {
  const url = 'https://www.bmw-saudiarabia.com/en/all-models/bmw-i-series/ix/bmw-ix.html';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('Status:', res.status);
  if (res.ok) {
    const html = await res.text();
    const regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
    const m = html.match(regex) || [];
    console.log('Scene7 images for iX:', m.length);
    fs.writeFileSync('scratch/ix_scene7.json', JSON.stringify(m, null, 2));
  }
}
const fs = require('fs');
testIXSA();
