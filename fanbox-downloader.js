var getSrcURL, getExttype, getDiff, getFile, getTitle, getPageID, getfanboxName, getfanboxID
var getFilename, getFilename2, dl, dlText, getText, dlAttr//, getStorage

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

getFilename2 = function(query){
    query=query.replaceAll('$fanboxname$',getfanboxName())
    query=query.replaceAll('$fanboxID$',getfanboxID())
    query=query.replaceAll('$Title$',getTitle())
    query=query.replaceAll('$PageID$',getPageID())
    return query.replaceAll('/\//g',"／")
}

getFilename = function(diff){
    if (getDiff() > 1 & diff >= 0) {
        var query=getFilename2(macro2)
        query=query.replaceAll('$DiffCount$',getDiff())
        query=query.replaceAll('$Diff$',(''+(diff+1)).padStart(2,'0'))
        return query    
    } else if (getDiff()==1 |diff == -1) {
        query = getFilename2(macro)
    } else if (diff == -2) {
        query = getFilename2(macro3)

    }
    return query
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
    if (document.querySelector('.sc-16ys89y-0.jWzPaa')) {
        text = document.querySelector('.sc-16ys89y-0.jWzPaa').innerHTML
    } else {
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
    if(getText()!=""){
        const blob2 = new Blob([getText()], { type: "text/plain" });
        const blob3 = URL.createObjectURL(blob2)
        var filename =getFilename(-1) + ".txt";
        getFile(blob3,filename)
        URL.revokeObjectURL(blob2)
        console.log(filename)
    }
}

dlAttr = function(){
    Attr = document.querySelectorAll('[download]')
    if (Attr!= null){
        for (var num = 0; num<Attr.length; num++){
        s2 = Attr[num].getAttribute('href')
        t = Attr[num].getAttribute('download')
        query=getFilename(-2) + '.' + getExttype(s2)
        filename = query.replaceAll('$AttrName$',t)
        getFile(s2,filename)
        }
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

chrome.runtime.onMessage.addListener(function(request,sender){
    chrome.storage.local.get(['savetext','saveattr', 'macro', 'macro2', 'macro3'],function(str){
        globalThis.macro=str.macro
        globalThis.macro2=str.macro2
        globalThis.macro3=str.macro3
        dl()
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