async function testIXImages() {
  const res = await fetch('https://www.bmw-saudiarabia.com/models/theix/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const regex = /https?:\/\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)/gi;
  const matches = html.match(regex) || [];
  console.log('Matches:', [...new Set(matches)]);
}
testIXImages();
