class ThreadEmbed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._messageHandler = null;
    }

    async connectedCallback() {
        const url = this.getAttribute('url');
        console.log('ThreadEmbed connected, URL:', url);
        if (!url) {
            console.log('No URL provided to ThreadEmbed');
            return;
        }

        console.log('Creating iframe for URL:', url);
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                iframe {
                    width: 100%;
                    border: none;
                    background: var(--background-primary, #fff);
                    overflow: hidden;
                    min-height: 200px;
                    transition: height 0.3s ease-out;
                }
            </style>
            <iframe scrolling="no" src="thread.html?url=${encodeURIComponent(url)}"></iframe>
        `;

        // Remove any existing message handler
        if (this._messageHandler) {
            window.removeEventListener('message', this._messageHandler);
        }

        // Create a new message handler specific to this iframe
        this._messageHandler = (event) => {
            const iframe = this.shadowRoot.querySelector('iframe');
            if (iframe && event.data && event.data.type === 'resize') {
                // Verify the message is from our iframe
                if (event.source === iframe.contentWindow) {
                    // Add a buffer for expanded content
                    const newHeight = event.data.height + 50;
                    // Always update height to match content
                    iframe.style.height = newHeight + 'px';
                }
            }
        };

        // Set up the new message listener
        window.addEventListener('message', this._messageHandler);
    }

    disconnectedCallback() {
        // Clean up the message handler when the element is removed
        if (this._messageHandler) {
            window.removeEventListener('message', this._messageHandler);
            this._messageHandler = null;
        }
    }

    static get observedAttributes() {
        return ['url'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('ThreadEmbed attribute changed:', name, 'from', oldValue, 'to', newValue);
        if (name === 'url' && newValue && newValue !== oldValue) {
            this.connectedCallback();
        }
    }
}

customElements.define('thread-embed', ThreadEmbed); 