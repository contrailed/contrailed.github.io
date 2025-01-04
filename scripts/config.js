// Thread configuration
const config = {
    // API settings
    API_THREAD_DEPTH: 20,

    // Visual layout
    REPLY_INDENT_PX: 24,        // Indentation for each reply level
    TRUNCATION_LEVEL: 20,       // Level at which to show "Thread continues..." message
    RECENT_REPLIES_COUNT: 20,   // Number of most recent replies to show by default
    LINE_HEIGHT: 1.4,           // Line height for post content
    LINE_OPACITY: {
        HORIZONTAL: 0,          // Opacity of horizontal connector lines (0-1)
        VERTICAL: 0.5           // Opacity of vertical connector lines (0-1)
    },

    // Gradient settings
    GRADIENT_COLOR: {
        MIN_VALUE: 80,          // Darkest grey value (0-255)
        MAX_VALUE: 255          // Lightest grey value (0-255)
    }
};

// Make config available globally
window.appConfig = config; 