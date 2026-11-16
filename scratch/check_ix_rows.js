const parsed = require('./bmw_parsed.json');
const ixRows = parsed.specs.filter(s => (s['الموديل'] || '').includes('iX'));
console.log('Total iX rows in Excel:', ixRows.length);
ixRows.forEach(r => console.log(' - Model:', r['الموديل'], '| Trim:', r['الفئة / النسخة']));
