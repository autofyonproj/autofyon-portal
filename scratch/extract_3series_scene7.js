const fs = require('fs');
const html = fs.readFileSync('scratch/bmw_3series.html', 'utf8');

const regex = /https:\/\/bmw\.scene7\.com\/is\/image\/BMW\/[^"'<>\s]+/gi;
const matches = html.match(regex) || [];
const clean = [...new Set(matches.map(u => u.replace(/&amp;/g, '&')))];

console.log('Scene7 images found for 3 Series:', clean.length);
clean.forEach(u => console.log(' -', u));
