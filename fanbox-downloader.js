var getSrcURL,　getExttype,　getDiff, getFile, BT, dl, dl2, gettext,  getFilename2;
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
    if(getDiff()<=1){
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
    a=document.querySelector('.sc-1vjtieq-15.ctPdwn').querySelectorAll(".bej7gp-1.fsXvuu").length
    return (''+a).padStart(2,'0')
}
getSrcURL = function(getnum){
    return document.querySelector('.sc-1vjtieq-15.ctPdwn').querySelectorAll(".bej7gp-1.fsXvuu")[getnum].querySelector('a').getAttribute('href')
}
dl = function(){
    var diff = getDiff();
    console.log(diff);
    for(var num = 0; num < diff ; num++){
      var filename = getFilename(num);
      var url = getSrcURL(num);
      filename = filename + String('.') + url.split("/").reverse()[0].split('.')[1];
      console.log(filename);
      console.log(url);
      getFile(url,filename);
  }
  }
gettext = function(){
    const texts=[];
    s=document.querySelector('.sc-1vjtieq-15.ctPdwn').querySelectorAll(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr")
    diff=s.length
        for(var num = 0; num < diff ; num++){
        t=s[num].textContent;
        texts.push(t);
}
    texts2=texts.join('\n');
    return texts2
}

getFilename2 = function(getnum){
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

dl2 = function(){
    console.log(gettext())
    const blob2 = new Blob([gettext()], { type: "text/plain" });
    const blob3 = URL.createObjectURL(blob2)
    var filename ="fanbox-download/"+getFilename(0)+".txt";
    console.log(filename)
    getFile(blob3,filename)
    URL.revokeObjectURL(blob2)
}
  chrome.runtime.onMessage.addListener(function(request,sender){
    dl()
    dl2()
  }
);