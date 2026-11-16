async function checkScripts() {
  const res = await fetch('https://toyota.com.eg/en');
  const html = await res.text();
  const scripts = [...html.matchAll(/src="([^"]+\.js[^"]*)"/g)].map(m => m[1]);
  console.log('Scripts:', scripts);
}
checkScripts();
