export enum LeadStatus {
  LIVE = 'Live',
  REVISIT = 'Revisit',
  BOOKED = 'Booked',
  SOLD = 'Sold',
  DQ = 'DQ'
}

export type RenterOwner = 'Renter' | 'Owner';
export type EmploymentType = 'Full-Time' | 'Part-Time';

export interface Lead {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: LeadStatus;
  renterOwner: RenterOwner;
  superannuation: string;
  employmentType: EmploymentType;
  generatedBy: string;
  lastContactedBy: string;
  lastContactDate: string;
  notes: string[];
  callLogged?: boolean;
  suburb?: string;
}

export interface Activity {
  id: string;
  repName: string;
  leadName: string;
  action: string;
  timestamp: string;
}

export interface QueuedLead {
  date: string;
  name: string;
  houseNumber: string;
  streetName: string;
  suburb: string;
  postcode: string;
  phone: string;
  renterOwner: RenterOwner;
  superannuation: string;
  employmentType: EmploymentType;
  repName: string;
}

export type ViewType = 'dashboard' | 'leads' | 'upload';
