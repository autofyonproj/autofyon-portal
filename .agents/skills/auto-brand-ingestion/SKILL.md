---
name: auto-brand-ingestion
description: >-
  Standard operating instructions and automated workflow for any AI model (including
  Ollama and small local models) to collect, validate, and ingest automotive brands,
  official agency distributors, models, trims, official PDF brochures, and clean
  gallery images into AutoFyon with zero image conflicts.
---

# Automotive Brand Ingestion Standard Operating Procedure (SOP)

This skill provides a **deterministic, fail-safe protocol** for any AI agent or LLM (from GPT-4 / Claude / Gemini down to small local models like Ollama `llama3:8b`, `mistral`, or `qwen2.5`) to add new car brands and official Egyptian agency fleets into the AutoFyon platform.

---

## 1. Architectural Invariants (Non-Negotiable)

1. **Two-Layer Rule**: Schema and migrations are **FROZEN**. Never add columns to `businesses` or `units`. All vehicle specifications, brochure links, and trims are stored in `custom_data` JSON.
2. **Strict Hierarchy**:
   - `vehicle_brand` (Parent, `vendor_claimable = 0`, e.g. `biz_brand_peugeot`)
   - `main_agency` or `distributor` (Official Egyptian Agent, `vendor_claimable = 1`, e.g. `biz_dist_mansour_peugeot`)
   - `vehicle_model` (Minisite Node, child of brand, e.g. `biz_model_peugeot_3008`)
   - `vehicle_trim` (Child of model, embedded mode, e.g. `biz_trim_3008_allure_pack`)
   - Edge: Model is connected to Distributor with typed relationship `sold_by`.
3. **Zero-Tolerance Image Conflict Rule**:
   - Every image URL in `vendor_gallery` **MUST** strictly belong to its exact `business_id = model.id`.
   - **NO cross-model or cross-brand image reuse** (e.g., an interior photo cannot be shared between 3008 and 5008).
   - **NO placeholder images** (Unsplash, placeholder.com, generic stock photos are strictly rejected).
   - Only official agent assets (e.g. `*.peugeot.com.eg`, `*.renault.com.eg`, `*.toyota.com.eg`, or AutoFyon R2 CDN).
4. **Official PDF Brochure Protocol**:
   - Every model must carry its official Egyptian agent PDF brochure URL under:
     `custom_data.sec_1_identity.brochure_url` and `custom_data.sec_overview.brochure_url`.
   - The platform proxy at `/api/cars/[slug]/brochure` automatically streams this PDF with branded headers (`AutoFyon-[Model]-Official-Brochure.pdf`).

---

## 2. Standard AI Ingestion Schema (JSON)

Any AI model (including small Ollama models) should **ONLY** generate this clean JSON. The built-in ingestion engine (`scripts/ingest_brand.js`) handles SQL generation, validation, and database injection.

```json
{
  "brand": {
    "slug": "peugeot",
    "name": "Peugeot",
    "name_ar": "بيجو",
    "origin": "France",
    "logo_url": "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset/logos/optimized/peugeot.svg"
  },
  "agency": {
    "slug": "mansour-peugeot",
    "name": "Mansour Automotive - Peugeot",
    "name_ar": "المنصور للسيارات - بيجو",
    "type_id": "distributor",
    "phone": "19944",
    "website": "https://peugeot.com.eg"
  },
  "models": [
    {
      "slug": "3008",
      "name": "3008",
      "name_ar": "3008",
      "category": "SUV",
      "year": 2026,
      "brochure_url": "https://www.peugeot.com.eg/content/dam/peugeot/egypt/b2c/brochures/peugeot-3008.pdf",
      "specs": {
        "engine": "1.6L THP Turbo",
        "power_hp": 165,
        "torque_nm": 240,
        "transmission": "6-Speed Automatic",
        "fuel_tank_l": 53
      },
      "images": [
        "https://www.peugeot.com.eg/.../peugeot-3008-hero.jpg",
        "https://www.peugeot.com.eg/.../peugeot-3008-interior.jpg"
      ],
      "trims": [
        {
          "slug": "active-pack",
          "name": "Active Pack",
          "name_ar": "أكتيف باك",
          "price_egp": 1950000
        },
        {
          "slug": "allure-pack",
          "name": "Allure Pack",
          "name_ar": "ألور باك",
          "price_egp": 2100000
        },
        {
          "slug": "gt",
          "name": "GT",
          "name_ar": "جي تي",
          "price_egp": 2300000
        }
      ]
    }
  ]
}
```

---

## 3. Automation Execution Commands

Once the JSON is saved (e.g. `scripts/data_peugeot.json`):

### 1. Validate & Generate SQL
```powershell
node scripts/ingest_brand.js --file scripts/data_peugeot.json
```
The script validates:
- Image domain origins & formats.
- Ensures no duplicated image URLs across any models.
- Validates official brochure URLs.
- Ensures positive integer prices in EGP and Arabic translations.
- Outputs `scripts/ingest_<brand>.sql`.

### 2. Direct Execution to Cloudflare D1
```powershell
node scripts/ingest_brand.js --file scripts/data_peugeot.json --execute
```
Or execute the generated SQL manually:
```powershell
npx.cmd wrangler d1 execute autoportal-d1 --remote --file="scripts/ingest_peugeot.sql"
```

### 3. Run Integrity Audit
```powershell
node scripts/audit_brand_integrity.js --brand peugeot
```
Checks for:
- Zero cross-model image conflicts.
- 100% hero image coverage.
- Active brochure PDF links.
- Active `sold_by` relationship edges.

---

## 4. Prompt for Small LLMs (Ollama / Llama-3 / Mistral)

To instruct any small model or local Ollama instance to extract this data, feed it the following system prompt:

```text
You are an Automotive Data Extraction Specialist for AutoFyon.com (Egypt).
Your task is to take raw text, specifications, or scraped HTML from an official Egyptian automotive agent website and convert it into a strict JSON payload following the AutoFyon schema.

RULES:
1. ONLY return a valid JSON object matching the specification. Do not include markdown conversational filler.
2. Prices must be in Egyptian Pounds (EGP) as numbers (e.g. 1950000, not "1.95M").
3. All image URLs must be absolute links from the official agency website. Never use Unsplash or stock photos.
4. Each model must have its own unique images. Do not repeat an image across multiple models.
5. Provide the official PDF brochure URL for each model if available.
6. Provide Arabic names (name_ar) for the brand, agency, model, and every trim.

SCHEMA:
{
  "brand": { "slug": "string", "name": "string", "name_ar": "string", "origin": "string" },
  "agency": { "slug": "string", "name": "string", "name_ar": "string", "type_id": "distributor", "phone": "string", "website": "string" },
  "models": [
    {
      "slug": "string",
      "name": "string",
      "name_ar": "string",
      "category": "SUV|Sedan|Hatchback|Coupe|Truck",
      "year": 2026,
      "brochure_url": "string (ends with .pdf or agent link)",
      "specs": { "engine": "string", "power_hp": 0, "torque_nm": 0, "transmission": "string" },
      "images": ["url1", "url2"],
      "trims": [
        { "slug": "string", "name": "string", "name_ar": "string", "price_egp": 0 }
      ]
    }
  ]
}
```
