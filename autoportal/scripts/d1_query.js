const { execSync } = require('child_process');
const fs = require('fs');

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("Usage: node scripts/d1_query.js <path-to-sql-file>");
  process.exit(1);
}

try {
  const stdout = execSync(`npx.cmd wrangler d1 execute autoportal-d1 --remote --json --file=${sqlFile}`, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  // Find JSON array in stdout
  const match = stdout.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (match) {
    const data = JSON.parse(match[0]);
    if (data[0] && data[0].results) {
      console.log(JSON.stringify(data[0].results, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } else {
    console.log(stdout);
  }
} catch (err) {
  console.error("Error executing query:", err.stdout || err.message);
}
