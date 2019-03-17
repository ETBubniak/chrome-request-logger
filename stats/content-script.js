chrome.runtime.onMessage.addListener(function (request,sender,sendResponse){
	if(request.action == "getDOM"){
		console.log(" receiving request ");
		sendResponse({dom:"some document"});
	}
});