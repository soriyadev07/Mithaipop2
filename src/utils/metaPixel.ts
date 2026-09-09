/**
 * ============================================================================
 * META PIXEL TRACKING & EVENT ENGINE FOR MITHAI POP (mithaipop.in)
 * ============================================================================
 * Configures and dispatches official Meta Pixel events for the storefront.
 * 
 * Events supported:
 * 1. PageView: Tracked globally across the site and on SPA navigation transitions.
 * 2. ViewContent: Fired whenever a customer opens/views a specific product.
 * 3. Lead: Fired ONLY on successful submission of the "Join Waitlist" form,
 *    attaching the associated product name if applicable.
 *
 * NOTE: Purchase, AddToCart, and InitiateCheckout are intentionally omitted
 * during the current pre-launch waitlist campaign.
 */

/**
 * ============================================================================
 * 1. META PIXEL CONFIGURATION CONSTANT
 * ============================================================================
 * Change this constant if you ever need to change or update your Meta Pixel ID.
 */
export const META_PIXEL_ID = '1391287436526762';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    __metaPixelInitializedId?: string;
  }
}

/**
 * Initializes the Meta Pixel base loader in the browser environment.
 * Guards against duplicate script injections or duplicate initializations.
 */
export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;

  // If fbq is not yet loaded on window, define the stub queue and inject script
  if (!window.fbq) {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  // Initialize with META_PIXEL_ID if not already initialized with this exact ID
  if (window.__metaPixelInitializedId !== META_PIXEL_ID) {
    if (typeof window.fbq === 'function') {
      window.fbq('init', META_PIXEL_ID);
      window.__metaPixelInitializedId = META_PIXEL_ID;
    }
  }
}

export interface MetaPageViewParams {
  page_title?: string;
  page_path?: string;
  [key: string]: any;
}

/**
 * Tracks a PageView event in Meta Pixel.
 * Safe to call on SPA view changes or route changes.
 */
export function trackMetaPageView(params?: MetaPageViewParams): void {
  if (typeof window === 'undefined') return;
  initMetaPixel();

  try {
    if (typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', 'PageView', params);
      } else {
        window.fbq('track', 'PageView');
      }
    }
  } catch (err) {
    console.warn('[Meta Pixel] Failed to track PageView:', err);
  }
}

export interface MetaViewContentParams {
  content_name: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

/**
 * Track ViewContent whenever a user opens/views a specific product.
 */
export function trackMetaViewContent(params: MetaViewContentParams): void {
  if (typeof window === 'undefined') return;
  initMetaPixel();

  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: params.content_name,
        content_category: params.content_category || 'Fusion Indian Desserts',
        content_ids: params.content_ids || [],
        content_type: params.content_type || 'product',
        value: typeof params.value === 'number' ? params.value : undefined,
        currency: params.currency || 'INR',
      });
    }
  } catch (err) {
    console.warn('[Meta Pixel] Failed to track ViewContent:', err);
  }
}

export interface MetaLeadParams {
  content_name?: string;
  product_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

/**
 * Track a Lead event ONLY when a user successfully submits the "Join Waitlist" form.
 * If the waitlist form is associated with a specific product, attaches the product name.
 */
export function trackMetaLead(params?: MetaLeadParams): void {
  if (typeof window === 'undefined') return;
  initMetaPixel();

  try {
    if (typeof window.fbq === 'function') {
      const payload: Record<string, any> = {
        content_category: params?.content_category || 'Waitlist',
        currency: params?.currency || 'INR',
        value: typeof params?.value === 'number' ? params?.value : 0,
      };

      if (params?.content_name) {
        payload.content_name = params.content_name;
      }
      if (params?.product_name) {
        payload.product_name = params.product_name;
        if (!payload.content_name) {
          payload.content_name = params.product_name;
        }
      }

      window.fbq('track', 'Lead', payload);
    }
  } catch (err) {
    console.warn('[Meta Pixel] Failed to track Lead:', err);
  }
}
