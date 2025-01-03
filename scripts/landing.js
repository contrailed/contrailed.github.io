// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up handlers');
    
    // Get elements
    const urlInput = document.getElementById('urlInput');
    console.log('URL input found:', !!urlInput);
    
    const viewButton = document.getElementById('viewButton');
    console.log('View button found:', !!viewButton);
    
    function viewThread() {
        console.log('viewThread function called');
        const url = urlInput.value.trim();
        console.log('URL input value:', url);
        
        if (!url) {
            alert('Please enter a Bluesky post URL');
            return;
        }
        
        console.log('URL validation check...');
        if (!url.includes('bsky.app/profile/') || !url.includes('/post/')) {
            alert('Please enter a valid Bluesky post URL');
            return;
        }
        
        const threadUrl = `thread.html?url=${encodeURIComponent(url)}`;
        console.log('Navigating to:', threadUrl);
        
        try {
            window.location.href = threadUrl;
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }
    
    // Button click handler
    if (viewButton) {
        console.log('Adding click handler to button');
        viewButton.onclick = function(e) {
            console.log('Button clicked (onclick)');
            viewThread();
        };
        
        viewButton.addEventListener('click', function(e) {
            console.log('Button clicked (addEventListener)');
        });
    } else {
        console.error('View button not found!');
    }
    
    // Also handle Enter key
    if (urlInput) {
        urlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed');
                viewThread();
            }
        });
    }
}); 