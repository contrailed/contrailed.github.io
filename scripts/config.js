// Thread configuration
const config = {
    // API settings
    API_THREAD_DEPTH: 25,

    // Visual layout
    REPLY_INDENT_PX: 24,        // Indentation for each reply level
    TRUNCATION_LEVEL: 25,       // Level at which to show "Thread continues..." message
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
    },

    // Featured content
    FEATURED_THREADS: [
        {
            url: "https://bsky.app/profile/malwaretech.com/post/3lekkmoc5vs2f",
            title: "Featured Thread 1"
        },
        {
            url: "https://bsky.app/profile/reuters.com/post/3leue6mxsqk2k",
            title: "Featured Thread 2"
        },
        {
            url: "https://bsky.app/profile/mcnees.bsky.social/post/3leu5o6upzs2n",
            title: "Featured Thread 3"
        }
    ]
};

// Export the configuration object
window.appConfig = config; 