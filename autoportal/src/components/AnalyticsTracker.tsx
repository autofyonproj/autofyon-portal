'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type AnalyticsEventType =
  | 'page_view'
  | 'vehicle_view'
  | 'vehicle_click'
  | 'phone_click'
  | 'whatsapp_click';

function contactTarget(href: string, type: 'phone_click' | 'whatsapp_click'): string | null {
  let value: string;
  if (type === 'phone_click') {
    value = href.replace(/^tel:/i, '');
  } else {
    try {
      const url = new URL(href);
      value = url.searchParams.get('phone') ?? url.pathname.split('/').filter(Boolean).pop() ?? '';
    } catch {
      return null;
    }
  }
  const normalized = value.replace(/[^\d+]/g, '');
  return /^\+?\d{7,18}$/.test(normalized) ? normalized : null;
}

export default function AnalyticsTracker({
  businessId,
  unitId = null,
}: {
  businessId?: string | null;
  unitId?: string | null;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const send = (
      eventType: AnalyticsEventType,
      eventBusinessId: string | null | undefined = businessId,
      eventUnitId: string | null = unitId,
      target: string | null = null,
    ) => {
      if (!eventBusinessId) return;
      let sourceHost = '';
      if (document.referrer) {
        try {
          sourceHost = new URL(document.referrer).hostname.toLowerCase();
        } catch {
          sourceHost = '';
        }
      }

      void fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: eventBusinessId,
          eventType,
          unitId: eventUnitId,
          path: pathname,
          sourceHost,
          contactTarget: target,
        }),
        keepalive: true,
      }).then((response) => {
        if (!response.ok) console.warn(`Analytics event rejected (${response.status}).`);
      }).catch((error: unknown) => {
        console.error('Analytics event could not be sent.', error);
      });
    };

    if (businessId) send(unitId ? 'vehicle_view' : 'page_view');

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.href;
      const linkedUnitId = anchor.dataset.analyticsUnitId;
      const linkedBusinessId = anchor.dataset.analyticsBusinessId ?? businessId;
      if (linkedUnitId) {
        send('vehicle_click', linkedBusinessId, linkedUnitId);
        return;
      }

      if (!businessId) return;
      if (anchor.protocol === 'tel:') {
        send('phone_click', businessId, unitId, contactTarget(href, 'phone_click'));
        return;
      }

      if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(anchor.hostname.toLowerCase())) {
        send('whatsapp_click', businessId, unitId, contactTarget(href, 'whatsapp_click'));
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [businessId, pathname, unitId]);

  return null;
}
