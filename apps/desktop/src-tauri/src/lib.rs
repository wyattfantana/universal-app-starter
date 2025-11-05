mod db;
mod models;
mod commands;

use db::Database;
use std::fs;
use tauri::Manager;

fn initialize_default_settings(db: &Database) {
    let conn = db.conn.lock().unwrap();

    // Check if settings row exists
    let count: i32 = conn
        .query_row("SELECT COUNT(*) FROM settings WHERE id = 1", [], |row| {
            row.get(0)
        })
        .unwrap_or(0);

    // Insert default settings if not exists
    if count == 0 {
        conn.execute(
            "INSERT INTO settings (id, business_name, business_owner, business_email, business_phone,
                                  business_address, business_website, vat_enabled, vat_rate,
                                  markup_percentage, currency, bank_details, paypal_email)
             VALUES (1, '', '', '', '', '', '', 0, 20.0, 30.0, 'GBP', '', '')",
            [],
        )
        .expect("Failed to insert default settings");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Get app data directory
            let app_data_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            let db_dir = app_data_dir.join("quotemaster");
            fs::create_dir_all(&db_dir).expect("Failed to create app data directory");
            let db_path = db_dir.join("quotemaster.db");

            // Initialize database
            let db = Database::new(db_path.to_str().unwrap()).expect("Failed to initialize database");
            db.initialize_schema().expect("Failed to create database schema");

            // Insert default settings
            initialize_default_settings(&db);

            // Manage database state
            app.manage(db);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_all_clients,
            commands::get_client,
            commands::add_client,
            commands::update_client,
            commands::delete_client,
            commands::get_settings,
            commands::update_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
