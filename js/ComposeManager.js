var isSelected = new Array();
isSelected["zheng"] = false;
isSelected["dizi"] = false;
isSelected["erhu"] = false;
isSelected["sun"] = false;

var colorOf = new Array();


//var isZhengSelected = false;
//var isDiziSelected = false;
//var isErhuSelected = false;
//var isSunSelected = false;

var stageWidth;
var stageHeight;
var composeCanvas;

// For sound rectangles
var soundRects = new Array();
var NONE_SELECTED = -1;
var selectedRect = NONE_SELECTED;
var soundRectHeight = 10;

// For play bar
var initialPlayBarX;
var initialPlayBarY;
var playBar;
var lastTimestamp;

// For player manager
var playerManager;

// For get Key based on Y
var lineHeight;
var lineMarginTop;

//*** Sound Rectangle!!! */
//***********************/
//************************/
function SoundRect(startX, startY, length, instrument) {
    this.startX = startX;
    this.startY = startY;
    this.length = Math.max(length, 20);
    var height = soundRectHeight;
    this.instrument = instrument;
    var key = getKeyBasedOnY(this.startY);
    console.log("Key of retangle is " + key);
    this.isSelected = false;
    
    this.audio;
    switch (this.instrument) {
        case "zheng":
            this.audio = loadSound("sound/zheng/zheng_" + key + ".mp3");
            break;
        case "dizi":
            this.audio = loadSound("sound/dizi/dizi_" + key + ".mp3");
            break;
        case "erhu":
            this.audio = loadSound("sound/erhu/erhu_" + key + ".mp3");
            break;
        case "sun":
            this.audio = loadSound("sound/xun/xun_" + key + ".mp3");
            break;
        default:
            break;
    }
    
    /*** Return is audio file is loaded*/
    this.isAuidoLoaded = function() {
        if (this.audio != null && this.audio.isLoaded()) {
            return true;
        }
        else {
            return false;
        }
    }
    
    /*** Play assigned sound*/
    this.play = function() {
        if (this.isAuidoLoaded()) {
            if (!this.audio.isPlaying()) {
                this.audio.play();
            }
        }
    }
    
    /*** Stop playing sound */
    this.stop = function() {
        if (this.isAuidoLoaded()) {
            if (this.audio.isPlaying()) {
                this.audio.stop();
            }
        }
    }
    
    /*** Pause playing sound*/
    this.pause = function() {
        if (this.isAuidoLoaded()) {
            if (this.audio.isPlaying()) {
                this.audio.pause();
            }
        }
    }
    
    /*** Return is playing*/
    this.isPlaying = function() {
        if (this.isAuidoLoaded()) {
            return this.audio.isPlaying();
        } else {
            return false;
        }
    }
    
    /*** Return is paused*/
    this.isPaused = function() {
        if (this.isAuidoLoaded()) {
            return this.audio.isPaused();
        } else {
            return false;
        }
    }
    
    /*** Return current time*/
    this.currentTime = function() {
        if (this.isAuidoLoaded()) {
            return this.audio.currentTime();
        }
        else {
            return 0;
        }
    }
    
    this.display = function() {
        fill(colorOf[this.instrument]);
        if (this.isSelected) {
            stroke(0);
        }
        else {
            noStroke();
        }
        
        var posX = this.startX;
        var posY = this.startY;
        rect(posX, posY, this.length, height);
    }
    
    this.isContained = function(x, y) {
        return (x>=this.startX) && 
                (x<=(this.startX+this.length)) && 
                (y>=this.startY) && 
                (y<=(this.startY+height));
    }
}
/* End of Sound Rectangle */


//*** Play Bar */
//////////////////
///////////////////////
function PlayBar(initialX, initialY, height, speed, stageWidth) {
    this.initialX = initialX;
    this.initialY = initialY;
    this.posX = initialX;
    this.posY = initialY;
    this.height = height;
    this.speed = speed;
    this.stageWidth = stageWidth;
    this.isPlaying = false;
    var width = 5;
    
    this.display = function() {
        fill(0);
        noStroke();
        
        rect(this.posX, this.posY, width, this.height);
    }
    
    this.play = function() {
        this.isPlaying = true;
    }
    
    this.pause = function() {
        this.isPlaying = false;
    }
    
    this.stop = function() {
        this.isPlaying = false;
        this.posX = this.initialX;
    }
    
    this.moveToRight = function(deltaTime) {
        if (this.isPlaying) {
            this.posX += speed * deltaTime;
            this.posX %= this.stageWidth;
        }
    }
}
//*** End of Play bar class */


