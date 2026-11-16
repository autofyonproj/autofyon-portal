const { execFileSync } = require('child_process');

const query = process.argv[2] || 'SELECT id, name, slug, published, status FROM businesses WHERE slug = "mg-gt"';

try {
  const stdout = execFileSync('npx.cmd', ['wrangler', 'd1', 'execute', 'autoportal-d1', '--remote', '--json', `--command=${query}`], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    shell: true,
  });
  const jsonStart = stdout.indexOf('[');
  if (jsonStart !== -1) {
    const data = JSON.parse(stdout.slice(jsonStart));
    console.log(JSON.stringify(data[0].results, null, 2));
  } else {
    console.log(stdout);
  }
} catch (err) {
  console.error("Execution error:", err.stdout || err.message);
}
