// Template functions
function createMainPostContent(post) {
    const parentUrl = post.parent ? `https://bsky.app/profile/${post.parent.author.handle}/post/${post.parent.rkey}` : null;
    const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${post.rkey}`;
    
    const avatarUrl = post.author?.avatar ? 
        (post.author.avatar.includes('?') ? 
            `${post.author.avatar}&thumb=80` : 
            `${post.author.avatar}?thumb=80`) 
        : 'default-avatar.png';
    
    return `
        <div class="expanded-header">
            <img class="avatar" src="${avatarUrl}" alt="Avatar" loading="lazy">
            <div class="expanded-user-info">
                <span class="display-name">${post.author?.displayName || post.author?.handle}</span>
                <span class="handle">@${post.author?.handle}</span>
            </div>
        </div>
        <div class="expanded-content">
            <div class="post-content">
                ${formatPostText(post.text || '')}
            </div>
            ${createEmbedHTML(post.embed)}
        </div>
        <div class="expanded-footer">
            <div class="expanded-timestamp">
                ${formatTimestamp(post.createdAt)}
            </div>
            <div class="post-links">
                ${parentUrl ? `
                <a href="thread.html?url=${encodeURIComponent(parentUrl)}" class="post-link" target="_blank" rel="noopener noreferrer">Open Parent in Thread View</a>
                <span class="link-separator">|</span>
                ` : ''}
                <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="post-link">Open on bsky.app</a>
            </div>
            <div class="post-stats">
                <span class="likes">♡ ${post.likes || 0}</span>
                <span class="reposts">↺ ${post.reposts || 0}</span>
            </div>
        </div>
    `;
}

function createCollapsedReplyContent(post, rootAuthorHandle) {
    const gradientColor = getGradientColor(post.gradientProgress || 0);
    
    if (post.isTruncated) {
        const parentUrl = `https://bsky.app/profile/${post.parentHandle}/post/${post.parentRkey}`;
        return `
            <div class="collapsed-view truncated">
                <a href="thread.html?url=${encodeURIComponent(parentUrl)}" 
                   style="text-decoration: none; color: inherit; cursor: pointer; display: block;">
                    <div class="post-content" style="color: var(--text-secondary); font-style: italic;">
                        ${post.text}
                    </div>
                </a>
            </div>
        `;
    }

    // Check for different types of media
    let mediaIndicator = '';
    if (post.embed) {
        if (post.embed.type === 'images') {
            mediaIndicator = '<span class="media-indicator">📷</span>';
        } else if (post.embed.type === 'app.bsky.embed.record#view') {
            // Check for Giphy in the main record
            if (post.embed.record?.embed?.type === 'app.bsky.embed.external#view' &&
                post.embed.record.embed.external?.uri?.includes('giphy.com')) {
                mediaIndicator = '<span class="media-indicator">GIF</span>';
            }
            // Also check for Giphy in any external embeds
            else if (post.embed.record?.embeds?.some(e => 
                e.type === 'app.bsky.embed.external#view' && 
                e.external?.uri?.includes('giphy.com'))) {
                mediaIndicator = '<span class="media-indicator">GIF</span>';
            }
            // Check for YouTube
            else if (post.embed.record?.embed?.type === 'app.bsky.embed.external#view' &&
                     (post.embed.record.embed.external?.uri?.includes('youtube.com') || 
                      post.embed.record.embed.external?.uri?.includes('youtu.be'))) {
                mediaIndicator = '<span class="media-indicator">▶️</span>';
            }
        }
    }
    
    return `
        <div class="collapsed-view">
            <div class="post-content" style="color: ${gradientColor}">
                ${formatPostText(post.text || '', true)}
                ${mediaIndicator}
            </div>
            <div class="user-info">
                <span class="display-name">${post.author?.displayName || post.author?.handle}</span>
            </div>
        </div>
        ${createExpandedReplyContent(post, rootAuthorHandle)}
    `;
}

