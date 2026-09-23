import { api } from './api.js';
import { requireUser, setUpNavbar } from './nav.js';

/** @typedef {{ id: number, username: string, isAdmin: boolean, skills: { name: string, level: number, category: string }[] }} User */

requireUser();
setUpNavbar();

const usersList = /** @type {HTMLElement} */ (document.getElementById('users-list'));
const skillFilterInput = /** @type {HTMLInputElement} */ (document.getElementById('skill-filter'));
const newUserForm = /** @type {HTMLFormElement} */ (document.getElementById('user-form'));
const topSkillsList = /** @type {HTMLElement} */ (document.getElementById('top-skills'));
const surveyButton = /** @type {HTMLButtonElement} */ (document.getElementById('load-survey'));
const surveyTable = /** @type {HTMLElement} */ (document.getElementById('survey-results'));

/** @type {User[]} */
let users = [];

loadUsers();
loadTopSkills();

async function loadUsers() {
    const data = await api('/api/admin/users');
    users = data.users;
    renderUsers();
}

function renderUsers() {
    const skillFilter = skillFilterInput.value.trim().toLowerCase();
    const visibleUsers = users.filter((user) =>
        user.skills.some((skill) => skill.name.toLowerCase().includes(skillFilter)),
    );

    usersList.innerHTML = '';
    for (const user of visibleUsers) {
        const item = document.createElement('li');
        item.textContent = `${user.username} (${user.skills.map((skill) => skill.name).join(', ')})`;
        usersList.appendChild(item);
    }
}

skillFilterInput.addEventListener('input', renderUsers);

newUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(newUserForm);
    await api('/api/admin/users', {
        method: 'POST',
        json: { username: formData.get('username'), password: formData.get('password') },
    });
    newUserForm.reset();
    await loadUsers();
});

async function loadTopSkills() {
    const data = await api('/api/admin/top-skills');
    topSkillsList.innerHTML = '';
    for (const skill of data.topSkills) {
        const item = document.createElement('li');
        item.textContent = `${skill.name}: ${skill.people} people`;
        topSkillsList.appendChild(item);
    }
}

surveyButton.addEventListener('click', async () => {
    const data = await api('/api/admin/survey');
    surveyTable.innerHTML = '<tr><th>Skill</th><th>Answers</th><th>Average level</th></tr>';
    for (const row of data.results) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.skill}</td><td>${row.answers}</td><td>${row.average}</td>`;
        surveyTable.appendChild(tr);
    }
});
