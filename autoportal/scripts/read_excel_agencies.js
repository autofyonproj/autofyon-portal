const XLSX = require('xlsx');
const path = require('path');

const filePath = 'C:/Users/7assan/.gemini/antigravity/brain/20b02abe-fe4c-457e-9abc-217ccacd1486/.user_uploaded/media_1795340796481_3d40ca3a.xlsx';
const wb = XLSX.readFile(filePath);

console.log('=== SHEET NAMES ===');
console.log(JSON.stringify(wb.SheetNames, null, 2));

// Read each sheet and dump its content
wb.SheetNames.forEach(name => {
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  console.log(`\n\n=== SHEET: ${name} (${data.length} rows) ===`);
  // Print first 50 rows max
  data.slice(0, 50).forEach((row, i) => {
    if (row.some(c => c !== '')) {
      console.log(`Row ${i}: ${JSON.stringify(row)}`);
    }
  });
});
