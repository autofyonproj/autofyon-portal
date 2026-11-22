const XLSX = require('xlsx');
const wb = XLSX.readFile('C:/Users/7assan/.gemini/antigravity/brain/20b02abe-fe4c-457e-9abc-217ccacd1486/.user_uploaded/media_1795340796481_3d40ca3a.xlsx');
const ws = wb.Sheets['مقارنة_ملونة'];
if (!ws) {
  console.log('No such sheet.');
} else {
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  rows.slice(0, 30).forEach((r, idx) => {
    if (r.some(cell => cell !== '')) {
      console.log(`R${idx}:`, JSON.stringify(r));
    }
  });
}
