const xlsx = require('../autoportal/node_modules/xlsx');
const fs = require('fs');

const excelPath = 'C:/Users/7assan/.gemini/antigravity/brain/b98ac83d-af8a-4b8c-8fd3-a782aba20715/.user_uploaded/media_1794861180104_7d5d5b50.xlsx';
const wb = xlsx.readFile(excelPath);

function getCleanRows(sheetName) {
  const sheet = wb.Sheets[sheetName];
  const raw = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  // Find header row
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(raw.length, 5); i++) {
    if (raw[i] && (raw[i][0] === 'id' || raw[i][1] === 'الموديل' || raw[i][0] === 'الموديل')) {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex === -1) return raw;
  const headers = raw[headerRowIndex];
  const rows = [];
  for (let i = headerRowIndex + 1; i < raw.length; i++) {
    const r = raw[i];
    if (!r || r.length === 0 || !r.some(cell => cell !== undefined && cell !== '')) continue;
    const obj = {};
    headers.forEach((h, idx) => {
      if (h) obj[h.trim()] = r[idx];
    });
    rows.push(obj);
  }
  return rows;
}

const specs = getCleanRows('مواصفات_الوكيل_المصري');
const prices = getCleanRows('أسعار_مصر');
const brochures = getCleanRows('المصادر_والبروشورات');
const branches = getCleanRows('الوكلاء_ومراكز_الخدمة');

fs.writeFileSync('scratch/bmw_parsed.json', JSON.stringify({
  specsCount: specs.length,
  pricesCount: prices.length,
  brochuresCount: brochures.length,
  branchesCount: branches.length,
  specs,
  prices,
  brochures,
  branches
}, null, 2), 'utf8');

console.log(`Parsed: ${specs.length} specs, ${prices.length} prices, ${brochures.length} brochures, ${branches.length} branches`);
