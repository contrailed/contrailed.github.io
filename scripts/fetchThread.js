async function fetchPostData(postUrl) {
    try {
        const urlParts = postUrl.split('/');
        const handle = urlParts[urlParts.indexOf('profile') + 1];
        const rkey = urlParts[urlParts.indexOf('post') + 1];

        const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${rkey}&depth=${window.appConfig.API_THREAD_DEPTH}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }

        const threadData = await response.json();
        const post = threadData.thread.post;

        // Helper function to process a post and its replies
        function processPost(threadPost, depth = 0) {
            if (!threadPost || !threadPost.post) return null;

            const formattedPost = {
                author: {
                    displayName: threadPost.post.author.displayName,
                    handle: threadPost.post.author.handle,
                    avatar: threadPost.post.author.avatar
                },
                text: threadPost.post.record.text,
                likes: threadPost.post.likeCount || 0,
                reposts: threadPost.post.repostCount || 0,
                createdAt: threadPost.post.record.createdAt,
                rkey: threadPost.post.uri.split('/').pop(),
                uri: threadPost.post.uri,
                replies: [],
                embed: null,
                parent: threadPost.parent ? {
                    author: {
                        handle: threadPost.parent.post.author.handle
                    },
                    rkey: threadPost.parent.post.uri.split('/').pop()
                } : null
            };

            // Process embeds if they exist
            if (threadPost.post.embed) {
                if (threadPost.post.embed.images) {
                    formattedPost.embed = {
                        type: 'images',
                        images: threadPost.post.embed.images.map(img => ({
                            url: img.fullsize,
                            alt: img.alt
                        }))
                    };
                } else if (threadPost.post.embed.external) {
                    formattedPost.embed = {
                        type: 'external',
                        url: threadPost.post.embed.external.uri,
                        title: threadPost.post.embed.external.title,
                        description: threadPost.post.embed.external.description,
                        thumb: threadPost.post.embed.external.thumb
                    };
                }
            }

            // Process replies if they exist and we're not at max depth
            if (threadPost.replies) {
                formattedPost.replies = threadPost.replies
                    .map(reply => processPost(reply, depth + 1))
                    .filter(reply => reply !== null);
            }

            return formattedPost;
        }

        // Process the entire thread starting from the root post
        const formattedData = processPost(threadData.thread);
        return formattedData;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
}

// Export using ES module syntax
export { fetchPostData }; 