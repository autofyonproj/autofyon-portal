async function testRedirect() {
  const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGgrGUwxb5Xx3uYiD60Dj2m4ZYuH3UEBi_ydvUcTHci4uPO01TG2ZKbyHQC5v2oB1HDPTHJvbSDSUVw3rhZHIsWq_Tcx-Jvf42kCLPLeovX2hWhTdGZ-E7gw7XNqR1ENcTy8VFTISvachbCxTB3ZK_RRBSoVKuNaeWhB0kuahNY3KEPM5nTafGbbDdcInY=';
  const res = await fetch(url, { redirect: 'manual' });
  console.log('Location:', res.headers.get('location'));
}
testRedirect();
