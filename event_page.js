  //コンテキスト表示
  chrome.contextMenus.create({
    'id' : "mkcM",
    'title' : 'fanbox-downloader',
    'type' : 'normal',
    "contexts" : ["page"],
    "documentUrlPatterns" : ["https://*.fanbox.cc/posts/*","https://*.fanbox.cc/*/posts/*"]
    /*,
    'onclick' : function(info){
      chrome.extention.sendMessage({type: 'get'});
    }*/
  });
//選択時のイベント
chrome.contextMenus.onClicked.addListener(function (info,tab) {
  console.log('sendMessage')
 // if (info.menuItemId === 'nkcM'){
  chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id,{message: 'getImage'})
  console.log('sentMessage')
});
  
  //}
});

//とりあえずこれで受けられてるのでこのままで
chrome.extension.onMessage.addListener(function(request) {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename
    });
});