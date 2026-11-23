const { execSync } = require('child_process');
const output = execSync(
  'npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT id, slug, parent_business_id FROM businesses WHERE type_id = \'vehicle_trim\' AND parent_business_id LIKE \'%mg%\'" --json',
  { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
);
console.log(output);
