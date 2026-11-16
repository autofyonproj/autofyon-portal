const fs = require('fs');
const crawled = JSON.parse(fs.readFileSync('scratch/bmw_crawled_images.json', 'utf8'));

console.log('--- Summary of Crawled Scene7 Images ---');
for (const [model, data] of Object.entries(crawled)) {
  const s7 = data.scene7 || [];
  console.log(`${model}: ${s7.length} Scene7 images (Status: ${data.status || data.error})`);
}
