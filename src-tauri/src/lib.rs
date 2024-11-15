use encoding_rs::GBK;
use std::path::PathBuf;
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
        let bytes = name.as_bytes();

        // 尝试 UTF-8 解码
        if let Ok(name_str) = std::str::from_utf8(bytes) {
            // name_str 已经是 UTF-8 编码
            return Some(name_str.to_owned());
        }

        // 如果 UTF-8 解码失败，尝试用 GBK 解码
        // GBK.decode() 会返回 UTF-8 编码的 Cow<str>
        let (cow, _encoding_used, had_errors) = GBK.decode(bytes);
        if !had_errors {
            // cow 已经是 UTF-8 编码
            return Some(cow.into_owned());
        }

        None
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
