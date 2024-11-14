import { v4 as uuidv4 } from 'uuid';
import ky from 'ky';
import { fetch } from '@tauri-apps/plugin-http';
export const req = ky.create({
    prefixUrl: import.meta.env.VITE_API_BASE_URL,
	hooks: {
		beforeRequest: [
			request => {
                let uuid = localStorage.getItem('uuid');
                if (!uuid) {
                    uuid = uuidv4();
                    localStorage.setItem('uuid', uuid);
                }
                request.headers.set('uuid', uuid);
			}
		], 
	},
    fetch
});