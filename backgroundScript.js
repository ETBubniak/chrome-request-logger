// add event listener for a web requestDetails.

function postJsonObject(formattedJson){
    var xhr = new XMLHttpRequest();
    var url = "datadiarrhea.net/collector";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
        }
    }
    var data = JSON.stringify({formattedJson});
    xhr.send(data);
}

function formatAsJson(initiator, target){
    const collectorRegex = /(?<=(https):\/\/)(www.)?\S+\//;
    const requestRegex = /\w+(?=.com)/;
    const formattedJson = {
        "collector_name": initiator,
        "request_source": target
    };    
    return formattedJson;
}

function doesInitiatorMatchTarget(request){
    const regex = /\w+.(com)/;
    if (request.hasOwnProperty("initiator")){
        const initiatorDomain = request.initiator.match(regex);
        const initiatorMatchesTarget = request.url.includes(initiatorDomain[0]);
        return initiatorMatchesTarget;        
    }
    else {
        return false;
    }
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

function getCurrentTabURL(){
    return new Promise(function(resolve, reject){
        chrome.tabs.query({"active": true, "currentWindow": true}, (tab) => {
            if (tab.length > 0 ){
                resolve(tab[0].url);
            }
            else {
                reject("Failed for some reason");
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
            getCurrentTabURL().then((currentURL) => {
                const jsonToPost = formatAsJson(request.initiator, request.url);
                postJsonObject(jsonToPost);
                storeToDB(request, currentURL);
            }
            );
        }
    }

};

const filter = {
    "urls": ["http://*/*", "https://*/*"]
};

function getObject(currentKey){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(currentKey, function callback(result){
            resolve(result)
        });
    });
}

function storeToDB(request, currentURL) {
    const dataObj = {};
    const currentKey = [currentURL];
    getObject(currentKey)
    .then(function resolved(result) {
        if (result != null){
            var array = (result[currentURL] ? result[currentURL]:[]);
            array.push(request);
            var jsonObj = {};
            jsonObj[currentURL] = array;
            chrome.storage.sync.set(jsonObj, function() {
                console.log("Saved a new array item");
            });
        } else {
            dataObj = {currentURL:[request]};
            chrome.storage.sync.set(dataObj, function(){
            if(!chrome.runtime.lastError){
                console.log('Request has been saved');
            }
        });
        }
    });    
};

function clearAllFromDB(){
    chrome.storage.sync.clear();
}

function getAllFromDB() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(function(contents) {
            console.log(contents)
            if (contents){
                resolve(contents);
            }
            else {
                reject("contents null/undefined for some reason");
            }
        });
    });
};

chrome.webRequest.onCompleted.addListener(callback, filter);