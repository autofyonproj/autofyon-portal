const { execSync } = require('child_process');

function runD1(sql) {
  try {
    const cmd = `npx.cmd wrangler d1 execute autoportal-d1 --remote --command="${sql.replace(/"/g, '\\"')}" --json`;
    const out = execSync(cmd, { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' });
    const parsed = JSON.parse(out);
    return parsed[0].results;
  } catch (err) {
    return { error: err.message };
  }
}

console.log('--- Total events count ---');
console.log(runD1('SELECT event_type, COUNT(*) as count FROM business_analytics_events GROUP BY event_type'));

console.log('--- Hosts recorded in analytics ---');
console.log(runD1('SELECT host, source_host, COUNT(*) as count FROM business_analytics_events GROUP BY host, source_host'));

console.log('--- Recent events ---');
console.log(runD1('SELECT id, business_id, event_type, host, path, contact_target, created_at FROM business_analytics_events ORDER BY created_at DESC LIMIT 30'));

console.log('--- Leads recorded ---');
console.log(runD1('SELECT COUNT(*) as count FROM vendor_leads'));
console.log(runD1('SELECT * FROM vendor_leads ORDER BY created_at DESC LIMIT 10'));
