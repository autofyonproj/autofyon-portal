const fs = require('fs');
const html = fs.readFileSync('scratch/bmw_x5_sample.html', 'utf8');

const regex = /(?:https?:\/\/[^"'<>\s]+\.(?:jpg|jpeg|png|webp)|\/content\/dam\/[^"'<>\s]+)/gi;
const matches = html.match(regex) || [];
const unique = [...new Set(matches.map(u => u.startsWith('/') ? 'https://www.bmw-egypt.com' + u : u))];

console.log('Total unique image/dam URLs in X5 sample:', unique.length);
console.log('Sample:');
console.log(unique.filter(u => !u.endsWith('.js') && !u.endsWith('.css') && !u.endsWith('.svg')).slice(0, 30));
