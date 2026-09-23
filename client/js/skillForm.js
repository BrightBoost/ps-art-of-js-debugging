import { requireUser, setUpNavbar } from './nav.js';

requireUser();
setUpNavbar();

const addSkillForm = /** @type {HTMLFormElement} */ (document.getElementById('add-skill-form'));
const messageDiv = /** @type {HTMLElement} */ (document.getElementById('message'));
const submitButton = /** @type {HTMLButtonElement} */ (addSkillForm.querySelector('[type=submit]'));

addSkillForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(addSkillForm);
    const skill = {
        name: formData.get('name'),
        level: formData.get('level'),
        category: formData.get('category'),
    };

    // Prevent double submits while the request is on its way
    submitButton.disabled = true;
    try {
        const response = await fetch('/api/user/skills', {
            method: 'POST',
            body: JSON.stringify(skill),
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        window.location.href = `/skillList.html?new=${encodeURIComponent(String(skill.name))}`;
    } catch (error) {
        messageDiv.textContent = error instanceof Error ? error.message : String(error);
    } finally {
        submitButton.disabled = false;
    }
});
