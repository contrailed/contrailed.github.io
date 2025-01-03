// Initialize thread from localStorage data
function initializeFromLocalStorage() {
    try {
        console.log('Loading data from localStorage...');
        const storedData = localStorage.getItem('post-data-live');
        if (!storedData) {
            console.error('No data found in localStorage');
            return;
        }

        const data = JSON.parse(storedData);
        console.log('Loaded data:', data);

        // Process the data directly here since we're in browser context
        function processThread(threadData, maxDepth = Infinity) {
            function processPost(post, depth = 0) {
                // Don't process beyond maxDepth
                if (depth > maxDepth) return null;

                // Process the current post
                const processedPost = {
                    ...post,
                    replies: []
                };

                // Process replies if they exist and we're not at max depth
                if (post.replies && depth < maxDepth) {
                    processedPost.replies = post.replies
                        .map(reply => processPost(reply, depth + 1))
                        .filter(reply => reply !== null);
                }

                return processedPost;
            }

            return processPost(threadData, 0);
        }

        // Get the maximum depth from the API response
        function getMaxDepth(post, currentDepth = 0) {
            let maxDepth = currentDepth;
            if (post.replies && post.replies.length > 0) {
                post.replies.forEach(reply => {
                    maxDepth = Math.max(maxDepth, getMaxDepth(reply, currentDepth + 1));
                });
            }
            return maxDepth;
        }

        const maxAvailableDepth = getMaxDepth(data);
        window.threadData = processThread(data, maxAvailableDepth);
        initializeThread(window.threadData);
        console.log('Thread initialized successfully');
    } catch (error) {
        console.error('Error initializing thread:', error);
    }
}

// Call initialization when the page loads
document.addEventListener('DOMContentLoaded', initializeFromLocalStorage);

function createPostHTML(post) {
    let allPosts = [];
    const rootAuthorHandle = post.author.handle;

    function getMaxDepth(post, currentDepth = 0) {
        let maxDepth = currentDepth;
        if (post.replies && post.replies.length > 0) {
            post.replies.forEach(reply => {
                maxDepth = Math.max(maxDepth, getMaxDepth(reply, currentDepth + 1));
            });
        }
        return maxDepth;
    }

    const maxThreadDepth = getMaxDepth(post);

    function flattenThread(post, level = 0, isMainPost = false) {
        allPosts.push({
            post: post,
            level: level,
            isMainPost: isMainPost
        });

        if (post.replies) {
            // If we're at the truncation level and have replies, add truncation notice
            if (level === window.appConfig.TRUNCATION_LEVEL && post.replies.length > 0) {
                const truncationPost = {
                    author: post.author,
                    text: "Thread continues...",
                    createdAt: post.createdAt,
                    rkey: post.rkey + "-truncated",
                    isTruncated: true,
                    parentHandle: post.author.handle,
                    parentRkey: post.rkey
                };
                allPosts.push({
                    post: truncationPost,
                    level: level + 1,
                    isMainPost: false
                });
            } else if (level < window.appConfig.TRUNCATION_LEVEL) {
                // Only process replies if we haven't reached the truncation level
                post.replies
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .forEach(reply => flattenThread(reply, level + 1));
            }
        }
    }

    flattenThread(post, 0, true);

    // Calculate thread time range for color gradients
    const timestamps = allPosts.map(p => new Date(p.post.createdAt).getTime());
    const oldestTime = Math.min(...timestamps);
    const newestTime = Math.max(...timestamps);

    // Set the time range in window for gradient calculations
    window.threadOldestTime = oldestTime;
    window.threadNewestTime = newestTime;

    // Apply gradient colors to each post
    allPosts.forEach(p => {
        const postTime = new Date(p.post.createdAt).getTime();
        const progress = (postTime - oldestTime) / (newestTime - oldestTime);
        p.post.gradientProgress = progress;
    });

    // Split into main post, older replies, and recent replies
    const mainPost = allPosts[0];
    const replies = allPosts.slice(1);
    const olderReplies = replies.slice(0, -window.appConfig.RECENT_REPLIES_COUNT);
    const recentReplies = replies.slice(-window.appConfig.RECENT_REPLIES_COUNT);

    // Build HTML
    let html = `
        <div class="main-post">
            ${createMainPostContent(mainPost.post)}
        </div>
    `;

    if (olderReplies.length > 0) {
        html += `
            <div class="older-replies-section collapsed">
                <button class="expand-older" onclick="toggleOlderReplies(this)">
                    Show ${olderReplies.length} earlier ${olderReplies.length === 1 ? 'reply' : 'replies'}
                </button>
                <div class="older-replies">
                    ${renderReplies(olderReplies, rootAuthorHandle)}
                </div>
            </div>
        `;
    }

    html += renderReplies(recentReplies, rootAuthorHandle);
    return html;
}

window.initializeThread = function(threadData) {
    if (threadData) {
        document.getElementById('thread-container').innerHTML = createPostHTML(threadData);
        window.initializeInteractions();
        // Dispatch event when thread is loaded
        window.dispatchEvent(new Event('threadLoaded'));
    } else {
        console.error('No thread data available');
    }
};