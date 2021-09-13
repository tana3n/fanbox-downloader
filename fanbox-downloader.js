var getSrcURL, getExttype, getDiff, getFile, getTitle, getPageID, getfanboxName, getfanboxID
var getFilename, dl, dlText, getText, dlAttr//, getStorage

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

getFilename = function(diff){
    //ここをなんとかしたい2020
    query="fanbox-downloader/$fanboxname$($fanboxID$) - $Title$($PageID$)"//ここはstorage.sync.getで運用したいところ
    if(getDiff() > 1){
        query="fanbox-downloader/$fanboxname$($fanboxID$) - $Title$($PageID$) [$Diff$ - $DiffCount$]"
    }

    query=query.replace('$fanboxname$',getfanboxName())
    query=query.replace('$fanboxID$',getfanboxID())
    query=query.replace('$Title$',getTitle())
    query=query.replace('$PageID$',getPageID())
    if(getDiff() > 1){
        query=query.replace('$DiffCount$',getDiff())
        query=query.replace('$Diff$',(''+(diff+1)).padStart(2,'0'))
    }
    return query.replace('/\//g',"／")
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
    if (document.querySelector('.sc-16ys89y-0.jWzPaa')){
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
    for(var num = 0; num < diff ; num++){
        var url = getSrcURL(num);
        var filename = getFilename(num) + '.' + getExttype(url);
        console.log(filename);
        console.log(url);
        getFile(url,filename);
    }
}
function save_settings(){
    var txt = false//document.getElementById(text).value
    var attr = false//document.getElementById(attr).value
    chrome.storage.local.set({savetext: txt, saveattr: attr}, function() {
        console.log('Value is set to ' + txt + " and " +attr);
  });
}

//save_settings()

chrome.runtime.onMessage.addListener(function(request,sender){
    dl()
    chrome.storage.local.get(['savetext','saveattr'],function(str){
        console.log(str.savetext + " , " + str.savetext)
        if(str.savetext !== false){
            console.log("Enabled SaveText")
            dlText()
        }
        if(str.saveattr !== false){
            console.log("Enabled SaveAttributes")
            dlAttr()
        }
    })
}
)