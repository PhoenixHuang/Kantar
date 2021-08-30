var sayHiEl;
var vudata = [];
var zomdata = [];
var indx = 0;
//var nop=6;
var output = '';

function datacap(datacapObj) {
var instance =datacapObj.instance;
var PhotoSwipe = datacapObj.PhotoSwipe;
var nop = datacapObj.nop;
var percent = datacapObj.percent; 
var closeBTNEnableTime = datacapObj.closeBTNEnableTime ;
var closeBTNSubmitTime = datacapObj.closeBTNSubmitTime;

    //Caliculating percent of pages
    if (percent != "null") {
        var verifNop = Math.round((nop * percent) / 100);
    }
    // Initially Hide close button for percent of pages to be viewed 
    if (percent != "null") {
        $('.say-hi').hide();
    }
    // Initially Hide close button till the close button enable time 
    if (closeBTNEnableTime != "null") {
        $('.say-hi').hide();
    }

    function Timer(callback, delay) {
        var timerId, start, remaining = delay;

        this.pause = function () {
            window.clearTimeout(timerId);
            remaining -= new Date() - start;
        };

        this.resume = function () {
            start = new Date();
            timerId = window.setTimeout(callback, remaining);
        };

        this.resume();
    }


    for (i = 0; i < nop; i++) {
        vudata.push(0);
        zomdata.push(0);
    }
    vudata[0] = 1;
    instance.addEventHandler(PhotoSwipe.EventTypes.onZoomPanRotateShow, function (e) {
        vudata[indx] = 1;
        zomdata[indx] = 1;
    });
    instance.addEventHandler(PhotoSwipe.EventTypes.onDisplayImage, function (e) {
        indx = e.index;
        vudata[e.index] = 1;
        if (e.index == nop - 1) $('.ps-toolbar-next').hide();
        else $('.ps-toolbar-next').show(); if (e.index == 0) $('.ps-toolbar-previous').hide();
        else $('.ps-toolbar-previous').show();
        if (percent != null) {
            if (verifNop-1 == e.index) {
                $('.say-hi').show();
            }
        }
        if (closeBTNEnableTime != "null") {
            timer.resume();
        }
        if (closeBTNSubmitTime != "null") {
            timer1.resume();
        }
    });
    if (closeBTNEnableTime != "null") {
        var timer = new Timer(function () {
            $('.say-hi').show();
        }, closeBTNEnableTime);
    }
    if (closeBTNSubmitTime != "null") {
        if (closeBTNSubmitTime != '') {
            var timer1 = new Timer(function () {
                output = '';
                for (i = 0; i < nop - 1; i++) {
                    output = output + (vudata[i] + "," + zomdata[i]) + "#";

                }
                output = output + (vudata[i] + "," + zomdata[i]);
                $('#_Q0').val(output);
				$('.mrNext').click();
            }, closeBTNSubmitTime);
        }
    }
    if (closeBTNEnableTime != "null") {
        timer.pause();
    }
    if (closeBTNSubmitTime != "null") {
        timer1.pause();
    }
    
    // onShow - store a reference to our "say hi" button
    instance.addEventHandler(PhotoSwipe.EventTypes.onShow, function (e) {
        sayHiEl = window.document.querySelectorAll('.say-hi')[0];
    });

    // onToolbarTap - listen out for when the toolbar is tapped
    instance.addEventHandler(PhotoSwipe.EventTypes.onToolbarTap, function (e) {
        if (e.toolbarAction === PhotoSwipe.Toolbar.ToolbarAction.none) {
            //if (e.tapTarget === sayHiEl || Util.DOM.isChildOf(e.tapTarget, sayHiEl)) {
				output = '';
                for (i = 0; i < nop - 1; i++) {
                    output = output + (vudata[i] + "," + zomdata[i]) + "#";

                }
				
                output = output + (vudata[i] + "," + zomdata[i]);
				$('#_Q0').val(output);
				$('.mrNext').click();
            //}
        }
    });

    $(".ps-toolbar-next").click(function () {
        if (closeBTNEnableTime != "null") {
        timer.pause();
    }
    if (closeBTNSubmitTime != "null") {
        timer1.pause();
    }
    });
}