async function checkToyota() {
  const models = [
    { slug: 'corolla', url: 'https://toyota.com.eg/en/models/corolla' },
    { slug: 'fortuner', url: 'https://toyota.com.eg/en/models/fortuner' },
    { slug: 'urban-cruiser', url: 'https://toyota.com.eg/en/models/urban-cruiser' },
    { slug: 'prado', url: 'https://toyota.com.eg/en/models/land-cruiser-prado' },
    { slug: 'yaris', url: 'https://toyota.com.eg/en/models/yaris' }
  ];

  for (const m of models) {
    try {
      const res = await fetch(m.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      console.log(`Toyota ${m.slug}: status=${res.status}`);
      if (res.status === 200) {
        const html = await res.text();
        const matches = [...html.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
        const unique = [...new Set(matches)].filter(u =>
          !u.includes('logo') && !u.includes('favicon') && !u.includes('icon')
        );
        console.log(`  Found ${unique.length} images:`, unique.slice(0, 10));
      }
    } catch (e) {
      console.error(`Toyota ${m.slug} error:`, e.message);
    }
  }
}
checkToyota();
