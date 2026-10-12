mod db;

use db::Db;
use std::collections::HashMap;
use tauri::Manager;

/// 一次性读出全部 KV。
/// 前端启动时用它刷新 localStorage 缓存，一次 IPC 搞定，避免逐条读
#[tauri::command]
fn kv_get_all(db: tauri::State<'_, Db>) -> Result<HashMap<String, String>, String> {
    db.read_all()
}

#[tauri::command]
fn kv_set(db: tauri::State<'_, Db>, key: String, value: String) -> Result<(), String> {
    db.set(&key, &value)
}

#[tauri::command]
fn kv_delete(db: tauri::State<'_, Db>, key: String) -> Result<(), String> {
    db.delete(&key)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 数据库放在应用数据目录，而不是可执行文件旁边：安装目录通常只读
            let dir = app.path().app_data_dir()?;
            let db = Db::open(&dir.join("app.db")).expect("初始化 SQLite 失败");
            app.manage(db);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![kv_get_all, kv_set, kv_delete, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
