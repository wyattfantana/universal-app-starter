import { invoke } from '@tauri-apps/api/core';
import type { Client, Estimate, Invoice, Product, Revenue, Settings } from '@/types';

/**
 * Type-safe API wrapper for Tauri commands
 */
export const api = {
  clients: {
    getAll: () => invoke<Client[]>('get_all_clients'),
    getById: (id: number) => invoke<Client>('get_client', { id }),
    create: (client: Omit<Client, 'id'>) => invoke<number>('add_client', { client }),
    update: (id: number, client: Client) => invoke<void>('update_client', { id, client }),
    delete: (id: number) => invoke<void>('delete_client', { id }),
  },

  estimates: {
    getAll: () => invoke<Estimate[]>('get_all_estimates'),
    getById: (id: number) => invoke<Estimate>('get_estimate_with_items', { id }),
    create: (estimate: Omit<Estimate, 'id'>) => invoke<number>('create_estimate', { estimate }),
    update: (id: number, estimate: Estimate) => invoke<void>('update_estimate', { id, estimate }),
    delete: (id: number) => invoke<void>('delete_estimate', { id }),
  },

  invoices: {
    getAll: () => invoke<Invoice[]>('get_all_invoices'),
    getById: (id: number) => invoke<Invoice>('get_invoice_with_items', { id }),
    create: (invoice: Omit<Invoice, 'id'>) => invoke<number>('create_invoice', { invoice }),
    update: (id: number, invoice: Invoice) => invoke<void>('update_invoice', { id, invoice }),
    delete: (id: number) => invoke<void>('delete_invoice', { id }),
  },

  products: {
    getAll: () => invoke<Product[]>('get_all_products'),
    getById: (id: number) => invoke<Product>('get_product', { id }),
    create: (product: Omit<Product, 'id'>) => invoke<number>('add_product', { product }),
    update: (id: number, product: Product) => invoke<void>('update_product', { id, product }),
    delete: (id: number) => invoke<void>('delete_product', { id }),
    search: (query: string) => invoke<Product[]>('search_products', { query }),
  },

  revenue: {
    getAll: () => invoke<Revenue[]>('get_revenue_history'),
    getById: (id: number) => invoke<Revenue>('get_revenue', { id }),
    create: (revenue: Omit<Revenue, 'id'>) => invoke<number>('add_revenue', { revenue }),
  },

  settings: {
    get: () => invoke<Settings>('get_settings'),
    update: (settings: Settings) => invoke<void>('update_settings', { settings }),
  },
};
