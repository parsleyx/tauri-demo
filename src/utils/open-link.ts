import { open } from "@tauri-apps/plugin-shell";
export const openLink = async (url: string) => {
    open(url);
}