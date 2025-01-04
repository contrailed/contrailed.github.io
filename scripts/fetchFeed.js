async function fetchDiscoverFeed() {
    try {
        const params = new URLSearchParams({
            feed: 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
            limit: '20'
        });

        const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Feed data:', data);
        
        // Extract the top 10 posts that have replies (threads)
        const threads = data.feed
            .filter(item => item.post.replyCount > 0)
            .slice(0, 10)
            .map(item => {
                const uri = item.post.uri;
                const handle = item.post.author.handle;
                const postId = uri.split('/').pop();
                
                if (!handle || !postId) {
                    console.log('Skipping malformed item:', item);
                    return null;
                }

                return {
                    url: `https://bsky.app/profile/${handle}/post/${postId}`,
                    title: item.post.record.text.substring(0, 100)
                };
            })
            .filter(thread => thread !== null);

        console.log('Processed threads:', threads);
        return threads;
    } catch (error) {
        console.error('Error fetching discover feed:', error);
        return [];
    }
}

// Make function available globally
window.fetchDiscoverFeed = fetchDiscoverFeed; 