/**
 * mediaupload class
 * Inherits from SESurveyTool
 */
function mediaupload(questionContainers, json, globalOpts) {
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
mediaupload.prototype.saveEncodedData = "";
mediaupload.prototype.fileName = "";

mediaupload.prototype = Object.create(SESurveyTool.prototype);
mediaupload.prototype.type = function() {
    return "mediaupload";
}
mediaupload.prototype.getDependencies = function() {
    return [{
        'type': 'stylesheet',
        'url': pageLayout.themePath + "css/1.10.4/jquery-ui-custom.css"
    }, {
        'type': 'script',
        'url': pageLayout.sharedContent + 'LAF/Lib/jQueryUI/1.11.0/jquery-ui.min.js'
    }, {
        'type': 'script',
        'url': pageLayout.sharedContent + 'LAF/Lib/swfobject/2.2/swfobject.js'
    }, {
        'type': 'script',
        'url': pageLayout.sharedContent + 'LAF/Lib/MediaUpload/jquery.FileReader.js'
    }, {
        'type': 'script',
        'url': pageLayout.sharedContent + 'LAF/Lib/MediaUpload/webcam/webcam.js'
    }];
}

mediaupload.prototype.setInitialResponses = function() {
    var webcamaccess = this.getProperty("webcam");
    /* Set Initial Responses*/
    var setInitialValue = "";
    $.each(this.inputs.filter('textarea'), function(i, e) {
        setInitialValue = $(e).val();
    });
    if (setInitialValue != "") {

        if (this.getProperty("webcam"))
            $('#' + this.questionName + 'WebCamResp').html(setInitialValue);
        else
            $('#' + this.questionName + 'Resp').html(setInitialValue);

        var splitArray = setInitialValue.split('~');
        this.fileName = splitArray[splitArray.length - 1]

        if (this.fileName.length > 24) {
            var fileNameShort = this.fileName.substr(0, 12) + '...' + this.fileName.slice(-12);
            $("#" + this.questionName + "FlashFile").html(fileNameShort);
            $("#" + this.questionName + "FlashFile").attr('title', this.fileName);
        } else {
            $("#" + this.questionName + "FlashFile").html(this.fileName);
            $("#" + this.questionName + "FlashFile").attr('title', this.fileName);
        }

		
        this.componentContainer.find('#' + this.questionName + 'Submit').css('background', '#ccc').attr("disabled", true);
        this.componentContainer.find('#' + this.questionName + 'Select').css('background', '#ccc').attr("disabled", true);
        if (webcamaccess) {
            this.componentContainer.find('#' + this.questionName + 'TakeSnap').css('background', '#ccc').attr("disabled", true);
        }
    }
    /* CLOSE Set Initial Responses*/
}

mediaupload.prototype.setResponses = function() {
    if (this.getProperty("webcam"))
        var response = $('#' + this.questionName + 'WebCamResp').html();
    else
        var response = $('#' + this.questionName + 'Resp').html();
    $.each(this.inputs.filter('textarea'), function(i, e) {
        $(e).val(response)
    });

}

mediaupload.prototype.build = function() {

    this.deferred.resolve();
}

mediaupload.prototype.render = function() {

    // Get tool properties
    var mediatype = this.getProperty("mediatype");
    var opconame = this.getProperty("opconame");
    var passcode = this.getProperty("passcode");
    var uploadbuttonlabel = this.getProperty("uploadbuttonlabel");
    var uploadbuttonlabelcolor = this.getProperty("uploadbuttonlabelcolor");
    var uploadbuttonbackgrouncolor = this.getProperty("uploadbuttonbackgrouncolor");
    var uploadbuttonlabelfontsize = this.getProperty("uploadbuttonlabelfontsize");
    var inputfilelabel = this.getProperty("inputfilelabel");
    var webcamaccess = this.getProperty("webcam");
    var webcamheight = this.getProperty("webcamheight");
    var webcamwidth = this.getProperty("webcamwidth");
    var imageformat = this.getProperty("imageformat");
    var imagequality = this.getProperty("imagequality");
    var mediatypemissingerrmsg = this.getProperty("mediatypemissingerrmsg");
    var opconamemissingerrmsg = this.getProperty("opconamemissingerrmsg");
    var passcodemissingerrmsg = this.getProperty("passcodemissingerrmsg");
    var inputfilelabelcolor = this.getProperty("inputfilelabelcolor");
    var inputfilebackgrouncolor = this.getProperty("inputfilebackgrouncolor");
    var inputfiledefaultname = this.getProperty("inputfiledefaultname");
    var inputfilenamecolor = this.getProperty("inputfilenamecolor");
    var inputfilenamefontsize = this.getProperty("inputfilenamefontsize");
    var inputfilelabelfontsize = this.getProperty("inputfilelabelfontsize");

    var snapbuttonlabel = this.getProperty("snapbuttonlabel");
    var snapbuttonlabelcolor = this.getProperty("snapbuttonlabelcolor");
    var snapbuttonbackgrouncolor = this.getProperty("snapbuttonbackgrouncolor");
    var snapbuttonlabelfontsize = this.getProperty("snapbuttonlabelfontsize");

    var mediatypeerrmsg = this.getProperty("mediatypeerrmsg");
    var imagefilesizeerrmsg = this.getProperty("imagefilesizeerrmsg");
    var audiofilesizeerrmsg = this.getProperty("audiofilesizeerrmsg");
    var videofilesizeerrmsg = this.getProperty("videofilesizeerrmsg");
    var ievideosizelimitaionmessage = this.getProperty("ievideosizelimitaionmessage");

    this.componentContainer = $('<div>');
    this.componentContainer.append(this.label);
    this.componentContainer.attr('id', 'qc_' + this.questionFullName); //change to be more identifable with question?
    this.componentContainer.addClass('qcContainer');
    var inputcontainer = $("<div>");

    // Create input file element 
    var input = $("<input>");
    input.attr('type', 'file');
    input.addClass('fupload');
    input.attr('name', this.questionName + 'Name');
    input.attr('id', this.questionName + 'Id');
    input.attr('style', 'position:fixed;top:-100px;');

    var input2 = $("<input>");
    input2.attr('type', 'button');
    input2.attr('name', this.questionName + 'Name');
    input2.attr('id', this.questionName + 'Select');
    input2.attr('value', inputfilelabel);
    input2.attr('style', 'background-color: ' + inputfilebackgrouncolor + '; padding: 10px; border: 1px solid #e0e0e0;margin-top: 10px;color: ' + inputfilelabelcolor + ';font-size: ' + inputfilelabelfontsize + 'px;');

    var that = this;
    var input1 = $("<input>");
    input1.attr('type', 'button');
    input1.addClass('fuploadButton');
    input1.attr('id', this.questionName + 'Submit');
    input1.attr('value', uploadbuttonlabel);
    input1.attr('style', 'background: ' + uploadbuttonbackgrouncolor + '; border: 1px solid #ccc; padding: 10px; margin-left: 10px; margin-right: 10px; color: ' + uploadbuttonlabelcolor + '; font-size: ' + uploadbuttonlabelfontsize + 'px;');
    input1.on("click", function() {
        if (that.saveEncodedData == undefined) {
            console.log("No file selected");
        } else {
            pageLayout.createLoader();
            setTimeout(function() {
                that.clickUpload();
            }, 100);
        }

    });

    // For mobile, enable mobile native feature

    if (mediatype == 'image') {
        input.attr('accept', 'image/*;capture=camera');
    } else if (mediatype == 'video') {
        input.attr('accept', 'video/*;capture=camcorder');
    } else if (mediatype == 'audio') {
        input.attr('accept', 'audio/*;capture=microphone');
    }
    var flashFileNameContainer = $("<span>");
    flashFileNameContainer.attr('style', 'color: ' + inputfilenamecolor + '; font-size: ' + inputfilenamefontsize + 'px;');
    flashFileNameContainer.attr('id', this.questionName + 'FlashFile');
    flashFileNameContainer.html(inputfiledefaultname);

    var serverResponseContainer = $("<span>");
    if (webcamaccess)
        serverResponseContainer.attr('id', this.questionName + 'WebCamResp');
    else
        serverResponseContainer.attr('id', this.questionName + 'Resp');

    serverResponseContainer.hide();

    var encodeContainer = $("<div>");
    encodeContainer.attr('id', this.questionName + 'EncodeData');
    encodeContainer.hide();


    // Webcam container
    var webcamFullContainer = $("<div>");
    var webcamContainer = $("<div style=\"float:left;\">");
    webcamContainer.attr('id', this.questionName + 'Webcam');
    var webcamContainerSnap = $("<div style=\"float:left; margin-left:10px;\">");
    webcamContainerSnap.attr('id', this.questionName + 'WebcamSnap');
    webcamFullContainer.append(webcamContainer);
    webcamFullContainer.append(webcamContainerSnap);

    // Appending custom inputs to survey tool 
    var PC_OTHERDEVICE = pageLayout.deviceType.toUpperCase();
    if ((PC_OTHERDEVICE == 'PC' || PC_OTHERDEVICE == 'OTHERDEVICE') && webcamaccess) {
        inputcontainer.append(serverResponseContainer);
        inputcontainer.append(webcamFullContainer);
        inputcontainer.append(encodeContainer);
        inputcontainer.append("<br/><br/>");
    } else {
        inputcontainer.append(input);
        inputcontainer.append(input2);
        inputcontainer.append(flashFileNameContainer);
        inputcontainer.append(serverResponseContainer);
        inputcontainer.append(input1);
        inputcontainer.append(webcamFullContainer);
        inputcontainer.append(encodeContainer);
        inputcontainer.append("<br/><br/>");
    }
    this.component = inputcontainer;

    // Minimum inputs required from MDD - validations

    if (mediatype == "NotDefined" || opconame == "NotDefined" || passcode == "NotDefined") {

        if (mediatype == "NotDefined") {
            this.nativeContainer.find('.mrErrorText').remove();
            this.nativeContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + mediatypemissingerrmsg + "<br/></span>");
        }
        if (opconame == "NotDefined") {
            this.nativeContainer.find('.mrErrorText').remove();
            this.nativeContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + opconamemissingerrmsg + "<br/></span>");
        }
        if (passcode == "NotDefined") {
            this.nativeContainer.find('.mrErrorText').remove();
            this.nativeContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + passcodemissingerrmsg + "<br/></span>");
        }
    } else {

        this.componentContainer.append(this.component);
        this.nativeContainer.after(this.componentContainer);
        this.nativeContainer.hide();
    }

    //pageLayout.next.hide();

    //Only for PC and Laptops - enable webcam for webcam enable questions

    if (PC_OTHERDEVICE == 'PC' || PC_OTHERDEVICE == 'OTHERDEVICE') {

        if (webcamaccess) {
            input.hide();
            webcamFullContainer.height(webcamheight + 'px');
            webcamFullContainer.before('<br/>');
            var inputTakeSnap = $("<input>");
            inputTakeSnap.attr('type', 'button');
            inputTakeSnap.addClass('takeSnap');
            inputTakeSnap.attr('id', this.questionName + 'TakeSnap');
            inputTakeSnap.attr('value', snapbuttonlabel);
            inputTakeSnap.attr('style', 'background: ' + snapbuttonbackgrouncolor + '; border: 1px solid #ccc; padding: 10px; margin-top: 20px; color: ' + snapbuttonlabelcolor + '; font-size: ' + snapbuttonlabelfontsize + 'px;');
            inputTakeSnap.on("click", function() {
                that.takeSnap();
            });
            webcamFullContainer.after('<br/>');
            webcamFullContainer.after(inputTakeSnap);
            inputTakeSnap.after(input1);
            input1.after(flashFileNameContainer);
            //webcamFullContainer.after();

			var backendValue = "";
			$.each(this.inputs.filter('textarea'), function(i, e) {
				backendValue = $(e).val();
			});
			if (backendValue == "") {
				var webcamSWF = pageLayout.sharedContent + "LAF/Lib/MediaUpload/webcam/webcam.swf";
				Webcam.setSWFLocation(webcamSWF);
				Webcam.set({
					width: webcamwidth,
					height: webcamheight,
					image_format: imageformat,
					jpeg_quality: imagequality
				});
				Webcam.attach(this.questionName + 'Webcam');
				//alert(Webcam.dispatch());
			}
        }

    }

    this.setInitialResponses();


    // File read and Encoded in base64 format and for IE9 will call flash filereader.swf

    var filereaderSWF = pageLayout.sharedContent + "LAF/Lib/MediaUpload/filereader.swf";

    $('#' + this.questionName + 'Select').fileReader({
        filereader: filereaderSWF
    });

    var fileId = "";
    if ($('#fileReaderSWFObject').length) {
        fileId = this.questionName + 'Select';
    } else {
        fileId = this.questionName + 'Id';
    }


    $('#' + this.questionName + 'Select').click({
        qname: this.questionName
    }, function(e) {
        var qname = e.data.qname;
        if ($('#fileReaderSWFObject').length) {} else {
            $('#' + qname + 'Id').click();
        }
    });

    var msg = this.getProperty("ie9errormessage");

    // File Change event

    $('#' + fileId).change({
        qname: this.questionName,
        that: this,
        componentContainer: that.componentContainer,
        ie9errormessage: msg
    }, function(e) {

        pageLayout.createLoader();
        var selectedfile = e.target.files[0];
        var qname = e.data.qname;
        var that = e.data.that;
        var componentContainer = e.data.componentContainer;
        var ie9errormessage = e.data.ie9errormessage;

        if (selectedfile != undefined) {

            var fileSize = (selectedfile.size / (1024 * 1024)); //size in mb 
            that.fileName = selectedfile.name;


            // For IE9 - Some times file type does't give video type like (vide/*), we are adding video type forcebly based on video file formats
            var isThisIE = browser.isIe();
            if (browser.isIe() && browser.getVersion() <= 9) {
                if (browser.getVersion() <= 9) {
                    var filenameFullArray = that.fileName.split('.');
                    var fileExt = filenameFullArray[filenameFullArray.length - 1];
                    if (imageType == null && audioType == null) {
                        var videoFormats = ["webm", "mkv", "flv", "vob", "ogv", "ogg", "drc", "mng", "avi", "mov", "wmv", "yuv", "mp4", "m4p ", "m4v", "mpg", "mpeg", "3gp", "3g2", "svi", "m4v", "mxf", "roq", "nsv"];
                        if ($.inArray(fileExt, videoFormats) !== -1) {
                            selectedfile.type = "video/" + fileExt;
                        } else {
                            selectedfile.type = selectedfile.type
                        }
                    }
                }
            }

            var fileType = selectedfile.type;
            var videoType = fileType.match('video.*');
            var imageType = fileType.match('image.*');
            var audioType = fileType.match('audio.*');

            // File type and size validations  
            if (videoType == null && imageType == null && audioType == null) {
                pageLayout.hideLoader();
                componentContainer.find('.mrErrorText').remove();
                componentContainer.prepend("<span class=\"mrErrorText\">" + mediatypeerrmsg + "<br/></span>");
            } else {
                if (videoType != null && fileSize > 30) {
                    pageLayout.hideLoader();
                    componentContainer.find('.mrErrorText').remove();
                    componentContainer.prepend("<span class=\"mrErrorText\">" + videofilesizeerrmsg + "<br/></span>");
                } else if (imageType != null && fileSize > 5) {
                    pageLayout.hideLoader();
                    componentContainer.find('.mrErrorText').remove();
                    componentContainer.prepend("<span class=\"mrErrorText\">" + imagefilesizeerrmsg + "<br/></span>");
                } else if (audioType != null && fileSize > 5) {
                    pageLayout.hideLoader();
                    componentContainer.find('.mrErrorText').remove();
                    componentContainer.prepend("<span class=\"mrErrorText\">" + audiofilesizeerrmsg + "<br/></span>");
                } else {
                    if (isThisIE && fileSize > 10) {
                        pageLayout.hideLoader();
                        componentContainer.find('.mrErrorText').remove();
                        componentContainer.prepend("<span class=\"mrErrorText\">" + ievideosizelimitaionmessage + "<br/></span>");
                    } else {
                        console.log('Validations done');
                        filereader = new FileReader();

                        // to show selected custome file name compatible(look and feel) for all browsers

                        filereader.filename = that.fileName;
                        if (that.fileName.length > 24) {
                            var fileNameShort = that.fileName.substr(0, 12) + '...' + that.fileName.slice(-12);
                            $("#" + qname + "FlashFile").html(fileNameShort);
                            $("#" + qname + "FlashFile").attr('title', that.fileName);
                        } else {
                            $("#" + qname + "FlashFile").html(that.fileName);
                            $("#" + qname + "FlashFile").attr('title', that.fileName);
                        }

                        // file encoding process started

                        filereader.onload = function() {
                            var encodeData = filereader.result;
                            //console.log(encodeData);
                            encodeData = encodeData.replace(/\s/g, '');

                            that.saveEncodedData = selectedfile.size + ',' + selectedfile.type + ',' + encodeData;

                            pageLayout.hideLoader();
                            if (browser.isIe() && browser.getVersion() <= 9) {
                                if (browser.getVersion() <= 9) {
                                    componentContainer.find('.mrErrorText').remove();
                                    componentContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + ie9errormessage + "<br/></span>");
                                }
                            }
                        };
                        filereader.onabort = function() {
                            console.log('Upload aborted');
                            pageLayout.hideLoader();
                        };
                        filereader.onerror = function() {
                            console.log('Upload error');
                            pageLayout.hideLoader();
                        };
                        filereader.readAsDataURL(selectedfile);
                    }
                }
            }
        } else {
            pageLayout.hideLoader();
        }
    });

    // File change event close

}

