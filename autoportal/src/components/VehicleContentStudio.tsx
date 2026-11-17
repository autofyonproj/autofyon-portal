'use client';

import { useState } from 'react';
import type {
  ContentPermissions, StudioField, StudioGalleryItem, StudioSection,
} from '@/lib/content-admin';
import GalleryManager from '@/components/GalleryManager';

export default function VehicleContentStudio({
  sellerId,
  unitId,
  sections,
  fields,
  initialGallery,
  permissions,
}: {
  sellerId: string;
  unitId: string;
  sections: StudioSection[];
  fields: Record<string, StudioField[]>;
  initialGallery: Record<string, StudioGalleryItem[]>;
  permissions: ContentPermissions;
}) {
  const [gallery, setGallery] = useState(initialGallery);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const section = sections.find((item) => item.id === activeSection);

  if (!sections.length) {
    return <p className="rounded-xl border border-black/10 p-4 text-sm opacity-70">No vehicle gallery sections are configured for this model.</p>;
  }

  return (
    <section dir="rtl" className="space-y-4">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🚗</span>
          <span>معرض وسلايدر هذه السيارة (Vehicle Carousel & Media)</span>
        </h2>
        <p className="text-xs opacity-60 mt-1">
          ارفع صور هذه السيارة تحديداً، تحكم في ترتيب الشرائح، التقط بالكاميرا مباشرة، أو أضف فيديو مراجعة من يوتيوب.
        </p>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-b border-black/10 dark:border-white/10 pb-2" aria-label="Vehicle gallery sections">
        {sections.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            aria-current={activeSection === item.id ? 'page' : undefined}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeSection === item.id
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 opacity-75'
            }`}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.name_ar || item.name}</span>
          </button>
        ))}
      </nav>
      {section ? (
        <GalleryManager
          businessId={sellerId}
          unitId={unitId}
          sectionId={section.id}
          items={gallery[section.id] ?? []}
          fields={fields[section.id] ?? []}
          permissions={permissions}
          onUpdate={(items) => setGallery((current) => ({ ...current, [section.id]: items }))}
        />
      ) : null}
    </section>
  );
}