//*** Player Manager Class*/
///////////////////////////
////////////////////////////////
function PlayerManager(play_bar, sound_rects) {
    var playBar = play_bar;
    var soundRects = sound_rects;
    
    this.manage = function() {
        if (playBar != null && soundRects != null) {
            for (i=0; i<soundRects.length; i++) {
                if (playBar.posX >= soundRects[i].startX && playBar.posX <= (soundRects[i].startX + soundRects[i].length)) {
                    if (playBar.isPlaying) {
                        console.log("is playing: " + soundRects[i].isPlaying());
                        if (!soundRects[i].isPlaying()) {
                            soundRects[i].play();
                        }
                    } else {
                        if (soundRects[i].isPlaying()) {
                            soundRects[i].pause();
                        }
                    }
                } else {
                    if (soundRects[i].isPaused()) {
                        soundRects[i].play();
                    }
                    if (soundRects[i].isPlaying()) {
                        console.log("is playing: " + soundRects[i].isPlaying());
                        console.log("is paused: " + soundRects[i].isPaused());
                        if (soundRects[i].currentTime() != 0) {
                            soundRects[i].stop();
                        } else {
                            soundRects[i].pause();
                        }
                    }
                }
                
                
            }
        }
    }
}

$(document).ready(function(){
    console.log("Call from ready " + document.width + "*" + document.height);

/// Not compatible because key is local variable and only store last key, so select function and deselect function only affect  last element
//    for (key in isSelected) {
//        console.log(key);
//        $("div.leftbar>ul>li.btn-"+key+">a").click(function(e){
//            if (isSelected[key]) {
//                deselectInstrument(key);
//            }
//            else {
//                deselectAllInstrument();
//                selectInstrument(key);
//            }
//        });
//    }
    
    // Get width of stage element
    stageWidth = $("div.stage>div.line").css("width");
    stageWidth = stageWidth.split("px")[0];
    stageHeight = $("div.stage").css("height");
    stageHeight = stageHeight.split("px")[0];
    stageHeight = $("div.stage>div.line-top").offset().top;
    stageHeight = $("div.stage>div.button-container").offset().top - stageHeight;
    console.log("Width of Stage: " + stageWidth);
    console.log("Height of Stage: " + stageHeight);
    // Get offset of line
    initialPlayBarX = $("div.stage>div.line").offset().left;
    initialPlayBarY = $("div.stage>div.line").offset().top;
    console.log("X of Stage: " + initialPlayBarX);
    console.log("Y of Stage: " + initialPlayBarY);
    // Get line's height and margin-top
    lineHeight = $("div.stage>div.line").height();
    lineMarginTop = $("div.stage>div.line").css("margin-top");
    lineMarginTop = lineMarginTop.split("px")[0];
    console.log("Height of line " + lineHeight);
    console.log("Margin top of line " + lineMarginTop);
    
    // Instrument Selection
    $("div.leftbar>ul>li.btn-zheng>a").click(function(e) {
        
        if (isSelected["zheng"]) {       
            deselectInstrument("zheng");
        }
        else {
            deselectAllInstrument();
            selectInstrument("zheng");
        }
        
    });
    $("div.leftbar>ul>li.btn-dizi>a").click(function(e) {

        if (isSelected["dizi"]) {       
            deselectInstrument("dizi");
        }
        else {
            deselectAllInstrument();
            selectInstrument("dizi");
        }
        
    });
    $("div.leftbar>ul>li.btn-erhu>a").click(function(e) {
        
        if (isSelected["erhu"]) {       
            deselectInstrument("erhu");
        }
        else {
            deselectAllInstrument();
            selectInstrument("erhu");
        }
        
    });
    $("div.leftbar>ul>li.btn-sun>a").click(function(e) {

        if (isSelected["sun"]) {       
            deselectInstrument("sun");
        }
        else {
            deselectAllInstrument();
            selectInstrument("sun");
        }
        
    });
    
    // Play or pause play bar
    $("div.stage>div.button-container>div.playbuttoncontainer").click(function(e) {
        if (playBar != null) {
            if (playBar.isPlaying) {
                playBar.pause();
                buttonPlay( "div.stage>div.button-container>div.playbuttoncontainer>div.playbutton");
            }
            else {
                playBar.play();
                buttonPause( "div.stage>div.button-container>div.playbuttoncontainer>div.playbutton");
            }
        }
        console.log("Click on pause button container");
    });
    $("div.stage>div.button-container>div.stopbuttoncontainer").click(function(e) {
        if (playBar != null) {
            playBar.stop();
            buttonPlay( "div.stage>div.button-container>div.playbuttoncontainer>div.playbutton");
        }
        console.log("Click on stop button container");
    });    
    
});

function preload() {
    
}

function setup() {
    console.log("Call from setup " + document.width + "*" + document.height);
    composeCanvas = createCanvas(stageWidth, stageHeight);
    composeCanvas.class("StageCanvas");
    composeCanvas.parent('stage');
    
    // Set up color for each instruments
    colorOf["zheng"] = color(204, 68, 0);
    colorOf["dizi"] = color(0, 179, 60);
    colorOf["erhu"] = color(128, 191, 255);
    colorOf["sun"] = color(102, 102, 51);
    
    // Set up play bar
    playBar = new PlayBar(0, 0, stageHeight, 50, stageWidth);
    
    // Set up player manager
    playerManager = new PlayerManager(playBar, soundRects);
    
    // Initialize a block
//    block = new soundRect(0, 0, 0, colorOf["zheng"]);
    
    // Record current timestamp
    lastTimestamp = millis();
}

