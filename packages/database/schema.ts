// Database table helpers and query builders
import { query, queryOne } from './index';
import type {
  Client,
  Estimate,
  EstimateItem,
  Invoice,
  InvoiceItem,
  Product,
  Revenue,
  Settings,
} from '@repo/types';

// ============ Client Queries ============

export async function getAllClients(): Promise<Client[]> {
  return query<Client>('SELECT * FROM clients ORDER BY created_at DESC');
}

export async function getClientById(id: number): Promise<Client | null> {
  return queryOne<Client>('SELECT * FROM clients WHERE id = $1', [id]);
}

export async function createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
  const result = await queryOne<Client>(
    `INSERT INTO clients (name, email, phone, address, company)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [client.name, client.email, client.phone, client.address, client.company]
  );
  if (!result) throw new Error('Failed to create client');
  return result;
}

export async function updateClient(id: number, client: Partial<Client>): Promise<Client> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(client).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    const existing = await getClientById(id);
    if (!existing) throw new Error('Client not found');
    return existing;
  }

  values.push(id);
  const result = await queryOne<Client>(
    `UPDATE clients SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  if (!result) throw new Error('Client not found');
  return result;
}

export async function deleteClient(id: number): Promise<void> {
  await query('DELETE FROM clients WHERE id = $1', [id]);
}

// ============ Estimate Queries ============

export async function getAllEstimates(): Promise<Estimate[]> {
  return query<Estimate>(`
    SELECT e.*, json_agg(ei.*) as items
    FROM estimates e
    LEFT JOIN estimate_items ei ON e.id = ei.estimate_id
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `);
}

export async function getEstimateById(id: number): Promise<Estimate | null> {
  return queryOne<Estimate>(`
    SELECT e.*,
           json_agg(ei.*) as items,
           row_to_json(c.*) as client
    FROM estimates e
    LEFT JOIN estimate_items ei ON e.id = ei.estimate_id
    LEFT JOIN clients c ON e.client_id = c.id
    WHERE e.id = $1
    GROUP BY e.id, c.id
  `, [id]);
}

// ============ Invoice Queries ============

export async function getAllInvoices(): Promise<Invoice[]> {
  return query<Invoice>(`
    SELECT i.*, json_agg(ii.*) as items
    FROM invoices i
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `);
}

export async function getInvoiceById(id: number): Promise<Invoice | null> {
  return queryOne<Invoice>(`
    SELECT i.*,
           json_agg(ii.*) as items,
           row_to_json(c.*) as client
    FROM invoices i
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
    LEFT JOIN clients c ON i.client_id = c.id
    WHERE i.id = $1
    GROUP BY i.id, c.id
  `, [id]);
}

// ============ Product Queries ============

export async function getAllProducts(): Promise<Product[]> {
  return query<Product>('SELECT * FROM products ORDER BY last_updated DESC');
}

export async function getProductById(id: number): Promise<Product | null> {
  return queryOne<Product>('SELECT * FROM products WHERE id = $1', [id]);
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  return query<Product>(
    `SELECT * FROM products
     WHERE to_tsvector('english', name || ' ' || COALESCE(description, ''))
           @@ plainto_tsquery('english', $1)
     ORDER BY last_updated DESC
     LIMIT 50`,
    [searchTerm]
  );
}

// ============ Settings Queries ============

export async function getSettings(): Promise<Settings | null> {
  return queryOne<Settings>('SELECT * FROM settings WHERE id = 1');
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(settings).forEach(([key, value]) => {
    if (value !== undefined && key !== 'id') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    const existing = await getSettings();
    if (!existing) throw new Error('Settings not found');
    return existing;
  }

  const result = await queryOne<Settings>(
    `UPDATE settings SET ${fields.join(', ')} WHERE id = 1 RETURNING *`,
    values
  );
  if (!result) throw new Error('Settings not found');
  return result;
}

// ============ Revenue/Analytics Queries ============

export async function getRevenueByMonth(year: number): Promise<Revenue[]> {
  return query<Revenue>(
    `SELECT
       TO_CHAR(date, 'YYYY-MM') as month,
       SUM(total) as total,
       SUM(cost) as cost,
       SUM(profit) as profit,
       AVG(markup_percentage) as avg_markup
     FROM revenue
     WHERE EXTRACT(YEAR FROM date) = $1
     GROUP BY TO_CHAR(date, 'YYYY-MM')
     ORDER BY month DESC`,
    [year]
  );
}

export async function getDashboardStats() {
  return queryOne(`
    SELECT
      (SELECT COUNT(*) FROM clients) as total_clients,
      (SELECT COUNT(*) FROM estimates WHERE status = 'sent') as pending_estimates,
      (SELECT COUNT(*) FROM invoices WHERE status = 'pending') as pending_invoices,
      (SELECT COUNT(*) FROM invoices WHERE status = 'overdue') as overdue_invoices,
      (SELECT COALESCE(SUM(total), 0) FROM invoices WHERE status = 'paid') as total_revenue,
      (SELECT COALESCE(SUM(profit), 0) FROM revenue) as total_profit
  `);
}
