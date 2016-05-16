var clips =[]; 
var lastFrameTimes;
var isDebug = false;

function preload() {
    clips.push(loadSound("music/zheng/tangfu_clip.mp3"));
    clips.push(loadSound("music/zheng/fangsong_clip.mp3"));
    clips.push(loadSound("music/zheng/tagexing_clip.mp3"));
    clips.push(loadSound("music/dizi/bishanxing_clip.mp3"));
    clips.push(loadSound("music/dizi/huimengyouxian_clip.mp3"));
    clips.push(loadSound("music/dizi/zhanghuo_clip.mp3"));
    clips.push(loadSound("music/erhu/longyingsuifeng_clip.mp3"));
    clips.push(loadSound("music/erhu/qinghefeng_clip.mp3"));
    clips.push(loadSound("music/erhu/shengshengman_clip.mp3"));
    clips.push(loadSound("music/sun/shuilongyin_clip.mp3"));
    clips.push(loadSound("music/sun/yuejinzhao_clip.mp3"));
    clips.push(loadSound("music/sun/shuirousheng_clip.mp3"));
    
    lastFrameTimes = new Array(clips.length);
    console.log("Size of last frame times " + lastFrameTimes.length);
 }

// Hide "Loading..." text after clips are loaded
function setup() {
    for (i=0; i<clips.length; i++) {
        if (clips[i].isLoaded()) {
            $("div.listen>div.audio div.btn" + i.toString()).css("display", "block").siblings("p").css("display","none");
            lastFrameTimes[i] = 0;
            console.log("Last Frame Times " + i + " " + lastFrameTimes[i] );
        }
    }
}

function draw() {
    for (i=0; i<clips.length; i++) {
        if (clips[i].isPlaying()) {
            
            if (lastFrameTimes[i] > clips[i].currentTime() && !clips[i].isPaused()) {
                //clips[i].stop(0);
                clips[i].pause();
                lastFrameTimes[i] = 0;
            }
            else {
                lastFrameTimes[i] = clips[i].currentTime();
            }
            
            bottonWhenPlay(i);
        }
        else {
            bottonWhenPause(i);
        }
    }
    if (isDebug) {
        console.log("Last Frame time: " + lastFrameTimes[0]); 
        console.log("Current time: " + clips[0].currentTime());
        console.log("Duration: " + clips[0].duration());
        console.log("Is playing? " + clips[0].isPlaying());
        console.log("Is paused? " + clips[0].isPaused());
    }
}


$(document).ready(function() {
    console.log(clips.length);
    for (i=0; i<12; i++) {
        console.log(i);
        playAtBotton(i);
    }
});

/*** Play specified playback*/
function playAtBotton(index) {
    $("div.listen>div.audio div.btn" + index.toString()).click(function(e) {
        if (clips[index].isLoaded()) {
            if (clips[index].isPlaying()) {
                clips[index].pause();
            }
            else {
                clips[index].setVolume(0.5);
                clips[index].play();
                lastFrameTimes[index] = clips[index].currentTime();
            }
        }
    });
}

//*** Change botton icon when sound play */
function bottonWhenPlay(index) {
    $("div.listen>div.audio div.btn" + index.toString()).css("right","50%").css("width", "50px").css("height","60px").css("border-left-width","20px").css("border-right-width", "20px").css("border-top-width","0px").css("border-bottom-width","0px");
}

//*** Change botton icon when sound paused */
function bottonWhenPause(index) {
    $("div.listen>div.audio div.btn" + index.toString()).css("right","45%").css("width", "0px").css("height","0px").css("border-left-width","50px").css("border-right-width", "0px").css("border-top-width","30px").css("border-bottom-width","30px");
}
