function getfanboxName(){
    return document.querySelector('h1 a').text
}
function getfanboxID(){
    if　(location.hostname==("www.fanbox.cc")){
        s=location.pathname.match(/(?<=@)(.*)(?=\/posts)/)//@以降を取得
        return s[0]
    }else{
        return location.hostname.replace('.fanbox.cc','')//こっちはサブドメインを取得すればOK
    }
}
function getPageID(){
    s=location.pathname.match(/(?<=\/posts\/)[0-9]*/)
    return s[0]
}
function getTitle(){
    return document.querySelector("article h1").textContent.replace(/\u002f/g, '／')
}

function getFilename2(query){
    query=query.replaceAll('$fanboxname$',getfanboxName())
    query=query.replaceAll('$fanboxID$',getfanboxID())
    query=query.replaceAll('$Title$',getTitle())
    query=query.replaceAll('$PageID$',getPageID())
    query=query.replaceAll(':',"：")
    return query.replaceAll('/\//g',"／")
}

function getFilename(diff){
    if (getDiff() > 1 & diff >= 0) {
        var query=getFilename2(macro2)
        query=query.replaceAll('$DiffCount$',getDiff())
        query=query.replaceAll('$Diff$',(''+(diff+1)).padStart(2,'0'))
    } else if (getDiff()==1 |diff == -1) {
        query = getFilename2(macro)
    } else if (diff == -2) {
        query = getFilename2(macro3)
    }
    return query
}

function getExttype(URL){
    return URL.split("/").reverse()[0].split('.')[1];
}

function getDiff(){
    a=document.querySelector('.sc-1vjtieq-5').querySelectorAll('.sc-xvj0xk-1').length
    return (''+a).padStart(2,'0')
}

function getSrcURL(getnum){
    return  document.querySelector('.sc-1vjtieq-5').querySelectorAll('.sc-xvj0xk-1')[getnum].getAttribute('href')
}

function getText(){
    if (document.querySelector('.sc-16ys89y-0')) {
        text = document.querySelector('.sc-16ys89y-0').innerHTML
    } else {
        s=document.querySelector('.sc-1vjtieq-1').querySelectorAll(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr")
        const texts=[]
        for(var num = 0; num < s.length ; num++){
            texts.push(s[num].textContent);
        }
        text = texts.join('\n');
    }
    return text
}

function dlText(){
    if(getText()!=""){
        const blob2 = new Blob([getText()], { type: "text/plain" });
        var filename = getFilename(-1) + ".txt";
        if (isChrominum() == true ){
            console.log("SetFlag: Chrominum")
            const blob3 = URL.createObjectURL(blob2)
            console.log(blob3)
            getFile("download",blob3,filename)
            //URL.revokeObjectURL(blob3)
        } else {
            chrome.runtime.sendMessage({
                type: "blob",
                blob: blob2,
                filename: filename
               });
        } 

    }
}

function dlAttr(){
    Attr = document.querySelectorAll('[download]')
    if (Attr!= null){
        for (var num = 0; num<Attr.length; num++){
        s2 = Attr[num].getAttribute('href')
        t = Attr[num].getAttribute('download')
        query=getFilename(-2) + '.' + getExttype(s2)
        filename = query.replaceAll('$AttrName$',t)
        getFile("download", s2, filename)
        }
    }
}

function getFile(type, url, filename){
    return chrome.runtime.sendMessage({
     type: type,
     url: url,
     filename: filename
    });
}

function dl(){
    var diff = getDiff();
    for(var num = 0; num < diff ; num++){
        var url = getSrcURL(num);
        var filename = getFilename(num) + '.' + getExttype(url);
        console.log(filename);
        console.log(url);
        getFile("download",url,filename);
    }
}


function isChrominum(){
    var s = chrome.runtime.getURL("")
    if ( /chrome/.test(s) == true ) {
        return true
    }
    else return false;
}


chrome.runtime.onMessage.addListener(function(request,sender){
    chrome.storage.local.get(['savetext','saveattr', 'macro', 'macro2', 'macro3'],function(str){
        if (str.macro==undefined) {
            alert("fanbox-downloader：オプションから設定を行ってください");    
            return chrome.runtime.sendMessage({type: "set"});
        } 
        else{
            globalThis.macro=str.macro
            globalThis.macro2=str.macro2
            globalThis.macro3=str.macro3
            dl()
            if(str.savetext == true){
                console.log("Enabled SaveText")
                dlText()
            }
            if(str.saveattr == true){
                console.log("Enabled SaveAttributes")
                dlAttr()
            }
        }
    })
}
)