// Simulates saving two skills at (almost) the same moment.
// Usage: start the server, then run: node scripts/two-saves.js
const BASE = process.env.API_URL ?? 'http://localhost:3000';

const login = await fetch(`${BASE}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user1', password: 'password1' }),
});
const cookie = login.headers.get('set-cookie')?.split(';')[0] ?? '';

/** @param {string} name */
function addSkill(name) {
    return fetch(`${BASE}/api/user/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({ name, level: 3, category: 'Tools' }),
    }).then((response) => response.status);
}

const stamp = Date.now().toString().slice(-4);
const statuses = await Promise.all([addSkill(`Docker-${stamp}`), addSkill(`Podman-${stamp}`)]);
console.log('Both requests answered with:', statuses);

const skills = await fetch(`${BASE}/api/user/skills`, { headers: { cookie } }).then((r) => r.json());
const saved = skills.skills.map((/** @type {{ name: string }} */ s) => s.name).filter((/** @type {string} */ n) => n.endsWith(stamp));
console.log('Actually saved:', saved);
