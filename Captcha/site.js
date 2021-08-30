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


 