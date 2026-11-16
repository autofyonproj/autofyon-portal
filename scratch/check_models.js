const data = require('./bmw_parsed.json');

const modelsMap = {};
data.specs.forEach(s => {
  const m = s['الموديل'];
  if (!modelsMap[m]) modelsMap[m] = [];
  modelsMap[m].push(s);
});

console.log('Unique Models in Specs:', Object.keys(modelsMap).length);
Object.entries(modelsMap).forEach(([name, list]) => {
  console.log(`- ${name}: ${list.length} trims, brochure: ${list[0]['مصدر الوكيل (بروشور/صفحة)'] || 'none'}`);
});

console.log('\nBrochures list:');
data.brochures.forEach(b => {
  console.log(`- ${b['الموديل']}: ${b['بروشور/صفحة الوكيل']}`);
});
