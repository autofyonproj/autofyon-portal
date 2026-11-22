const xlsx = require('xlsx');
const path = 'C:/Users/7assan/.gemini/antigravity/brain/20b02abe-fe4c-457e-9abc-217ccacd1486/.user_uploaded/media_1795340796481_3d40ca3a.xlsx';
const wb = xlsx.readFile(path);
console.log('Sheet names:', wb.SheetNames);
for (const name of wb.SheetNames) {
  const s = wb.Sheets[name];
  const rows = xlsx.utils.sheet_to_json(s);
  console.log(`\n=== Sheet: ${name} (${rows.length} rows) ===`);
  if (rows.length > 0) {
    console.log('Columns:', Object.keys(rows[0]));
    console.log('Sample row 0:', JSON.stringify(rows[0], null, 2));
    if (rows.length > 1) {
      console.log('Sample row 1:', JSON.stringify(rows[1], null, 2));
    }
  }
}
