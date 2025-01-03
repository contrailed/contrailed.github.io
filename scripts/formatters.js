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
    // Add your text formatting logic here
    return text;
}

// Make functions available globally
window.getTimeAgo = getTimeAgo;
window.formatTimestamp = formatTimestamp;
window.getAgeColor = getAgeColor;
window.formatPostText = formatPostText; 