const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require('docx');

async function generateAgencyReport() {
  const doc = new Document({
    creator: 'AutoFyon Strategy & Partnership Division',
    title: 'استراتيجية التعاون مع وكلاء السيارات في مصر وخطة الرعاية والتحليل الرباعي SWOT',
    description: 'دليل الشراكة مع وكلاء السيارات الرسميين وفرص التعاون والتحليل الرباعي واستراتيجية الرعاة غير المنافسين',
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 24, // 12pt
            color: '1A1A1A',
          },
          paragraph: {
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { line: 360, before: 120, after: 120 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Header / Title Block
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'منصة أوتوفيون | AutoFyon.com',
                bold: true,
                size: 36, // 18pt
                color: 'E5383B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { before: 50, after: 200 },
            children: [
              new TextRun({
                text: 'ملف الشراكة الاستراتيجية مع وكلاء السيارات المعتمدين في مصر',
                bold: true,
                size: 30, // 15pt
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { before: 0, after: 300 },
            children: [
              new TextRun({
                text: 'فرص التعاون • المرونة التقنية • التحليل الرباعي (SWOT) • استراتيجية الرعاية المتكاملة',
                size: 22,
                color: '64748B',
                italics: true,
              }),
            ],
          }),

          // Metadata Callout Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                      left: { style: BorderStyle.SINGLE, size: 12, color: 'E5383B' }, // Red accent
                      right: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
                    },
                    children: [
                      new Paragraph({
                        bidirectional: true,
                        children: [
                          new TextRun({ text: 'إعداد: ', bold: true }),
                          new TextRun('قطاع التطوير والشراكات الاستراتيجية - AutoFyon Egypt\n'),
                          new TextRun({ text: 'التاريخ المرجعي: ', bold: true }),
                          new TextRun('نوفمبر 2026\n'),
                          new TextRun({ text: 'المستهدف: ', bold: true }),
                          new TextRun('وكلاء وموزعو السيارات الرسميون في جمهورية مصر العربية (تويوتا، المنصور، جي بي أوتو، مانسكو، ناتكو، وغيرها)\n'),
                          new TextRun({ text: 'الهدف: ', bold: true }),
                          new TextRun('بناء تحالف رقمي مباشر يحمي صورة الوكيل، يعزز مبيعاته، ويمنحه مرونة التحديث الذاتي الفوري.'),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300 } }),

          // Section 1: Executive Overview
          heading1('1. الرؤية العامة: لماذا يحتاج وكيل السيارات في مصر إلى منصة AutoFyon؟'),
          bodyPara('يشهد سوق السيارات المصري مرحلة تحول جذرية بعد المتغيرات السعرية وظاهرة الأوفر برايس (Overprice)، حيث بات المستهلك المصري يبحث عن مصدر موثوق يمنحه المواصفات الرسمية والأسعار الدقيقة المعلنة من الوكيل بعيداً عن عشوائية مواقع الإعلانات المبوبة.'),
          bodyPara('تعاني المواقع التقليدية (مثل هتلاقي وكونتاكت كارز) من ازدحام الإعلانات وتضارب الأسعار وضعف الجودة البصرية للموديلات الجديدة. في المقابل، تقدم AutoFyon تجربة رقمية فاخرة تعامل كل سيارة كـ "موقع مصغر مستقل (Minisite)" يتمتع بجودة بصرية سينمائية 21:9 Cinemascope، وبطاقات أمان وفئات سعرية وتفاصيل تقنية دقيقة.'),

          new Paragraph({ spacing: { before: 200 } }),

          // Section 2: Opportunities per Major Agency
          heading1('2. فرص التعاون الخاصة بأبرز وكلاء السيارات في مصر'),
          bodyPara('توفر AutoFyon قيمة مضافة مخصصة لكل مجموعة وكالات وفقاً لتشكيلتها واحتياجاتها التسويقية:'),

          createStyledTable(
            ['المجموعة / الوكيل', 'أبرز العلامات التجارية', 'الفرصة الاستراتيجية مع أوتوفيون'],
            [
              [
                'المنصور للسيارات (Al-Mansour)',
                'MG, Chevrolet, Opel',
                'إبراز تفوق تشكيلة إم جي المتطورة (MG 7, MG GT, HS HEV)، تسليط الضوء على مقارنات مواصفات مصر بالخليج لتبرير التسعير، وتوجيه المشترين مباشرة لفروع الوكيل في الأقاليم (الإسكندرية، المنصورة، أسيوط، سوهاج).'
              ],
              [
                'تويوتا إيجيبت (Toyota Egypt)',
                'Toyota, Lexus',
                'تقديم طرازات 2026 الأحدث عالمياً (كورولا 2026، برادو J250، أوربان كروزر، bZ4X الكهربائية) بصور سينمائية تليق باعتمادية العلامة، وإبراز شبكة مراكز الخدمة المعتمدة.'
              ],
              [
                'جي بي أوتو (GB Auto)',
                'Hyundai, Chery, Changan, Haval',
                'تنظيم كتالوج ضخم يضم أكثر من 30 طرازاً في منصة مرتبة تمنع تشتت المشتري، والتركيز على طرازات التجميع المحلي وحملات الصيانة والضمان.'
              ],
              [
                'مانسكو والقصراوي وEIM',
                'Peugeot, Citroen, Renault, Jetour',
                'إبراز التصميم الأوروبي والمقصورات المستقبلية (i-Cockpit) عبر شرائح العرض التفاعلية وتثقيف المستهلك المصري حول ميزات الأمان المتقدمة.'
              ],
              [
                'وكلاء السيارات الفاخرة (NATCO, Global Auto)',
                'Mercedes-Benz, BMW, Audi',
                'الاستفادة من الوضع السينمائي الفاخر (Cinematic Luxury Preset) بدون إعلانات مزعجة تسيء لصورة العلامة، واستعراض فئات الـ M Power والـ AMG بمواصفات حصرية.'
              ]
            ],
            [25, 25, 50]
          ),

          new Paragraph({ spacing: { before: 250 } }),

          // Section 3: Platform Features & Flexibility for Agencies
          heading1('3. المزايا التقنية والمرونة التشغيلية الممنوحة للوكلاء'),
          bodyPara('صُممت منصة AutoFyon لتمنح الوكيل أقصى درجات المرونة والتحكم الكامل في بياناته عبر مسارين متوازيين:'),

          heading2('أ. لوحة الإدارة الذاتية المعتمدة (Self-Serve Verified Agency Portal)'),
          bulletItem('تحديث فوري للأسعار الرسمية: يستطيع مدير التسويق أو المبيعات لدى الوكيل تعديل الأسعار فور صدور القائمة الرسمية وتنعكس مباشرة على المنصة في ثوانٍ.'),
          bulletItem('إدارة الفئات والمواصفات: تعديل تجهيزات الفئات (Standard, Luxury, Sport) وإضافة ألوان الطلاء المتاحة في المخزون الحقيقي.'),
          bulletItem('ربط الفروع ومراكز الصيانة: إضافة الفروع الجديدة، مواعيد العمل، أرقام الخطوط الساخنة، ومواقع خرائط جوجل بدقة.'),

          heading2('ب. خدمة الكونسيرج الإداري الفوري (Managed Concierge Service)'),
          bulletItem('في حال انشغال فريق الوكيل، يمكنهم ببساطة إرسال ملف الإكسل (Master Sheet) أو الكتالوج المعتمد لفريق محتوى AutoFyon، ليتم تدقيقه وبرمجته ورفعه على السحابة خلال ساعات عمل رسمية مجاناً.'),

          heading2('ج. محرك الكروسيل السينمائي التفاعلي (Cinematic Interactive Engine)'),
          bulletItem('عرض سينمائي فاخر بنسبة 21:9 Cinemascope مع تدرج لوني يعكس فخامة السيارة ويبرز خطوط التصميم الديناميكية.'),
          bulletItem('شرائح تفاعلية وأسئلة ذكية (Quiz/Trivia Slides): مسابقات سريعة لزوار المنصة تختبر معرفتهم بقدرات المحرك أو الأمان، مما يزيد من وقت بقاء العميل على الصفحة بمعدل 4 أضعاف مقارنة بالمواقع التقليدية.'),
          bulletItem('تضمين جولات الفيديو وقنوات يوتيوب المعتمدة للوكيل مباشرة داخل شرائح العرض.'),

          heading2('د. التحميل المباشر للبروشور دون تسريب الزوار (Direct In-Platform Brochure Proxy)'),
          bulletItem('يمكن للزائر تحميل الكتالوج والمواصفات الرسمية بضغطة زر واحدة بصيغة PDF؛ حيث يقوم خادمنا بجلب الملف وتسميته رسمياً باسم AutoFyon دون أن يغادر الزائر الموقع أو ينتقل لموقع آخر.'),

          heading2('هـ. التحكم الكامل في توثيق مصدر الوكيل (Source Citation & Traffic Protection)'),
          bulletItem('يحتفظ الأدمن أو الوكيل بالحق في إظهار أو إخفاء رابط موقع الوكيل الخارجي بنقرة زر واحدة لحماية حركة الزيارات وإبقاء المشتري مركزاً على معارضنا المشتركة.'),

          new Paragraph({ spacing: { before: 250 } }),

          // Section 4: Comprehensive SWOT Analysis
          heading1('4. التحليل الرباعي الشامل (SWOT Analysis) لشراكة الوكلاء'),
          bodyPara('يوضح التحليل الاستراتيجي التالي نقاط القوة والضعف والفرص والمخاطر المتعلقة بالشراكة المباشرة مع وكلاء السيارات:'),

          createStyledTable(
            ['العنصر الاستراتيجي', 'التفاصيل والبنود', 'الأثر التشغيلي والحلول المقترحة'],
            [
              [
                'نقاط القوة\n(Strengths)',
                '• تجربة رقمية متفوقة وبصرية سينمائية غير مسبوقة في مصر.\n• دقة وموثوقية البيانات ومنع شائعات التسعير.\n• معمارية سحابية خارقة على Cloudflare Workers لا تتوقف.\n• تكامل هرمي يربط الوكيل بالموزعين المعتمدين والمشترين.',
                'تمنح أوتوفيون مكانة "المصدر الموثوق الأول" لسوق السيارات، وتمنح الوكيل وسيلة تسويق بريميوم تنافس بوابات دبي وأوروبا.'
              ],
              [
                'نقاط الضعف\n(Weaknesses)',
                '• حداثة المنصة بالمقارنة مع المنصات التاريخية (كونتاكت كارز/هتلاقي).\n• الاعتماد الأولي على التحديث المستمر ومتابعة الوكلاء.\n• عدم توفر صور حقيقية لبعض الفئات الاقتصادية فور نزولها.',
                'علاج نقطة الضعف: توفير سكريبتات السحب الآلي للبيانات، واستوديو التوليد الافتراضي بالذكاء الاصطناعي لسد أي نقص في الصور فوراً.'
              ],
              [
                'الفرص\n(Opportunities)',
                '• ملء الفراغ الكبير في تغطية سيارات الهايبرد والسيارات الكهربائية الجديدة.\n• استقطاب جيل المشترين الشباب الباحثين عن المقصورات الذكية والشاشات.\n• تأسيس شراكات حصرية مع الموزعين ومراكز الصيانة المعتمدة.\n• التحول للمنصة الرسمية لحجز تجارب القيادة (Test Drives).',
                'فرصة الاستحواذ على صدارة البحث العضوي (SEO) في مصر لأسماء الموديلات وفئاتها لعامي 2026 و2027.'
              ],
              [
                'التهديدات\n(Threats)',
                '• بطء الإجراءات البيروقراطية لدى إدارات التسويق ببعض الوكالات الكبرى.\n• تقلبات أسعار الصرف التي قد تحدث إرباكاً في التسعير.\n• محاولة المنصات المنافسة محاكاة التصميم البصري للكروسيل.',
                'تحييد التهديد: إتاحة العرض التلقائي المحدث مجاناً للموديلات، بحيث يجد الوكيل سياراته معروضة بأرقى شكل دون أن نبدأ بطلب تكاليف تعطل التعاون.'
              ]
            ],
            [20, 45, 35]
          ),

          new Paragraph({ spacing: { before: 250 } }),

          // Section 5: Launch & Onboarding Roadmap
          heading1('5. خطة الإطلاق ومراحل استقطاب الوكلاء (Go-To-Market & Onboarding)'),
          bodyPara('نقترح خطة إطلاق مرحلية تضمن بناء الثقة السريعة مع الوكلاء دون فرض أعباء مادية أو إدارية عليهم في البداية:'),

          bulletItem('المرحلة الأولى: التجهيز الاستباقي للبيانات (The "Already Built" Strategy) — تم إنجازها: قمنا بالفعل بإدخال وتصوير سيارات تويوتا وإم جي لعام 2026/2027 وتوفير روابط مباشرة تعمل بكفاءة على السحابة.'),
          bulletItem('المرحلة الثانية: التواصل التجاري الرقمي المصور: إرسال تقرير أنيق ورابط العرض المباشر لمدير التسويق والعلاقات العامة (PR Manager) بالوكالة قائلاً: "سياراتكم ومراكزكم معروضة بالفعل على أوتوفيون بأحدث فئات 2026.. إليكم حسابكم المجاني لإدارتها".'),
          bulletItem('المرحلة الثالثة: منح علامة "الوكيل المعتمد" (Verified Agency Badge): تفعيل التوثيق الرسمي ومفتاح التحكم برابط الموقع والبروشور المباشر.'),
          bulletItem('المرحلة الرابعة: تشغيل تحويل طلبات الشراء وتجارب القيادة (VIP Lead Forwarding): إرسال بيانات العملاء الجادين ومحبي العلامة مباشرة للخط الساخن أو نظام CRM الخاص بالوكيل.'),

          new Paragraph({ spacing: { before: 250 } }),

          // Section 6: Sponsorship Strategy - Car Agency vs Non-Competing Giants
          heading1('6. استراتيجية الرعاية: هل نعتمد على رعاية وكلاء السيارات أم لا؟'),
          bodyPara('هذه نقطة جوهرية وحاسمة في نجاح المنصة على المدى الطويل، وتخضع للمبادئ الاستراتيجية التالية:'),

          heading2('أ. التوصية الحاسمة بشأن رعاية وكلاء السيارات (Car Agencies):'),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({
                text: '⚠️ غير موصى به إطلاقاً أخذ رعاية حصرية رئيسية من وكيل سيارات معين للمنصة ككل (Do NOT take Master Sponsorship from a Car Agency).',
                bold: true,
                color: 'B91C1C',
              }),
            ],
          }),
          bodyPara('السبب الاستراتيجي: إذا قامت شركة مثل "المنصور" أو "تويوتا" برعاية المنصة كراعٍ رسمي رئيسي، ستفقد المنصة فوراً ميزتها التنافسية الكبرى وهي "الحيادية والاستقلالية (Editorial Neutrality)" في عيون المشتري المصري، وسيشعر وكلاء العلامات المنافسة (مثل جي بي أوتو ومانسكو) بالانحياز وسيرفضون التعاون أو تغذية بياناتهم.'),
          bodyPara('النموذج الصحيح لتعامل الوكلاء: دخل اشتراكات SaaS، باقات توثيق المعارض، وتوليد العملاء المهتمين (Lead Generation) لكل علامة في صفحتها المستقلة دون هيمنة على الموقع العام.'),

          heading2('ب. البديل الذهبي: الرعاة الاستراتيجيون من القطاعات الكبرى غير المنافسة'),
          bodyPara('تمثل القطاعات الداعمة لسوق السيارات الميدان الأكثر ربحية ومصداقية لجلب الرعاية الكبرى (Master Sponsorships) دون أي تعارض مصالح:'),

          createStyledTable(
            ['القطاع المستهدف', 'أبرز الكيانات في مصر', 'شكل وطبيعة الرعاية ومساحات الظهور'],
            [
              [
                '1. شركات الاتصالات والشبكات\n(Telecom Giants)',
                'فودافون مصر (Vodafone RED)\nأورانج (Orange Premier)\nاتصالات من &e\nالمصرية للاتصالات (WE)',
                '• رعاية التجربة الرقمية والبصرية للمنصة: "مدعوم بأسرع شبكة إنترنت".\n• رعاية تقنيات السيارات المتصلة (Connected Cars و eSIM) المعروضة في أقسام التكنولوجيا `sec_auto_technology`.\n• حملات عروض حصرية لعملاء الفئات المميزة (مثل Vodafone RED و Orange Eagle).'
              ],
              [
                '2. البنوك وشركات التمويل والتقسيط\n(Banks & Auto Finance)',
                'البنك الأهلي المصري\nبنك مصر\nالبنك التجاري الدولي (CIB)\nشركة كونتكت للتمويل (Contact)\nشركة فاليو (ValU)\nشركة درايف (Drive)\nأمان (Aman)',
                '• الوجود الحصري داخل حاسبة التمويل والأقساط التفاعلية أسفل كل فئة سيارة.\n• زر تفاعلي: "قدّم على تقسيط هذه السيارة فوراً عبر بنك X / فاليو".\n• هذا هو القطاع الأعلى إنفاقاً والأكثر تعطشاً لمشتري السيارات الجدد في مصر!'
              ],
              [
                '3. شركات الزيوت والبترول العالمية\n(Oil & Lubricants)',
                'إكسون موبيل (Mobil 1)\nشل مصر (Shell Helix)\nتوتال إنرجيز (TotalEnergies)',
                '• الرعاية الحصرية لأقسام المحركات ومنظومات القوة `sec_auto_engine`.\n• وضع علامة: "الزيت الموصى به لمحركات هذه الفئة هو Mobil 1 أو Shell Helix".\n• رعاية جداول وتنبيهات مواعيد الصيانة الدورية.'
              ],
              [
                '4. شركات التأمين الشامل على السيارات\n(Motor Insurance)',
                'مصر للتأمين\nشركة جي آي جي (gig)\nأكسا للتأمين (AXA)\nأليانز (Allianz)',
                '• الرعاية الحصرية لأقسام ومواصفات الأمان `sec_auto_safety` وأنظمة ADAS.\n• حاسبة أسعار وثيقة التأمين الشامل الفورية للسيارة حسب قيمتها السوقية المعلنة في المنصة.'
              ]
            ],
            [25, 25, 50]
          ),

          new Paragraph({ spacing: { before: 250 } }),

          // Section 7: Strategic Conclusion
          heading1('7. الخلاصة وخطة الخطوة القادمة'),
          bodyPara('يمتلك مشروع AutoFyon تركيبة استثنائية تجمع بين المعمارية البرمجية السحابية الفائقة، والجماليات البصرية السينمائية، والتأمين الشديد للبيانات، مما يؤهله للجلوس على طاولة المفاوضات مع كبار الوكلاء والرعاة من موقع القوة والاحترافية.'),
          bodyPara('الخطوة القادمة هي تقديم العرض الحي لصفحات تويوتا كورولا 2026 وإم جي ZS 2027 لمدراء التسويق ليروا بأعينهم كيف تتفوق صفحات سياراتهم على كل ما هو موجود في السوق المصري، بالتوازي مع فتح خطوط التواصل مع مسؤولي الرعاية في كبرى شركات الاتصالات والبنوك المصرية.'),

          new Paragraph({ spacing: { before: 300 } }),

          // Sign-off Block
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            children: [
              new TextRun({
                text: 'تم بحمد الله إعداد التقرير الاستراتيجي — AutoFyon 2026',
                bold: true,
                size: 22,
                color: '64748B',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath1 = path.join(__dirname, '..', 'to_agencies.docx');
  const outPath2 = path.join(__dirname, '..', 'AutoFyon_Agencies_Partnership_Strategy.docx');
  const artifactPath = path.join(
    'C:\\Users\\7assan\\.gemini\\antigravity\\brain\\d694cd89-5fe0-4eb2-9786-871e8d1dfcfb',
    'to_agencies.docx'
  );

  fs.writeFileSync(outPath1, buffer);
  fs.writeFileSync(outPath2, buffer);
  fs.writeFileSync(artifactPath, buffer);

  console.log('Documents generated successfully:');
  console.log('1. ', outPath1);
  console.log('2. ', outPath2);
  console.log('3. ', artifactPath);
}

// Helper functions for Word styles
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    bidirectional: true,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14pt
        color: 'E5383B',
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    bidirectional: true,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12pt
        color: '0F172A',
      }),
    ],
  });
}

