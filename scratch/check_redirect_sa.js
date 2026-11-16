async function testRedirect() {
  const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEa20XauYK_n8mVfXB_370eRwYhEZDdzmqQR7cZT4oWnJu_zlirSFovDTyq85ftFfZcXonZyhLnSPYIlPZcf4ckUtuxkoiOISJ94sOwVRXCsfuRa46LFPunqW5uAIfSv-81fck=';
  const res = await fetch(url, { redirect: 'manual' });
  console.log('Location:', res.headers.get('location'));
}
testRedirect();
