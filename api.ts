import { Lead, Activity, QueuedLead } from './types';

/**
 * IMPORTANT:
 * Replace with your deployed Google Apps Script Web App URL
 * Example:
 * https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXX/exec
 */
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbyXZpdHV4GLE26v4_AYU1vBqB8rNm_OYAouUoo7C3lgpQ2AX8e1Q_eQQoizh4UGgIFr/exec';

// Detect placeholder mode for local/dev UI testing
const isPlaceholder = API_BASE_URL.includes('YOUR_SCRIPT_ID');

/**
 * Helper for GET requests to Google Apps Script
 * GAS works best with query params and no custom headers
 */
async function gasGet<T>(params: string): Promise<T> {
  if (isPlaceholder) {
    throw new Error('Placeholder API URL in use');
  }

  const url = `${API_BASE_URL}?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`GAS GET failed (${res.status})`);
  }

  return res.json();
}

/**
 * Helper for POST requests to Google Apps Script
 * Uses text/plain to avoid CORS preflight issues
 */
async function gasPost(body: object): Promise<boolean> {
  if (isPlaceholder) {
    return true;
  }

  try {
    await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(body)
    });
    return true;
  } catch (err) {
    console.error('GAS POST failed:', err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* LEADS */
/* ------------------------------------------------------------------ */

export async function getLeads(): Promise<Lead[]> {
  try {
    return await gasGet<Lead[]>('action=getLeads');
  } catch (err) {
    console.warn('getLeads failed, using mock data');

    return [
      {
        id: '1',
        name: 'John Doe',
        address: '123 Fake St, Sydney NSW 2000',
        phone: '0412 345 678',
        status: 'Live',
        renterOwner: 'Owner',
        superannuation: '$150k+',
        employmentType: 'Full-Time',
        generatedBy: 'Marketing',
        lastContactedBy: 'Sam Rep',
        lastContactDate: '2024-05-01 14:30',
        notes: [
          'Initial call completed.',
          'Interested in solar savings.'
        ],
        callLogged: true
      },
      {
        id: '2',
        name: 'Jane Smith',
        address: '45 Blue Ave, Melbourne VIC 3000',
        phone: '0499 888 777',
        status: 'Revisit',
        renterOwner: 'Renter',
        superannuation: '$75–150k',
        employmentType: 'Part-Time',
        generatedBy: 'Inbound',
        lastContactedBy: 'Alex Agent',
        lastContactDate: '2024-04-30 10:15',
        notes: ['Busy during the day, call after 5pm.'],
        callLogged: false
      }
    ];
  }
}

/* ------------------------------------------------------------------ */
/* DASHBOARD */
/* ------------------------------------------------------------------ */

export async function getDashboardActivity(): Promise<Activity[]> {
  try {
    return await gasGet<Activity[]>('action=getDashboardActivity');
  } catch (err) {
    console.warn('getDashboardActivity failed, using mock data');

    return [
      {
        id: '1',
        repName: 'Sam Rep',
        leadName: 'John Doe',
        action: 'Call Logged',
        timestamp: '2 mins ago'
      },
      {
        id: '2',
        repName: 'Alex Agent',
        leadName: 'Jane Smith',
        action: 'Status Updated',
        timestamp: '1 hour ago'
      }
    ];
  }
}

/* ------------------------------------------------------------------ */
/* UPDATE LEAD */
/* ------------------------------------------------------------------ */

export async function updateLead(
  leadId: string,
  callResult: string,
  noteText: string,
  repName: string
): Promise<boolean> {
  if (isPlaceholder) {
    console.log('Mock updateLead:', {
      leadId,
      callResult,
      noteText,
      repName
    });
    return true;
  }

  return gasPost({
    action: 'updateLead',
    leadId,
    callResult,
    noteText,
    repName
  });
}

/* ------------------------------------------------------------------ */
/* BULK UPLOAD LEADS */
/* ------------------------------------------------------------------ */

export async function uploadLeads(
  leads: QueuedLead[],
  repName: string
): Promise<boolean> {
  if (isPlaceholder) {
    console.log('Mock uploadLeads:', leads);
    return true;
  }

  return gasPost({
    action: 'uploadLeads',
    repName,
    leads
  });
}
