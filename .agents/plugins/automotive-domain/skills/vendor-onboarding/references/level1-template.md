# Level 1 — Template Outreach

Level 1 enables automated, mass vendor onboarding via pre-built minisite templates.

## Architecture

- **`outreach_templates` table**: Stores template metadata and configuration
- **Batch Outreach Engine**: `/api/jana/outreach/batch-send` endpoint
- **Auto-provisioning on claim**: Instantiates businesses with `service_level='template'`
- **Free feature showcase**: Showcases initial catalog without upfront commitments

## Key Attributes

- Assigns `default_template_id` based on business type
- Defaults `subscription_tier='free'`
- Sets `service_level='template'`
