const fs = require('fs');
const { fetchPostData } = require('./fetchThread.js');

async function saveRawData(postUrl) {
    try {
        console.log('Fetching post data...');
        const rawData = await fetchPostData(postUrl);
        
        // Save to data directory
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');
        }
        
        const fileName = `data/raw-thread-${Date.now()}.json`;
        fs.writeFileSync(fileName, JSON.stringify(rawData, null, 2));
        console.log(`Raw data saved to ${fileName}`);
    } catch (error) {
        console.error('Error saving raw data:', error);
    }
}

// Get URL from command line argument or use default
const postUrl = process.argv[2] || 'https://bsky.app/profile/malwaretech.com/post/3lekkmoc5vs2f';
saveRawData(postUrl); 