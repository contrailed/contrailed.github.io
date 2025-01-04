// Time formatting
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) return 'just now';
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    
    return `${Math.floor(diffMonths / 12)}y ago`;
}

function formatTimestamp(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Color calculations
function getAgeColor(dateString) {
    const postTime = new Date(dateString).getTime();
    const oldestTime = window.threadOldestTime;
    const newestTime = window.threadNewestTime;
    
    const position = (postTime - oldestTime) / (newestTime - oldestTime);
    
    if (position < 0.60) {
        return `rgb(90, 90, 90)`;
    }
    
    const scaledPosition = (position - 0.60) * 2.5;
    const brightness = Math.floor(90 + (scaledPosition * 165));
    return `rgb(${brightness}, ${brightness}, ${brightness})`;
}

// Text formatting
function formatPostText(text, isCollapsed = false) {
    if (!text) return '';
    
    if (isCollapsed) {
        // Special case: if the text is just a single pin emoji
        if (text.trim() === '📌') {
            return '(pin)';
        }
        
        // This regex matches most emoji including compound emoji
        return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}][\u{1F3FB}-\u{1F3FF}]?[\u{200D}\u{FE0F}]?[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]?/gu, '').trim();
    }
    
    return text;
}

// Make functions available globally
window.getTimeAgo = getTimeAgo;
window.formatTimestamp = formatTimestamp;
window.getAgeColor = getAgeColor;
window.formatPostText = formatPostText; 