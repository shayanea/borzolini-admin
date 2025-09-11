export type ContactStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  status: ContactStatus;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  status?: ContactStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
  today?: number;
  thisWeek?: number;
  thisMonth?: number;
}

export interface UpdateContactData {
  status?: ContactStatus;
  adminNotes?: string;
}

export interface ContactResponseItem {
  id: string;
  contactId: string;
  message: string;
  sentBy: string;
  sentAt: string;
}

export interface CreateContactResponseData {
  message: string;
}

export interface UpdateContactResponseData {
  message: string;
}
