import { api } from './api.js';

/** @returns {{ id: number, username: string, isAdmin: boolean } | null} */
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') ?? 'null');
}

/** Redirect to the login page if nobody is logged in. */
export function requireUser() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/index.html';
        throw new Error('Not logged in');
    }
    return user;
}

export function setUpNavbar() {
    const user = getCurrentUser();
    const navbar = /** @type {HTMLElement} */ (document.getElementById('navbar'));

    if (user?.isAdmin) {
        const adminLink = document.createElement('a');
        adminLink.href = '/admin.html';
        adminLink.textContent = 'Admin';
        navbar.insertBefore(adminLink, document.getElementById('logout'));
    }

    document.getElementById('logout')?.addEventListener('click', async () => {
        await api('/api/user/logout', { method: 'POST' });
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    });
}
