const { execSync } = require('child_process');
const output = execSync(
  'npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT id, slug, type_id FROM businesses WHERE slug LIKE \'%toyota%\' OR slug LIKE \'%corolla%\' OR slug LIKE \'%fortuner%\' OR slug LIKE \'%prado%\'" --json',
  { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
);
console.log(output);
