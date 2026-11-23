const { execSync } = require('child_process');
const output = execSync(
  'npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT id, slug, name, type_id FROM businesses WHERE slug LIKE \'%mg%\' LIMIT 10" --json',
  { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
);
console.log(output);
