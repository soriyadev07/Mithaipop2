import fs from 'fs';
import path from 'path';

export interface WaitlistRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  favoritePop?: string;
  preferredFlavor?: string;
  referralSource?: string;
  source?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  consent: boolean;
  dateJoined: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'waitlist_signups.json');

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    }
  } catch (err) {
    console.error('Error ensuring waitlist data file:', err);
  }
}

export function readWaitlistRecords(): WaitlistRecord[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading waitlist records:', err);
  }
  return [];
}

export function writeWaitlistRecords(records: WaitlistRecord[]): void {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing waitlist records:', err);
  }
}

export function addOrUpdateWaitlistRecord(payload: {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  favoritePop?: string;
  preferredFlavor?: string;
  referralSource?: string;
  source?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  consent: boolean;
}): { entry: WaitlistRecord; isDuplicate: boolean } {
  const records = readWaitlistRecords();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const existingIndex = records.findIndex(
    (r) => r.email.trim().toLowerCase() === normalizedEmail
  );

  if (existingIndex >= 0) {
    // Update existing without duplicating
    const existing = records[existingIndex];
    const updated: WaitlistRecord = {
      ...existing,
      fullName: payload.fullName.trim() || existing.fullName,
      phone: payload.phone.trim() || existing.phone,
      city: payload.city?.trim() || existing.city,
      favoritePop: payload.favoritePop?.trim() || payload.preferredFlavor?.trim() || existing.favoritePop,
      preferredFlavor: payload.preferredFlavor?.trim() || payload.favoritePop?.trim() || existing.preferredFlavor,
      referralSource: payload.referralSource?.trim() || existing.referralSource,
      source: payload.source || (payload.utmSource ? 'Meta Ads' : existing.source),
      campaign: payload.campaign || payload.utmCampaign || existing.campaign,
      utmSource: payload.utmSource?.trim() || existing.utmSource,
      utmMedium: payload.utmMedium?.trim() || existing.utmMedium,
      utmCampaign: payload.utmCampaign?.trim() || existing.utmCampaign,
      utmContent: payload.utmContent?.trim() || existing.utmContent,
      utmTerm: payload.utmTerm?.trim() || existing.utmTerm,
      fbclid: payload.fbclid?.trim() || existing.fbclid,
      consent: Boolean(payload.consent)
    };
    records[existingIndex] = updated;
    writeWaitlistRecords(records);
    return { entry: updated, isDuplicate: true };
  }

  // Create new record
  const newEntry: WaitlistRecord = {
    id: `wl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fullName: payload.fullName.trim(),
    email: normalizedEmail,
    phone: payload.phone.trim(),
    city: payload.city?.trim() || undefined,
    favoritePop: payload.favoritePop?.trim() || payload.preferredFlavor?.trim() || undefined,
    preferredFlavor: payload.preferredFlavor?.trim() || payload.favoritePop?.trim() || undefined,
    referralSource: payload.referralSource?.trim() || undefined,
    source: payload.source || (payload.utmSource ? 'Meta Ads' : 'Direct / Organic'),
    campaign: payload.campaign || payload.utmCampaign || 'Website Direct',
    utmSource: payload.utmSource?.trim() || undefined,
    utmMedium: payload.utmMedium?.trim() || undefined,
    utmCampaign: payload.utmCampaign?.trim() || undefined,
    utmContent: payload.utmContent?.trim() || undefined,
    utmTerm: payload.utmTerm?.trim() || undefined,
    fbclid: payload.fbclid?.trim() || undefined,
    consent: Boolean(payload.consent),
    dateJoined: new Date().toISOString()
  };

  records.unshift(newEntry);
  writeWaitlistRecords(records);
  return { entry: newEntry, isDuplicate: false };
}

export function deleteWaitlistRecord(id: string): boolean {
  const records = readWaitlistRecords();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length !== records.length) {
    writeWaitlistRecords(filtered);
    return true;
  }
  return false;
}
