// All calls to the backend go through here.
// In development Vite proxies /api to the Express server, so the base URL is empty.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * @param {string} path
 * @param {RequestInit & { json?: unknown }} [options]
 */
export async function api(path, options = {}) {
    const { json, headers, ...rest } = options;
    const response = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        ...rest,
        headers: json === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
        body: json === undefined ? rest.body : JSON.stringify(json),
    });

    if (response.status === 401 && !path.endsWith('/login')) {
        // The session is gone (for example after a server restart): log in again
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? response.statusText);
    }
    return data;
}
