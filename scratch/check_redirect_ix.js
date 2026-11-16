async function testRedirect() {
  const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHfs6JQnCw2xr30809Dc20nmbUInoRn9u678cxIBNNAmp-unFLPhmwwoCbcMTgIfVU2Eg3jUGQkF2I42BlFW7SQSjU5hK1QH_zANTbbO-EnGmCwcCqK3KVOnoKJF34K59qA-g==';
  const res = await fetch(url, { redirect: 'manual' });
  console.log('Location:', res.headers.get('location'));
}
testRedirect();
