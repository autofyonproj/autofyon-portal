const fs = require('fs');
const data = require('./bmw_parsed.json');

console.log('--- Trims Mapping ---');
const modelGroups = {};

data.specs.forEach((s, idx) => {
  const modelName = s['الموديل'];
  const trimName = s['الفئة / النسخة'];
  if (!modelGroups[modelName]) modelGroups[modelName] = [];
  
  // Find matching price
  const priceRow = data.prices.find(p => {
    return (p['الموديل'] === modelName || modelName.includes(p['الموديل']) || p['الموديل'].includes(modelName)) &&
           (p['الفئة'] === trimName || trimName.includes(p['الفئة']) || p['الفئة'].includes(trimName));
  });

  modelGroups[modelName].push({
    trim: trimName,
    body: s['نوع الهيكل'],
    engine_cc: s['سعة المحرك cc'],
    hp: s['القوة حصان'],
    torque: s['العزم نيوتن.متر @دورة'],
    transmission: s['ناقل الحركة'],
    accel: s['0-100 ثانية'],
    top_speed: s['السرعة القصوى كم/س'],
    price: priceRow ? priceRow['السعر جنيه'] : null,
    priceNote: priceRow ? priceRow['التحقق'] : 'No direct price match'
  });
});

for (const [m, list] of Object.entries(modelGroups)) {
  console.log(`\nModel: ${m} (${list.length} trims)`);
  list.forEach(t => {
    console.log(`  - ${t.trim} | ${t.engine_cc}cc | ${t.hp}hp | 0-100: ${t.accel}s | Price: ${t.price ? t.price.toLocaleString() + ' EGP' : 'N/A'}`);
  });
}
