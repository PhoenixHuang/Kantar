/**
 * autosum class
 * Inherits from SESurveyTool
 */

function animation(questionContainers, json, globalOpts) {
	
    SESurveyTool.prototype.init.call(this, questionContainers, json, globalOpts);
}
animation.prototype = Object.create(SESurveyTool.prototype);
animation.prototype.type = function() {
    return "animation";
}
animation.prototype.getDependencies = function() {
    return [
    ];
}


animation.prototype.setResponses = function() {

}

animation.prototype.build = function() {
	
		var header = this.getProperty("headeranimation");
		var middlecomponent = this.getProperty("componentanimation");
		var footer = this.getProperty("footeranimation");
		var container = this.getProperty("containeranimation");

		// Component Animation
		$(".question-text").addClass("animated "+header);
        $(".question-component").addClass("animated "+middlecomponent);
		$(".footer1").addClass("animated "+footer);
        $(".footer2").addClass("animated "+footer);
		$(".container").addClass("animated "+container);

		
    this.deferred.resolve();
/*

.bounce
.flash
.pulse
.rubberBand
.shake
.headShake
.swing
.tada
.wobble
.jello
.bounceIn
.bounceInDown
.bounceInLeft
.bounceInRight
.bounceInUp
.bounceOut
.bounceOutDown
.bounceOutLeft
.bounceOutRight
.bounceOutUp
.fadeIn
.fadeInDown
.fadeInDownBig
.fadeInLeft
.fadeInLeftBig
.fadeInRight
.fadeInRightBig
.fadeInUp
.fadeInUpBig
.fadeOut
.fadeOutDown
.fadeOutDownBig
.fadeOutLeft
.fadeOutLeftBig
.fadeOutRight
.fadeOutRightBig
.fadeOutUp
.fadeOutUpBig
.flipInX
.flipInY
.flipOutX
.flipOutY
.lightSpeedIn
.lightSpeedOut
.rotateIn
.rotateInDownLeft
.rotateInDownRight
.rotateInUpLeft
.rotateInUpRight
.rotateOut
.rotateOutDownLeft
.rotateOutDownRight
.rotateOutUpLeft
.rotateOutUpRight
.hinge
.rollIn
.rollOut
.zoomIn
.zoomInDown
.zoomInLeft
.zoomInRight
.zoomInUp
.zoomOut
.zoomOutDown
.zoomOutLeft
.zoomOutRight
.zoomOutUp
.slideInDown
.slideInLeft
.slideInRight
.slideInUp
.slideOutDown
.slideOutLeft
.slideOutRight
.slideOutUp

*/
}

animation.prototype.render = function() {
}


animation.prototype.toolOptions = function() {
	$.extend(this.options, this.options.animation);
            return {
                'headeranimation': "",
                'componentanimation': "",
                'footeranimation': "",
				'containeranimation': "fadeInRight",
				row: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				grid: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				column: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				rowGrid: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				},
				columnGrid: {
					extrasmall: {},
					small: {},
					medium: {},
					large: {},
					extralarge: {}
				}
            }
}