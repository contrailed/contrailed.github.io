// Initialize keyboard navigation
function initializeKeyboardNav() {
    let replyElements = [];

    function updateReplyElements() {
        // Get all reply posts, including those in the older replies section
        replyElements = Array.from(document.querySelectorAll('.reply-post'));
    }

    function getCurrentFocusIndex() {
        updateReplyElements();
        // Find the currently expanded reply
        const expandedReply = document.querySelector('.reply-post.expanded');
        return expandedReply ? replyElements.indexOf(expandedReply) : -1;
    }

    function moveFocus(direction) {
        updateReplyElements();
        let currentFocusIndex = getCurrentFocusIndex();
        
        // If nothing is focused yet, start at the beginning or end
        if (currentFocusIndex === -1) {
            currentFocusIndex = direction > 0 ? 0 : replyElements.length - 1;
        } else {
            // Move focus in the specified direction
            currentFocusIndex += direction;
            
            // Wrap around if we go past the ends
            if (currentFocusIndex >= replyElements.length) {
                currentFocusIndex = 0;
            } else if (currentFocusIndex < 0) {
                currentFocusIndex = replyElements.length - 1;
            }
        }

        // Collapse all replies
        replyElements.forEach(reply => reply.classList.remove('expanded'));
        
        // Expand the focused reply
        const focusedElement = replyElements[currentFocusIndex];
        focusedElement.classList.add('expanded');
        
        // Ensure the focused element is in view
        focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // If the focused reply is in the older replies section, make sure it's visible
        const olderSection = focusedElement.closest('.older-replies-section');
        if (olderSection && olderSection.classList.contains('collapsed')) {
            olderSection.classList.remove('collapsed');
            const button = olderSection.querySelector('.expand-older');
            if (button) {
                button.textContent = 'Show Less';
            }
        }
    }

    // Set up keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'j' || e.key === 'ArrowDown') {
            moveFocus(1);
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            moveFocus(-1);
        }
    });
}

// Make functions available globally
window.initializeKeyboardNav = initializeKeyboardNav;

// Handle reply click events
window.handleReplyClick = function(element) {
    // Don't handle clicks on truncated posts
    if (element.querySelector('.truncated')) {
        return;
    }

    // First, collapse any currently expanded replies
    const allExpandedReplies = document.querySelectorAll('.reply-post.expanded');
    allExpandedReplies.forEach(reply => {
        if (reply !== element) {
            reply.classList.remove('expanded');
        }
    });

    // Then toggle the clicked reply
    element.classList.toggle('expanded');
};

// Handle expanding/collapsing older replies
window.toggleOlderReplies = function(button) {
    const section = button.parentElement;
    section.classList.toggle('collapsed');
    button.textContent = section.classList.contains('collapsed')
        ? `Show ${section.querySelector('.older-replies').children.length} earlier replies`
        : 'Hide earlier replies';
};

// Initialize all interactions when the thread is loaded
window.initializeInteractions = function() {
    initializeKeyboardNav();
}; 