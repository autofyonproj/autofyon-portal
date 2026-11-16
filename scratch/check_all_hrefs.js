const fs = require('fs');
const html = fs.readFileSync('scratch/all_models_page.html', 'utf8');

// Find all hrefs on the page
const hrefs = html.match(/href="([^"]+)"/gi) || [];
const cleanHrefs = [...new Set(hrefs.map(h => h.replace(/^href="/, '').replace(/"$/, '')))];

console.log('Total hrefs on all-models:', cleanHrefs.length);
console.log('Hrefs matching 7:', cleanHrefs.filter(h => h.includes('7')));
console.log('Hrefs matching ix:', cleanHrefs.filter(h => h.toLowerCase().includes('ix')));
