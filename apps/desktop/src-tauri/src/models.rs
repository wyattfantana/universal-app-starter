use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Client {
    pub id: Option<i64>,
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub company: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EstimateItem {
    pub id: Option<i64>,
    pub estimate_id: Option<i64>,
    pub description: String,
    pub quantity: f64,
    pub unit: String,
    pub unit_price: f64,
    pub cost_price: Option<f64>,
    pub discount: Option<f64>,
    pub section: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Estimate {
    pub id: Option<i64>,
    pub number: String,
    pub client_id: i64,
    pub date: String,
    pub validity_date: Option<String>,
    pub deposit_amount: Option<f64>,
    pub subtotal: f64,
    pub vat_amount: f64,
    pub total: f64,
    pub status: String,
    pub notes: Option<String>,
    pub payment_terms: Option<String>,
    pub terms_conditions: Option<String>,
    pub created_at: Option<String>,
    pub items: Option<Vec<EstimateItem>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvoiceItem {
    pub id: Option<i64>,
    pub invoice_id: Option<i64>,
    pub description: String,
    pub quantity: f64,
    pub unit: String,
    pub unit_price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Invoice {
    pub id: Option<i64>,
    pub number: String,
    pub client_id: i64,
    pub date: String,
    pub due_date: String,
    pub subtotal: f64,
    pub vat_amount: f64,
    pub total: f64,
    pub status: String,
    pub payment_method: Option<String>,
    pub paid_date: Option<String>,
    pub notes: Option<String>,
    pub created_at: Option<String>,
    pub items: Option<Vec<InvoiceItem>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    pub id: Option<i64>,
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub category: String,
    pub supplier: String,
    pub unit_price: f64,
    pub unit: String,
    pub vat_rate: Option<f64>,
    pub image_url: Option<String>,
    pub supplier_url: Option<String>,
    pub feed_source: String,
    pub last_updated: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Revenue {
    pub id: Option<i64>,
    pub date: String,
    pub invoice_number: String,
    pub client_id: i64,
    pub total: f64,
    pub cost: f64,
    pub profit: f64,
    pub markup_percentage: f64,
    pub payment_method: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub business_name: String,
    pub business_owner: String,
    pub business_email: String,
    pub business_phone: String,
    pub business_address: String,
    pub business_website: String,
    pub vat_enabled: bool,
    pub vat_rate: f64,
    pub markup_percentage: f64,
    pub currency: String,
    pub bank_details: String,
    pub paypal_email: String,
    pub logo_base64: Option<String>,
    pub logo_path: Option<String>,
    pub brand_color: Option<String>,
    pub terms_conditions: Option<String>,
    pub payment_instructions: Option<String>,
    pub company_tax_id: Option<String>,
    pub company_registration: Option<String>,
}
