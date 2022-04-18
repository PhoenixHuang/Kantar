var startX,startY; 
document.addEventListener("touchstart",function(e){ 
    startX = e.targetTouches[0].pageX;
    startY = e.targetTouches[0].pageY;
}); 
document.addEventListener("touchmove",function(e){ 
    var moveX = e.targetTouches[0].pageX;
    var moveY = e.targetTouches[0].pageY;    
    if(Math.abs(moveX-startX)>Math.abs(moveY-startY)){
        e.preventDefault();
    }
},{passive:false});

$(function () {
    $(".mrNext").hide();
    var captcha = sliderCaptcha({
        id: 'captcha',
        setSrc: function () {
            return 'https://cdn.jsdelivr.net/gh/phoenixhuang/kantar/Captcha/Pics/Pic' + Math.round(Math.random() * 99) + '.jpg';
        },
        onSuccess: function () { 
            $(".mrNext").show();;
        }
    });   
    
})


 
