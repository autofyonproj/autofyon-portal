'use client';

import { useState } from 'react';
import type {
  ContentPermissions, StudioField, StudioGalleryItem, StudioSection,
} from '@/lib/content-admin';
import type { SocialLink } from '@/lib/social-link-types';
import GalleryManager from '@/components/GalleryManager';
import SocialLinksEditor from '@/components/SocialLinksEditor';
import YouTubeEmbedForm from '@/components/YouTubeEmbedForm';

export default function VehicleContentStudio({
  sellerId,
  unitId,
  sections,
  fields,
  initialGallery,
  initialSocialLinks,
  permissions,
}: {
  sellerId: string;
  unitId: string;
  sections: StudioSection[];
  fields: Record<string, StudioField[]>;
  initialGallery: Record<string, StudioGalleryItem[]>;
  initialSocialLinks: SocialLink[];
  permissions: ContentPermissions;
}) {
  const [gallery, setGallery] = useState(initialGallery);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<'gallery' | 'social'>('gallery');
  const section = sections.find((item) => item.id === activeSection);
  const sectionFields = section ? fields[section.id] ?? [] : [];

  return (
    <section className="space-y-4">
      <nav className="flex gap-2 border-b border-black/10 pb-2" aria-label="Vehicle content">
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          aria-pressed={activeTab === 'gallery'}
          className={`rounded-lg px-3 py-2 text-sm ${activeTab === 'gallery' ? 'bg-neutral-900 text-white' : 'border border-black/10 hover:bg-black/5'}`}
        >
          Gallery &amp; carousel
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          aria-pressed={activeTab === 'social'}
          className={`rounded-lg px-3 py-2 text-sm ${activeTab === 'social' ? 'bg-neutral-900 text-white' : 'border border-black/10 hover:bg-black/5'}`}
        >
          Social links
        </button>
      </nav>

      {activeTab === 'social' ? (
        <SocialLinksEditor businessId={sellerId} unitId={unitId} initialLinks={initialSocialLinks} />
      ) : !sections.length ? (
        <p className="rounded-xl border border-black/10 p-4 text-sm opacity-70">No vehicle gallery sections are configured for this model.</p>
      ) : section ? (
        <>
          <div>
            <h2 className="text-lg font-bold">Vehicle gallery and carousel</h2>
            <p className="text-sm opacity-60">Upload photos or add a YouTube walkaround for this exact vehicle. Bind media to a field to make it a carousel slide.</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-b border-black/10 pb-2" aria-label="Vehicle gallery sections">
            {sections.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${activeSection === item.id ? 'bg-neutral-900 text-white' : 'border border-black/10 hover:bg-black/5'}`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          <GalleryManager
            businessId={sellerId}
            unitId={unitId}
            sectionId={section.id}
            items={gallery[section.id] ?? []}
            fields={sectionFields}
            permissions={permissions}
            onUpdate={(items) => setGallery((current) => ({ ...current, [section.id]: items }))}
          />
          <YouTubeEmbedForm
            businessId={sellerId}
            unitId={unitId}
            sectionId={section.id}
            fields={sectionFields}
            onAdded={(item) => setGallery((current) => ({
              ...current,
              [section.id]: [...(current[section.id] ?? []), item],
            }))}
          />
        </>
      ) : null}
    </section>
  );
}