function bodyPara(text) {
  return new Paragraph({
    bidirectional: true,
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, color: '334155' })],
  });
}

function bulletItem(text) {
  return new Paragraph({
    bidirectional: true,
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, color: '1E293B' })],
  });
}

function createStyledTable(headers, rows, colWidthsPct) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: colWidthsPct[i], type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' }, // Dark navy
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: '0F172A' },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5383B' }, // Red bottom line
          left: { style: BorderStyle.SINGLE, size: 2, color: '1E293B' },
          right: { style: BorderStyle.SINGLE, size: 2, color: '1E293B' },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            children: [
              new TextRun({
                text: h,
                bold: true,
                color: 'FFFFFF',
                size: 22,
              }),
            ],
          }),
        ],
      })
    ),
  });

  const tableRows = [headerRow];

  rows.forEach((row, rowIndex) => {
    const isEven = rowIndex % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : 'F8FAFC';

    tableRows.push(
      new TableRow({
        children: row.map((cellText, i) =>
          new TableCell({
            width: { size: colWidthsPct[i], type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: bgFill },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            },
            children: cellText.split('\n').map(
              (line) =>
                new Paragraph({
                  bidirectional: true,
                  alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.RIGHT,
                  spacing: { before: 60, after: 60 },
                  children: [
                    new TextRun({
                      text: line,
                      size: 20, // 10pt
                      color: i === 0 ? '0F172A' : '334155',
                      bold: i === 0,
                    }),
                  ],
                })
            ),
          })
        ),
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });
}

generateAgencyReport().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
