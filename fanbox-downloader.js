var getSrcURL, getExttype, getDiff, getFile, dl, dlText, getText, dlAttr
var getTitle, getPageID, getFilename, getfanboxName, getfanboxID

getfanboxName = function(){
    return document.querySelector('h1 a').text
}
getfanboxID　=　function(){
    if　(location.hostname==("www.fanbox.cc")){
        s=location.pathname.match(/(?<=@)(.*)(?=\/posts)/)//@以降を取得
        return s[0]
    }else{
        return location.hostname.replace('.fanbox.cc','')//こっちはサブドメインを取得すればOK
    }
}
getPageID = function(){
    s=location.pathname.match(/(?<=\/posts\/)[0-9]*/)
    return s[0]
}
getTitle = function(){
    return document.querySelector("article h1").textContent.replace(/\u002f/g, '／')
}

getFilename = function(){
    //ここをなんとかしたい2020
    s=getfanboxName()+String('(')+getfanboxID()+String(') - ')+getTitle()+String('(')+getPageID()+String(')')
    s=s.replace('/\//g',"／")
    return "fanbox-downloader/" + s
}
getExttype = function(URL){
    return URL.split("/").reverse()[0].split('.')[1];
}

getDiff = function(){
    a=document.querySelector('.sc-1vjtieq-15.ctPdwn').querySelectorAll(".bej7gp-1.fsXvuu").length
    return (''+a).padStart(2,'0')
}

getSrcURL = function(getnum){
    return document.querySelector('.sc-1vjtieq-15.ctPdwn').querySelectorAll(".bej7gp-1.fsXvuu")[getnum].querySelector('a').getAttribute('href')
}

getText = function(){
    if (document.querySelector('.sc-16ys89y-0.jWzPaa')!=""){
        text = document.querySelector('.sc-16ys89y-0.jWzPaa').innerHTML
    }else{
        s=document.querySelector('.sc-1vjtieq-15.ctPdwn').querySelectorAll(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr")
        const texts=[]
        for(var num = 0; num < s.length ; num++){
            texts.push(s[num].textContent);
        }
        text = texts.join('\n');
    }
    return text
}

dlText = function(){
    //console.log(getText())
    if(getText()!=""){
        const blob2 = new Blob([getText()], { type: "text/plain" });
        const blob3 = URL.createObjectURL(blob2)
        var filename =getFilename() + ".txt";
        getFile(blob3,filename)
        URL.revokeObjectURL(blob2)
        console.log(filename)
    }
}

dlAttr = function(){
    try {
        Attr = document.querySelector('[download]')
        s2 = Attr.getAttribute('href')
        t = Attr.getAttribute('download')
        filename=getFilename()+" - " + t +  "." + getExttype(s2)
        getFile(s2,filename)
    }
    catch(e){
        //console.log("Attribute URL not Found")
        //もう少しいい書き方ありそう
    }
}

getFile = function(url, filename) {
    return chrome.extension.sendMessage({
     type: 'download',
     url: url,
     filename: filename
    });
}

dl = function(){
    var diff = getDiff();
    console.log(diff);
    for(var num = 0; num < diff ; num++){
        var filename = getFilename(num);
        if(diff > 1){//差分が存在する時のリネーム処理
            filename = filename + String(' [')+ (''+(num+1)).padStart(2,'0') + String(' - ') + getDiff() + String(']')
        }
        var url = getSrcURL(num);
        filename = filename + '.' + getExttype(url)
        console.log(filename);
        console.log(url);
        getFile(url,filename);
    }
}

  chrome.runtime.onMessage.addListener(function(request,sender){
    dl()
    dlText()
    dlAttr()
  }
)