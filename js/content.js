const greenSquare = document.createElement('div');
greenSquare.style.width = '10px';
greenSquare.style.height = '10px';
greenSquare.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
greenSquare.style.position = 'absolute';
greenSquare.style.top = '50px';
greenSquare.style.left = '50px';
greenSquare.style.zIndex = '9999';

document.body.appendChild(greenSquare);

var ids = [];
chrome.storage.local.get(['ids'], function (result) {
	if(result.ids){
		ids = result.ids;
	}
});

function mark_seen_videos(){
	// document.addEventListener('DOMContentLoaded', function() {
	// window.addEventListener('load', function() {
		// const videoIds = ["QG_QAC6SsTA", "alOjjATs6AA", "yetAnotherVideoId"];
		for(i=ids.length-1;i>=0;i--){
			let videoId = ids[i];
		// videoIds.forEach(videoId => {
		    // Find the <a> tag with the href ending with the video ID
		    const thumbnailLinks = document.querySelectorAll(`a[href*="${videoId}"]`); // Replace "alOjjATs6AA" with the actual video ID

		    // Check if any matching links are found
		    if (thumbnailLinks.length > 0) {
		        // Get the first matching link (assuming there's only one)
		        const thumbnailLink = thumbnailLinks[0];

		        // Create a transparent red square element
		        const square = document.createElement('div');
		        square.style.width = '50px'; // Adjust the size as needed
		        square.style.height = '50px'; // Adjust the size as needed
		        square.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Red color with 50% opacity
		        square.style.position = 'absolute';
		        square.style.top = '0';
		        square.style.left = '0';
		        square.style.zIndex = '9999';

		        // Append the transparent red square to the thumbnail link
		        thumbnailLink.appendChild(square);
		        ids.splice(i,1);
		    }
	   	}
		// });
	// });


}


var functionCalled = false;

function switchBack(){
	functionCalled = false;
}

// Function to run when the DOM content is loaded or changes
function onDOMChange() {

	if (functionCalled || ids.length==0) {
        return;
    }
	functionCalled = true;

	mark_seen_videos();
    // Your code to run after the DOM changes
    console.log("DOM content changed");
    setTimeout(switchBack, 10000);
    // mark_seen_videos();
}

// Callback function for the observer
const mutationCallback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            // If nodes were added or removed, call the function
            onDOMChange();
            break; // Break the loop after the first change
        }
    }
};

// Create a new observer
const observer = new MutationObserver(mutationCallback);

// Start observing the DOM for changes
observer.observe(document.documentElement, { childList: true, subtree: true });