//Upload button click event
mediaupload.prototype.clickUpload = function() {

    // Get tool properties
    var loadingmessage = this.getProperty("loadingmessage");
    var loadingmessagefontsize = this.getProperty("loadingmessagefontsize");
    var progressbarwidth = this.getProperty("progressbarwidth");

    // File Type and Size validations
    var completeBaseCode = this.saveEncodedData;
    var completeBaseCodeArray = completeBaseCode.split(',');
    var fileSize = completeBaseCodeArray[0] //size in kb
    var fileType = completeBaseCodeArray[1] //size in kb

    fileSize = (fileSize / 1048576).toFixed(2); //size in mb 
    console.log('File size: ' + fileSize)
    var fileTypeFullArray = fileType.split('/');
    var fileMediaType = fileTypeFullArray[0];
    var fileExt = fileTypeFullArray[1];

    var Base64String = completeBaseCodeArray[3];

    $("#loader").append("<div id='progressbar' style='width:" + progressbarwidth + "%; margin:auto;font-size:" + loadingmessagefontsize + "px;'><div  class='progress-label' style='width:" + progressbarwidth + "%; position: absolute;text-align: center; margin: 7px 0 0 0;'>" + loadingmessage + "</div></div>");
    var progressbar = $("#progressbar"),
        progressLabel = $(".progress-label");
    progressbar.progressbar({
        value: 0
    });
    // Call .NET web service
    this.sendToWebServer(Base64String, fileType, fileExt, fileMediaType);

}


