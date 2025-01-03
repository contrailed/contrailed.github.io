// Wait for both DOM content and thread initialization
function applyStyles() {
    console.log('Applying dynamic styles with line height:', window.appConfig.LINE_HEIGHT);
    
    const style = document.createElement('style');
    document.head.appendChild(style);

    // Add dynamic CSS rules with maximum specificity
    style.textContent = `
        /* Post content line height */
        body #thread-container .post-content {
            line-height: ${window.appConfig.LINE_HEIGHT} !important;
        }

        /* Container adjustments */
        body #thread-container .expanded-content {
            padding: 0 !important;
            margin: 8px 0;
        }

        body #thread-container .expanded-content .post-content {
            padding: 4px 0 !important;
        }

        body #thread-container .collapsed-view {
            padding: 2px 4px 2px 0 !important;
        }

        /* Expanded post header/footer spacing */
        body #thread-container .expanded-header {
            padding-bottom: 16px !important;
            margin-bottom: 8px !important;
            border-bottom: 1px solid var(--border-color);
        }

        body #thread-container .expanded-footer {
            padding-top: 8px !important;
            border-top: 1px solid var(--border-color);
        }

        /* Reply indentation lines */
        .reply-post.collapsed {
            position: relative;
        }

        /* Horizontal connector lines */
        .reply-post.collapsed::before {
            content: "";
            display: block;
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            width: ${window.appConfig.REPLY_INDENT_PX}px;
            height: 1px;
            background-color: var(--border-color);
            opacity: ${window.appConfig.LINE_OPACITY.HORIZONTAL};
            pointer-events: none;
            z-index: 1;
        }

        /* Vertical connector lines */
        .reply-post.collapsed::after {
            content: "";
            display: block;
            position: absolute;
            right: 100%;
            top: -2px;
            width: 1px;
            height: calc(100% + 4px);
            background-color: transparent;
            box-shadow: ${Array.from({length: 25}, (_, i) => 
                `${-(i * window.appConfig.REPLY_INDENT_PX)}px 0 0 var(--border-color)`
            ).join(', ')};
            opacity: ${window.appConfig.LINE_OPACITY.VERTICAL};
            pointer-events: none;
            z-index: 1;
        }
    `;
    
    console.log('Dynamic styles applied:', style.textContent);
}

// Apply styles when DOM is loaded
document.addEventListener('DOMContentLoaded', applyStyles);

// Also apply styles when thread is refreshed
window.addEventListener('threadLoaded', applyStyles); 