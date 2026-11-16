async function testScene7() {
  const url = 'https://bmw.scene7.com/is/image/BMW/g20_ice_stage-50-years:16to7?fmt=webp-alpha&wid=1279&fit=constrain%2C1';
  const res = await fetch(url);
  console.log('Scene7 HTTP status:', res.status, 'Content-type:', res.headers.get('content-type'), 'Length:', res.headers.get('content-length'));
}
testScene7();
