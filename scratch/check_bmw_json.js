const fs = require('fs');

const html = fs.readFileSync('scratch/bmw_x5_sample.html', 'utf8');

// Search for any .json or data attributes
const jsonUrls = html.match(/https?:\/\/[^"'\s<>]+\.json[^"'\s<>]*/gi) || [];
console.log('JSON URLs:', jsonUrls);

// Search for image or asset paths
const damMatches = html.match(/\/content\/dam\/[^"'\s<>]+/gi) || [];
console.log('DAM matches count:', damMatches.length);
console.log('DAM unique:', [...new Set(damMatches)].slice(0, 20));

// Check if there are embedded JSON objects in <script> tags
const scriptJson = html.match(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Embedded JSON script tags:', scriptJson.length);
if (scriptJson.length > 0) {
  fs.writeFileSync('scratch/bmw_embedded_json.txt', scriptJson.join('\n---\n'));
}
