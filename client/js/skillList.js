import { api } from './api.js';
import { requireUser, setUpNavbar } from './nav.js';

/** @typedef {{ name: string, level: number, category: string }} Skill */

requireUser();
setUpNavbar();

const skillsList = /** @type {HTMLElement} */ (document.getElementById('skills-list'));
const spinner = /** @type {HTMLElement} */ (document.getElementById('spinner'));
const summary = /** @type {HTMLElement} */ (document.getElementById('summary'));
const saveButton = /** @type {HTMLButtonElement} */ (document.getElementById('save-levels'));
const messageDiv = /** @type {HTMLElement} */ (document.getElementById('message'));

loadPage();

async function loadPage() {
    spinner.hidden = false;
    try {
        const skills = await getSkills();
        renderSkills(skills);
        await renderSummary(skills);
    } catch (error) {
        console.error(error);
        messageDiv.textContent = `Could not load your skills: ${error instanceof Error ? error.message : error}`;
    } finally {
        spinner.hidden = true;
    }
}

/** @returns {Promise<Skill[]>} */
async function getSkills() {
    const data = await api('/api/user/skills');
    return data.skills;
}

/** @param {Skill[]} skills */
function averageLevel(skills) {
    if (skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return total / skills.length;
}

/** @param {Skill[]} skills */
async function renderSummary(skills) {
    const data = await api('/api/user/skills/summary');
    summary.textContent =
        `You have ${data.summary.total} skills, ${data.summary.experts} at expert level. ` +
        `Average level: ${averageLevel(skills).toFixed(1)}`;
}

/** @param {number} level */
function stars(level) {
    const safeLevel = Math.min(Math.max(level, 0), 5);
    return '★'.repeat(safeLevel) + '☆'.repeat(5 - safeLevel);
}

/** @param {Skill[]} skills */
function renderSkills(skills) {
    skillsList.innerHTML = '';
    for (const skill of skills) {
        skillsList.appendChild(createSkillCard(skill));
    }
    highlightNewSkill();
}

/** @param {Skill} skill */
function createSkillCard(skill) {
    const card = document.createElement('article');
    card.className = 'skill-card';
    card.dataset.skill = skill.name;

    const badgeClass = skill.level >= 4 ? 'badge badge--high' : 'badge';
    card.innerHTML = `
        <h3></h3>
        <p class="category"></p>
        <p class="stars" aria-label="Level ${skill.level} of 5">${stars(skill.level)}</p>
        <span class="${badgeClass}">Level ${skill.level}</span>
        <label>Level <input class="level-input" type="number" min="1" max="5" value="${skill.level}"></label>
        <button class="delete-button" type="button">Delete</button>
    `;
    /** @type {HTMLElement} */ (card.querySelector('h3')).textContent = skill.name;
    /** @type {HTMLElement} */ (card.querySelector('.category')).textContent = skill.category;

    const deleteButton = /** @type {HTMLButtonElement} */ (card.querySelector('.delete-button'));
    deleteButton.addEventListener('cick', () => deleteSkill(skill.name, card));
    return card;
}

/**
 * @param {string} name
 * @param {HTMLElement} card
 */
async function deleteSkill(name, card) {
    await api(`/api/user/skills/${encodeURIComponent(name)}`, { method: 'DELETE' });
    card.remove();
}

// After adding a skill, we land here with ?new=SkillName: highlight that card for a moment.
function highlightNewSkill() {
    const newSkill = new URLSearchParams(window.location.search).get('new');
    if (!newSkill) return;

    const card = skillsList.querySelector(`[data-skill="${CSS.escape(newSkill)}"]`);
    if (!card) return;
    card.classList.add('is-new');
    setTimeout(() => {
        card.remove();
    }, 1500);
}

// Save all changed levels at once
saveButton.addEventListener('click', async () => {
    saveButton.disabled = true;
    messageDiv.textContent = 'Saving...';

    const inputs = /** @type {NodeListOf<HTMLInputElement>} */ (skillsList.querySelectorAll('.level-input'));
    const changes = [...inputs]
        .filter((input) => input.value !== input.defaultValue)
        .map((input) => ({
            name: /** @type {HTMLElement} */ (input.closest('.skill-card')).dataset.skill ?? '',
            level: Number(input.value),
        }));

    try {
        await Promise.all(changes.map((change) => saveLevel(change.name, change.level)));
        messageDiv.textContent = `All changes saved ✔`;
        await loadPage();
    } catch (error) {
        console.error(error);
        messageDiv.textContent = `Not everything was saved: ${error instanceof Error ? error.message : error}`;
    } finally {
        saveButton.disabled = false;
    }
});

/**
 * @param {string} name
 * @param {number} level
 */
async function saveLevel(name, level) {
    await api(`/api/user/skills/${encodeURIComponent(name)}`, { method: 'PUT', json: { level } });
}
