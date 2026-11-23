const { execSync } = require('child_process');

const sql = "SELECT id, business_id, event_type, host, path, contact_target, created_at FROM business_analytics_events WHERE event_type IN ('phone_click', 'whatsapp_click', 'vehicle_click') ORDER BY created_at DESC";
const out = execSync(`npx.cmd wrangler d1 execute autoportal-d1 --remote --command="${sql}" --json`, {
  cwd: 'e:/autofyon fof VSCode/autoportal',
  encoding: 'utf8'
});
console.log(JSON.stringify(JSON.parse(out)[0].results, null, 2));
