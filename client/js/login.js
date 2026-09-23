import { api } from './api.js';

const loginForm = /** @type {HTMLFormElement} */ (document.getElementById('login-form'));
const messageDiv = /** @type {HTMLElement} */ (document.getElementById('message'));

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);

    try {
        const data = await api('/api/user/login', {
            method: 'POST',
            json: {
                username: formData.get('username'),
                password: formData.get('password'),
            },
        });
        // Save the user to localStorage and go to the skills page
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = '/skillList.html';
    } catch (error) {
        messageDiv.textContent = error instanceof Error ? error.message : String(error);
    }
});
