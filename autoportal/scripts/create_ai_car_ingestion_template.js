const fs = require('fs');
const path = require('path');
const os = require('os');
const XLSX = require('xlsx');

const workbook = XLSX.utils.book_new();

function columnName(index) {
  let name = '';
  while (index > 0) {
    const remainder = (index - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    index = Math.floor((index - 1) / 26);
  }
  return name;
}

function addSheet(name, headers, rows, widths) {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  sheet['!cols'] = widths.map((wch) => ({ wch }));
  sheet['!autofilter'] = { ref: `A1:${columnName(headers.length)}${Math.max(1, rows.length + 1)}` };
  sheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' };
  XLSX.utils.book_append_sheet(workbook, sheet, name);
}

const startHere = [
  ['Purpose', 'Use this workbook to research one Egypt-market automotive brand and return structured, source-backed data for AutoFyon vehicle minisites. Complete one workbook per brand/market when practical.'],
  ['How to use', 'Read the copy-ready agent prompt below, inspect Section_Catalog and Field_Catalog, then fill the data sheets. Preserve these sheet names and column headers. Add rows rather than adding new columns.'],
  ['Step 1 - scope', 'Record the brand, official Egyptian agency/distributor, market, model year, and research snapshot date in Brand_Agency and Models. Separate body styles or powertrains only when the Egyptian lineup treats them as distinct models.'],
  ['Step 2 - evidence', 'Add every source to Sources before citing it. Prefer official Egypt-market agency pages and brochures. Record URL, access date, page/heading, exact supporting excerpt, market, and confidence for each important claim.'],
  ['Step 2A - Egyptian agent opportunities', 'Audit the official Egyptian agent website for model pages, specifications, trim tables, brochures, galleries, videos, FAQs, articles, prices, warranty, after-sales, dealer locator and contact forms. Record each page/API opportunity, what data it can support, access restrictions, and a Source_ID.'],
  ['Step 2B - supplied workbook integration', 'Use Workbook_Crosswalk to map BMW/Toyota source tabs into the normalized sheets. Original input tabs are embedded as IN_* read-only snapshots, with original Excel row numbers. Preserve useful values and source distinctions; do not treat a workbook statement as independently verified or silently merge conflicts.'],
  ['Step 3 - structured data', 'Write one model-level feature per row in Specs and one trim-specific equipment fact per row in Trim_Features. Use only field keys from Field_Catalog when available; put genuinely unmapped source facts in Extra_Facts for review.'],
  ['Step 4 - trims', 'Enter one row per officially offered Egypt-market trim in Trims. Record price only when the source and date support it; distinguish official list price from dealer/market estimate. Never overwrite an existing trim just because its name looks similar.'],
  ['Step 4A - GCC comparison', 'For each model AND each trim where evidence exists, record GCC-market specs as separate observations in Market_Comparisons, with country, model year, generation, powertrain, trim, source, and comparability. Use Trim_Differences to list exactly what changes between Egypt and GCC trims. GCC data is comparative only and must never silently replace Egypt-market values.'],
  ['Step 4A1 - seed comparisons', 'For each approved comparison, copy one atomic Market_Comparisons row into model.market_comparisons in the seed JSON. Include both Egypt and GCC values, trims, years, market, source IDs/URLs, confidence and review status. The vehicle model minisite displays approved rows on Specifications; unapproved/conflicted rows remain research-only.'],
  ['Step 4B - evaluations', 'Use Evaluations for sourced professional road tests, owner-review summaries, safety/quality assessments, and clearly labeled agent/AutoFyon content opportunities. Record evaluator, method, date, exact source, evidence, limitations, and whether it is a measured score or qualitative summary. Never fabricate star ratings or consensus.'],
  ['Step 5 - carousel', 'Every populated model-scope Specs row must have a matching, verified image asset. Put the asset URL, Source_ID, exact-feature proof and review status on the fact row AND create its matching Carousel_Media row with the same model, section and field key. For trim-specific features, find an exact trim image when available and record it against the relevant trim/feature; do not imply a model-level image proves trim-only equipment. Search official agent/manufacturer galleries and brochures for a photo or diagram that actually demonstrates the specific fact. Do not reuse one generic model image across unrelated specs. If no accurate asset can be verified, set NO_VERIFIED_ASSET, explain the search in QA_Checklist and do not fabricate/relabel an image; the record must be reported incomplete for media.'],
  ['Step 5A - service links', 'For every model, record verified showroom/seller (sold_by), finance (financed_by), insurance (insured_by), maintenance/service center (serviced_by), spare-parts (parts_for) and accessory/fitment (parts_for or compatible_with) relationships in Relationships. Service links on the model minisite come from these graph edges; do not invent providers or claim a provider is compatible without source evidence.'],
  ['Step 6 - articles', 'Use Articles to draft original bilingual minisite articles. Use verified facts and cite Source_IDs. Do not copy brochure/site prose. For an About/overview article, set Article_Type to Model_Overview and Publish_Destination to Custom_Page; a human editor creates/publishes it using the Site Builder. Section_Article is available only on sections configured to show blogs.'],
  ['Step 7 - relationships', 'Record agency, distributor, service network, manufacturing origin, warranty/finance/parts relationships in Relationships. Do not infer formal relationships from a directory listing.'],
  ['Step 8 - QA and handoff', 'Complete QA_Checklist, state unresolved conflicts, and return a short summary of added, matched, missing and disputed records. Keep uncertain values out of publishable rows until reviewed. Every extracted fact, price, media asset, evaluation, comparison and article claim must point to a Source_ID.'],
  ['AI AGENT PROMPT - COPY FROM THE NEXT ROW', `ROLE: Research Egypt-market automotive data and prepare BOTH (1) the completed, source-traceable AutoFyon minisite workbook and (2) an ingestion-ready JSON payload for ${'{BRAND}'}. Never execute SQL, write to AutoFyon, or claim import/deployment.\n\nINPUT WORKBOOK INTEGRATION: Read Workbook_Crosswalk first, then inspect every relevant embedded IN_* source tab. Treat these tabs as read-only source snapshots and preserve their original Excel row numbers. Map useful existing BMW/Toyota data into the normalized sheets without dropping trim-level distinctions, dates, units, price types, market labels or source notes. Use Sources.Input_Workbook/Input_Sheet/Input_Row to retain traceability. The supplied workbooks are discovery leads, not proof: verify publishable claims against the cited primary source. Keep conflicting observations separate, including the BMW workbook's reported 18 conflicts and Toyota Corolla airbag discrepancy; never auto-resolve or overwrite a conflict. Reconcile likely existing AutoFyon records before suggesting adds; flag similar names as review-required rather than merging or deleting them.\n\nEGYPTIAN AGENT SITE AUDIT: Use Agent_Website_Opportunities to inventory official Egypt agent pages and reachable resources: model/trim pages, spec tables, brochure/PDF links, image galleries, video, FAQs, articles/news, price/availability notices, warranty/service, branches/dealer locator and contact channels. Capture exact URL, page type, observed content, access/API limitations, date checked, what AutoFyon section it can fill, and Source_ID. Do not bypass access controls or imply an inaccessible page was reviewed.\n\nWORKBOOK CONTRACT: Preserve sheet names and headers. One model per Models row; one trim per Trims row; one atomic fact per Specs/Trim_Features/Market_Comparisons/Trim_Differences/Extra_Facts row; one asset per Carousel_Media row; one evaluation per Evaluations row; one article per Articles row; one relationship per Relationships row; and one source per Sources row. Use Section_ID/Field_Key from the catalogs. Every factual row must have a Source_ID plus page/heading or locator and evidence excerpt where the columns provide them. Sources must resolve to a URL or explicitly documented user-supplied/offline document. Never leave a publishable factual row without source attribution.\n\nSOURCE PRIORITY AND TRACEABILITY: First use the official Egyptian agent/manufacturer for Egypt specifications, trims, pricing, brochures, warranty and local images. Use official manufacturer GCC-country pages/brochures for GCC observations. Use official global sources only when exact generation/powertrain/market match is proven. Authorized dealer/secondary sources are cross-checks, not a reason to overwrite official values. Record publisher, full URL, access date, publication/effective date, country/market, model year, generation, trim, exact page/table/PDF page, verbatim short supporting excerpt, confidence, and limitation in Sources; put its Source_ID on each dependent fact. Keep disagreements as separate sourced observations, mark CONFLICTED/REVIEW_REQUIRED, and explain them. Distinguish current, historic, announced, imported and unknown values; do not turn an estimate into an official price.\n\nGCC VS EGYPT: For every Egypt model/trim, search relevant GCC markets (e.g. Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman) for the corresponding model year and exact trim/powertrain. Enter each observed GCC value separately in Market_Comparisons with country, source, exact variant and comparability. Add a Trim_Differences row for each evidenced difference (engine, output, drivetrain, safety equipment, comfort, technology, dimensions, warranty, trim availability, etc.) with both Egypt and GCC source IDs. If no exact counterpart or source exists, record NOT_FOUND/NOT_COMPARABLE in QA; never substitute GCC data into Egypt facts or imply all GCC countries share one specification.\n\nCAROUSELS: Group sourced values by their correct AutoFyon sections and suggest a readable order. Use Field_Catalog keys where available and Extra_Facts for unmapped facts. Carousel_Media must identify exact model, section, asset URL, original asset/source URL, source ID, exact-model proof, caption, and optional Field_Key/Field_Section_ID binding. Bind only media that truly shows that model/feature. No image sharing across models, placeholders, stock images, invented assets, or inaccurate section labels. Where no matching verified photo exists, mark TEXT_ONLY_OK and allow the branded text slide; do not delay or fabricate the fact itself.\n\nMODEL SERVICE LINKS: Use Relationships to record only verified existing-provider links for showrooms/sellers (sold_by), finance (financed_by), insurers (insured_by), maintenance/service centers (serviced_by), spare-parts providers (parts_for from provider to model), and accessories/fitment (parts_for or compatible_with). A model.relationships seed row must include relation_type, provider_business_id from a supplied AutoFyon export, optional direction, role_data and source_id. Never guess provider IDs or invent a compatible service. The minisite shows these service categories and links to linked provider minisites; categories with no verified providers say so.\n\nTRIM DIFFERENCES AND EVALUATIONS: Distinguish model-level shared specifications from trim-specific features. Record each trim name exactly, Arabic name if sourced, model year, Egypt price and price type/date/source, equipment differences and evidence. In Evaluations record evaluator/publisher, evaluation type/method, date, market/version tested, score exactly as published or source-backed qualitative assessment, tested criteria, URL/locator, excerpt, limitations and confidence. Do not invent ratings, summarize unsourced sentiment, treat a marketing claim as an independent evaluation, or fabricate customer reviews. Mark evaluation type as official_claim, independent_review, owner_review_summary, safety_test, or expert_assessment.\n\nABOUT AND ARTICLES: Draft original, helpful English/Arabic content (where evidence supports both) for a Model Overview/About custom page and focused articles when useful. Include clean page slug, titles, summaries, headings/body, FAQs, and Source_IDs for factual claims. Cover design, cabin, powertrain, comfort, safety, technology, Egypt trim choices, and clearly labeled GCC comparison. Do not copy source prose, fabricate reviews/ownership costs/warranty/availability, or present GCC equipment as Egyptian. Set DRAFT_REVIEW; a human must create/review/publish Custom_Page content in Site Builder. Section_Article is usable only where section blog support is enabled. Record each claim's Source_ID in Articles.\n\nQUALITY AND HANDOFF: Complete QA_Checklist; report source coverage and freshness, agent-site pages found/blocked, Egypt and GCC model/trim coverage, verified differences, service-provider coverage by type, evaluations, missing brochures/photos, conflicts and human-review items. Preserve ambiguity. Do not generate SQL. Begin: brand=${'{BRAND}'}; Egypt snapshot=${'{DATE}'}; requested model years=${'{YEARS}'}; GCC countries=${'{COUNTRIES}'}; AutoFyon export=${'{FILE OR NONE}'}; source bundle=${'{URLS/FILES}'};`
  ],
];

const integratedPromptIndex = startHere.findIndex(([topic]) => topic === 'AI AGENT PROMPT - COPY FROM THE NEXT ROW');
startHere[integratedPromptIndex][1] = startHere[integratedPromptIndex][1]
  .replace('Do not generate SQL.', 'Deliver the JSON payload described in AI_SEED_PROMPT as a separate file; never write to AutoFyon or claim import/deployment.')
  .replace(
    'CAROUSELS: Group sourced values by their correct AutoFyon sections and suggest a readable order. Use Field_Catalog keys where available and Extra_Facts for unmapped facts. Carousel_Media must identify exact model, section, asset URL, original asset/source URL, source ID, exact-model proof, caption, and optional Field_Key/Field_Section_ID binding. Bind only media that truly shows that model/feature. No image sharing across models, placeholders, stock images, invented assets, or inaccurate section labels. Where no matching verified photo exists, mark TEXT_ONLY_OK and allow the branded text slide; do not delay or fabricate the fact itself.',
    'CAROUSELS: Every populated Specs fact and every trim-specific feature needs an exact-feature image when the official sources provide one. Add the asset URL, Source_ID, proof and status to the fact row and create the matching Carousel_Media row using the same model, Section_ID and Field_Key. Bind the asset using images[].field_section_id and images[].field_key in seed JSON. Search official agent/manufacturer galleries and brochures for a photo or diagram that demonstrates that precise feature; do not reuse an unrelated hero photo. Never use a placeholder, stock image, fabricated asset, or cross-model image. If no accurate image is verifiable, record NO_VERIFIED_ASSET and search notes in QA_Checklist and mark the handoff incomplete; do not claim full image coverage or seed a fabricated substitute.',
  );
const seedOutputContract = [
  'SEED OUTPUT: Alongside the completed workbook, create one valid JSON file named data_${BRAND}.json. It must match scripts/ingest_brand.js and may contain no markdown or comments.',
  'TOP LEVEL: brand {slug,name,name_ar,origin,logo_url}; agency {slug,name,name_ar,type_id,phone,website}; sources[] with {id,title,publisher,url,market,model_year,trim,locator,excerpt,access_date,confidence}; models[]. Workbook-only/offline sources may remain in Sources, but seed sources[] must have an accessible HTTP(S) URL.',
  'MODEL: Each model has {slug,name,name_ar,category,year,brochure_url,specs,spec_sections,source_ids,source_refs,market_comparisons,relationships,images,trims}. Put every sourced AutoFyon field in specs (sec_auto_specs) or spec_sections keyed by its Section_ID; use exact Field_Catalog keys and preserve values/units. Keep model-level and trim-level facts separate. source_refs maps "section_id.field_key" to a Sources.id. Do not mix GCC values into Egypt specs.',
  'TRIM: Each trim has {slug,name,name_ar,price_egp,specs,spec_sections,source_refs}. Use EGP integer prices only when verified; otherwise omit price. Keep trim-specific powertrain/equipment on that trim.',
  'COMPARISON: model.market_comparisons is an array of atomic rows with {attribute_en,attribute_ar,field_key,egypt_trim_name,egypt_value,egypt_unit,egypt_source_id,egypt_source_url,gcc_country,gcc_model_name,gcc_trim_name,gcc_model_year,gcc_generation_or_powertrain,gcc_value,gcc_unit,gcc_source_id,gcc_source_url,comparability,difference_summary,confidence,review_status}. Use strings for values/units, exact market/year/generation/trim, both source IDs, and real source URLs. Set review_status="APPROVED" only after checking both citations and comparability; unresolved or unverified rows stay in the workbook and must not be seeded as approved.',
  'IMAGES: Every non-empty model spec in specs/spec_sections must have one matching images[] object {url,section_id,field_key,field_section_id,caption,caption_ar,source_url,source_id,exact_feature_proof,review_status,placement}. field_key and field_section_id must exactly match the spec Field_Key and Section_ID; use placement="carousel". Set review_status="APPROVED" only after confirming exact-model ownership and that the asset visibly demonstrates the specific attribute. Fill Specs.Related_Image_URL/Image_Source_ID/Exact_Feature_Proof/Image_Review_Status and create the matching Carousel_Media row. Use official feature photos or diagrams; an unrelated exterior shot is not proof. URLs must be exact-model, unique per model, with source attribution; never use placeholders or share images across models. The seed validator rejects any populated model spec without its field-bound, sourced, approved image. If no accurate image can be verified, leave the asset missing, explain in QA, and report that model incomplete rather than inventing one.',
  'RELATIONSHIPS: model.relationships[] items are {relation_type,provider_business_id,direction,role_data,source_id}; provider_business_id must match a real existing AutoFyon business ID from the supplied export. Valid relations are sold_by, distributed_by, manufactured_at, serviced_by, insured_by, financed_by, parts_for (direction="in"), compatible_with. A seed cannot create a provider node merely by mentioning it in Relationships.',
  'PERSISTENCE: The ingestion engine stores model and trim section fields in custom_data, source records/references in _data_provenance, approved market_comparisons in custom_data.sec_auto_specs.market_comparisons, and model.relationships as typed business_relationships edges. The model minisite renders approved comparisons in Specifications and linked service providers in its service links. Articles and evaluations remain drafts for human Site Builder/review workflows; never claim they were published by this seed.',
  'FINAL CHECK: Ensure every model and trim exists in the workbook, every field has a Source_ID, every Source_ID resolves in sources[], all required English/Arabic names are supplied when verifiable, each populated model-level spec has one exact-feature image mapping, and all conflicts are explicit. A human operator can run node scripts/ingest_brand.js --file scripts/data_${BRAND}.json to validate and generate SQL; never add --execute or write to the database.',
].join('\n\n');
const integratedPrompt = `${startHere[integratedPromptIndex][1]}\n\n${seedOutputContract}`;
startHere[integratedPromptIndex][1] = integratedPrompt;

addSheet('START_HERE', ['Topic', 'Instructions'], startHere, [34, 120]);
addSheet('AI_SEED_PROMPT', ['Prompt_Section', 'Copy_Ready_Instructions'], [
  ['Integrated workbook + seed prompt', integratedPrompt],
  ['Ingestion JSON contract', seedOutputContract],
], [38, 120]);

addSheet('Brand_Agency', [
  'Brand_Slug', 'Brand_Name_EN', 'Brand_Name_AR', 'Origin_Country', 'Official_Egypt_Website',
  'Agency_Slug', 'Agency_Name_EN', 'Agency_Name_AR', 'Agency_Type', 'Agency_Phone',
  'Agency_Address', 'Agency_Source_ID', 'Market', 'Snapshot_Date', 'Researcher', 'Review_Status',
], [], [22, 28, 28, 20, 42, 24, 34, 34, 22, 20, 38, 22, 16, 18, 24, 20]);

addSheet('Models', [
  'Brand_Slug', 'Model_Slug', 'Model_Name_EN', 'Model_Name_AR', 'Body_Category',
  'Model_Year', 'Generation_or_Code', 'Powertrain_Version', 'Market_Status',
  'Official_Brochure_URL', 'Brochure_Source_ID', 'Official_Model_Page_URL',
  'Model_Page_Source_ID', 'Hero_Asset_URL', 'Hero_Asset_Source_ID',
  'Existing_AutoFyon_Model_Slug', 'Match_Confidence', 'Model_Notes', 'Review_Status',
], [], [20, 24, 30, 30, 20, 14, 24, 26, 18, 48, 22, 48, 22, 48, 22, 32, 18, 50, 20]);

addSheet('Specs', [
  'Model_Slug', 'Section_ID', 'Field_Key', 'Field_Label_EN', 'Value_EN',
  'Value_AR', 'Unit', 'Scope_Model_or_Trim', 'Trim_Slug_if_Trim',
  'Carousel_Order', 'Carousel_Requested', 'Source_ID', 'Source_Page_or_Heading',
  'Source_Excerpt', 'Source_Access_Date', 'Market_and_Model_Year_Confirmed', 'Confidence',
  'Conflict_or_Caveat', 'Related_Image_URL', 'Image_Source_ID',
  'Exact_Feature_Proof', 'Image_Review_Status', 'Review_Status',
], [], [24, 26, 30, 30, 40, 40, 18, 22, 28, 16, 22, 18, 32, 55, 18, 24, 18, 46, 48, 22, 58, 24, 22]);

addSheet('Trims', [
  'Model_Slug', 'Trim_Slug', 'Trim_Name_EN', 'Trim_Name_AR', 'Model_Year',
  'Official_or_Market_Trim', 'Price_EGP', 'Price_Type', 'Price_As_Of',
  'Availability_Status', 'Official_Source_ID', 'Price_Source_ID',
  'Existing_AutoFyon_Trim_Slug', 'Match_Confidence', 'Trim_Notes', 'Review_Status',
], [], [24, 30, 32, 32, 14, 24, 18, 24, 18, 24, 20, 20, 34, 18, 48, 20]);

addSheet('Trim_Features', [
  'Model_Slug', 'Trim_Slug', 'Section_ID', 'Field_Key_or_Item',
  'Feature_Label_EN', 'Feature_Value_EN', 'Feature_Value_AR', 'Unit',
  'Source_ID', 'Source_URL', 'Source_Page_or_Heading', 'Source_Excerpt', 'Source_Access_Date',
  'Confidence', 'Carousel_Order_if_Applicable', 'Related_Image_URL',
  'Image_Source_ID', 'Exact_Feature_Proof', 'Image_Review_Status', 'Review_Status',
], [], [24, 28, 26, 34, 32, 42, 42, 18, 22, 32, 55, 18, 18, 24, 20, 48, 22, 58, 24, 22]);

addSheet('Extra_Facts', [
  'Model_Slug', 'Trim_Slug_if_Applicable', 'Suggested_Section_ID',
  'Source_Term', 'Fact_Label_EN', 'Fact_Label_AR', 'Value_EN', 'Value_AR',
  'Unit', 'Suggested_Field_Key', 'Carousel_Suggestion', 'Source_ID',
  'Source_Page_or_Heading', 'Source_Excerpt', 'Why_Not_Mapped_to_Catalog',
  'Confidence', 'Review_Status',
], [], [24, 28, 28, 32, 30, 30, 40, 40, 18, 32, 24, 18, 32, 55, 46, 18, 20]);

addSheet('Agent_Website_Opportunities', [
  'Brand_Slug', 'Agent_Name', 'Country', 'Page_or_Resource_Type',
  'Page_Title', 'Page_URL', 'Language', 'Date_Checked',
  'Access_Status', 'Observed_Content_or_Fields', 'Models_or_Trims_Covered',
  'AutoFyon_Target_Section_ID', 'Extraction_Opportunity',
  'Limitations_or_Consent_Needed', 'Source_ID', 'Evidence_or_Notes',
  'Follow_Up_Priority', 'Review_Status',
], [], [20, 34, 18, 28, 42, 70, 18, 18, 22, 60, 42, 30, 55, 48, 18, 48, 20, 20]);

addSheet('Market_Comparisons', [
  'Brand_Slug', 'Model_Slug', 'Egypt_Trim_Slug', 'Model_Year',
  'Attribute_or_Field_Key', 'Section_ID', 'Egypt_Value', 'Egypt_Unit',
  'Egypt_Country_or_Market', 'Egypt_Source_ID', 'GCC_Country',
  'GCC_Model_Name', 'GCC_Trim_Name', 'GCC_Model_Year',
  'GCC_Generation_or_Powertrain', 'GCC_Value', 'GCC_Unit',
  'GCC_Source_ID', 'Comparability', 'Difference_Summary',
  'Confidence', 'Review_Status',
], [], [20, 24, 28, 14, 32, 28, 36, 16, 22, 20, 20, 28, 30, 16, 34, 36, 16, 20, 24, 54, 18, 20]);

addSheet('Trim_Differences', [
  'Model_Slug', 'Model_Year', 'Attribute_or_Feature',
  'AutoFyon_Section_ID', 'Field_Key_if_Applicable',
  'Egypt_Trim_Name', 'Egypt_Value', 'Egypt_Source_ID',
  'GCC_Country', 'GCC_Trim_Name', 'GCC_Value', 'GCC_Source_ID',
  'Difference_Type', 'Exact_Generation_and_Powertrain_Match',
  'Difference_Explanation', 'Confidence', 'Review_Status',
], [], [24, 14, 34, 28, 32, 30, 40, 20, 20, 30, 40, 20, 24, 36, 58, 18, 20]);

addSheet('Evaluations', [
  'Model_Slug', 'Trim_Slug_if_Tested', 'Evaluation_Type',
  'Evaluator_or_Publisher', 'Evaluator_Independence',
  'Evaluation_Title', 'Evaluation_Date', 'Country_or_Market',
  'Model_Year_Generation_Tested', 'Powertrain_and_Trim_Tested',
  'Method_or_Test_Conditions', 'Published_Score_Exactly_As_Reported',
  'Score_Scale', 'Criteria_or_Findings', 'Positive_Findings',
  'Limitations_or_Caveats', 'Short_Source_Excerpt',
  'Source_ID', 'Source_URL', 'Source_Page_or_Timestamp',
  'Confidence', 'Can_Be_Summarized_for_Minisite',
  'Review_Status',
], [], [24, 28, 24, 38, 24, 52, 18, 22, 30, 36, 48, 36, 20, 52, 48, 52, 65, 18, 70, 32, 18, 32, 20]);

addSheet('Carousel_Media', [
  'Model_Slug', 'Section_ID', 'Slide_Order', 'Asset_Type',
  'Asset_URL', 'Exact_Model_Identity_Confirmed', 'Caption_EN', 'Caption_AR',
  'Field_Key', 'Field_Section_ID', 'Carousel_Placement',
  'Related_Value_or_Feature', 'Asset_Source_ID', 'Original_Source_URL',
  'Rights_or_Usage_Notes', 'URL_Used_by_Other_Model', 'Text_Only_Fallback_OK',
  'Review_Status',
], [], [24, 28, 14, 18, 50, 32, 38, 38, 32, 28, 22, 42, 20, 50, 42, 24, 26, 20]);

addSheet('Articles', [
  'Model_Slug', 'Article_Type', 'Publish_Destination', 'Target_Section_ID',
  'Page_Slug', 'Title_EN', 'Title_AR', 'Summary_EN', 'Summary_AR',
  'Article_Body_EN', 'Article_Body_AR', 'Key_Claims_and_Source_IDs',
  'Sources_IDs', 'Original_Wording_Confirmed', 'FAQ_Question_EN',
  'FAQ_Question_AR', 'FAQ_Answer_EN', 'FAQ_Answer_AR',
  'Draft_Status', 'Human_Editor_Notes', 'Source_Access_Date', 'Market_and_Trim_Scope',
], [], [24, 24, 24, 28, 26, 40, 40, 50, 50, 90, 90, 55, 32, 28, 42, 42, 70, 70, 22, 48, 18, 32]);

addSheet('Relationships', [
  'Model_Slug', 'Trim_Slug_if_Applicable', 'Relation_Type',
  'Relationship_Direction', 'Provider_AutoFyon_Business_ID',
  'Related_Organization_or_Place_EN', 'Related_Organization_or_Place_AR',
  'Official_Relationship_Confirmed', 'Address', 'City', 'Governorate',
  'Phone', 'Website_or_Contact_URL', 'Warranty_or_Service_Details', 'Role_Data_JSON',
  'Source_ID', 'Source_Page_or_Heading', 'Confidence', 'Review_Status',
], [], [24, 28, 24, 22, 38, 40, 40, 32, 46, 24, 24, 20, 48, 48, 54, 20, 34, 18, 20]);

addSheet('Sources', [
  'Source_ID', 'Brand_or_Model_Slug', 'Source_Tier', 'Source_Type',
  'Source_Title', 'Publisher_or_Agency', 'URL', 'Market',
  'Model_Year_or_Version', 'Published_or_Effective_Date', 'Access_Date',
  'Page_Heading_or_PDF_Page', 'Exact_Supporting_Excerpt',
  'Facts_Supported', 'Source_Confidence', 'Conflict_or_Limitation',
  'Official_Egypt_Agent_Source', 'Citation_or_Attribution_Text',
  'Input_Workbook', 'Input_Sheet', 'Input_Row',
], [
  ['SRC-BMW-WORKBOOK', 'bmw', 'USER_SUPPLIED', 'workbook snapshot', 'BMW Egypt market data workbook', 'User-supplied workbook', '', 'Egypt', 'Snapshot 2026-11-15', '2026-11-15', '2026-11-15', '', 'Workbook contents are research leads; verify each publishable claim against the cited primary source.', 'BMW model, trim, specs, market prices and comparisons', 'MEDIUM', 'Workbook summary reports 32 comparison checks: 9 matches, 18 conflicts, 0 market-version differences, 5 incomparable. Not all workbook rows are independently verified.', 'NO', 'User-supplied workbook; cite exact sheet/row and add underlying external source before publication.', 'bmw2_egypt_db.xlsx', '', ''],
  ['SRC-TOYOTA-WORKBOOK', 'toyota', 'USER_SUPPLIED', 'workbook snapshot', 'Toyota Egypt master workbook', 'User-supplied workbook', '', 'Egypt', 'Snapshot 2026-11-14', '2026-11-14', '2026-11-15', '', 'Workbook contents are research leads; verify each publishable claim against the cited primary source.', 'Toyota models, trims, prices, specs, features and comparisons', 'MEDIUM', 'Workbook summary reports 3 comparison checks: 2 matches and 1 conflict. Some sheet source cells contain placeholder text; validate real URLs.', 'NO', 'User-supplied workbook; cite exact sheet/row and add underlying external source before publication.', 'last toyota_egypt_db_master.xlsx', '', ''],
], [24, 28, 18, 22, 42, 34, 65, 16, 26, 24, 18, 34, 70, 52, 18, 50, 26, 70, 36, 34, 16]);

addSheet('QA_Checklist', [
  'Model_Slug', 'Check_ID', 'Check', 'Status',
  'Evidence_or_Source_ID', 'Issue_or_Notes', 'Reviewer', 'Review_Date',
], [
  ['', 'Q01', 'Correct Egypt-market model and model year confirmed', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q02', 'Existing AutoFyon model/trim matched; duplicates avoided', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q03', 'Every publishable specification has a source and market context', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q04', 'Conflicting sources are logged, not silently merged', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q05', 'Trim names and prices are evidence-backed and date-stamped', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q06', 'Brochure link is an official Egypt-market document and opens', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q07', 'Every image belongs to this exact model; no cross-model reuse', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q08', 'Carousel assets map to the correct section/field or remain unbound', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q09', 'No generic, placeholder, mislabeled, or unsupported image is included', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q10', 'Articles are original, bilingual where possible, and source-backed', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q11', 'No invented review, safety rating, price, warranty, or availability', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q12', 'Missing facts and human-review items are clearly reported', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q13', 'Official Egyptian agent website opportunities recorded (including blocked pages)', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q14', 'GCC data checked separately for each comparable model and trim', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q15', 'Egypt-versus-GCC trim differences are individually sourced', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q16', 'Evaluations identify evaluator, method, market/version, date, and source', 'NOT_STARTED', '', '', '', ''],
  ['', 'Q17', 'Every claim, comparison, evaluation, media item, and article fact traces to Source_ID', 'NOT_STARTED', '', '', '', ''],
  ['bmw', 'Q18', 'Resolve the BMW workbook comparison conflicts before publishing disputed values', 'REVIEW_REQUIRED', 'SRC-BMW-WORKBOOK', 'Input workbook reports 18 conflicts among 32 checks; inspect the matching source rows and verify against primary evidence.', '', ''],
  ['corolla', 'Q19', 'Resolve the Toyota Corolla airbag discrepancy by exact trim and source', 'REVIEW_REQUIRED', 'SRC-TOYOTA-WORKBOOK', 'Workbook comparison flags 2 versus 6 airbags; do not generalize either value without trim-specific primary evidence.', '', ''],
  ['toyota', 'Q20', 'Replace placeholder source text with working citations', 'REVIEW_REQUIRED', 'SRC-TOYOTA-WORKBOOK', 'Some price/comparison source cells contain literal "url"; a real, accessible source URL is required.', '', ''],
  ['corolla', 'Q21', 'Reconcile workbook Corolla trim names against existing AutoFyon records', 'REVIEW_REQUIRED', 'SRC-TOYOTA-WORKBOOK', 'Preserve similar Smart/Sunroof entries until matched by model year, source and exact official trim; do not silently merge or delete.', '', ''],
  ['', 'Q22', 'Model minisite service links use verified graph relationships and existing provider records', 'NOT_STARTED', '', 'Check showroom/seller, finance, insurance, maintenance, parts and accessories separately; never invent provider IDs or compatibility.', '', ''],
  ['', 'Q23', 'Every published model specification is paired with an exact-feature image', 'NOT_STARTED', '', 'Each Specs row needs a matching field-bound Carousel_Media row with an official asset, source, and proof that it depicts the named feature. Missing verified assets block complete handoff.', '', ''],
], [24, 14, 72, 20, 22, 60, 24, 18]);

const sections = [
  ['sec_1_identity', 'Overview', 'نظرة عامة', 'Model identity, year, category, overview, official brochure and model page links.', 1, 0, 'Use Models for identity. Overview has a carousel; article drafts can be custom Site Builder pages.'],
  ['sec_auto_specs', 'Specifications', 'المواصفات', 'Grouped engine, dimensions, performance, economy and safety specifications, plus approved Egypt-versus-GCC comparisons.', 1, 0, 'One sourced fact per Specs row; carousel slides show populated values in field order. Approved Market_Comparisons rows render in a separate side-by-side table after Egypt-market specs; GCC never overwrites Egypt values.'],
  ['sec_auto_exterior', 'Exterior', 'المظهر الخارجي', 'Paint, wheels, headlights, roof and model-specific exterior assets.', 1, 1, 'Articles can be Section_Article if blog is enabled for the model.'],
  ['sec_auto_interior', 'Interior', 'المقصورة', 'Seats, materials, lighting, sunroof and exact-model cabin assets.', 1, 1, 'Do not assign a generic cockpit image to a specific equipment fact.'],
  ['sec_auto_engine', 'Engine', 'المحرك', 'Powertrain, hybrid/EV, battery, range and charging details.', 1, 1, 'Use verified market-specific powertrain data.'],
  ['sec_auto_comfort', 'Comfort', 'الراحة', 'Climate zones, seat adjustment, keyless entry and sourced comfort details.', 1, 1, 'Use TEXT_ONLY_OK when no verified comfort image exists.'],
  ['sec_auto_safety', 'Safety', 'الأمان', 'Safety systems, braking, airbags and ratings only when officially supported.', 1, 1, 'Never infer a safety rating from an equipment list.'],
  ['sec_auto_technology', 'Technology', 'التقنية', 'Infotainment, connectivity, audio and digital cluster.', 1, 1, 'Bind media to a specific feature only when the image actually shows it.'],
  ['sec_auto_variants', 'Variants / Trims', 'الفئات', 'Official trim names, prices, availability and trim differences.', 1, 0, 'Trims are separate child records; do not merge similar names without evidence.'],
  ['sec_auto_inventory', 'Inventory', 'المخزون', 'Live seller listings/units and their availability.', 0, 0, 'Do not invent stock. This is relationship/unit data, not a model specification.'],
  ['sec_auto_origin', 'Manufactured At', 'بلد المنشأ', 'Verified manufacturing plant/country relationships.', 0, 0, 'Use a source-backed relationship; brand origin is not model assembly location.'],
  ['sec_auto_network', 'Network', 'الشبكة', 'Official brand, agency, distributor, dealer and service links.', 0, 0, 'Record the exact relationship and evidence in Relationships.'],
  ['sec_auto_protection', 'Protection & Warranty', 'الحماية والضمان', 'Official warranty, insurance and financing relationships/terms.', 0, 0, 'Separate official warranty terms from dealer or third-party offers.'],
  ['sec_auto_parts', 'Parts & Accessories', 'القطع والإكسسوارات', 'Official accessories and compatible parts relationships.', 0, 0, 'Do not claim compatibility without a source.'],
  ['sec_10_testimonials', 'Reviews & FAQs', 'التقييمات والأسئلة', 'Customer reviews and frequently asked questions.', 0, 0, 'Never fabricate testimonials. FAQs must be answered from cited sources.'],
];

addSheet('Section_Catalog', [
  'Section_ID', 'Section_Name_EN', 'Section_Name_AR', 'Purpose',
  'Carousel_Enabled_Currently', 'Section_Articles_Enabled_Currently', 'Research_and_Presentation_Guidance',
], sections, [28, 32, 32, 62, 26, 30, 76]);

const fields = [
  ['sec_auto_specs', 'engine_type', 'Engine Type', 'نوع المحرك', 'select', 'engine'],
  ['sec_auto_specs', 'displacement_cc', 'Displacement (cc)', 'السعة اللترية (سي سي)', 'number', 'engine'],
  ['sec_auto_specs', 'cylinders', 'Cylinders', 'عدد الأسطوانات', 'number', 'engine'],
  ['sec_auto_specs', 'transmission_type', 'Transmission', 'ناقل الحركة', 'select', 'transmission'],
  ['sec_auto_specs', 'drivetrain', 'Drivetrain', 'نظام الدفع', 'select', 'transmission'],
  ['sec_auto_specs', 'length_mm', 'Length (mm)', 'الطول (مم)', 'number', 'dimensions'],
  ['sec_auto_specs', 'width_mm', 'Width (mm)', 'العرض (مم)', 'number', 'dimensions'],
  ['sec_auto_specs', 'height_mm', 'Height (mm)', 'الارتفاع (مم)', 'number', 'dimensions'],
  ['sec_auto_specs', 'wheelbase_mm', 'Wheelbase (mm)', 'قاعدة العجلات (مم)', 'number', 'dimensions'],
  ['sec_auto_specs', 'kerb_weight_kg', 'Kerb Weight (kg)', 'الوزن فارغ (كجم)', 'number', 'dimensions'],
  ['sec_auto_specs', 'seats', 'Seats', 'عدد المقاعد', 'number', 'dimensions'],
  ['sec_auto_specs', 'power_hp', 'Power (hp)', 'القوة (حصان)', 'number', 'engine'],
  ['sec_auto_specs', 'torque_nm', 'Torque (Nm)', 'عزم الدوران (نيوتن متر)', 'number', 'engine'],
  ['sec_auto_specs', 'zero_to_100_s', '0-100 km/h (s)', 'التسارع 0-100 (ثانية)', 'number', 'performance'],
  ['sec_auto_specs', 'top_speed_kmh', 'Top Speed (km/h)', 'أقصى سرعة (كم/س)', 'number', 'performance'],
  ['sec_auto_specs', 'consumption_l_100km', 'Consumption (L/100km)', 'الاستهلاك (لتر/100كم)', 'number', 'economy'],
  ['sec_auto_specs', 'co2_g_km', 'CO2 (g/km)', 'انبعاثات ثاني أكسيد الكربون (غ/كم)', 'number', 'economy'],
  ['sec_auto_specs', 'airbags', 'Airbags', 'الوسائد الهوائية', 'number', 'safety'],
  ['sec_auto_specs', 'ncap_rating', 'Safety Rating (stars)', 'تقييم الأمان (نجوم)', 'select', 'safety'],
  ['sec_auto_exterior', 'paint_finish', 'Paint / Finish', 'الطلاء / التشطيب', 'text', 'exterior'],
  ['sec_auto_exterior', 'wheels', 'Wheels', 'الجنوط', 'text', 'exterior'],
  ['sec_auto_exterior', 'headlights', 'Headlights', 'المصابيح الأمامية', 'select', 'exterior'],
  ['sec_auto_exterior', 'roof_type', 'Roof', 'السقف', 'select', 'exterior'],
  ['sec_auto_interior', 'seating_material', 'Seating Material', 'مادة المقاعد', 'select', 'interior'],
  ['sec_auto_interior', 'ambient_lighting', 'Ambient Lighting', 'الإضاءة المحيطة', 'boolean', 'interior'],
  ['sec_auto_interior', 'sunroof', 'Sunroof', 'السقف الشمسي', 'select', 'interior'],
  ['sec_auto_engine', 'hybrid_system', 'Hybrid System', 'النظام الهجين', 'text', 'powertrain'],
  ['sec_auto_engine', 'battery_capacity_kwh', 'Battery Capacity (kWh)', 'سعة البطارية (كيلوواط ساعة)', 'number', 'powertrain'],
  ['sec_auto_engine', 'electric_range_km', 'Electric Range (km)', 'المدى الكهربائي (كم)', 'number', 'powertrain'],
  ['sec_auto_engine', 'charging_dc_kw', 'DC Charging (kW)', 'قدرة الشحن السريع (كيلوواط)', 'number', 'powertrain'],
  ['sec_auto_engine', 'charge_10_to_80_min', '10-80% Charge (min)', 'زمن الشحن 10-80% (دقيقة)', 'number', 'powertrain'],
  ['sec_auto_comfort', 'climate_zones', 'Climate Zones', 'مناطق التكييف', 'number', 'comfort'],
  ['sec_auto_comfort', 'seat_adjust', 'Seat Adjustment', 'تعديل المقاعد', 'text', 'comfort'],
  ['sec_auto_comfort', 'keyless_entry', 'Keyless Entry', 'الدخول الذكي', 'boolean', 'comfort'],
  ['sec_auto_safety', 'adas_suite', 'ADAS Suite', 'أنظمة المساعدة المتقدمة', 'textarea', 'safety'],
  ['sec_auto_safety', 'braking_system', 'Braking System', 'نظام الفرامل', 'text', 'safety'],
  ['sec_auto_technology', 'infotainment_size_in', 'Infotainment Size (in)', 'حجم الشاشة (بوصة)', 'number', 'technology'],
  ['sec_auto_technology', 'connectivity', 'Connectivity', 'الاتصال', 'select', 'technology'],
  ['sec_auto_technology', 'audio_system', 'Audio System', 'نظام الصوت', 'text', 'technology'],
  ['sec_auto_technology', 'digital_cluster', 'Digital Instrument Cluster', 'العدادات الرقمية', 'boolean', 'technology'],
];

addSheet('Field_Catalog', [
  'Section_ID', 'Field_Key', 'Field_Label_EN', 'Field_Label_AR',
  'Field_Type', 'Group_Key', 'Use_this_key_when',
], fields.map(([section, key, label, labelAr, type, group]) => [
  section, key, label, labelAr, type, group,
  'Use only when the source supports this exact fact; preserve the Egypt-market unit/version. If no field fits, use Extra_Facts.',
]), [28, 30, 38, 42, 18, 22, 78]);

addSheet('Controlled_Vocabulary', [
  'Column_or_Concept', 'Allowed_Values_or_Rule',
], [
  ['Source_Tier', 'OFFICIAL_EGYPT_AGENT | OFFICIAL_MANUFACTURER | AUTHORIZED_DEALER | SECONDARY_CROSSCHECK | USER_SUPPLIED'],
  ['Confidence', 'HIGH | MEDIUM | LOW | CONFLICTED | UNVERIFIED'],
  ['Review_Status', 'NOT_STARTED | DRAFT | REVIEW_REQUIRED | APPROVED | REJECTED'],
  ['Comparability', 'EXACT | PARTIAL | NOT_COMPARABLE | UNKNOWN; record why and never imply exact when generation/trim/powertrain differs'],
  ['Price_Type', 'OFFICIAL_EGYPT_LIST | OFFICIAL_PROMOTION | AUTHORIZED_DEALER | MARKET_ESTIMATE | HISTORICAL | UNKNOWN'],
  ['Market_Status', 'CURRENT | ANNOUNCED | DISCONTINUED | IMPORTED | UNKNOWN'],
  ['Carousel_Requested', 'YES | NO | TEXT_ONLY_OK | NEEDS_ASSET'],
  ['Carousel_Placement', 'body | carousel | both'],
  ['Asset_Type', 'image | video | youtube | embed | brochure_pdf'],
  ['Article_Type', 'Model_Overview | Feature_Article | Ownership_Guide | FAQ | Trim_Guide | Other'],
  ['Publish_Destination', 'Custom_Page | Section_Article | FAQ_Content | DRAFT_ONLY'],
  ['Relation_Type', 'sold_by | distributed_by | represented_by | manufactured_at | serviced_by | insured_by | financed_by | parts_for | compatible_with | agent_of'],
  ['No source value', 'Leave the value cell blank, set confidence to UNVERIFIED, and explain the gap in QA/notes. Do not use zero or N/A as a substitute.'],
], [32, 120]);

const crosswalkRows = [
  ['BMW', 'الملخص', 'Model coverage, research snapshot, comparison audit counts', 'QA_Checklist; Sources', 'Carry the dated audit summary; use each underlying specification/price row as a lead and resolve all 18 reported conflicts before publishing disputed values.', 'Snapshot 2026-11-15; 32 checks: 9 match, 18 conflict, 0 market-version differences, 5 incomparable.', 'Workbook summary only; trace each vehicle claim to the original brochure/page.'],
  ['BMW', 'مواصفات_الوكيل_المصري', 'Egypt-agent model/trim engine data, dimensions, performance, brochure URLs', 'Models; Trims; Specs; Sources; Trim_Features', 'One workbook row is a model/trim combination. Preserve trim and generation; parse numeric units only when unambiguous. Associate a source ID with every fact.', 'Egypt-market agent/spec table, snapshot 2026-11-15.', 'Use its brochure link, exact page/table and short evidence excerpt; reconcile inferred trim-to-powertrain notes.'],
  ['BMW', 'أسعار_مصر', 'Egypt prices, price type/date, source and verification notes', 'Trims; Sources; Market_Comparisons', 'Keep official-list, reported dealer/market, and historical price types distinct. Never treat a third-party market price as an official agent price.', 'Snapshot 2026-11-15; workbook identifies mixed price-source types.', 'Capture date and source URL per trim.'],
  ['BMW', 'مقارنة_ملونة', 'Conflicts between Egyptian-agent data and secondary sources', 'Market_Comparisons; Trim_Differences; QA_Checklist; Sources', 'Preserve both observations in separate rows. Do not select or overwrite a value until same-generation, same-market and same-trim evidence is checked.', 'Workbook summary reports 18 conflicts, 9 matches, 5 incomparable.', 'Capture Egypt primary and comparison-source URLs separately.'],
  ['BMW', 'تجهيزات_الوكيل', 'Trim-specific equipment differences', 'Trim_Features; Sources; Carousel_Media', 'Record one feature per row and trim. Distinguish yes/no, optional, standard and package equipment. Cite the applicable brochure section.', 'Local equipment according to workbook title.', 'Do not generalize one trim equipment to all trims.'],
  ['BMW', 'خليجي_أوروبي', 'GCC/European market comparison leads', 'Market_Comparisons; Trim_Differences; Sources', 'Separate each GCC country and Europe. Record exact model year, generation, engine and trim; never merge GCC and European specs.', 'Market-variant comparison lead.', 'Verify via a source for the specific country/version; not an Egypt source.'],
  ['BMW', 'الوكلاء_ومراكز_الخدمة', 'Dealer/service branch candidates and contacts', 'Relationships; Agent_Website_Opportunities; Sources', 'Use for research discovery; verify official status, address and contact information on the official BMW Egypt/Global Auto source before publishing.', 'Workbook labels selected entries as sourced from official brochure.', 'Add source ID and exact page/location.'],
  ['BMW', 'المصادر_والبروشورات', 'Brochure and source inventory', 'Models; Sources; Carousel_Media', 'Verify each link, PDF identity, market, model, date and availability; register source once and cite it from each model/fact.', 'Workbook source register.', 'Store verified brochure URL and PDF page/section.'],
  ['BMW', 'صور_المواصفات_الناقصة', 'Photo gaps and opportunities for assets', 'Carousel_Media; Agent_Website_Opportunities; QA_Checklist', 'Treat entries as requested research, not existing assets. Only add official, exact-model media after checking URL, provenance, usage terms and no cross-model reuse.', 'Workbook photo-gap list.', 'Never synthesize or reuse an unrelated photo.'],
  ['Toyota', 'الملخص', 'Coverage snapshot, comparison check totals and price coverage', 'QA_Checklist; Sources', 'Record snapshot 2026-11-14; resolve the single reported conflict before publishing the disputed Toyota fact.', '3 comparison checks: 2 matches, 1 conflict; 12 observed price rows.', 'Workbook summary is not a primary evidence citation.'],
  ['Toyota', '1_تويوتا_كورولا', 'Corolla 2026 five trims, prices, technical and equipment matrices', 'Models; Trims; Specs; Trim_Features; Market_Comparisons; Sources', 'Use the per-trim matrix so different wheels, airbags, climate, screens, sunroof and equipment stay trim-specific. Reconcile existing AutoFyon Corolla trim names/prices to avoid duplicates.', '2026; workbook lists Active AT, Comfort AT, Smart AT, Smart with Sunroof, Elegance AT.', 'Check the Corolla airbag conflict (workbook notes 2 versus 6); do not apply one value across all trims.'],
  ['Toyota', '2_تويوتا_أوربان_كروزر', 'Urban Cruiser 2026 trims, prices, specs and feature differences', 'Models; Trims; Specs; Trim_Features; Sources', 'Capture Active/Comfort differences individually; distinguish shared model specs from trim-exclusive equipment.', '2026; workbook lists Active AT and Comfort AT.', 'Verify official pages/PDF and source citations; check current AutoFyon rows before adding trims.'],
  ['Toyota', '3_تويوتا_فورتشنر', 'Fortuner 2026 trim-specific engines, drivetrain, equipment and prices', 'Models; Trims; Specs; Trim_Features; Sources', 'The 2.7L 2WD and 4.0L 4WD versions are not one interchangeable engine specification. Scope facts to exact trim.', '2026; Smart 2.7L 2WD, Elegance 4.0L 4WD, Sport 4.0L 4WD.', 'Verify each engine/output/equipment row against official source.'],
  ['Toyota', '4_تويوتا_برادو', 'Prado 2026 Highline specs, price and equipment', 'Models; Trims; Specs; Trim_Features; Sources', 'Keep model year and J250 generation explicit; verify the workbook’s price and detailed equipment against current Egypt source.', '2026; one Highline 2.4L Turbo trim shown.', 'Confirm current official price/version before publishing.'],
  ['Toyota', '5_تويوتا_bz4x', 'bZ4X 2026 Premier Electric trim, range, battery and equipment', 'Models; Trims; Specs; Trim_Features; Sources', 'Keep EV range test cycle, battery capacity, market and model year explicit.', '2026; one Premier Electric trim shown.', 'Verify WLTP/other range cycle and current official Egypt offer.'],
  ['Toyota', 'أسعار_مصر', 'Toyota trim prices, price dates and source markers', 'Trims; Sources', 'Several source cells are literal "url"; resolve a working primary source URL before considering a price verified.', 'Snapshot 2026-11-14; 12 observed Egypt trim price rows.', 'Do not publish placeholder link text as a citation.'],
  ['Toyota', 'مقارنة_ملونة', 'Cross-checks including Corolla displacement/airbag conflict and Urban Cruiser transmission', 'Market_Comparisons; Trim_Differences; QA_Checklist; Sources', 'The workbook records a Corolla airbag mismatch (six versus two). Split values by exact trim and source; do not flatten the conflict.', '3 checks: 2 match, 1 conflict.', 'Cite both original sources with exact trim applicability.'],
  ['Toyota', 'الوكلاء_ومراكز_الخدمة', 'Toyota Egypt branch/service candidates', 'Relationships; Agent_Website_Opportunities; Sources', 'Verify each branch/contact via official Toyota Egypt source; do not represent directory data as the full live network.', 'Workbook lists Toyota Egypt / 16550 branch entries.', 'Capture official locator URL and checked date.'],
  ['Both', 'Market_Comparisons', 'Per-model and per-trim Egypt-versus-GCC attribute comparisons', 'model.market_comparisons -> custom_data.sec_auto_specs.market_comparisons -> Minisite Specifications comparison table', 'Use one row per attribute and GCC market/trim. Keep Egypt values in Egypt fields and GCC values in GCC fields. Only REVIEW_STATUS=APPROVED rows are rendered.', 'Requires exact country, year, generation/powertrain, trim and both source citations.', 'Both source IDs must resolve to sources[] in seed JSON; provide valid HTTP(S) URLs and preserve conflicts outside approved output.'],
  ['Both', 'Not represented or only partially represented in input workbooks', 'Carousel-ready sourced asset mapping, agent-site opportunity audit, original About/articles/FAQs, evaluations methodology, full per-trim GCC comparison, AutoFyon record reconciliation and final provenance', 'Agent_Website_Opportunities; Carousel_Media; Articles; Evaluations; Market_Comparisons; Trim_Differences; QA_Checklist', 'Use the added standardized sheets. Treat all workbook cells as input leads, not automatic publication approval. Add source IDs throughout.', 'New AutoFyon enrichment requirements.', 'Every factual claim and asset must point to Sources with a specific URL or explicit workbook/sheet/row locator.'],
];

addSheet('Workbook_Crosswalk', [
  'Input_Workbook', 'Input_Sheet', 'Existing_Content_or_Opportunity',
  'Template_Sheets_to_Fill', 'Integration_Instructions',
  'Workbook_Scope_or_Known_Caveat', 'Required_External_Source_Check',
], crosswalkRows, [20, 36, 56, 70, 80, 72, 72]);

function importInputWorkbook(label, fileName) {
  const filePath = path.join(os.homedir(), 'Desktop', label === 'BMW' ? 'BMW' : 'toyota', fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`Input workbook not found; source sheets not embedded: ${filePath}`);
    return [];
  }
  const input = XLSX.readFile(filePath, { cellDates: false });
  const imported = [];
  for (const [sheetIndex, originalName] of input.SheetNames.entries()) {
    const sourceSheet = input.Sheets[originalName];
    const matrix = XLSX.utils.sheet_to_json(sourceSheet, { header: 1, defval: null, raw: true });
    let lastRow = matrix.length - 1;
    while (lastRow >= 0 && !matrix[lastRow].some((value) => value !== null && value !== '')) lastRow--;
    const sourceRows = matrix.slice(0, lastRow + 1);
    const maxColumns = sourceRows.reduce((max, row) => Math.max(max, row.length), 0);
    const columns = Array.from({ length: maxColumns }, (_, i) => `Excel_${columnName(i + 1)}`);
    const rows = [
      ['Input workbook', fileName, 'Original sheet', originalName],
      ['Original_Row_Number', ...columns],
      ...sourceRows.map((row, i) => [i + 1, ...row]),
    ];
    const safePart = originalName.replace(/[\\/?*:\[\]]/g, '_').slice(0, 20);
    const outputSheetName = `IN_${label}_${String(sheetIndex + 1).padStart(2, '0')}_${safePart}`.slice(0, 31);
    addSheet(outputSheetName, rows[1], rows.slice(2), [20, ...columns.map(() => 32)]);
    imported.push({ workbook: fileName, sourceSheet: originalName, outputSheet: outputSheetName, rowCount: sourceRows.length });
  }
  return imported;
}

const importedSheets = [
  ...importInputWorkbook('BMW', 'bmw2_egypt_db.xlsx'),
  ...importInputWorkbook('TOYOTA', 'last toyota_egypt_db_master.xlsx'),
];

if (importedSheets.length) {
  const crosswalk = workbook.Sheets.Workbook_Crosswalk;
  for (const item of importedSheets) {
    const rowIndex = XLSX.utils.decode_range(crosswalk['!ref']).e.r + 1;
    XLSX.utils.sheet_add_aoa(crosswalk, [[
      item.workbook.startsWith('bmw') ? 'BMW' : 'Toyota',
      item.sourceSheet,
      `Embedded input snapshot in ${item.outputSheet}`,
      item.outputSheet,
      'Use this read-only snapshot for discovery; map verified facts into normalized sheets and attach an external source citation before publication.',
      `${item.rowCount} source rows preserved with original row numbers.`,
      'Trace claims to original agent/manufacturer/dealer pages or the exact cited PDF page; snapshot alone is not proof.',
    ]], { origin: { r: rowIndex, c: 0 } });
  }
  crosswalk['!autofilter'] = { ref: `A1:G${XLSX.utils.decode_range(crosswalk['!ref']).e.r + 1}` };
}

const outputDir = path.resolve(__dirname, '..', 'templates');
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, 'AutoFyon_AI_Car_Minisite_Data_Template.xlsx');
XLSX.writeFile(workbook, outputPath, { compression: true });
console.log(`Created ${outputPath}`);
