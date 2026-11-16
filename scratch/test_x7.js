async function testX7() {
  const url = 'https://www.bmw-egypt.com/en/all-models/m-series/x7-m60i/bmw-x7-m60i.html';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('X7 HTTP status:', res.status);
  if (res.ok) {
    const html = await res.text();
    const regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
    const matches = html.match(regex) || [];
    console.log('X7 Scene7 images:', matches.length);
  }
}
testX7();