// Calling WebService with all inputs
mediaupload.prototype.sendToWebServer = function(Base64String, fileType, fileExt, fileMediaType) {
    var qname = this.questionName;
    var opconame = this.getProperty("opconame");
    var passcode = this.getProperty("passcode");
    var timeoutmessage = this.getProperty("timeoutmessage");
    var successmessage = this.getProperty("successmessage");
    var errormessage = this.getProperty("errormessage");
    var uploadsessiontime = this.getProperty("uploadsessiontime");
    var loadingmessage = this.getProperty("loadingmessage");
    var webcamaccess = this.getProperty("webcam");

    //Get current timestamp
    Date.prototype.timestamp = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = this.getDate().toString();
        var h = this.getHours().toString();
        var m = this.getMinutes().toString();
        var s = this.getSeconds().toString();

        return (mm[1] ? mm : "0" + mm[0]) + "" + (dd[1] ? dd : "0" + dd[0]) + "" + yyyy + "" + ((h > 12) ? h - 12 : h) + "" + m + "" + s;
    };

    d = new Date();

    var timestamp = d.timestamp();

    //Upload file name 
    var fileName = opconame + "_" + passcode + "_" + projectName + "_" + serial + "_" + qname + "_" + timestamp + "." + fileExt;

    fileMediaType = fileMediaType.toUpperCase();
    passcode = passcode.toUpperCase();
    opconame = opconame.toUpperCase();
    projectName = projectName.toUpperCase();
    // Ajax we service
    var data = {
        Base64String: Base64String,
        SASCode: projectName,
        FileName: fileName,
        ContentType: fileType,
        Opco: opconame,
        PassCode: passcode,
        FileType: fileMediaType
    };

    var items = Array(96, 97, 98, 99);
    var item = items[Math.floor(Math.random() * items.length)];
    var progressbar = $("#progressbar"),
        progressLabel = $(".progress-label");
    var that = this;
    jQuery.support.cors = true;
    var request = $.ajax({
        type: 'POST',
        url: 'http://EXT-EU-KO-MEDIA-LIVE-LB-1506352633.eu-west-1.elb.amazonaws.com/multimedia/L2/MediaUpload/POC/Service.asmx/UploadFileJSON',
        data: data,
        timeout: uploadsessiontime,
        dataType: "json",
        crossDomain: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function(data) {
            //console.log(JSON.stringify(data));
            progressbar.progressbar({
                value: 100,
                change: function() {
                    progressLabel.text("100% " + loadingmessage);
                }
            });

            pageLayout.hideLoader();
            that.componentContainer.find('#' + qname + 'Submit').css('background', '#ccc').attr("disabled", true);
            that.componentContainer.find('#' + qname + 'Select').css('background', '#ccc').attr("disabled", true);
            if (webcamaccess) {
                that.componentContainer.find('#' + qname + 'TakeSnap').css('background', '#ccc').attr("disabled", true);
                that.componentContainer.find('#' + qname + 'WebCamResp').html('Success~' + fileName + "~" + successmessage + "~" + that.fileName);
            } else {
                that.componentContainer.find('#' + qname + 'Resp').html('Success~' + fileName + "~" + successmessage + "~" + that.fileName);
            }
            that.componentContainer.find('.mrErrorText').remove();
            that.componentContainer.prepend("<span class=\"mrErrorText\" style=\"color:green;\">" + successmessage + "<br/></span>");
        },
        error: function(xhr, status, thrown) {
            console.log(status + ":" + thrown);
            pageLayout.hideLoader();
            if (thrown == "") {
                thrown = "Server error (empty)";
            }
            if (webcamaccess)
                that.componentContainer.find('#' + qname + 'WebCamResp').html("Error~" + fileName + "~" + thrown + "~" + errormessage + "~" + that.fileName);
            else
                that.componentContainer.find('#' + qname + 'Resp').html("Error~" + fileName + "~" + thrown + "~" + errormessage + "~" + that.fileName);
            if (status == 'timeout') {
                that.componentContainer.find('.mrErrorText').remove();
                that.componentContainer.prepend("<span class=\"mrErrorText\">" + status.toUpperCase() + ":" + timeoutmessage + "</span><br/>");
            } else {
                that.componentContainer.find('.mrErrorText').remove();
                that.componentContainer.prepend("<span class=\"mrErrorText\">" + status.toUpperCase() + ":" + thrown + "," + errormessage + "<br/></span>");
            }

        },
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            if (browser.isIe() && browser.getVersion() <= 9) {} else {
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        var percent = Math.floor(percentComplete * 100);
                        if (percent < item) {
                            progressbar.progressbar({
                                value: percent,
                                change: function() {
                                    progressLabel.text(progressbar.progressbar("value") + "% " + loadingmessage);
                                }
                            });
                        }
                    }
                }, false);
            }
            return xhr;
        }
    });
    data = null;

    //HERE IS THE HACK! :)
    request.onreadystatechange = null;
    request.abort = null;
    request = null;
    console.log("Ajax request done");
}
mediaupload.prototype.toolOptions = function() {
    $.extend(this.options, eval("this.options." + mediaupload.prototype.type()));
    switch (pageLayout.deviceType.toUpperCase()) {
        case "LARGETABLET":
        case "MEDIUMTABLET":
        case "SMALLTABLET":
        case "SMARTPHONETOUCH":
            if (this.orientation == 0 || this.orientation == 180) {
                return {
                    'ie9errormessage': "If you see a message about security, just select Yes",
                    'ievideosizelimitaionmessage': "Video file size too large. Please ensure your video is less than 10MB.",
                    'mediatype': "NotDefined",
                    'opconame': "NotDefined",
                    'passcode': "NotDefined",
                    'uploadsessiontime': 600000,
                    'uploadbuttonlabel': "Upload",
                    'uploadbuttonlabelcolor': "#fff",
                    'uploadbuttonbackgrouncolor': "#9FCC3B",
                    'uploadbuttonlabelfontsize': 36,
                    'inputfilelabel': "Choose File",
                    'inputfilelabelfontsize': 36,
                    'inputfilelabelcolor': "#fff",
                    'inputfilebackgrouncolor': "#9FCC3B",
                    'inputfiledefaultname': "No file chosen",
                    'inputfilenamecolor': "#000",
                    'inputfilenamefontsize': 36,
                    'errormessage': 'Please try again',
                    'successmessage': 'Upload successful, please continue',
                    'timeoutmessage': 'There was a problem uploading, please try again',
                    'mediatypeerrmsg': 'Please upload Image or Video or Audio file only.',
                    'imagefilesizeerrmsg': 'Image file size too large. Please ensure your Image is less than 5MB.',
                    'audiofilesizeerrmsg': 'Audio file size too large. Please ensure your Audio is less than 5MB.',
                    'videofilesizeerrmsg': 'Video file size too large. Please ensure your video is less than 30MB.',
                    'mediatypemissingerrmsg': 'Mediatype missing in question',
                    'opconamemissingerrmsg': 'Opconame missing in question',
                    'passcodemissingerrmsg': 'Passcode missing in question',
                    'webcam': false,
                    'webcamphotoname': 'Webcam_photo',
                    'webcamheight': 240,
                    'webcamwidth': 320,
                    'imageformat': 'jpeg',
                    'imagequality': 100,
                    'snapbuttonlabel': "Take snap",
                    'snapbuttonlabelcolor': "#fff",
                    'snapbuttonbackgrouncolor': "#9FCC3B",
                    'snapbuttonlabelfontsize': 36,
                    'loadingmessage': 'Content uploading',
                    'loadingmessagefontsize': 36,
                    'progressbarwidth': 90
                }
            } else {
                return {
                    'ie9errormessage': "If you see a message about security, just select Yes",
                    'ievideosizelimitaionmessage': "Video file size too large. Please ensure your video is less than 10MB.",
                    'mediatype': "NotDefined",
                    'opconame': "NotDefined",
                    'passcode': "NotDefined",
                    'uploadsessiontime': 600000,
                    'uploadbuttonlabel': "Upload",
                    'uploadbuttonlabelcolor': "#fff",
                    'uploadbuttonbackgrouncolor': "#9FCC3B",
                    'uploadbuttonlabelfontsize': 18,
                    'inputfilelabel': "Choose File",
                    'inputfilelabelfontsize': 18,
                    'inputfilelabelcolor': "#fff",
                    'inputfilebackgrouncolor': "#9FCC3B",
                    'inputfiledefaultname': "No file chosen",
                    'inputfilenamecolor': "#000",
                    'inputfilenamefontsize': 18,
                    'errormessage': 'Please try again',
                    'successmessage': 'Upload successful, please continue',
                    'timeoutmessage': 'There was a problem uploading, please try again',
                    'mediatypeerrmsg': 'Please upload Image or Video or Audio file only.',
                    'imagefilesizeerrmsg': 'Image file size too large. Please ensure your Image is less than 5MB.',
                    'audiofilesizeerrmsg': 'Audio file size too large. Please ensure your Audio is less than 5MB.',
                    'videofilesizeerrmsg': 'Video file size too large. Please ensure your video is less than 30MB.',
                    'mediatypemissingerrmsg': 'Mediatype missing in question',
                    'opconamemissingerrmsg': 'Opconame missing in question',
                    'passcodemissingerrmsg': 'Passcode missing in question',
                    'webcam': false,
                    'webcamphotoname': 'Webcam_photo',
                    'webcamheight': 240,
                    'webcamwidth': 320,
                    'imageformat': 'jpeg',
                    'imagequality': 100,
                    'snapbuttonlabel': "Take snap",
                    'snapbuttonlabelcolor': "#fff",
                    'snapbuttonbackgrouncolor': "#9FCC3B",
                    'snapbuttonlabelfontsize': 18,
                    'loadingmessage': 'Content uploading',
                    'loadingmessagefontsize': 18,
                    'progressbarwidth': 50
                }
            }
        case "PC":
        case "OTHERDEVICE":
        default:
            return {
                'ie9errormessage': "If you see a message about security, just select Yes",
                'ievideosizelimitaionmessage': "Video file size too large. Please ensure your video is less than 10MB.",
                'mediatype': "NotDefined",
                'opconame': "NotDefined",
                'passcode': "NotDefined",
                'uploadsessiontime': 600000,
                'uploadbuttonlabel': "Upload",
                'uploadbuttonlabelcolor': "#fff",
                'uploadbuttonbackgrouncolor': "#9FCC3B",
                'uploadbuttonlabelfontsize': 18,
                'inputfilelabel': "Choose File",
                'inputfilelabelfontsize': 18,
                'inputfilelabelcolor': "#fff",
                'inputfilebackgrouncolor': "#9FCC3B",
                'inputfiledefaultname': "No file chosen",
                'inputfilenamecolor': "#000",
                'inputfilenamefontsize': 18,
                'errormessage': 'Please try again',
                'successmessage': 'Upload successful, please continue',
                'timeoutmessage': 'There was a problem uploading, please try again',
                'mediatypeerrmsg': 'Please upload Image or Video or Audio file only.',
                'imagefilesizeerrmsg': 'Image file size too large. Please ensure your Image is less than 5MB.',
                'audiofilesizeerrmsg': 'Audio file size too large. Please ensure your Audio is less than 5MB.',
                'videofilesizeerrmsg': 'Video file size too large. Please ensure your video is less than 30MB.',
                'mediatypemissingerrmsg': 'Mediatype missing in question',
                'opconamemissingerrmsg': 'Opconame missing in question',
                'passcodemissingerrmsg': 'Passcode missing in question',
                'webcam': false,
                'webcamphotoname': 'Webcam_photo',
                'webcamheight': 240,
                'webcamwidth': 320,
                'imageformat': 'jpeg',
                'imagequality': 100,
                'snapbuttonlabel': "Take snap",
                'snapbuttonlabelcolor': "#fff",
                'snapbuttonbackgrouncolor': "#9FCC3B",
                'snapbuttonlabelfontsize': 18,
                'loadingmessage': 'Content uploading',
                'loadingmessagefontsize': 18,
                'progressbarwidth': 50
            }
    }
}

