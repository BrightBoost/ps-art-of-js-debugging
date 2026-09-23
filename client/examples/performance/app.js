const cards = /** @type {HTMLElement} */ (document.getElementById('cards'));
const filter = /** @type {HTMLInputElement} */ (document.getElementById('filter'));

const skillNames = ['JavaScript', 'Python', 'CSS', 'SQL', 'Docker', 'Git', 'Testing', 'Java', 'Kubernetes', 'TypeScript'];
const skills = Array.from({ length: 1000 }, (_, i) => ({
    name: skillNames[i % skillNames.length],
    owner: `Team member ${i + 1}`,
    note: 'Loves this skill. '.repeat(1 + (i % 4)),
}));

function render() {
    const term = filter.value.toLowerCase();
    cards.innerHTML = '';
    for (const skill of skills.filter((skill) => skill.name.toLowerCase().includes(term))) {
        const card = document.createElement('article');
        card.className = 'skill-card';
        card.innerHTML = `<h3>${skill.name}</h3><p class="category">${skill.owner}</p><p>${skill.note}</p>`;
        cards.appendChild(card);
    }
    equalizeCardHeights();
}

// Make all cards as high as the highest card, so the grid looks tidy.
function equalizeCardHeights() {
    const allCards = /** @type {NodeListOf<HTMLElement>} */ (cards.querySelectorAll('.skill-card'));
    let maxHeight = 0;
    for (const card of allCards) {
        card.style.height = 'auto';
        maxHeight = Math.max(maxHeight, card.offsetHeight);
        card.style.height = `${maxHeight}px`;
    }
}

filter.addEventListener('input', render);
render();
