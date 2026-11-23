const { execSync } = require('child_process');
const output = execSync(
  'npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT id, slug, type_id FROM businesses WHERE slug IN (\'mg-5\', \'mg-zs\', \'mg-gt\', \'mg-g50-plus\', \'mg-one\', \'mg-rx5-plus\', \'mg-hs\', \'mg-7\', \'mansour-automotive-mg\', \'mg\')" --json',
  { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
);
console.log(output);
