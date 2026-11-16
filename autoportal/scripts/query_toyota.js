const { query } = require('./db_helper.js');

async function main() {
  const models = await query(`
    SELECT id, name, name_ar, slug, type_id 
    FROM businesses 
    WHERE parent_business_id = 'biz_brand_toyota' OR slug LIKE '%toyota%'
  `);
  console.log(JSON.stringify(models, null, 2));
}
