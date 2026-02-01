import { Lead, Activity, QueuedLead } from './types';

/**
 * Backend API URL injected by Vercel (Vite requirement)
 * Must be set as VITE_API_BASE_URL in Vercel
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

/**
 * Helper for GET requests to Google Apps Script
 */
async function gasGet<T>(params: string): Promise<T> {
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
  return gasGet<Lead[]>('action=getLeads');
}

/* ------------------------------------------------------------------ */
/* DASHBOARD */
/* ------------------------------------------------------------------ */

export async function getDashboardActivity(): Promise<Activity[]> {
  return gasGet<Activity[]>('action=getDashboardActivity');
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
  return gasPost({
    action: 'uploadLeads',
    repName,
    leads
  });
}
