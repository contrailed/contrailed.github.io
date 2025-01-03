const { fetchPostData } = require('./fetchThread');
const { processThread } = require('./processThread');

async function getThreadData(auth, postUrl) {
    try {
        const rawThreadData = await fetchPostData(auth, postUrl);
        const processedThread = processThread(rawThreadData);
        return processedThread;
    } catch (error) {
        console.error('Error processing thread:', error);
        throw error;
    }
}

module.exports = { getThreadData }; 