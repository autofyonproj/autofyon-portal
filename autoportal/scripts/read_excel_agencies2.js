const XLSX = require('xlsx');

const filePath = 'C:/Users/7assan/.gemini/antigravity/brain/20b02abe-fe4c-457e-9abc-217ccacd1486/.user_uploaded/media_1795340796481_3d40ca3a.xlsx';
const wb = XLSX.readFile(filePath);

// Focus on the agencies/dealers sheet and prices sheet
const sheetsToRead = ['الوكلاء_ومراكز_الخدمة', 'أسعار_مصر', 'مواصفات_الوكيل_المصري', 'المصادر_والبروشورات'];

sheetsToRead.forEach(name => {
  if (!wb.Sheets[name]) { console.log(`Sheet "${name}" NOT FOUND`); return; }
  const ws = wb.Sheets[name];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  console.log(`\n\n========== SHEET: ${name} (${data.length} rows) ==========`);
  data.forEach((row, i) => {
    if (row.some(c => c !== '')) {
      console.log(`R${i}: ${JSON.stringify(row)}`);
    }
  });
});
