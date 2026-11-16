async function check() {
  const res = await fetch('https://toyota.com.eg/en/models/corolla');
  const text = await res.text();
  console.log('length:', text.length);
  const imgs = text.match(/src="([^"]+)"/g) || [];
  console.log('src matches:', imgs.slice(0, 30));
  // check for json or image urls
  const anyImg = text.match(/https?:\/\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp|svg)/gi) || [];
  console.log('anyImg:', anyImg.slice(0, 20));
  const relImg = text.match(/(\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp|svg))/gi) || [];
  console.log('relImg:', relImg.slice(0, 20));
}
check();
