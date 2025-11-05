use crate::db::Database;
use crate::models::{Client, Settings};
use tauri::State;

// ==================== CLIENT COMMANDS ====================

#[tauri::command]
pub fn get_all_clients(db: State<Database>) -> Result<Vec<Client>, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, name, email, phone, address, company, created_at FROM clients ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;

    let clients = stmt
        .query_map([], |row| {
            Ok(Client {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                email: row.get(2)?,
                phone: row.get(3)?,
                address: row.get(4)?,
                company: row.get(5)?,
                created_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(clients)
}

#[tauri::command]
pub fn get_client(id: i64, db: State<Database>) -> Result<Client, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let client = conn
        .query_row(
            "SELECT id, name, email, phone, address, company, created_at FROM clients WHERE id = ?1",
            [id],
            |row| {
                Ok(Client {
                    id: Some(row.get(0)?),
                    name: row.get(1)?,
                    email: row.get(2)?,
                    phone: row.get(3)?,
                    address: row.get(4)?,
                    company: row.get(5)?,
                    created_at: row.get(6)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(client)
}

#[tauri::command]
pub fn add_client(client: Client, db: State<Database>) -> Result<i64, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO clients (name, email, phone, address, company) VALUES (?1, ?2, ?3, ?4, ?5)",
        (
            &client.name,
            &client.email,
            &client.phone,
            &client.address,
            &client.company,
        ),
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn update_client(id: i64, client: Client, db: State<Database>) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE clients SET name = ?1, email = ?2, phone = ?3, address = ?4, company = ?5 WHERE id = ?6",
        (
            &client.name,
            &client.email,
            &client.phone,
            &client.address,
            &client.company,
            id,
        ),
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_client(id: i64, db: State<Database>) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM clients WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

// ==================== SETTINGS COMMANDS ====================

#[tauri::command]
pub fn get_settings(db: State<Database>) -> Result<Settings, String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    let settings = conn
        .query_row(
            "SELECT business_name, business_owner, business_email, business_phone, business_address,
                    business_website, vat_enabled, vat_rate, markup_percentage, currency,
                    bank_details, paypal_email, logo_base64, logo_path, brand_color,
                    terms_conditions, payment_instructions, company_tax_id, company_registration
             FROM settings WHERE id = 1",
            [],
            |row| {
                Ok(Settings {
                    business_name: row.get(0)?,
                    business_owner: row.get(1)?,
                    business_email: row.get(2)?,
                    business_phone: row.get(3)?,
                    business_address: row.get(4)?,
                    business_website: row.get(5)?,
                    vat_enabled: row.get::<_, i32>(6)? != 0,
                    vat_rate: row.get(7)?,
                    markup_percentage: row.get(8)?,
                    currency: row.get(9)?,
                    bank_details: row.get(10)?,
                    paypal_email: row.get(11)?,
                    logo_base64: row.get(12)?,
                    logo_path: row.get(13)?,
                    brand_color: row.get(14)?,
                    terms_conditions: row.get(15)?,
                    payment_instructions: row.get(16)?,
                    company_tax_id: row.get(17)?,
                    company_registration: row.get(18)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(settings)
}

#[tauri::command]
pub fn update_settings(settings: Settings, db: State<Database>) -> Result<(), String> {
    let conn = db.conn.lock().map_err(|e| e.to_string())?;

    use rusqlite::named_params;

    conn.execute(
        "UPDATE settings SET
            business_name = :business_name,
            business_owner = :business_owner,
            business_email = :business_email,
            business_phone = :business_phone,
            business_address = :business_address,
            business_website = :business_website,
            vat_enabled = :vat_enabled,
            vat_rate = :vat_rate,
            markup_percentage = :markup_percentage,
            currency = :currency,
            bank_details = :bank_details,
            paypal_email = :paypal_email,
            logo_base64 = :logo_base64,
            logo_path = :logo_path,
            brand_color = :brand_color,
            terms_conditions = :terms_conditions,
            payment_instructions = :payment_instructions,
            company_tax_id = :company_tax_id,
            company_registration = :company_registration
         WHERE id = 1",
        named_params! {
            ":business_name": &settings.business_name,
            ":business_owner": &settings.business_owner,
            ":business_email": &settings.business_email,
            ":business_phone": &settings.business_phone,
            ":business_address": &settings.business_address,
            ":business_website": &settings.business_website,
            ":vat_enabled": if settings.vat_enabled { 1 } else { 0 },
            ":vat_rate": &settings.vat_rate,
            ":markup_percentage": &settings.markup_percentage,
            ":currency": &settings.currency,
            ":bank_details": &settings.bank_details,
            ":paypal_email": &settings.paypal_email,
            ":logo_base64": &settings.logo_base64,
            ":logo_path": &settings.logo_path,
            ":brand_color": &settings.brand_color,
            ":terms_conditions": &settings.terms_conditions,
            ":payment_instructions": &settings.payment_instructions,
            ":company_tax_id": &settings.company_tax_id,
            ":company_registration": &settings.company_registration,
        },
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
