const host = /** @type {HTMLElement} */ (document.getElementById('panel-host'));
const openButton = /** @type {HTMLButtonElement} */ (document.getElementById('open-details'));

class DetailsPanel {
    constructor() {
        this.element = document.createElement('section');
        this.element.className = 'skill-card';
        this.element.innerHTML = `
            <h3>JavaScript</h3>
            <p class="category">History of levels over the last 10 years</p>
            <ul>${Array.from({ length: 2000 }, (_, i) => `<li>Check-in ${i + 1}: level ${1 + (i % 5)}</li>`).join('')}</ul>
            <button type="button" class="close">Close</button>`;
        // Keep the layout right when the window size changes.
        // The AbortController lets us remove the listener again when the panel closes.
        this.controller = new AbortController();
        window.addEventListener('resize', () => this.updateLayout(), { signal: this.controller.signal });
        /** @type {HTMLButtonElement} */ (this.element.querySelector('.close')).addEventListener('click', () => this.close());
    }

    updateLayout() {
        this.element.style.maxHeight = `${window.innerHeight * 0.6}px`;
    }

    open() {
        host.appendChild(this.element);
        this.updateLayout();
    }

    close() {
        this.controller.abort();
        this.element.remove();
    }
}

openButton.addEventListener('click', () => new DetailsPanel().open());
