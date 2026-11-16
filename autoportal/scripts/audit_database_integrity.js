const { execSync } = require('child_process');

function runD1(sql) {
  const cmd = `npx wrangler d1 execute autoportal-d1 --remote --json --command="${sql.replace(/"/g, '\\"')}"`;
  const out = execSync(cmd, { cwd: __dirname + '/../autoportal', encoding: 'utf-8' });
  const parsed = JSON.parse(out);
  return parsed[0].results;
}

console.log('--- 1. BRANDS AND MODELS HIERARCHY ---');
const models = runD1(`
  SELECT m.id, m.name, m.slug, m.parent_business_id, p.name as parent_name, p.slug as parent_slug
  FROM businesses m
  LEFT JOIN businesses p ON m.parent_business_id = p.id
  WHERE m.type_id = 'vehicle_model'
  ORDER BY m.parent_business_id, m.name;
`);
console.table(models);

console.log('--- 2. BUSINESS RELATIONSHIPS FOR MODELS ---');
const rels = runD1(`
  SELECT r.id, r.relation_type,
         s.name as source_name, s.slug as source_slug,
         t.name as target_name, t.slug as target_slug
  FROM business_relationships r
  JOIN businesses s ON r.source_business_id = s.id
  JOIN businesses t ON r.target_business_id = t.id
  WHERE s.type_id = 'vehicle_model' OR t.type_id = 'vehicle_model';
`);
console.table(rels);

console.log('--- 3. VENDOR GALLERY IMAGES AUDIT ---');
const gallery = runD1(`
  SELECT g.id, b.slug as car_slug, b.name as car_name, g.section_id, g.field_key, g.field_section_id, g.url, g.caption
  FROM vendor_gallery g
  JOIN businesses b ON g.business_id = b.id
  WHERE b.type_id = 'vehicle_model'
  ORDER BY b.slug, g.section_id;
`);
console.table(gallery);
