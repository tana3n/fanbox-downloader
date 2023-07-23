// fanbox-downloaer

// Unique Functions
// Get Page Information
function getfanboxName() {
  return document.querySelector("h1 a").text;
}

function getfanboxID() {
  if (location.hostname == "www.fanbox.cc") {
    s = location.pathname.match(/(?<=@)(.*)(?=\/posts)/); //@以降を取得
    return s[0];
  } else {
    return location.hostname.replace(".fanbox.cc", ""); //こっちはサブドメインを取得すればOK
  }
}

function getPageID() {
  pageID = location.pathname.match(/(?<=\/posts\/)[0-9]*/);
  return pageID[0];
}

function getTitle() {
  return document
    .querySelector("article h1")
    .textContent.replace(/\u002f/g, "／");
}

function getDiff() {
  let a = document.querySelector(".DraftEditor-root");
  if (a == null) {
    a = document
      .querySelector("article")
      .querySelectorAll(".PostImage__Anchor-sc-xvj0xk-1");
  } else {
    a = document
      .querySelector(".DraftEditor-root")
      .querySelectorAll(".PostImage__Wrapper-sc-xvj0xk-0");
  }
  a = a.length;
  return ("" + a).padStart(2, "0");
}

function getSrcURL(getnum) {
  let a = document.querySelector(".DraftEditor-root"); //figure
  if (a == null) {
    a = document
      .querySelector("article")
      .querySelectorAll(".PostImage__Anchor-sc-xvj0xk-1")
      [getnum].getAttribute("href");
  } else {
    a = document
      .querySelector(".DraftEditor-root")
      .querySelectorAll(".PostImage__Wrapper-sc-xvj0xk-0")
      [getnum].querySelector("a")
      .getAttribute("href");
  }
  return a;
}

function getText() {
  if (document.querySelector(".sc-16ys89y-0")) {
    text = document.querySelector(".sc-16ys89y-0").innerHTML;
  } else if (document.querySelector(".Body__PostBodyText-sc-16ys89y-0")) {
    text = document.querySelector(".Body__PostBodyText-sc-16ys89y-0").innerHTML;
  } else if (
    document.querySelectorAll(
      ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
    )
  ) {
    s = document.querySelectorAll(
      ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
    );
    const texts = [];

    for (var num = 0; num < s.length; num++) {
      texts.push(s[num].textContent);
    }
    text = texts.join("\n");
  }
  return text;
}
function dlText() {
  if (getText() != "") {
    const blob2 = new Blob([getText()], { type: "text/plain" });
    const filename = getFilename(-1) + ".txt";
    if (isChrominum() == true) {
      console.log("SetFlag: Chrominum");
      const blob3 = URL.createObjectURL(blob2);
      console.log(blob3);
      getFile("download", blob3, filename);
      //URL.revokeObjectURL(blob3)
    } else {
      chrome.runtime.sendMessage({
        type: "blob",
        blob: blob2,
        filename: filename,
      });
    }
  }
}

async function dlAttr() {
  Attr = document.querySelectorAll("[download]");
  if (Attr != null) {
    for (var num = 0; num < Attr.length; num++) {
      s2 = Attr[num].getAttribute("href");
      t = Attr[num].getAttribute("download");
      query = getFilename(-2) + "." + getExttype(s2);
      filename = query.replaceAll("$AttrName$", t);
      getFile("download", s2, filename);
      await new Promise((s) => {
        setTimeout(s, 150);
      });
    }
  }
}

async function dlimg() {
  diff = getDiff();
  for (var num = 0; num < diff; num++) {
    const url = getSrcURL(num);
    console.log(url);
    const filename = getFilename(num) + "." + getExttype(url);
    console.log(filename);
    await new Promise((s) => {
      getFile("download", url, filename);
      setTimeout(s, 150);
    });
  }
}

function getDate(query, custom) {
  let src = document.querySelector(
    ".styled__PostHeadBottom-sc-1vjtieq-3"
  ).innerText;
  replaced = /(\d+)年(\d+)月(\d+)日 (\d+):(\d+)/.exec(src);
  replaced[2] = parseInt(replaced[2]) - 1;
  if (custom & (replaced[4] < 4)) {
    //28h表記 4時前ならば1日前にずらして+24hする
    replaced[3] = parseInt(replaced[3]) - 1;
    replaced[4] = parseInt(replaced[4]) + 24;
  }
  dates = new Date(replaced[1], replaced[2], replaced[3]); //補正用
  replaced = [
    replaced[0],
    dates.getFullYear().toString(),
    (parseInt(dates.getMonth()) + 1).toString(),
    dates.getDate().toString(),
    replaced[4].toString(),
    replaced[5].toString(),
  ];
  return replaced[query].padStart(2, "0");
}

