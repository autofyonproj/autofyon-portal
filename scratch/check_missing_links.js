const fs = require('fs');
const html = fs.readFileSync('scratch/all_models_page.html', 'utf8');

function findLinks(term) {
  const reg = new RegExp(`href="([^"]*${term}[^"]*)"`, 'gi');
  const matches = [];
  let m;
  while ((m = reg.exec(html)) !== null) {
    matches.push(m[1]);
  }
  return [...new Set(matches)];
}

console.log('7-series links:', findLinks('7-series'));
console.log('x7 links:', findLinks('x7'));
console.log('ix links:', findLinks('ix'));
