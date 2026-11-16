async function testRedirect() {
  const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGnxsqiaaKQM1uFmfbjrJ3r7hywgEo7BC9x1xFEuUMlDwcu6CgvK_nPmobR0RVpFWhPTIS-oN3d-ufkenxMJti5w-i2vU_JjUUUHELZW84yzWne9ZIbdbPb4Z6hFj11UA==';
  const res = await fetch(url, { redirect: 'manual' });
  console.log('Location:', res.headers.get('location'));
}
testRedirect();
