var part1Height;
var part2Height;
var zhengHeight;
var diziHeight;
var erhuHeight;
var sunHeight;

var scrollY = 0;
var isContactMeOn = false;

$(document).ready(function () {
    
    part1Height = $(".head>nav>.part1").css("height").split("px");
    part1Height = Number(part1Height[0]);
    
    part2Height = $(".head>nav>.part2").css("height").split("px");
    part2Height = Number(part2Height[0]);
    
    zhengHeight = $("div.zheng").offset().top;
    diziHeight = $("div.dizi").offset().top;
    erhuHeight = $("div.erhu").offset().top;
    sunHeight = $("div.sun").offset().top;
    
    scrollY = window.pageYOffset;
    
    console.log("zheng " + zhengHeight + "\n" 
               + "dizi " + diziHeight + "\n" + "erhu " + erhuHeight + "\n" + "sun " + sunHeight);
   
   hideContactMe(); $("div.part2>ul>li>a.contactme").click(function() {
        if (isContactMeOn) {
            isContactMeOn = false;
            hideContactMe();
        }
        else {
            isContactMeOn = true;
            showContactMe();
        }
    });
    $("div.part2>ul>li>a.instruments").click(function() {
        if (isContactMeOn) {
            isContactMeOn = false;
            hideContactMe();
        }
    });
    
    $("div.part2>ul>li>a.compose").click(function() {
        if (isContactMeOn) {
            isContactMeOn = false;
            hideContactMe();
        }
    });
    
    
});

$(document).scroll(function(e) {
    scrollY = window.pageYOffset;
    console.log(scrollY);

    // Move part2 when viewport is out of original position of part2
    if (scrollY > part1Height) {
        $(".head>nav>.part2").css("top", scrollY - part1Height + "px");
        $(".head>nav>.leftbar").css("top", scrollY - part1Height + "px");
    }
    else {
        $(".head>nav>.part2").css("top", "0px");
        $(".head>nav>.leftbar").css("top", "0px");
    }
    
    // Move Contact Me panel alone with Contact Me button
    if (isContactMeOn) {
        showContactMe();
    }
    else {
        hideContactMe();
    }
    
    
    // Modify corresponding botton when viewport in certain div
    if (scrollY + part2Height > zhengHeight) {
        scrollInto("zheng");
    }
    else {
        scrollOut("zheng");
    }
    if (scrollY + part2Height > diziHeight) {
        scrollOut("zheng");
        scrollInto("dizi");
    }
    else {
        scrollOut("dizi");
    }
    if (scrollY + part2Height > erhuHeight) {
        scrollOut("dizi");
        scrollInto("erhu");
    }
    else {
        scrollOut("erhu");
    }
    if (scrollY + part2Height > sunHeight) {
        scrollOut("erhu");
        scrollInto("sun");
    }
    else {
        scrollOut("sun");
    }
    
    
    console.log("Successful");
});

function scrollInto(btn) {
    $(".head>nav>.leftbar>ul>li.btn-" + btn + ">a").css("width","150px").css("height","150px").css("line-height", "150px").css("background-color", "rgb(219, 201, 160)");    
}

function scrollOut(btn) {
    $(".head>nav>.leftbar>ul>li.btn-" + btn + ">a").css("width","100px").css("height","100px").css("line-height", "100px").css("background-color", "rgb(218, 202, 179)");     
}

function showContactMe() {
    $("div.contactme").css("width", "1000px");
   $("div.contactme").css("height","500px");
    
    if (scrollY > part1Height) {
        $("div.contactme").css("top", scrollY+part2Height + "px");
    }
    else {
        $("div.contactme").css("top", part1Height+part2Height + "px");
    }
}

function hideContactMe() {
   $("div.contactme").css("width", "0px");
   $("div.contactme").css("height","0px"); $("div.contactme").css("top","-500px");
}