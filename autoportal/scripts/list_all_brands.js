const { execSync } = require('child_process');
const output = execSync(
  'npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT id, slug, name, name_ar FROM businesses WHERE type_id = \'vehicle_brand\' ORDER BY name" --json',
  { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
);
const parsed = JSON.parse(output);
console.log(JSON.stringify(parsed[0].results, null, 2));
