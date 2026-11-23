const { execSync } = require('child_process');

try {
  const sql = 'ALTER TABLE business_analytics_events ADD COLUMN country TEXT;';
  const out = execSync(`npx.cmd wrangler d1 execute autoportal-d1 --remote --command="${sql}" --json`, {
    cwd: 'e:/autofyon fof VSCode/autoportal',
    encoding: 'utf8'
  });
  console.log('Country column added:', out);
} catch (e) {
  console.log('Country column check/error:', e.message);
}

try {
  const sql = 'ALTER TABLE business_analytics_events ADD COLUMN city TEXT;';
  const out = execSync(`npx.cmd wrangler d1 execute autoportal-d1 --remote --command="${sql}" --json`, {
    cwd: 'e:/autofyon fof VSCode/autoportal',
    encoding: 'utf8'
  });
  console.log('City column added:', out);
} catch (e) {
  console.log('City column check/error:', e.message);
}