function draw() {
    clear();
    if (soundRects != null) {
        for (i=0; i<soundRects.length; i++) {
            soundRects[i].display();
        }
    }
    
    // Display key note in the begining position
    for (i=0; i<composeCanvas.height; i+=soundRectHeight) {
        note = getKeyBasedOnY(i);
        if (note != null) {
            textSize(10);
            fill(0);
            text(note, 5, i+9);
        }
    }
    
    // Deltatime between each frames in second
    var deltaTime = (millis() - lastTimestamp)/1000;
    lastTimestamp = millis();
    //console.log(deltaTime);
    // Display play bar
    if (playBar != null) {
        playBar.moveToRight(deltaTime);
        playBar.display();
    }
    
    if (playerManager != null) {
        playerManager.manage();
    }
}

function mousePressed() {
    
    // Check if mouse is in canvas
    if (mouseX >= 0 && mouseX <= composeCanvas.width && mouseY >= 0 && mouseY <= composeCanvas.height) {
        if (mouseButton == LEFT) {
    //        block.startX = mouseX;
    //        block.startY = mouseY;
    //        block.length = 0;

            console.log("x " + mouseX + " y " + mouseY);

            // Detect which rectangle is being selected
            for (i=0; i<soundRects.length; i++) {
                if (soundRects[i].isContained(mouseX, mouseY)) {
                    var isInstrumentSelected = false;
                    for (key in isSelected) {
                        if (isSelected[key]) {
                            isInstrumentSelected = true;
                            break; // Exit the for loop
                        }
                    }

                    // If any instrument is selected, select that rectangle
                    if (isInstrumentSelected) {
                        selectedRect = i;
                        soundRects[i].isSelected = true;
                        //soundRects[i].play();
                    }
                    else // If no instrument is selected, remove that rectangle
                    {
                        soundRects.splice(i, 1);
                    }
                    break;
                }
            }

            // if no retangle is selected
            if (selectedRect == NONE_SELECTED) {
                for (key in isSelected) {
                    if (isSelected[key]) {
                        soundRects.push(new SoundRect(mouseX, Math.floor(mouseY / soundRectHeight) * soundRectHeight, 0, key));

                        selectedRect = soundRects.length - 1;
                        soundRects[selectedRect].isSelected = true;

                        break; // Exit the for loop
                    }
                }
            }
        }
    }
}

function mouseDragged() {
    if (mouseButton == LEFT) {
//        block.length = Math.max(mouseX - block.startX, 0);
        
        if (selectedRect != NONE_SELECTED) {
            soundRects[selectedRect].length = Math.max(mouseX - soundRects[selectedRect].startX, 20);
        }
    }
}

function mouseReleased() {
    if (selectedRect != NONE_SELECTED) {
        soundRects[selectedRect].isSelected = false;
        selectedRect = NONE_SELECTED;
    }
}

/*** Select specified instrument (bolden border)*/
function selectInstrument(instrument) {
    isSelected[instrument] = true;
    $("div.leftbar>ul>li.btn-"+instrument+">a").css("border-width", "5px").css("border-color", "rgba(" + colorOf[instrument].rgba + ")");
}
/*** Deselect specified instrument (thinen border)*/
function deselectInstrument(instrument) {
    isSelected[instrument] = false;
    $("div.leftbar>ul>li.btn-"+instrument+">a").css("border-width","0px");
}
/*** Deselect all instrument*/
function deselectAllInstrument() {
//    deselectInstrument("zheng");
//    deselectInstrument("dizi");
//    deselectInstrument("erhu");
//    deselectInstrument("sun");
    
    for (key in isSelected) {
        deselectInstrument(key);
    }
}

/*** Change play button's icon to play */
function buttonPlay(button) {
    $(button).css("border-top-width", "20px").css("border-bottom-width", "20px").css("border-left-width", "40px").css("border-right-width", "0px").css("height","0px").css("width","0px");
}
/*** Change play button's icon to pause */
function buttonPause(button) {
    $(button).css("border-top-width", "0px").css("border-bottom-width", "0px").css("border-left-width", "15px").css("border-right-width", "15px").css("height","40px").css("width","40px");
}

/*** Return key based Y position*/
function getKeyBasedOnY(posY) {
    var index = Math.floor(posY / soundRectHeight);
    var topRange = Math.floor(lineMarginTop / soundRectHeight);
    var localRange = Math.floor((Number(lineHeight)+Number(lineMarginTop)) / soundRectHeight);
    var heightRange = Math.floor(lineHeight / soundRectHeight);
    var localIndex = index % localRange;
    var localIndexWithoutTop = localIndex - topRange;
    
    // Extract note and layer
    if (localIndexWithoutTop >= 0) {
        var note = Math.floor((heightRange - 1 - localIndexWithoutTop) % 7);
        var layer = Math.floor((heightRange - 1 - localIndexWithoutTop) / 7) + 5;  // Layer starts from 5th, ends with 7th

        switch(note) {
            case 0:
                return "C"+layer;
            case 1:
                return "D"+layer;
            case 2:
                return "E"+layer;
            case 3:
                return "F"+layer;
            case 4:
                return "G"+layer;
            case 5:
                return "A"+layer;
            case 6:
                return "B"+layer;
            default:
                break;
        }
    }
    return null;
}