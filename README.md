## Usage

Paste a Bluesky post URL into the input field and press Enter or click "View Thread" to see the full discussion.

## Development

This is a static web application using vanilla JavaScript, HTML, and CSS. No build process is required.

### Project Structure

```
/
├── index.html          # Landing page
├── thread.html         # Thread viewer page
├── styles/            # CSS files
│   ├── main.css
│   ├── landing.css
│   ├── thread.css
│   ├── replies.css
│   └── embeds.css
└── scripts/           # JavaScript files
    ├── config.js
    ├── api.js
    ├── templates.js
    ├── interactions.js
    ├── formatters.js
    └── threadEmbed.js
```

### Running Locally

1. Clone the repository
2. Open `index.html` in your browser
3. For local development, use a local web server (e.g., `python -m http.server` or Live Server in VS Code)

## License

MIT 