// Common Functions
//
function getFilename2(query) {
  query = query.replaceAll("$fanboxname$", getfanboxName());
  query = query.replaceAll("$fanboxID$", getfanboxID());
  query = query.replaceAll("$Title$", getTitle());
  query = query.replaceAll("$PageID$", getPageID());
  query = query.replaceAll("$YYYY$", getDate(1));
  query = query.replaceAll("$YY$", getDate(1).slice(-2));
  query = query.replaceAll("$MM$", getDate(2));
  query = query.replaceAll("$DD$", getDate(3));
  query = query.replaceAll("$hh$", getDate(4));
  query = query.replaceAll("$YYYY28$", getDate(1, true));
  query = query.replaceAll("$YY28$", getDate(1, true).slice(-2));
  query = query.replaceAll("$MM28$", getDate(2, true));
  query = query.replaceAll("$DD28$", getDate(3, true));
  query = query.replaceAll("$hh28$", getDate(4, true));
  query = query.replaceAll("$mm$", getDate(5));
  query = query.replaceAll("$NYYYY28$", getDateNow(1, true));
  query = query.replaceAll("$NYY28$", getDateNow(1, true).slice(-2));
  query = query.replaceAll("$NMM28$", getDateNow(2, true));
  query = query.replaceAll("$NDD28$", getDateNow(3, true));
  query = query.replaceAll("$Nhh28$", getDateNow(4, true));
  query = query.replaceAll("$Nmm$", getDateNow(5));
  query = query.replaceAll(":", "：");
  return query.replaceAll("///g", "／");
}

function getFilename(diff) {
  let query;
  if ((getDiff() > 1) & (diff >= 0)) {
    query = getFilename2(macro2);
    query = query.replaceAll("$DiffCount$", getDiff());
    query = query.replaceAll("$Diff$", ("" + (diff + 1)).padStart(2, "0"));
  } else if ((getDiff() == 1) | (diff == -1)) {
    query = getFilename2(macro);
  } else if (diff == -2) {
    query = getFilename2(macro3);
  }
  return query;
}

// URIから判定する場合
function getExttype(URL) {
  return URL.split("/").reverse()[0].split(".")[1];
}

function getFile(type, url, filename) {
  chrome.runtime.sendMessage({
    type: type,
    url: url,
    filename: filename,
  });
}

function isChrominum() {
  const s = chrome.runtime.getURL("");
  if (/chrome/.test(s) == true) {
    return true;
  } else return false;
}

function getDateNow(query, custom) {
  dateNow = new Date(Date.now());
  //dateNow = new Date (2023,7 -1 ,1,0,15,23);

  replaced = [
    dateNow,
    dateNow.getFullYear().toString(),
    (dateNow.getMonth() + 1).toString(),
    dateNow.getDate().toString(),
    dateNow.getHours().toString(),
    dateNow.getMinutes().toString(),
  ];
  if (custom & (replaced[4] < 4)) {
    //28h表記 4時前ならば1日前にずらして本来の時間+24hにする
    // 年月日はDateの補正を利用する
    // 日時は純粋に進めればOKなので出力値を上書き
    customDate = new Date(replaced[1], replaced[2] - 1, replaced[3] - 1); //補正用
    replaced = [
      dateNow, //歪んだ値はそのまま入らない（元のまま）
      customDate.getFullYear().toString(),
      (customDate.getMonth() + 1).toString(),
      customDate.getDate().toString(),
      (dateNow.getHours() + 24).toString(),
      dateNow.getMinutes().toString(),
    ];
  }
  return replaced[query].padStart(2, "0");
}
async function main(str) {
  globalThis.macro = str.macro;
  globalThis.macro2 = str.macro2;
  globalThis.macro3 = str.macro3;

  dlimg();

  if (str.savetext == true) {
    console.log("Enabled SaveText");
    dlText();
  }
  if (str.saveattr == true) {
    console.log("Enabled SaveAttributes");
    dlAttr();
  }
}

chrome.runtime.onMessage.addListener(function (request, sender) {
  chrome.storage.local.get(
    ["savetext", "saveattr", "macro", "macro2", "macro3"],
    function (str) {
      if (str.macro == undefined) {
        alert("fanbox-downloader：オプションから設定を行ってください");
        return chrome.runtime.sendMessage({ type: "set" });
      } else {
        main(str);
      }
    }
  );
});
