export type AccountingDraftEntry = {
  sourceEntryId: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
};

export type AccountingDraftRecord = {
  sourceRecordId: string;
  type: 'sale' | 'purchase';
  state: 'finalized';
  occurredAt: string;
  currency: 'EGP';
  amount: number;
  description: string;
  details: {
    reference: string;
    vehicle: string;
    chassis: string;
    terms: string;
  };
  counterparty: {
    sourceId: string;
    name: string;
    phone: string;
  };
  journalEntries: AccountingDraftEntry[];
};

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function boundedText(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function validAmount(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 1_000_000_000_000;
}

export function parseAccountingDraftRecords(value: unknown):
  | { records: AccountingDraftRecord[] }
  | { error: string } {
  if (!Array.isArray(value) || value.length < 1 || value.length > 25) {
    return { error: 'Submit between 1 and 25 finalized accounting records.' };
  }

  const ids = new Set<string>();
  const records: AccountingDraftRecord[] = [];
  for (const rawRecord of value) {
    if (!rawRecord || typeof rawRecord !== 'object' || Array.isArray(rawRecord)) {
      return { error: 'Each accounting record must be an object.' };
    }
    const record = rawRecord as Record<string, unknown>;
    const counterparty = record.counterparty;
    if (!counterparty || typeof counterparty !== 'object' || Array.isArray(counterparty)) {
      return { error: 'Each accounting record needs a customer or supplier.' };
    }
    const party = counterparty as Record<string, unknown>;
    const rawDetails = record.details;
    const details = rawDetails && typeof rawDetails === 'object' && !Array.isArray(rawDetails)
      ? rawDetails as Record<string, unknown>
      : null;
    const sourceRecordId = typeof record.sourceRecordId === 'string' ? record.sourceRecordId.trim() : '';
    const type = record.type;
    const sourcePartyId = typeof party.sourceId === 'string' ? party.sourceId.trim() : '';
    const phone = typeof party.phone === 'string' ? party.phone.trim() : '';
    if (!/^[A-Za-z0-9._:-]{1,120}$/.test(sourceRecordId) ||
        ids.has(sourceRecordId) ||
        (type !== 'sale' && type !== 'purchase') ||
        record.state !== 'finalized' ||
        !isDate(record.occurredAt) ||
        record.currency !== 'EGP' ||
        !validAmount(record.amount) ||
        !boundedText(record.description, 500) ||
        !details ||
        typeof details.reference !== 'string' || details.reference.length > 120 ||
        typeof details.vehicle !== 'string' || details.vehicle.length > 250 ||
        typeof details.chassis !== 'string' || details.chassis.length > 120 ||
        typeof details.terms !== 'string' || details.terms.length > 500 ||
        !/^[A-Za-z0-9._:-]{1,120}$/.test(sourcePartyId) ||
        !boundedText(party.name, 120) ||
        phone.length > 30 ||
        !Array.isArray(record.journalEntries) ||
        record.journalEntries.length < 1 ||
        record.journalEntries.length > 100) {
      return { error: 'An accounting record contains invalid or incomplete fields.' };
    }
    ids.add(sourceRecordId);

    const entryIds = new Set<string>();
    const journalEntries: AccountingDraftEntry[] = [];
    for (const rawEntry of record.journalEntries) {
      if (!rawEntry || typeof rawEntry !== 'object' || Array.isArray(rawEntry)) {
        return { error: 'Each journal entry must be an object.' };
      }
      const entry = rawEntry as Record<string, unknown>;
      const sourceEntryId = typeof entry.sourceEntryId === 'string' ? entry.sourceEntryId.trim() : '';
      if (!/^[A-Za-z0-9._:-]{1,120}$/.test(sourceEntryId) ||
          entryIds.has(sourceEntryId) ||
          !isDate(entry.date) ||
          !boundedText(entry.description, 500) ||
          !boundedText(entry.debitAccount, 120) ||
          !boundedText(entry.creditAccount, 120) ||
          entry.debitAccount === entry.creditAccount ||
          !validAmount(entry.amount)) {
        return { error: 'A journal entry contains invalid or incomplete fields.' };
      }
      entryIds.add(sourceEntryId);
      journalEntries.push({
        sourceEntryId,
        date: entry.date,
        description: entry.description.trim(),
        debitAccount: entry.debitAccount.trim(),
        creditAccount: entry.creditAccount.trim(),
        amount: entry.amount,
      });
    }

    records.push({
      sourceRecordId,
      type,
      state: 'finalized',
      occurredAt: record.occurredAt,
      currency: 'EGP',
      amount: record.amount,
      description: record.description.trim(),
      details: {
        reference: details.reference.trim(),
        vehicle: details.vehicle.trim(),
        chassis: details.chassis.trim(),
        terms: details.terms.trim(),
      },
      counterparty: {
        sourceId: sourcePartyId,
        name: party.name.trim(),
        phone,
      },
      journalEntries,
    });
  }
  return { records };
}
