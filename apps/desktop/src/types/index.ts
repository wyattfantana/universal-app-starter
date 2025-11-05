// Core types that match Rust backend
export interface Client {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  created_at?: string;
}

export interface EstimateItem {
  id?: number;
  estimate_id?: number;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  cost_price?: number;
  discount?: number;
  section?: string;
}

export interface Estimate {
  id?: number;
  number: string;
  client_id: number;
  date: string;
  validity_date?: string;
  deposit_amount?: number;
  subtotal: number;
  vat_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
  notes?: string;
  payment_terms?: string;
  terms_conditions?: string;
  created_at?: string;
  items?: EstimateItem[];
}

export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

export interface Invoice {
  id?: number;
  number: string;
  client_id: number;
  date: string;
  due_date: string;
  subtotal: number;
  vat_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue';
  payment_method?: string;
  paid_date?: string;
  notes?: string;
  created_at?: string;
  items?: InvoiceItem[];
}

export interface Product {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  supplier: string;
  unit_price: number;
  unit: string;
  vat_rate?: number;
  image_url?: string;
  supplier_url?: string;
  feed_source: 'manual' | 'affiliate' | 'api';
  last_updated: string;
}

export interface Revenue {
  id?: number;
  date: string;
  invoice_number: string;
  client_id: number;
  total: number;
  cost: number;
  profit: number;
  markup_percentage: number;
  payment_method: string;
}

export interface Settings {
  business_name: string;
  business_owner: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  business_website: string;
  vat_enabled: boolean;
  vat_rate: number;
  markup_percentage: number;
  currency: string;
  bank_details: string;
  paypal_email: string;
  logo_base64?: string;
  logo_path?: string;
  brand_color?: string;
  terms_conditions?: string;
  payment_instructions?: string;
  company_tax_id?: string;
  company_registration?: string;
}

// Utility types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
