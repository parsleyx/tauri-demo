/// <reference types="vite/client" />
// 扩展 import.meta.env
interface ImportMetaEnv {
    VITE_API_BASE_URL: string;
    VITE_GAME_ID: string;
}