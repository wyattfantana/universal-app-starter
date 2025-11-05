use rusqlite::{Connection, Result};
use std::sync::Mutex;

pub struct Database {
    pub conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;

        // Enable foreign keys
        conn.execute("PRAGMA foreign_keys = ON", [])?;

        Ok(Database {
            conn: Mutex::new(conn),
        })
    }

    pub fn initialize_schema(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        // Clients table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                company TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )",
            [],
        )?;

        // Estimates table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS estimates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                number TEXT NOT NULL UNIQUE,
                client_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                validity_date TEXT,
                deposit_amount REAL,
                subtotal REAL NOT NULL,
                vat_amount REAL NOT NULL,
                total REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'draft',
                notes TEXT,
                payment_terms TEXT,
                terms_conditions TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Estimate items table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS estimate_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                estimate_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT NOT NULL DEFAULT 'each',
                unit_price REAL NOT NULL,
                cost_price REAL,
                discount REAL DEFAULT 0,
                section TEXT,
                FOREIGN KEY (estimate_id) REFERENCES estimates (id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Invoices table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                number TEXT NOT NULL UNIQUE,
                client_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                due_date TEXT NOT NULL,
                subtotal REAL NOT NULL,
                vat_amount REAL NOT NULL,
                total REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                payment_method TEXT,
                paid_date TEXT,
                notes TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Invoice items table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS invoice_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_id INTEGER NOT NULL,
                description TEXT NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT NOT NULL DEFAULT 'each',
                unit_price REAL NOT NULL,
                FOREIGN KEY (invoice_id) REFERENCES invoices (id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Products table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sku TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT NOT NULL,
                supplier TEXT NOT NULL,
                unit_price REAL NOT NULL,
                unit TEXT NOT NULL DEFAULT 'each',
                vat_rate REAL,
                image_url TEXT,
                supplier_url TEXT,
                feed_source TEXT NOT NULL DEFAULT 'manual',
                last_updated TEXT NOT NULL DEFAULT (datetime('now'))
            )",
            [],
        )?;

        // Revenue table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS revenue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                invoice_number TEXT NOT NULL,
                client_id INTEGER NOT NULL,
                total REAL NOT NULL,
                cost REAL NOT NULL DEFAULT 0,
                profit REAL NOT NULL DEFAULT 0,
                markup_percentage REAL NOT NULL DEFAULT 0,
                payment_method TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES clients (id)
            )",
            [],
        )?;

        // Settings table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                business_name TEXT NOT NULL DEFAULT '',
                business_owner TEXT NOT NULL DEFAULT '',
                business_email TEXT NOT NULL DEFAULT '',
                business_phone TEXT NOT NULL DEFAULT '',
                business_address TEXT NOT NULL DEFAULT '',
                business_website TEXT NOT NULL DEFAULT '',
                vat_enabled INTEGER NOT NULL DEFAULT 0,
                vat_rate REAL NOT NULL DEFAULT 20.0,
                markup_percentage REAL NOT NULL DEFAULT 30.0,
                currency TEXT NOT NULL DEFAULT 'GBP',
                bank_details TEXT NOT NULL DEFAULT '',
                paypal_email TEXT NOT NULL DEFAULT '',
                logo_base64 TEXT,
                logo_path TEXT,
                brand_color TEXT DEFAULT '#2563eb',
                terms_conditions TEXT,
                payment_instructions TEXT,
                company_tax_id TEXT,
                company_registration TEXT
            )",
            [],
        )?;

        // Create indexes for performance
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)",
            [],
        )?;
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)",
            [],
        )?;
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier)",
            [],
        )?;

        Ok(())
    }
}
