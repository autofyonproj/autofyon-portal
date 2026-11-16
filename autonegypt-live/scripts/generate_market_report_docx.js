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

async function generateReport() {
  const doc = new Document({
    creator: 'AutoPortal / AutoFyon Strategic Intelligence',
    title: 'تقرير التموضع الاستراتيجي والمنافسة في سوق السيارات المصري',
    description: 'تحليل المنافسين، الميزة التنافسية، وفرص الهيمنة على سوق السيارات في مصر',
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
                size: 28,
                color: '8B7340',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { before: 100, after: 400 },
            children: [
              new TextRun({
                text: 'تقرير التموضع الاستراتيجي والمنافسة في سوق السيارات المصري',
                bold: true,
                size: 40,
                color: '0D1117',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            spacing: { before: 0, after: 600 },
            children: [
              new TextRun({
                text: 'دراسة تحليلية للمنافسين (ContactCars, Hatla2ee, YallaMotor) والخنادق التنافسية لـ أوتوفيون',
                size: 22,
                color: '666666',
              }),
            ],
          }),

          // Divider
          new Paragraph({
            spacing: { after: 400 },
            border: {
              bottom: { color: 'C4A265', space: 1, value: BorderStyle.SINGLE, size: 12 },
            },
            children: [],
          }),

          // Section 1: Executive Verdict
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: '1. الخلاصة التنفيذية (The Executive Verdict): هل نمتلك فرصة حقيقية؟',
                bold: true,
                size: 30,
                color: '0D1117',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({
                text: 'الإجابة القاطعة: نعم وبقوة، والفرصة ليست فقط سانحة بل استثنائية (Blue Ocean Opportunity).',
                bold: true,
                color: '8B7340',
              }),
              new TextRun({
                text: ' يعيش سوق السيارات المصري حالياً أكبر حالة إعادة تشكيل في تاريخه: تغيرات أسعار متلاحقة، دخول مكثف لأكثر من 15 علامة تجارية صينية جديدة، وتخبط في قنوات التوزيع. في المقابل، المنصات التقليدية المسيطرة تاريخياً (مثل كونتكت كارز وهتلاقي) تعيش في حقبة تقنية قديمة تعود لعام 2010، وتعامل السيارات كمجرد إعلانات مبوبة فردية تفتقر للهوية والمصداقية وعمق المواصفات.',
              }),
            ],
          }),

          // Section 2: Competitor Analysis
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '2. تفكيك خريطة المنافسين ونقاط ضعفهم القاتلة',
                bold: true,
                size: 30,
                color: '0D1117',
              }),
            ],
          }),

          new Paragraph({
            bidirectional: true,
            spacing: { before: 150, after: 100 },
            children: [
              new TextRun({ text: 'أ. كونتكت كارز (ContactCars): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'المنصة الأقدم وتتمتع بثقة تاريخية وتكامل مع تمويل كونتكت. لكن نقطة ضعفها القاتلة هي واجهة المستخدم المزدحمة بالبانرات الإعلانية المشتتة، وبطء التحديث، وعدم تقديم أي حلول للمعارض لإنشاء مواقع مصغرة مستقلة خاصة بها، واعتمادها على جداول صامتة خالية من الصور المتخصصة للمواصفات.',
              }),
            ],
          }),

          new Paragraph({
            bidirectional: true,
            spacing: { before: 150, after: 100 },
            children: [
              new TextRun({ text: 'ب. هتلاقي (Hatla2ee): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'تمتلك ترافيك ضخم في سوق المستعمل والأفراد، لكنها تعاني من أزمة ثقة حادة (فوضى الإعلانات الوهمية والأرقام غير المحدثة). كما أنها تفتقر تماماً للهندسة الرقمية: لا يوجد كاروسيل مواصفات، ولا ربط لشبكات الموزعين المعتمدين، ومظهرها العام ينفر الوكلاء والمعارض الفاخرة.',
              }),
            ],
          }),

          new Paragraph({
            bidirectional: true,
            spacing: { before: 150, after: 100 },
            children: [
              new TextRun({ text: 'ج. يلا موتور مصر (YallaMotor): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'منصة إقليمية مدارة من دبي؛ تمتلك أرشفة جيدة للموديلات، لكنها منفصلة تماماً عن ديناميكيات السوق المصري (الأوفر برايس، شبكة الموزعين في المحافظات، حلول الواتساب للتجار).',
              }),
            ],
          }),

          new Paragraph({
            bidirectional: true,
            spacing: { before: 150, after: 200 },
            children: [
              new TextRun({ text: 'د. دوبيزل مصر (Dubizzle / OLX): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'منصة إعلانات عامة لا تقدم أي تخصص للسيارات، ولا يمكن للمشتري أو الوكيل الاعتماد عليها كمرجع رسمي لمواصفات وفئات السيارات.',
              }),
            ],
          }),

          // Section 3: Comparison Table
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '3. مصفوفة المقارنة المباشرة: أوتوفيون في مواجهة السوق',
                bold: true,
                size: 30,
                color: '0D1117',
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E2329' },
                    children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'المنصات المنافسة', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '8B7340' },
                    children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'منصة أوتوفيون (AutoFyon)', bold: true, color: 'FFFFFF' })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: '1E2329' },
                    children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'الميزة التنافسية', bold: true, color: 'FFFFFF' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'صفحة إعلان عادية أو جدول صامت' })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'موقع مصغر مستقل (Minisite) لكل سيارة ومعرض', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'المواقع المصغرة' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'معلومات عامة مقتضبة' })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: '13 رف مخصص (محرك، تكنولوجيا، أمان، مقصورة...)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'عمق المواصفات' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'قوائم مفرقة بدون أدوات تصدير' })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: '2,823 معرض وموزع مع تصدير VCF والواتساب الفوري', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'دليل شبكة التجار' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'صور عشوائية بدون ربط بالمواصفات' })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'شريحة وصورة لكل مواصفة + اختبارات تفاعلية Quiz', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'الكاروسيل والوسائط' })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'استضافة تقليدية وبطء في التصفح' })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'سيرفرات Cloudflare Edge فائقة السرعة (< 1 ثانية)', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ bidirectional: true, children: [new TextRun({ text: 'سرعة واستقرار الموقع' })] })] }),
                ],
              }),
            ],
          }),

          // Section 4: Our Moats
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '4. الخنادق التنافسية لـ أوتوفيون (Our Unfair Advantages)',
                bold: true,
                size: 30,
                color: '0D1117',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '1. استراتيجية حصان طروادة للمعابر (2,823 معرض جاهز): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'بدلاً من البحث عن معارض من الصفر، نمتلك بالفعل أرقام هواتف وواتساب 2,823 معرض وموزع في مصر. تقديم مواقع مصغرة مجانية لهم مع أزرار تواصل مباشرة يمنحهم قيمة تسويقية تفوق مواقعهم الشخصية دون أي تكلفة تأسيس.',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '2. الروابط الهرمية وقوة محركات البحث (SEO Masterstroke): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'بنية autofyon.com/toyota/yaris تمنح أوتوفيون صدارة نتائج البحث العضوي في Google لكل من يبحث عن مواصفات أو أسعار أو معارض أي سيارة في مصر.',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '3. تسجيل عروض وتعديلات المعارض على قاعدة بيانات السيارة: ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'السيارة هي المرساة، وجميع عروض المعارض والأوفر برايس والكماليات المضافة تُسجل على صفحة السيارة نفسها، مما يجعل صفحة السيارة مرجعاً حياً لمقارنة عروض كل معارض مصر.',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '4. استوديو الإنتاج وتصدير الفيديو الترويجي (MP4 & YouTube): ', bold: true, color: '8B7340' }),
              new TextRun({
                text: 'تحويل الكاروسيل إلى ريلز وفيديوهات MP4 ومشاركتها مباشرة على يوتيوب يحل أكبر معضلة تسويقية للمعارض، ويجعل أوتوفيون ذراع الإنتاج الإعلامي الحصري لهم.',
              }),
            ],
          }),

          // Section 5: Go-to-Market
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            bidirectional: true,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: '5. خطة العمل لاقتناص الحصة السوقية (GTM Execution Plan)',
                bold: true,
                size: 30,
                color: '0D1117',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '• المرحلة الأولى (الشهر الأول): ', bold: true }),
              new TextRun({
                text: 'إطلاق ميزة تصدير جهات الاتصال (VCF) لجميع تجار مصر لنشر اسم أوتوفيون على هواتف أكثر من 10,000 تاجر ومندوب مبيعات، مع استكمال كتالوج الـ 156 سيارة بالصور والمواصفات.',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '• المرحلة الثانية (الشهر الثاني): ', bold: true }),
              new TextRun({
                text: 'استقطاب أول 100 معرض رئيسي (في مدينة نصر، مصر الجديدة، المهندسين، والإسكندرية) لربط عروضهم ومخزونهم الفعلي على صفحات السيارات وتفعيل أزرار الواتساب.',
              }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            children: [
              new TextRun({ text: '• المرحلة الثالثة (الشهر الثالث): ', bold: true }),
              new TextRun({
                text: 'الشراكات مع الوكلاء الرسميين (GB Auto, المنصور، تويوتا، نيسان) لتوثيق قوائم الأسعار الرسمية ومراكز الصيانة المعتمدة.',
              }),
            ],
          }),

          // Sign-off
          new Paragraph({
            spacing: { before: 500 },
            border: {
              top: { color: 'C4A265', space: 1, value: BorderStyle.SINGLE, size: 8 },
            },
            children: [
              new TextRun({
                text: 'إعداد: وحدة التخطيط الاستراتيجي وتطوير المنصة — أوتوفيون مصر (AutoFyon.com)',
                bold: true,
                size: 20,
                color: '8B7340',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPathLocal = path.join(__dirname, '..', 'AutoFyon_Egyptian_Market_Strategic_Report.docx');
  const artifactDir = 'C:\\Users\\7assan\\.gemini\\antigravity\\brain\\d694cd89-5fe0-4eb2-9786-871e8d1dfcfb';
  const outPathArtifact = path.join(artifactDir, 'AutoFyon_Egyptian_Market_Strategic_Report.docx');

  fs.writeFileSync(outPathLocal, buffer);
  console.log('Saved local docx:', outPathLocal);

  try {
    fs.writeFileSync(outPathArtifact, buffer);
    console.log('Saved artifact docx:', outPathArtifact);
  } catch (err) {
    console.error('Could not save to artifact directory:', err);
  }
}

generateReport().catch(console.error);
