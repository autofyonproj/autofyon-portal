async function testTheIX() {
  const urls = [
    'https://www.bmw-egypt.com/models/theix/',
    'https://www.bmw-saudiarabia.com/models/theix/'
  ];
  const fs = require('fs');
  for (const u of urls) {
    const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log(u, 'status:', res.status);
    if (res.ok) {
      const html = await res.text();
      const regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
      const m = html.match(regex) || [];
      console.log(' -> Scene7 count:', m.length);
      if (m.length > 0) {
        fs.writeFileSync('scratch/ix_images.json', JSON.stringify([...new Set(m)], null, 2));
      }
    }
  }
}
testTheIX();
