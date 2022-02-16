//コンテキスト表示
chrome.contextMenus.create({
    'id' : "fbdl",
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
  chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id,{message: 'getImage'})
  });
});

//直リンに出来ない物は一度storageに投げた方がよさそう
chrome.runtime.onMessage.addListener(function(request) {
  if(request.type=="download"){
    console.log(request.filename)
    download(request.url,request.filename)
    }
  else if(request.type=="blob"){

    const blob = URL.createObjectURL(request.blob)
    download(blob,request.filename)
  }
  else if(request.type=="set"){
    chrome.runtime.openOptionsPage();//background.jsから発火する必要がある
  }
  return true;
});

function download(url,filename){
  chrome.downloads.download({
    url: url,
    filename: filename
    });
}
