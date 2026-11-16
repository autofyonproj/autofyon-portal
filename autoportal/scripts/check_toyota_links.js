async function getToyotaLinks() {
  const res = await fetch('https://toyota.com.eg/en');
  const html = await res.text();
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log('Sample hrefs:', hrefs.filter(h => h.includes('model') || h.includes('cars')).slice(0, 30));
}
getToyotaLinks();
