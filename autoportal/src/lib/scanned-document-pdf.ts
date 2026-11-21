type ScannedPage = {
  width: number;
  height: number;
  bytes: Uint8Array;
};

const textEncoder = new TextEncoder();

function encodedText(value: string): Uint8Array {
  return textEncoder.encode(value);
}

function createPdf(pages: ScannedPage[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  const offsets = [0];
  let length = 0;
  const append = (bytes: Uint8Array) => {
    chunks.push(bytes);
    length += bytes.byteLength;
  };
  const appendText = (value: string) => append(encodedText(value));
  const startObject = (id: number) => {
    offsets[id] = length;
    appendText(`${id} 0 obj\n`);
  };

  appendText('%PDF-1.4\n');
  startObject(1);
  appendText('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  startObject(2);
  const pageRefs = pages.map((_, index) => `${3 + index * 3} 0 R`).join(' ');
  appendText(`<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((page, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const content = `q\n${page.width} 0 0 ${page.height} 0 0 cm\n/Im0 Do\nQ\n`;

    startObject(pageId);
    appendText(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`);
    startObject(imageId);
    appendText(`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.byteLength} >>\nstream\n`);
    append(page.bytes);
    appendText('\nendstream\nendobj\n');
    startObject(contentId);
    appendText(`<< /Length ${encodedText(content).byteLength} >>\nstream\n${content}endstream\nendobj\n`);
  });

  const crossReferenceOffset = length;
  appendText(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (let id = 1; id < offsets.length; id++) {
    appendText(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  appendText(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${crossReferenceOffset}\n%%EOF\n`);

  const pdf = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    pdf.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return pdf;
}

async function toJpegPage(file: File): Promise<ScannedPage> {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 2400 / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    image.close();
    throw new Error('تعذر تجهيز صفحة المسح على هذا الجهاز.');
  }
  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  image.close();

  const jpeg = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('تعذر تحويل صورة الصفحة إلى مستند.'));
    }, 'image/jpeg', 0.9);
  });
  return { width, height, bytes: new Uint8Array(await jpeg.arrayBuffer()) };
}

export async function combineScannedImages(files: File[]): Promise<File> {
  if (!files.length || files.length > 20) {
    throw new Error('اختر من صفحة واحدة إلى 20 صفحة للمستند الواحد.');
  }
  const pages = await Promise.all(files.map(toJpegPage));
  const pdf = createPdf(pages);
  const buffer = new ArrayBuffer(pdf.byteLength);
  new Uint8Array(buffer).set(pdf);
  return new File([buffer], `scan-${Date.now()}.pdf`, { type: 'application/pdf' });
}
