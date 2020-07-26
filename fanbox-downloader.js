var getSrcURL,　getExttype,　getDiff, getFile, BT, dl;
var getTitle, getPageID, getFilename, getDiffmacro, getfbName,getfbID
getfbName = function(){
return document.querySelector('h1 a').text
}
getfbID　=　function(){
if　(location.hostname==("www.fanbox.cc")){
    s=location.pathname.match(/(?<=@)(.*)(?=\/posts)/)
    return s[0]    
}
    //@以降を取得
else{
    return location.hostname.replace('.fanbox.cc','')
    //こっちはfanbox.cc以前を取得すればOK
}
}
getPageID = function(){
    s=location.pathname.match(/(?<=\/posts\/)[0-9]*/)
    return s[0]
}

getTitle = function(){
    return document.querySelector("article h1").textContent.replace(/\u002f/g, '／')
}

getFilename = function(getnum){
    //ここをなんとかしたい2020
    s=getfbName()+String('(')+getfbID()+String(') - ')+getTitle()+String('(')+getPageID()+String(')')
    s=s.replace('/\//g',"／")
    if(getDiff()==1){
    return s
    }
    else{
    return String("fanbox-download/")+s+String(' [')+ (''+(getnum+1)).padStart(2,'0') +String(' - ')+getDiff()+String(']')
    }
}
getFile = function(url, filename) {
    return chrome.extension.sendMessage({
     type: 'download',
     url: url,
     filename: filename
    });
}
getDiff = function(){
    a=document.querySelector('.sc-1vjtieq-17.bnlkzd').querySelectorAll(".bej7gp-1.fsXvuu").length
    return (''+a).padStart(2,'0')
}
getSrcURL = function(getnum){
    return document.querySelector('.sc-1vjtieq-17.bnlkzd').querySelectorAll(".bej7gp-1.fsXvuu")[getnum].querySelector('a').getAttribute('href')
}
dl = function(){
    var diff = getDiff();
    for(var num = 0; num < diff ; num++){
      var filename = getFilename(num);
      var url = getSrcURL(num);
      filename = filename + String('.') + url.split("/").reverse()[0].split('.')[1];
      console.log(filename);
      console.log(url);
      getFile(url,filename);
  }
  }
  chrome.runtime.onMessage.addListener(function(request,sender){
    dl()
  }
);