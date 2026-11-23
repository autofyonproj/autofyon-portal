const fs = require('fs');
const { execSync } = require('child_process');

const sql = fs.readFileSync('e:/autofyon fof VSCode/autoportal/scripts/ingest_toyota.sql', 'utf8');
const inserts = sql.split('INSERT INTO businesses');

console.log('Total business inserts:', inserts.length - 1);

inserts.slice(1).forEach((insert, idx) => {
  const match = insert.match(/VALUES\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*('[^']*'|NULL)\s*,\s*'([^']+)'/i);
  if (match) {
    const id = match[1];
    const name = match[2];
    const slug = match[4];
    try {
      const check = execSync(
        `npx.cmd wrangler d1 execute autoportal-d1 --remote --command="SELECT id, slug FROM businesses WHERE slug = '${slug}'" --json`,
        { cwd: 'e:/autofyon fof VSCode/autoportal', encoding: 'utf8' }
      );
      const parsed = JSON.parse(check);
      const rows = parsed[0]?.results || [];
      if (rows.length && rows[0].id !== id) {
        console.log(`❌ CONFLICT #${idx}: slug "${slug}" exists with id "${rows[0].id}" but script tried inserting id "${id}"`);
      } else {
        console.log(`✓ #${idx}: id "${id}", slug "${slug}" -> ok (${rows.length ? 'match' : 'new'})`);
      }
    } catch (e) {
      console.log(`Err on #${idx}:`, e.message);
    }
  }
});
