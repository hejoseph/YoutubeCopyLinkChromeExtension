const redSquare = document.createElement('div');
redSquare.style.width = '100px';
redSquare.style.height = '100px';
redSquare.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Red color with 50% opacity
redSquare.style.position = 'absolute';
redSquare.style.top = '50px';
redSquare.style.left = '50px';
redSquare.style.zIndex = '9999';

// Append the transparent red square to the body of the page
document.body.appendChild(redSquare);

var videoIds = [];
chrome.storage.sync.get(['ids'], function (result) {
	videoIds = result.ids.split("\n");
});

// Wait for the DOMContentLoaded event before executing the content script
window.addEventListener('load', function() {
	// const videoIds = ["QG_QAC6SsTA", "alOjjATs6AA", "yetAnotherVideoId"];
	videoIds.forEach(videoId => {
	    // Find the <a> tag with the href ending with the video ID
	    const thumbnailLinks = document.querySelectorAll(`a[href*="${videoId}"]`); // Replace "alOjjATs6AA" with the actual video ID

	    // Check if any matching links are found
	    if (thumbnailLinks.length > 0) {
	        // Get the first matching link (assuming there's only one)
	        const thumbnailLink = thumbnailLinks[0];

	        // Create a transparent red square element
	        const redSquare = document.createElement('div');
	        redSquare.style.width = '50px'; // Adjust the size as needed
	        redSquare.style.height = '50px'; // Adjust the size as needed
	        redSquare.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Red color with 50% opacity
	        redSquare.style.position = 'absolute';
	        redSquare.style.top = '0';
	        redSquare.style.left = '0';
	        redSquare.style.zIndex = '9999';

	        // Append the transparent red square to the thumbnail link
	        thumbnailLink.appendChild(redSquare);
	    }
	});
});
