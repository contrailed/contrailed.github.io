// Function to notify parent of size changes
function notifyResize() {
    // Get the thread container height
    const container = document.getElementById('thread-container');
    
    // Calculate the maximum height of all content
    let height;
    if (container) {
        // Get all expanded views
        const expandedViews = container.getElementsByClassName('expanded-view');
        let maxBottom = container.offsetHeight;
        
        // Check each expanded view's position
        Array.from(expandedViews).forEach(view => {
            if (!view.closest('.collapsed')) { // Only count expanded views that aren't collapsed
                const rect = view.getBoundingClientRect();
                const bottom = rect.top + window.scrollY + rect.height;
                maxBottom = Math.max(maxBottom, bottom);
            }
        });
        
        height = maxBottom + 20; // Add padding
    } else {
        height = document.documentElement.scrollHeight;
    }
    
    window.parent.postMessage({
        type: 'resize',
        height: height
    }, '*');
}

// Set up mutation observer to watch for content changes
const observer = new MutationObserver(() => {
    // Use requestAnimationFrame to wait for browser to finish rendering
    requestAnimationFrame(() => {
        // Add a small delay to ensure expanded/collapsed content is rendered
        setTimeout(notifyResize, 100);
    });
});

// Start observing once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    
    // Initial size notification
    notifyResize();
    
    // Listen for click events that might expand/collapse content
    document.addEventListener('click', () => {
        // Multiple checks to catch the animation
        setTimeout(notifyResize, 50);
        setTimeout(notifyResize, 300);
        setTimeout(notifyResize, 600);
    });
}); 