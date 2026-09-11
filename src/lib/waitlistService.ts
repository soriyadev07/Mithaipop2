import { supabase, isSupabaseConfigured } from './supabase';
import { WaitlistEntry } from '../types';

export interface WaitlistSubmissionPayload {
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
}

export interface WaitlistSubmissionResult {
  success: boolean;
  isDuplicate: boolean;
  entry?: WaitlistEntry;
  error?: string;
}

/**
 * Submit waitlist signup to the persistent database.
 * Saves to both the persistent server endpoint (/api/waitlist) and
 * the connected Supabase project (table: waitlist_signups) if configured.
 */
export async function submitWaitlistSignup(
  payload: WaitlistSubmissionPayload
): Promise<WaitlistSubmissionResult> {
  const cleanPayload = {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    city: payload.city?.trim() || undefined,
    favoritePop: (payload.favoritePop || payload.preferredFlavor || 'All Flavours / Surprise Me').trim(),
    preferredFlavor: (payload.favoritePop || payload.preferredFlavor || 'All Flavours / Surprise Me').trim(),
    referralSource: payload.referralSource?.trim() || undefined,
    source: payload.source || (payload.utmSource ? 'Meta Ads' : 'Direct / Organic'),
    campaign: payload.campaign || payload.utmCampaign || 'Website Direct',
    utmSource: payload.utmSource?.trim() || undefined,
    utmMedium: payload.utmMedium?.trim() || undefined,
    utmCampaign: payload.utmCampaign?.trim() || undefined,
    utmContent: payload.utmContent?.trim() || undefined,
    utmTerm: payload.utmTerm?.trim() || undefined,
    fbclid: payload.fbclid?.trim() || undefined,
    consent: Boolean(payload.consent)
  };

  let primaryResult: WaitlistSubmissionResult | null = null;

  // 1. Submit to the persistent server database (/api/waitlist)
  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanPayload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        primaryResult = {
          success: true,
          isDuplicate: Boolean(data.isDuplicate),
          entry: data.entry
        };
      } else {
        primaryResult = {
          success: false,
          isDuplicate: false,
          error: data.error || 'Server rejected signup'
        };
      }
    } else {
      const errorText = await res.text();
      console.warn('API /api/waitlist returned status:', res.status, errorText);
    }
  } catch (err) {
    console.warn('Could not reach /api/waitlist:', err);
  }

  // 2. If Supabase is connected, insert/upsert into waitlist_signups table
  if (supabase && isSupabaseConfigured()) {
    try {
      const dbRow = {
        full_name: cleanPayload.fullName,
        email: cleanPayload.email,
        phone: cleanPayload.phone,
        city: cleanPayload.city || null,
        favorite_pop: cleanPayload.favoritePop || null,
        referral_source: cleanPayload.referralSource || null,
        utm_source: cleanPayload.utmSource || null,
        utm_medium: cleanPayload.utmMedium || null,
        utm_campaign: cleanPayload.utmCampaign || null,
        utm_content: cleanPayload.utmContent || null,
        utm_term: cleanPayload.utmTerm || null,
        fbclid: cleanPayload.fbclid || null,
        consent: cleanPayload.consent,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('waitlist_signups')
        .insert([dbRow])
        .select();

      if (error) {
        console.warn('Supabase waitlist_signups insert warning:', error.message);
      } else if (data && data[0] && !primaryResult?.success) {
        const saved = data[0];
        primaryResult = {
          success: true,
          isDuplicate: false,
          entry: {
            id: String(saved.id),
            fullName: saved.full_name,
            email: saved.email,
            phone: saved.phone,
            city: saved.city || undefined,
            favoritePop: saved.favorite_pop || undefined,
            preferredFlavor: saved.favorite_pop || undefined,
            referralSource: saved.referral_source || undefined,
            source: cleanPayload.source,
            campaign: cleanPayload.campaign,
            utmSource: saved.utm_source || undefined,
            utmMedium: saved.utm_medium || undefined,
            utmCampaign: saved.utm_campaign || undefined,
            utmContent: saved.utm_content || undefined,
            utmTerm: saved.utm_term || undefined,
            fbclid: saved.fbclid || undefined,
            consent: Boolean(saved.consent),
            dateJoined: saved.created_at || new Date().toISOString()
          }
        };
      }
    } catch (sbErr) {
      console.warn('Supabase waitlist call error:', sbErr);
    }
  }

  // If we got a positive result from either server database or Supabase, return it
  if (primaryResult) {
    return primaryResult;
  }

  // Fallback if network was unavailable
  throw new Error('Database insertion failed. Please check network connection.');
}

/**
 * Fetch all waitlist signups for authenticated admin dashboard.
 * Queries Supabase waitlist_signups table or /api/waitlist endpoint.
 */
export async function fetchAllWaitlistEntries(): Promise<WaitlistEntry[]> {
  // 1. Try Supabase if configured
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: String(row.id),
          fullName: row.full_name || '',
          email: row.email || '',
          phone: row.phone || '',
          city: row.city || undefined,
          favoritePop: row.favorite_pop || undefined,
          preferredFlavor: row.favorite_pop || undefined,
          referralSource: row.referral_source || undefined,
          source: row.utm_source ? 'Meta Ads' : (row.source || 'Direct / Organic'),
          campaign: row.utm_campaign || row.campaign || 'Website Direct',
          utmSource: row.utm_source || undefined,
          utmMedium: row.utm_medium || undefined,
          utmCampaign: row.utm_campaign || undefined,
          utmContent: row.utm_content || undefined,
          utmTerm: row.utm_term || undefined,
          fbclid: row.fbclid || undefined,
          consent: Boolean(row.consent),
          dateJoined: row.created_at || new Date().toISOString()
        }));
      }
    } catch (err) {
      console.warn('Failed fetching waitlist from Supabase, falling back to server API:', err);
    }
  }

  // 2. Fetch from persistent server API
  try {
    const res = await fetch('/api/waitlist', {
      headers: {
        'x-admin-request': 'true'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.entries)) {
        return data.entries;
      }
    }
  } catch (err) {
    console.warn('Could not fetch /api/waitlist:', err);
  }

  return [];
}

/**
 * Delete a waitlist entry (Admin action)
 */
export async function deleteWaitlistEntryRemote(id: string): Promise<boolean> {
  let success = false;

  // Supabase delete if configured
  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .delete()
        .eq('id', id);

      if (!error) success = true;
    } catch {}
  }

  // Server API delete
  try {
    const res = await fetch(`/api/waitlist/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-request': 'true'
      }
    });
    if (res.ok) success = true;
  } catch {}

  return success;
}
