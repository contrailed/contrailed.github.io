// Process thread data into a format suitable for display
function processThread(threadData) {
    function processPost(post, depth = 0) {
        // Process the current post
        const processedPost = {
            ...post,
            replies: []
        };

        // Process replies if they exist
        if (post.replies) {
            processedPost.replies = post.replies
                .map(reply => processPost(reply, depth + 1))
                .filter(reply => reply !== null);
        }

        return processedPost;
    }

    return processPost(threadData, 0);
}

// Make function available globally
window.processThread = processThread; 