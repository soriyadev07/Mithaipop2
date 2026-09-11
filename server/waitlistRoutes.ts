import { IncomingMessage, ServerResponse } from 'http';
import { readWaitlistRecords, addOrUpdateWaitlistRecord, deleteWaitlistRecord } from './waitlistDb';

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    // If body was already parsed by a previous middleware
    if ((req as any).body && typeof (req as any).body === 'object') {
      return resolve((req as any).body);
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

/**
 * Universally compatible waitlist HTTP handler (works in Connect, Vite, Express, and raw Node.js)
 */
export async function handleWaitlistRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<void> {
  const url = req.url || '';
  const method = req.method?.toUpperCase() || 'GET';

  // Only handle /api/waitlist routes
  if (!url.startsWith('/api/waitlist') && !url.startsWith('/')) {
    if (next) return next();
    return;
  }

  // Normalize path relative to /api/waitlist
  let subPath = url;
  if (subPath.startsWith('/api/waitlist')) {
    subPath = subPath.replace('/api/waitlist', '');
  }
  const cleanPath = subPath.split('?')[0];

  // 1. GET /api/waitlist/count
  if (method === 'GET' && (cleanPath === '/count' || cleanPath === '/count/')) {
    const records = readWaitlistRecords();
    sendJson(res, 200, { count: records.length });
    return;
  }

  // 2. GET /api/waitlist - Admin only
  if (method === 'GET' && (cleanPath === '' || cleanPath === '/')) {
    const adminHeader = req.headers['x-admin-request'];
    const authHeader = req.headers['authorization'];
    const isAdmin = adminHeader === 'true' || Boolean(authHeader);

    if (!isAdmin) {
      sendJson(res, 403, {
        error: 'Waitlist records are private. Authenticated admin access required.'
      });
      return;
    }

    const records = readWaitlistRecords();
    sendJson(res, 200, {
      success: true,
      count: records.length,
      entries: records
    });
    return;
  }

  // 3. POST /api/waitlist - Public signup submission
  if (method === 'POST' && (cleanPath === '' || cleanPath === '/')) {
    try {
      const body = await parseJsonBody(req);
      const {
        fullName,
        email,
        phone,
        city,
        favoritePop,
        preferredFlavor,
        referralSource,
        source,
        campaign,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        fbclid,
        consent
      } = body || {};

      if (!fullName || !fullName.trim()) {
        sendJson(res, 400, { success: false, error: 'Please enter your name.' });
        return;
      }

      if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        sendJson(res, 400, { success: false, error: 'Please enter a valid email address.' });
        return;
      }

      if (!phone || !phone.trim() || phone.trim().length < 7) {
        sendJson(res, 400, { success: false, error: 'Please enter a valid mobile number.' });
        return;
      }

      const result = addOrUpdateWaitlistRecord({
        fullName,
        email,
        phone,
        city,
        favoritePop,
        preferredFlavor,
        referralSource,
        source,
        campaign,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        fbclid,
        consent: consent !== undefined ? Boolean(consent) : true
      });

      sendJson(res, 200, {
        success: true,
        isDuplicate: result.isDuplicate,
        entry: result.entry
      });
      return;
    } catch (err: any) {
      console.error('Error handling POST /api/waitlist:', err);
      sendJson(res, 500, {
        success: false,
        error: "We couldn't save your signup right now. Please try again."
      });
      return;
    }
  }

  // 4. DELETE /api/waitlist/:id - Admin only
  if (method === 'DELETE') {
    const adminHeader = req.headers['x-admin-request'];
    const authHeader = req.headers['authorization'];
    const isAdmin = adminHeader === 'true' || Boolean(authHeader);

    if (!isAdmin) {
      sendJson(res, 403, { error: 'Unauthorized. Admin credentials required.' });
      return;
    }

    const segments = cleanPath.split('/').filter(Boolean);
    const id = segments[0];
    if (id) {
      const deleted = deleteWaitlistRecord(id);
      sendJson(res, 200, { success: deleted });
      return;
    }
  }

  if (next) {
    next();
  } else {
    sendJson(res, 404, { error: 'Not found' });
  }
}
