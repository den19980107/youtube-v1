//socket連線的部分
var socket = io.connect('http://localhost:3000');

//--------------

var player;

function onYouTubePlayerAPIReady() {
  player = new YT.Player('ytplayer', {
    height: '360',
    width: '640',
    videoId: 'LQYV0jWxwII',
    events: {
      'onReady': onPlayerReady //當api準備好時 發出event 呼叫onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
  var pausebtn = document.getElementById('pause');
  var playbtn = document.getElementById('play');
  var slider = document.getElementById('myRange');
  var myTimeLine = document.getElementById('myTimeLine');
  var timelong = player.getDuration();
  var vtime;
  var vedioInfo = {
    state: 0, //1 = play 0 = pause
    time: 0
  }
  playbtn.addEventListener('click', function() {
    console.log('play');
    player.playVideo();
    timelong = player.getDuration();
    vedioInfo.state = 1;
    vedioInfo.time = vtime;
    socket.emit("message", vedioInfo);

  })

  pausebtn.addEventListener('click', function() {
    console.log('pause');
    player.pauseVideo();
    vedioInfo.state = 0;
    vedioInfo.time = vtime;
    socket.emit("message", vedioInfo);
  })

  slider.addEventListener('change', function() {
    //要把0~100的值轉變到0～影片長度
    vtime = (slider.value / 100) * timelong;
    player.seekTo(vtime); //seekTo把影片拖到指定的時機點
    vedioInfo.time = vtime;
    socket.emit("message", vedioInfo);
  })


  getTime = function() {
    vtime = player.getCurrentTime();
    var nowTime = (player.getCurrentTime() / timelong) * 100; //取得目前時間
    slider.value = nowTime; //將目前間設定到slider上
  }
  setInterval("getTime()", "1000"); //每隔1秒呼叫getTime一次

}

//listen for events
socket.on('message', function(obj) {
  if (obj.state == 0) { //vedio stop
    player.pauseVideo();
  }
  if (obj.state == 1) { //vedio play
    player.playVideo();
  }
  player.seekTo(obj.time);
});
//listen for events