use std::path::PathBuf;
#[cfg(unix)]
use std::{env, os::unix::ffi::OsStrExt};
use tauri::command;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
fn get_current_executable_name() -> Option<String> {
    fn decode_path_name(path: PathBuf) -> Option<String> {
        let name = path.file_name()?;
        #[cfg(windows)]
        {
            return Some(name.to_string_lossy().to_string());
        }
        #[cfg(not(windows))]
        {
            let bytes = name.as_bytes();
            return Some(std::str::from_utf8(bytes).unwrap().to_owned());

        }
    }
    match env::current_exe() {
        Ok(path) => decode_path_name(path),
        Err(_) => None,
    }
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_current_executable_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
