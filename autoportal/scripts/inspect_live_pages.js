async function inspect() {
  const urls = [
    'https://autofyon.com/mg-zs',
    'https://autofyon.com/mg-gt',
    'https://autofyon.com/corolla',
    'https://autofyon.com/toyota',
    'https://autofyon.com/mg'
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u);
      const html = await res.text();
      console.log('==============================================');
      console.log('PAGE:', u, 'STATUS:', res.status);
      
      // Extract slide titles and note
      const slideTitles = [...html.matchAll(/class="[^"]*slide-title[^"]*"[^>]*>([^<]+)</g)].map(m => m[1].trim());
      console.log('Slide titles:', slideTitles);

      // Extract image sources
      const imgSources = [...html.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
      console.log('Images (top 5):', imgSources.slice(0, 5));

      // Extract section/panel headers
      const panels = [...html.matchAll(/class="panel-title">([^<]+)</g)].map(m => m[1].trim());
      console.log('Panels:', panels);

      // Extract shelf link texts
      const shelfLinks = [...html.matchAll(/class="shelf-link[^"]*"[^>]*>([^<]+)</g)].map(m => m[1].trim());
      console.log('Shelves in nav:', shelfLinks);
    } catch (e) {
      console.error('Error fetching', u, e.message);
    }
  }
}
inspect();
