INSERT INTO vendor_gallery (
  id, business_id, section_id, field_key, field_section_id, url, caption, caption_ar, media_data, placement, is_hero, show_on_minisite, approval_status, display_order
) VALUES (
  'gal_yaris_tech_quiz',
  'biz_model_toyota_yaris',
  'sec_auto_technology',
  NULL,
  'sec_auto_technology',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
  'Yaris Technology Quiz',
  'اختبر معلوماتك التقنية عن تويوتا ياريس',
  '{"captionBg":"glass","watermark":"Toyota · autofyon.com","quiz":{"question":"هل تدعم شاشة تويوتا ياريس الاتصال اللاسلكي بنظام Apple CarPlay؟","question_ar":"هل تدعم شاشة تويوتا ياريس الاتصال اللاسلكي بنظام Apple CarPlay؟","options":["لا، عبر كابل USB فقط","نعم، لاسلكياً وسلكياً معاً","لا تدعم النظام"],"options_ar":["لا، عبر كابل USB فقط","نعم، لاسلكياً وسلكياً معاً","لا تدعم النظام"],"correctIndex":1,"explanation":"نعم، تأتي فئة Smart بشاشة لمس 9 بوصة تدعم الاتصال اللاسلكي السريع بـ Apple CarPlay و Android Auto.","explanation_ar":"نعم، تأتي فئة Smart بشاشة لمس 9 بوصة تدعم الاتصال اللاسلكي السريع بـ Apple CarPlay و Android Auto."}}',
  'carousel',
  0,
  1,
  'approved',
  2
)
ON CONFLICT(id) DO UPDATE SET
  media_data = excluded.media_data,
  url = excluded.url;
