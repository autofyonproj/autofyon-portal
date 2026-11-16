async function searchLang() {
  const res = await fetch('https://toyota.com.eg/en/js/lang-en.js');
  const text = await res.text();
  const urls = text.match(/https?:\/\/[^"'\s<>]+\.(?:png|jpg|jpeg|webp)/gi) || [];
  const storage = text.match(/\/storage\/[^"'\s<>]+\.(?:png|jpg|jpeg|webp)/gi) || [];
  console.log('URLs in lang-en.js:', urls);
  console.log('Storage in lang-en.js:', storage);
}
searchLang();
