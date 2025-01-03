class ThreadPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const url = this.getAttribute('url');
        if (!url) return;

        try {
            const match = url.match(/profile\/([^/]+)\/post\/([^/]+)/);
            if (!match) throw new Error('Invalid URL format');
            
            const [_, handle, rkey] = match;
            const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${rkey}&depth=0`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            const post = data?.thread?.post?.record;
            const author = data?.thread?.post?.author;
            
            if (!post || !author) throw new Error('Invalid post data');

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        padding: 15px;
                        background: var(--background-secondary, #f5f5f5);
                        border: 1px solid var(--border-color, #ddd);
                        border-radius: 4px;
                        margin: 10px 0;
                    }
                    .author {
                        margin-bottom: 8px;
                    }
                    .name {
                        font-weight: bold;
                    }
                    .handle {
                        color: var(--text-secondary, #666);
                        margin-left: 6px;
                    }
                    .content {
                        color: var(--text-primary, #000);
                        line-height: 1.4;
                    }
                </style>
                <div class="author">
                    <span class="name">${author.displayName || author.handle}</span>
                    <span class="handle">@${author.handle}</span>
                </div>
                <div class="content">${post.text}</div>
            `;
        } catch (error) {
            console.error('Error loading thread preview:', error);
            this.shadowRoot.innerHTML = `
                <div>Error loading preview</div>
            `;
        }
    }
}

customElements.define('thread-preview', ThreadPreview); 