const XLSX = require('xlsx');
const fs = require('fs');

const filePath = 'C:/Users/7assan/.gemini/antigravity/brain/20b02abe-fe4c-457e-9abc-217ccacd1486/.user_uploaded/media_1795340796481_3d40ca3a.xlsx';
const wb = XLSX.readFile(filePath);

// Parse specs sheet
const specsWs = wb.Sheets['مواصفات_الوكيل_المصري'];
const specsRows = XLSX.utils.sheet_to_json(specsWs, { header: 1, defval: '' });
const specsHeader = specsRows[3]; // header row
const specsData = specsRows.slice(4).filter(r => r[0] !== '' && typeof r[0] === 'number');

// Parse prices sheet
const pricesWs = wb.Sheets['أسعار_مصر'];
const pricesRows = XLSX.utils.sheet_to_json(pricesWs, { header: 1, defval: '' });
const pricesData = pricesRows.slice(4).filter(r => r[0] !== '' && typeof r[0] === 'number');

// Parse dealers sheet
const dealersWs = wb.Sheets['الوكلاء_ومراكز_الخدمة'];
const dealersRows = XLSX.utils.sheet_to_json(dealersWs, { header: 1, defval: '' });
const dealersData = dealersRows.slice(4).filter(r => r[0] !== '' && typeof r[0] === 'number');

// Parse brochures sheet
const brochuresWs = wb.Sheets['المصادر_والبروشورات'];
const brochuresRows = XLSX.utils.sheet_to_json(brochuresWs, { header: 1, defval: '' });
const brochuresData = brochuresRows.slice(4).filter(r => r[0] !== '');

console.log('\n=== DEALERS ===');
dealersData.forEach(r => {
  console.log(JSON.stringify({
    id: r[0], agency: r[1], branch: r[2], type: r[3],
    city: r[4], gov: r[5], address: r[6], phone: r[7],
    source: r[8], confidence: r[9], note: r[10]
  }));
});

console.log('\n=== PRICES ===');
pricesData.forEach(r => {
  console.log(JSON.stringify({
    id: r[0], model: r[1], trim: r[2], year: r[3],
    priceType: r[4], price: r[5], minP: r[6], maxP: r[7]
  }));
});

console.log('\n=== SPECS (first 10) ===');
specsData.slice(0, 10).forEach(r => {
  console.log(JSON.stringify({
    id: r[0], model: r[1], trim: r[2], body: r[3], fuel: r[4],
    cc: r[5], cyl: r[6], hp: r[7], torque: r[8], trans: r[9],
    drive: r[10], acc: r[11], topspeed: r[12], consumption: r[13],
    seats: r[23], source: r[24]
  }));
});

console.log('\n=== BROCHURES ===');
brochuresData.forEach(r => {
  console.log(JSON.stringify({ model: r[0], url: r[1], status: r[2] }));
});
