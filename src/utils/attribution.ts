/**
 * Attribution & Meta Ads Tracking Engine for Mithai Pop
 * Captures and persists UTM and Meta Click Identifier (fbclid) parameters across the session.
 */

export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  source: string;
  campaign: string;
  landingPage?: string;
  referrer?: string;
}

const STORAGE_KEY = 'mithai_pop_meta_attribution';

export function normalizeSource(utmSource?: string, fbclid?: string): string {
  if (fbclid && !utmSource) {
    return 'Meta Ads';
  }
  if (!utmSource) {
    return 'Direct / Organic';
  }

  const s = utmSource.toLowerCase().trim();
  if (s.includes('facebook') || s.includes('fb') || s.includes('instagram') || s.includes('meta') || s.includes('ig')) {
    return 'Meta Ads';
  }
  if (s.includes('google')) {
    return 'Google';
  }
  if (s.includes('twitter') || s === 'x') {
    return 'Twitter / X';
  }
  if (s.includes('youtube')) {
    return 'YouTube';
  }
  if (s.includes('whatsapp')) {
    return 'WhatsApp';
  }
  if (s.includes('direct') || s.includes('organic')) {
    return 'Direct / Organic';
  }
  return utmSource;
}

export function normalizeCampaign(utmCampaign?: string): string {
  if (!utmCampaign || utmCampaign.trim() === '') {
    return 'Website Direct';
  }
  return utmCampaign.trim();
}

export function captureUrlAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      source: 'Direct / Organic',
      campaign: 'Website Direct',
    };
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || undefined;
    const utmMedium = urlParams.get('utm_medium') || undefined;
    const utmCampaign = urlParams.get('utm_campaign') || undefined;
    const utmContent = urlParams.get('utm_content') || undefined;
    const utmTerm = urlParams.get('utm_term') || undefined;
    const fbclid = urlParams.get('fbclid') || undefined;

    // Check existing stored attribution in session
    const existingRaw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    let existing: AttributionData | null = null;
    if (existingRaw) {
      try {
        existing = JSON.parse(existingRaw);
      } catch {
        // ignore
      }
    }

    // If new ad parameters are in the current URL, save them
    const hasIncomingAdParams = !!(utmSource || utmMedium || utmCampaign || utmContent || utmTerm || fbclid);

    if (hasIncomingAdParams || !existing) {
      const source = normalizeSource(utmSource || existing?.utmSource, fbclid || existing?.fbclid);
      const campaign = normalizeCampaign(utmCampaign || existing?.utmCampaign);

      const freshData: AttributionData = {
        utmSource: utmSource || existing?.utmSource,
        utmMedium: utmMedium || existing?.utmMedium,
        utmCampaign: utmCampaign || existing?.utmCampaign,
        utmContent: utmContent || existing?.utmContent,
        utmTerm: utmTerm || existing?.utmTerm,
        fbclid: fbclid || existing?.fbclid,
        source,
        campaign,
        landingPage: window.location.pathname + window.location.search,
        referrer: document.referrer || existing?.referrer,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      return freshData;
    }

    return existing;
  } catch (err) {
    console.warn('Failed to capture attribution:', err);
    return {
      source: 'Direct / Organic',
      campaign: 'Website Direct',
    };
  }
}

export function getStoredAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      source: 'Direct / Organic',
      campaign: 'Website Direct',
    };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // fallback
  }

  // Fallback to fresh capture
  return captureUrlAttribution();
}
