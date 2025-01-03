import { fetchPostData } from './fetchThread.js';

async function savePostData(data) {
    try {
        console.log('Starting save process...');
        console.log('Data to save:', data);
        // Instead of writing to file, we'll store in localStorage
        localStorage.setItem('post-data-live', JSON.stringify(data));
        console.log('Data saved successfully to localStorage');
    } catch (error) {
        console.error('Error saving data:', error);
        console.error('Error details:', error.message);
        throw error;
    }
}

async function refreshThreadData() {
    try {
        if (!POST_URL) {
            console.error('No post URL provided');
            window.location.href = 'index.html';
            return;
        }

        console.log('Fetching post data...');
        const rawData = await fetchPostData(POST_URL);
        console.log('Raw data received:', rawData);
        
        console.log('Processing thread...');
        // Use the global processThread function
        if (typeof window.processThread !== 'function') {
            throw new Error('processThread function not found. Make sure processThread.js is loaded.');
        }
        const processedData = window.processThread(rawData);
        console.log('Processed data:', processedData);
        
        console.log('Saving data...');
        await savePostData(processedData);
        
        // After saving, trigger a page reload of the thread
        window.threadData = processedData;
        initializeThread(processedData);
        
        console.log('Process completed successfully!');
    } catch (error) {
        console.error('Process failed:', error);
        console.error('Error stack:', error.stack);
    }
}

// Expose the refresh function globally
window.refreshThreadData = refreshThreadData; 