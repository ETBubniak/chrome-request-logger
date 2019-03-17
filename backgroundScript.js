// add event listener for a web requestDetails.

function doesInitiatorMatchTarget(request){
    const regex = /\w+.(com)/
    const initiatorDomain = request.initiator.match(regex);
    const initiatorMatchesTarget = request.url.includes(initiatorDomain[0]);
    return initiatorMatchesTarget;
}

function getCurrentTabId(){
    return new Promise(function(resolve, reject){
        chrome.tabs.query({"active": true, "currentWindow": true}, (tab) => {
            if (tab.length > 0 ){
                resolve(tab[0].id);
            }
            else {
                reject("No match");
            }
        });
    });
}

function isPartOfCurrentTab(request){
    return new Promise((resolve, reject) => {
        getCurrentTabId()
        .then(function resolved(currentTabId){
            if (request.tabId === currentTabId){
                resolve(true);
            }
            else {
                resolve(false);
            }
        }, function rejected(err){
            resolve(false);
        });
    });
}

const callback = async function(request){
    const partOfCurrentTab = await isPartOfCurrentTab(request);
    if (partOfCurrentTab) {
        const initiatorMatchesTarget = doesInitiatorMatchTarget(request);
        if ((!initiatorMatchesTarget)){
            console.log(request);
        }
    }

};

const filter = {
    "urls": ["http://*/*", "https://*/*"]
};

chrome.webRequest.onCompleted.addListener(callback, filter);