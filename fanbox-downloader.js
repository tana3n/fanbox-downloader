function getfanboxName(){
    return document.querySelector('h1 a').text;
}
function getfanboxID(){
    if (location.hostname==("www.fanbox.cc")){
        s=location.pathname.match(/(?<=@)(.*)(?=\/posts)/);//@以降を取得
        return s[0];
    }else{
        return location.hostname.replace('.fanbox.cc','');//こっちはサブドメインを取得すればOK
    }
}
function getPageID(){
    pageID=location.pathname.match(/(?<=\/posts\/)[0-9]*/);
    return pageID[0];
}
function getTitle(){
    return document.querySelector("article h1").textContent.replace(/\u002f/g, '／');
}

function getFilename2(query){
    query=query.replaceAll('$fanboxname$',getfanboxName());
    query=query.replaceAll('$fanboxID$',getfanboxID());
    query=query.replaceAll('$Title$',getTitle());
    query=query.replaceAll('$PageID$',getPageID());
    query=query.replaceAll('$YYYY$',getDate(1));
    query=query.replaceAll('$YY$',getDate(1).slice(-2));
    query=query.replaceAll('$MM$',getDate(2));
    query=query.replaceAll('$DD$',getDate(3));
    query=query.replaceAll('$hh$',getDate(4));
    query=query.replaceAll('$YYYY28$',getDate(1,true));
    query=query.replaceAll('$YY28$',getDate(1,true).slice(-2));
    query=query.replaceAll('$MM28$',getDate(2,true));
    query=query.replaceAll('$DD28$',getDate(3,true));
    query=query.replaceAll('$hh28$',getDate(4,true));
    query=query.replaceAll('$mm$',getDate(5));
    query=query.replaceAll(':',"：");
    return query.replaceAll('/\//g',"／");
}

function getFilename(diff){
    if (getDiff() > 1 & diff >= 0) {
        var query=getFilename2(macro2);
        query=query.replaceAll('$DiffCount$',getDiff());
        query=query.replaceAll('$Diff$',(''+(diff+1)).padStart(2,'0'));
    } else if (getDiff()==1 |diff == -1) {
        query = getFilename2(macro);
    } else if (diff == -2) {
        query = getFilename2(macro3);
    }
    return query;
}

function getDate(query, custom){
    src = document.querySelector(".sc-1vjtieq-3.emomCe").innerText;
    replaced = /(\d+)年(\d+)月(\d+)日 (\d+):(\d+)/.exec(src);
    if( (custom == true) & (replaced[4] < 4) ){//28h表記 4時前ならば1日前にずらして+24hする
            replaced[3] = parseInt(replaced[3]) - 1;
            replaced[4] = parseInt(replaced[4]) + 24;
    }
    dates = new Date(replaced[1],replaced[2],replaced[3]);//補正用
    replaced =[
        replaced[0],
        dates.getFullYear().toString(),
        dates.getMonth().toString(),
        dates.getDate().toString(),
        replaced[4].toString(),
        replaced[5].toString()
        ];
    console.log(replaced[query])
    return replaced[query].padStart(2,'0');
}
function getExttype(URL){
    return URL.split("/").reverse()[0].split('.')[1];
}

function getDiff(){
    a=document.querySelector('.sc-1vjtieq-5').querySelectorAll('.sc-xvj0xk-1').length;
    return (''+a).padStart(2,'0');
}

function getSrcURL(getnum){
    return  document.querySelector('.sc-1vjtieq-5').querySelectorAll('.sc-xvj0xk-1')[getnum].getAttribute('href');
}

function getText(){
    if (document.querySelector('.sc-16ys89y-0')) {
        text = document.querySelector('.sc-16ys89y-0').innerHTML;
    } else if(document.querySelectorAll(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr")){
        s=document.querySelectorAll(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr");
        const texts=[];
        
        for(var num = 0; num < s.length ; num++){
            texts.push(s[num].textContent);
        }
        text = texts.join('\n');
    }
    return text;
}

function dlText(){
    if(getText()!=""){
        const blob2 = new Blob([getText()], { type: "text/plain" });
        var filename = getFilename(-1) + ".txt";
        if (isChrominum() == true ){
            console.log("SetFlag: Chrominum");
            const blob3 = URL.createObjectURL(blob2);
            console.log(blob3);
            getFile("download",blob3,filename);
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
    Attr = document.querySelectorAll('[download]');
    if (Attr!= null){
        for (var num = 0; num<Attr.length; num++){
            s2 = Attr[num].getAttribute('href');
            t = Attr[num].getAttribute('download');
            query=getFilename(-2) + '.' + getExttype(s2);
            filename = query.replaceAll('$AttrName$',t);
            getFile("download", s2, filename);
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
        return true;
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
            globalThis.macro=str.macro;
            globalThis.macro2=str.macro2;
            globalThis.macro3=str.macro3;
            dl();
            if(str.savetext == true){
                console.log("Enabled SaveText");
                dlText();
            }
            if(str.saveattr == true){
                console.log("Enabled SaveAttributes");
                dlAttr();
            }
        }
    })
}
)