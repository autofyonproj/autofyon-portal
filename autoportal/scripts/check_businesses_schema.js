const { execSync } = require('child_process');
const output = execSync(
  'npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT sql FROM sqlite_master WHERE type=\'table\' AND name=\'businesses\'" --json',
  { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
);
console.log(output);
