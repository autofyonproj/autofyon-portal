'use client';

import { useState } from 'react';
import {
  type MediaManagerPresentation,
  type PresentationBlock,
  type PresentationCopy,
} from '@/lib/media-manager-presentation';

type BlockListKey = 'benefits' | 'workflow' | 'freeTools' | 'ecosystem';

const blockLists: { key: BlockListKey; title: string; description: string }[] = [
  { key: 'benefits', title: 'Benefits', description: 'The benefit cards shown in the presentation.' },
  { key: 'workflow', title: 'Workflow', description: 'The steps shown to vendors and partners.' },
  { key: 'freeTools', title: 'Free tools', description: 'What the free version offers today.' },
  { key: 'ecosystem', title: 'AUTOFYON ecosystem', description: 'Future connections and service pathways.' },
];

function CopyFields({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: PresentationCopy;
  onChange: (value: PresentationCopy) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(['ar', 'en'] as const).map((language) => (
        <label key={language} className="block text-xs font-semibold">
          <span className="mb-1 block opacity-65">{label} · {language === 'ar' ? 'العربية' : 'English'}</span>
          {multiline ? (
            <textarea
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              maxLength={2000}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              rows={3}
              value={value[language]}
              onChange={(event) => onChange({ ...value, [language]: event.target.value })}
            />
          ) : (
            <input
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              maxLength={2000}
              className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
              value={value[language]}
              onChange={(event) => onChange({ ...value, [language]: event.target.value })}
            />
          )}
        </label>
      ))}
    </div>
  );
}

function BlockEditor({
  block,
  index,
  count,
  onChange,
  onMove,
}: {
  block: PresentationBlock;
  index: number;
  count: number;
  onChange: (block: PresentationBlock) => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <article className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-bold">{block.title.en || block.id}</div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={block.enabled} onChange={(event) => onChange({ ...block, enabled: event.target.checked })} />
            Show on presentation
          </label>
          <button type="button" className="rounded border px-2 py-1 text-xs disabled:opacity-35" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move block up">↑</button>
          <button type="button" className="rounded border px-2 py-1 text-xs disabled:opacity-35" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Move block down">↓</button>
        </div>
      </div>
      <CopyFields label="Title" value={block.title} onChange={(title) => onChange({ ...block, title })} />
      <CopyFields label="Description" value={block.body} onChange={(body) => onChange({ ...block, body })} multiline />
    </article>
  );
}

export default function MediaManagerPresentationEditor({
  initialPresentation,
  updatedAt,
}: {
  initialPresentation: MediaManagerPresentation;
  updatedAt: string | null;
}) {
  const [presentation, setPresentation] = useState(initialPresentation);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState(updatedAt);

  function updateList(key: BlockListKey, blocks: PresentationBlock[]) {
    setPresentation((current) => ({ ...current, [key]: blocks }));
  }

  function moveBlock(key: BlockListKey, index: number, direction: -1 | 1) {
    const blocks = [...presentation[key]].sort((a, b) => a.order - b.order);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;
    [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
    updateList(key, blocks.map((block, order) => ({ ...block, order })));
  }

  async function save(nextPresentation = presentation) {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/admin/media-manager/presentation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presentation: nextPresentation }),
      });
      const data = await response.json() as { error?: string; presentation?: MediaManagerPresentation; updatedAt?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save presentation.');
      if (data.presentation) setPresentation(data.presentation);
      setLastUpdatedAt(data.updatedAt ?? new Date().toISOString());
      setMessage('Saved and published. The public presentation will load the updated content.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save presentation.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-4">
        <div className="text-xs opacity-70">
          {lastUpdatedAt ? `Last saved: ${new Date(lastUpdatedAt).toLocaleString()}` : 'No custom content saved yet; defaults are shown.'}
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/media-manager/index.html#demo-presentation" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-black/15 px-4 py-2 text-sm font-bold hover:bg-black/[.03]">
            Preview public presentation ↗
          </a>
          <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save and publish'}
          </button>
        </div>
      </div>
      {message ? <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}

      <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-bold">Presentation introduction</h2>
        <CopyFields label="Eyebrow" value={presentation.intro.eyebrow} onChange={(eyebrow) => setPresentation((current) => ({ ...current, intro: { ...current.intro, eyebrow } }))} />
        <CopyFields label="Main title" value={presentation.intro.title} onChange={(title) => setPresentation((current) => ({ ...current, intro: { ...current.intro, title } }))} />
        <CopyFields label="Introduction" value={presentation.intro.description} onChange={(description) => setPresentation((current) => ({ ...current, intro: { ...current.intro, description } }))} multiline />
      </section>

      <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-bold">Audience messages</h2>
        {(['vendors', 'partners'] as const).map((audience) => (
          <div key={audience} className="space-y-3 rounded-xl border border-black/10 p-4">
            <h3 className="font-bold">{audience === 'vendors' ? 'Vendors and showroom owners' : 'Partners and management'}</h3>
            <CopyFields label="Tab label" value={presentation.audiences[audience].label} onChange={(label) => setPresentation((current) => ({ ...current, audiences: { ...current.audiences, [audience]: { ...current.audiences[audience], label } } }))} />
            <CopyFields label="Audience title" value={presentation.audiences[audience].title} onChange={(title) => setPresentation((current) => ({ ...current, audiences: { ...current.audiences, [audience]: { ...current.audiences[audience], title } } }))} />
            <CopyFields label="Audience description" value={presentation.audiences[audience].description} onChange={(description) => setPresentation((current) => ({ ...current, audiences: { ...current.audiences, [audience]: { ...current.audiences[audience], description } } }))} multiline />
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-bold">Presentation sections</h2>
        <div className="space-y-3">
          {blockLists.map(({ key, title, description }) => (
            <details key={key} open className="space-y-3 rounded-xl border border-black/10 p-4">
              <summary className="cursor-pointer font-bold">{title} <span className="text-xs font-normal opacity-60">— {description}</span></summary>
              <div className="space-y-4 pt-3">
                <CopyFields
                  label={`${title} section heading`}
                  value={presentation.sectionTitles[key]}
                  onChange={(copy) => setPresentation((current) => ({ ...current, sectionTitles: { ...current.sectionTitles, [key]: copy } }))}
                />
                {[...presentation[key]].sort((a, b) => a.order - b.order).map((item, index, list) => (
                  <BlockEditor
                    key={item.id}
                    block={item}
                    index={index}
                    count={list.length}
                    onChange={(updated) => updateList(key, presentation[key].map((block) => block.id === updated.id ? updated : block))}
                    onMove={(direction) => moveBlock(key, index, direction)}
                  />
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-lg font-bold">Closing note</h2>
        <CopyFields label="Product status and privacy note" value={presentation.closing} onChange={(closing) => setPresentation((current) => ({ ...current, closing }))} multiline />
      </section>

      <div className="flex justify-end">
        <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save and publish'}
        </button>
      </div>
    </div>
  );
}