function createExpandedReplyContent(post, rootAuthorHandle) {
    const isRootAuthor = post.author.handle === rootAuthorHandle;
    const timeAgo = getTimeAgo(post.createdAt);
    const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${post.rkey}`;
    
    const avatarUrl = post.author?.avatar ? 
        (post.author.avatar.includes('?') ? 
            `${post.author.avatar}&thumb=80` : 
            `${post.author.avatar}?thumb=80`) 
        : 'default-avatar.png';
    
    return `
        <div class="expanded-view ${isRootAuthor ? 'root-author' : ''}">
            <div class="expanded-header">
                <img class="avatar" src="${avatarUrl}" alt="Avatar" loading="lazy">
                <div class="expanded-user-info">
                    <span class="display-name">${post.author?.displayName || post.author?.handle}</span>
                    <span class="handle">@${post.author?.handle}</span>
                </div>
            </div>
            <div class="expanded-content">
                <div class="post-content">
                    ${formatPostText(post.text || '')}
                </div>
                ${createEmbedHTML(post.embed)}
            </div>
            <div class="expanded-footer">
                <div class="expanded-timestamp">
                    <span class="time-ago">${timeAgo}</span>
                    <span class="dot">·</span>
                    <span class="timestamp">${formatTimestamp(post.createdAt)}</span>
                </div>
                <div class="post-links">
                    <a href="thread.html?url=${encodeURIComponent(postUrl)}" class="post-link" target="_blank" rel="noopener noreferrer">Open in Thread View</a>
                    <span class="link-separator">|</span>
                    <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="post-link">Open on bsky.app</a>
                </div>
                <div class="post-stats">
                    <span class="likes">♡ ${post.likes || 0}</span>
                    <span class="reposts">↺ ${post.reposts || 0}</span>
                </div>
            </div>
        </div>
    `;
}

function createEmbedHTML(embed) {
    if (!embed) return '';

    if (embed.type === 'images') {
        const images = embed.images.map(img => {
            // Create both a small preview and full size URL
            const previewUrl = img.url.includes('?') ? 
                `${img.url}&thumb=200` : 
                `${img.url}?thumb=200`;
            const fullUrl = img.url.includes('?') ? 
                `${img.url}&thumb=500` : 
                `${img.url}?thumb=500`;
            
            return `
                <div class="embedded-image">
                    <div class="image-container" onclick="event.stopPropagation(); this.classList.toggle('expanded'); this.parentElement.classList.toggle('expanded')">
                        <img src="${previewUrl}"
                             data-src="${fullUrl}"
                             alt="${img.alt || ''}"
                             loading="lazy"
                             onload="this.style.filter='none'; if(this.dataset.src !== this.src) { this.src = this.dataset.src; }"
                        >
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="embedded-images-grid">${images}</div>`;
    }

    // Handle giphy embeds
    if (embed.type === 'app.bsky.embed.record#view' && 
        embed.record?.embed?.type === 'app.bsky.embed.external#view' && 
        embed.record.embed.external?.uri?.includes('giphy.com')) {
        const giphyUrl = embed.record.embed.external.uri;
        const giphyId = giphyUrl.split('/').pop();
        return `
            <div class="giphy-embed">
                <iframe src="https://giphy.com/embed/${giphyId}"
                        width="480"
                        height="270"
                        frameBorder="0"
                        class="giphy-embed"
                        allowFullScreen>
                </iframe>
            </div>
        `;
    }

    if (embed.type === 'external') {
        return `
            <a href="${embed.url}" target="_blank" rel="noopener noreferrer" class="external-embed">
                ${embed.thumb ? `<img src="${embed.thumb}" alt="Link preview" loading="lazy">` : ''}
                <div class="external-content">
                    <div class="external-title">${embed.title || 'External link'}</div>
                    ${embed.description ? `<div class="external-description">${embed.description}</div>` : ''}
                </div>
            </a>
        `;
    }

    return '';
}

function renderReplies(replies, rootAuthorHandle) {
    let html = '';
    
    for (let i = 0; i < replies.length; i++) {
        const item = replies[i];
        const hasMoreReplies = item.level === window.appConfig.TRUNCATION_LEVEL && item.post.replies && item.post.replies.length > 0;
        
        html += `
            <div class="reply-post collapsed ${item.post.author.handle === rootAuthorHandle ? 'root-author' : ''} ${hasMoreReplies ? 'has-more' : ''}"
                 onclick="handleReplyClick(this)"
                 style="margin-left: ${item.level * window.appConfig.REPLY_INDENT_PX}px;">
                ${createCollapsedReplyContent(item.post, rootAuthorHandle)}
            </div>
        `;
    }
    
    return html;
}

function getGradientColor(progress) {
    // Convert progress (0-1) to a color from dark grey to white
    const value = Math.round(window.appConfig.GRADIENT_COLOR.MIN_VALUE + (progress * (window.appConfig.GRADIENT_COLOR.MAX_VALUE - window.appConfig.GRADIENT_COLOR.MIN_VALUE)));
    return `rgb(${value}, ${value}, ${value})`;
}

function createReplyContent(item, rootAuthorHandle) {
    const isRootAuthor = item.post.author.handle === rootAuthorHandle;
    const maxDepth = getMaxDepth(window.threadData); // Get the max depth from the thread data
    const hasMoreReplies = item.level === maxDepth - 1 && item.post.replies && item.post.replies.length > 0;

    return `
        <div class="reply-post collapsed ${isRootAuthor ? 'root-author' : ''} ${hasMoreReplies ? 'has-more' : ''}" 
             onclick="handleReplyClick(this)">
            ${createCollapsedReplyContent(item.post, rootAuthorHandle)}
        </div>
    `;
}

// Helper function to get max depth (can be shared between files if needed)
function getMaxDepth(post, currentDepth = 0) {
    let maxDepth = currentDepth;
    if (post.replies && post.replies.length > 0) {
        post.replies.forEach(reply => {
            maxDepth = Math.max(maxDepth, getMaxDepth(reply, currentDepth + 1));
        });
    }
    return maxDepth;
}

// Make functions available globally
window.createMainPostContent = createMainPostContent;
window.createCollapsedReplyContent = createCollapsedReplyContent;
window.createExpandedReplyContent = createExpandedReplyContent;
window.createEmbedHTML = createEmbedHTML;
window.renderReplies = renderReplies;
window.getGradientColor = getGradientColor;
window.createReplyContent = createReplyContent;
window.getMaxDepth = getMaxDepth;