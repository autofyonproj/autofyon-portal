UPDATE standalone_license_templates
   SET features_json = json_remove(features_json, '$.owner_ribbon', '$.staff_accounts');
