async function testIX() {
  const urls = [
    'https://www.bmw-egypt.com/en/all-models/7-series/7-series-sedan/bmw-7-series-sedan.html',
    'https://www.bmw-me.com/en/all-models/bmw-i/ix/2021/bmw-ix.html',
    'https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html'
  ];
  for (const u of urls) {
    const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log(u, 'status:', res.status);
    if (res.ok) {
      const html = await res.text();
      const regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
      const m = html.match(regex) || [];
      console.log(' -> Scene7 images count:', m.length);
    }
  }
}
testIX();
