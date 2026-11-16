async function check() {
  const res = await fetch('https://www.mgmotor.com.eg/model/mg-gt/');
  const html = await res.text();
  const imgs = [...html.matchAll(/(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp))/gi)].map(m => m[1]);
  const unique = [...new Set(imgs)];
  console.log('GT all images count:', unique.length);
  unique.forEach(u => console.log(u));
}
check();
