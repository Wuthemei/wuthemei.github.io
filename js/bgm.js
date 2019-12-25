$(function(){
    arrMusicID = [4394416,1091088,26875199,27723552,26090100,26193921,306709,5299097,31062378,139443,29984086,155924,432430716];  //musicID array
    musicID = Math.floor(Math.random()*(arrMusicID.length)) //get a ran num as index
    $('body').css('height',document.documentElement.clientHeight -5);

    if (!Number.isInteger(arrMusicID[musicID])) return; // load failed, bye~
    var iframe = document.createElement('iframe');
    iframe.id="bgm";
    iframe.style = "position: absolute; top: 0px; left: 0px; border: 0px;";
    iframe.src = '//music.163.com/outchain/player?type=2&id=' +arrMusicID[musicID]+ '&auto=1&height=32';
    console.log(iframe.src)
    iframe.frameborder="no";
    iframe.marginwidth="0";
    iframe.marginheight="0";
    iframe.width=250;
    iframe.height=52;
    document.body.appendChild(iframe);
});
