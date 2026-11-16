async function getToyotaAllHrefs() {
  const res = await fetch('https://toyota.com.eg/ar');
  const html = await res.text();
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log('Toyota AR hrefs:', hrefs);
}
getToyotaAllHrefs();
