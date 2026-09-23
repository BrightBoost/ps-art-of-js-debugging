const overview = /** @type {HTMLElement} */ (document.getElementById('overview'));

async function loadOverview() {
    const response = await fetch('/api/user/skill');
    const data = await response.json();
    for (const skill of data.skills) {
        const item = document.createElement('li');
        item.textContent = `${skill.name} (level ${skill.level})`;
        overview.appendChild(item);
    }
}

loadOverview();