mediaupload.prototype.takeSnap = function() {
    console.log("take snap clicked");
    var webcamphotoname = this.getProperty("webcamphotoname");
    var imageformat = this.getProperty("imageformat");
	var ie9errormessage = this.getProperty("ie9errormessage");
    var qname = this.questionName;
    var that = this;
    var webcamphotofullname = webcamphotoname + '.' + imageformat;
    // take snapshot and get image data
    Webcam.snap(function(data_uri) {
        // display results in page
        var img = document.createElement("img");
        img.src = data_uri;
        var String = data_uri.substring(data_uri.lastIndexOf(":") + 1, data_uri.lastIndexOf(";"));
        $('#' + qname + 'WebcamSnap').html(img);
        that.saveEncodedData = bytes(data_uri) + ',' + String + ',' + data_uri;

        that.fileName = webcamphotofullname;
        if (webcamphotofullname.length > 24) {
            var fileNameShort = webcamphotofullname.substr(0, 12) + '...' + webcamphotofullname.slice(-12);
            $("#" + qname + "FlashFile").html(fileNameShort);
            $("#" + qname + "FlashFile").attr('title', webcamphotofullname);
        } else {
            $("#" + qname + "FlashFile").html(webcamphotofullname);
            $("#" + qname + "FlashFile").attr('title', webcamphotofullname);
        }


        if (browser.isIe() && browser.getVersion() <= 9) {
            if (browser.getVersion() <= 9) {
                that.componentContainer.find('.mrErrorText').remove();
                that.componentContainer.find('.mrQuestionText').before("<span class=\"mrErrorText\">" + ie9errormessage + "<br/></span>");
            }
        }
    });
}

function bytes(string) {
    var count = 0;
    var escaped_string = encodeURI(string);
    if (escaped_string.indexOf("%") != -1) {
        var count = escaped_string.split("%").length - 1;
        count = count == 0 ? 1 : count;
        count = count + (escaped_string.length - (count * 3));
    } else {
        count = escaped_string.length;
    }
    return count
}

var browser = {
    isIe: function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            return true;
            // IE 10 or older => return version number
            //return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            return true;
            // IE 11 => return version number
            //var rv = ua.indexOf('rv:');
            //return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            return true;
            // IE 12 => return version number
            //return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        // other browser
        return false;
    },
    navigator: navigator.appVersion,
    getVersion: function() {
        var version = 999; // we assume a sane browser
        if (navigator.appVersion.indexOf("MSIE") != -1)
        // bah, IE again, lets downgrade version number
            version = parseFloat(navigator.appVersion.split("MSIE")[1]);
        return version;
    }
};