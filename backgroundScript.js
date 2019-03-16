// add event listener for a web request.



const callback = function(details){
    console.log(details);
}

const filter = {
    "urls": ["http://*/*", "https://*/*"]
};

chrome.webRequest.onBeforeRequest.addListener(callback, filter);

function storeToDB(request, currentURL) {
	chrome.storage.sync.set({currentURL: request}, function(){
		message('Request has been saved');
    });
};

function getAllFromDB() {
	chrome.storage.sync.get(null, function(contents) {
		return contents;
	});
};