export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFAQDto {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_active?: boolean;
}

export interface UpdateFAQDto {
  question?: string;
  answer?: string;
  category?: string;
  order?: number;
  is_active?: boolean;
}

export interface FAQQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  is_active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FAQResponse {
  data: FAQ[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
