$(function(){
    arrMusicID = [1091088,27471609,26875199,27723552,26090100,26090100,26193921,501467597,19282045,306709,5299097,27471615,31062378,139443];  //musicID array
    musicID = Math.floor(Math.random()*(arrMusicID.length)) //get a ran num as index
    $('body').css('height',document.documentElement.clientHeight -5);

    if (!Number.isInteger(arrMusicID[musicID])) return; // load failed, bye~

    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=' +arrMusicID[musicID]+ '&auto=1&height=66"></iframe>
});
