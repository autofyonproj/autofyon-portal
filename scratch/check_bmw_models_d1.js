const { execSync } = require('child_process');
const out = execSync(`npx.cmd wrangler d1 execute autoportal-d1 --remote --json --command "SELECT id, name, slug FROM businesses WHERE parent_business_id = 'biz_brand_bmw'"`, { cwd: 'autoportal', encoding: 'utf8' });
const json = JSON.parse(out.substring(out.indexOf('['), out.lastIndexOf(']') + 1));
console.log('BMW Models in DB:', json[0].results.length);
json[0].results.forEach(r => console.log(' -', r.id, '|', r.name, '|', r.slug));
