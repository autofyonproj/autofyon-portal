const xlsx = require('../autoportal/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'C:/Users/7assan/.gemini/antigravity/brain/b98ac83d-af8a-4b8c-8fd3-a782aba20715/.user_uploaded/media_1794861180104_7d5d5b50.xlsx';
const workbook = xlsx.readFile(excelPath);

console.log('Sheets found:', workbook.SheetNames);

const output = {};
for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  output[sheetName] = {
    rowCount: data.length,
    columns: data.length > 0 ? Object.keys(data[0]) : [],
    sample: data.slice(0, 3)
  };
}

fs.writeFileSync('scratch/excel_summary.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Summary written to scratch/excel_summary.json');
