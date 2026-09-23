const average = /** @type {HTMLElement} */ (document.getElementById('average'));
const form = /** @type {HTMLFormElement} */ (document.getElementById('feedback'));
const status = /** @type {HTMLElement} */ (document.getElementById('status'));

async function showAverage() {
    const response = await fetch('./skills.json');
    const data = await response.json();
    let total = 0;
    for (const skill of data.skills) {
        total += skill.level;
    }
    average.textContent = `Average team level: ${(total / data.skills.length).toFixed(1)}`;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Sending...';
    const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: new FormData(form).get('message') }),
    });
    const data = await response.json();
    status.textContent = `Thanks! That's feedback message number ${data.received}.`;
    form.reset();
});

showAverage();
