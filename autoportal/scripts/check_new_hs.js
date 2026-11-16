async function checkNewHs() {
  const res = await fetch('https://www.mgmotor.com.eg/model/new-hs/');
  const html = await res.text();
  const matches = [...html.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
  const unique = [...new Set(matches)].filter(u =>
    !u.includes('logo') && !u.includes('favicon') && !u.includes('icon') &&
    !u.includes('facebook') && !u.includes('insta') && !u.includes('Youtube') &&
    !u.includes('RX9') && !u.includes('tik-tok') && !u.includes('egypt') &&
    !u.includes('Menu')
  );
  console.log('New HS unique images count:', unique.length);
  unique.forEach(u => console.log('  ' + u));
}
checkNewHs();
