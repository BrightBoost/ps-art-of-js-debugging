const form = /** @type {HTMLFormElement} */ (document.getElementById('preferences'));
const status = /** @type {HTMLElement} */ (document.getElementById('status'));

const defaults = { sortBy: 'name', compact: false };

function loadPreferences() {
    try {
        return JSON.parse(localStorage.getItem('preferences') ?? 'null') ?? defaults;
    } catch {
        return defaults;
    }
}

function showPreferences() {
    const preferences = loadPreferences();
    /** @type {HTMLSelectElement} */ (form.elements.namedItem('sortBy')).value = preferences.sortBy;
    /** @type {HTMLInputElement} */ (form.elements.namedItem('compact')).checked = preferences.compact;
    /** @type {HTMLInputElement} */ (form.elements.namedItem('rememberMe')).checked = document.cookie.includes('rememberMe=');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const preferences = {
        sortBy: formData.get('sortBy'),
        compact: formData.has('compact'),
    };
    localStorage.setItem('preferences', preferences);

    if (formData.has('rememberMe')) {
        // Remember the user for 30 days
        document.cookie = `rememberMe=user1; max-age=${60 * 60 * 24 * 30}; SameSite=None`;
    } else {
        document.cookie = 'rememberMe=; max-age=0';
    }
    status.textContent = 'Preferences saved!';
});

showPreferences();
