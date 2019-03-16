// add event listener for a web request.



const callback = function(details){
    console.log(details);
}

const filter = {
    "urls": new Array("http://*/*", "https://*/*")
};

chrome.webRequest.onBeforeRequest.addListener(callback, filter);