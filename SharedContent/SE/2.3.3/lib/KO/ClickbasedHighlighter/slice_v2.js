var MakeDiv = function(){
var propertiesObj = new Object();
var str,n;
var id,k;
var output=[];
var divmain;
var redraw;
function init(props)
	{
		var ht;
		
		propertiesObj = props;
		//Below code changes based on layout 
		$('#'+propertiesObj.contnrId).css({height:(parseInt(propertiesObj.imgheight)+200)+"px"})
		str=propertiesObj.sliceinfo;
		redraw=$("#_Q0").val();
         $("#_Q0").hide();
        n=str.split("#");
        
		loadimg();
       		
		setdiv();
		
	}
	
function loadimg()
{
img = new Image();
img.onload = function() {
			
			$("#divmain").css("visibility","visible");
			$("#"+propertiesObj.preloadimgid).css("display","none");
			//document.getElementById('divmain').style.visibility = "visible"
		    //document.getElementById(propertiesObj.preloadimgid).style.display = "none"
		};
		
		img.onerror=function() {
		
		 alert("Image not found");
		};
	img.src = propertiesObj.imgpath;
}	
	

function setdiv()
{	 

	 for(i=0;i<n.length;i++)
	 {
	   output.push(0);
	 }
	 var questionsPD = $("#questions").css("padding-left");
	 var questionsPD = questionsPD.replace("px","");
	 var leftmargin = parseInt(propertiesObj.imgwidth) + parseInt(questionsPD);
	 
	 if(propertiesObj.compRTL == true){
	 var mrgn=($(document).width()-leftmargin)/2;
	 if($(document).width()>=1200)
	  mrgn=20*9;
	  
	 }else{
	 var mrgn=($(document).width()-parseInt(propertiesObj.imgwidth))/6;
	 if($(document).width()>=1200)
	  mrgn=20;
	 }
	 //alert(mrgn);

	 
	 if(propertiesObj.compRTL == true){
	var cntr=document.createElement("center")
	cntr.setAttribute("style", "direction:ltr;");
	}else{
	var cntr=document.createElement("center")
	}
	
	 divmain=document.createElement("div");
	 $(divmain).attr({id:'divmain'})
	 divmain.style.position='absolute';
	 
	 divmain.style.cursor='crosshair';
	 divmain.style.userselect='none';
	 if(parseInt(propertiesObj.imgwidth)<$(document).width())
	 divmain.style.marginLeft=mrgn+'px'
	 $(cntr).append(divmain)
	 $('#'+propertiesObj.contnrId).append(cntr)
         
	 
	 document.getElementById('divmain').style.visibility = "hidden"
	
	 var divimg=document.createElement("img")
	 $(divimg).attr({id:'imgid',src:propertiesObj.imgpath});
	 divimg.style.position='absolute';
	 divimg.style.width=propertiesObj.imgwidth;
	 divimg.style.height=propertiesObj.imgheight;
	 $('#divmain').append(divimg)
	 
     document.getElementById('divmain').style.width=$('#imgid').width();
	 document.getElementById('divmain').style.height=$('#imgid').height();
	 
   for(i=0;i<n.length;i++)
	 {
	  
	  var n2=n[i].toString();
	 
	  
	  var n3=n2.split("$");
	  
	  for(j=0;j<n3.length;j++)
	  {
	   n1=n3[j].toString();
	   
	  n1=n1.split(",");
	  var divcrt=document.createElement("div")
	  
	  
	    $(divcrt).attr('class',i+1)
	       divcrt.style.position='absolute';
		   divcrt.style.userselect='none';
		   divcrt.style.left=n1[0]+'px';
		   divcrt.style.top=n1[1]+'px';
		   divcrt.style.width=n1[2]+'px';
		   divcrt.style.height=n1[3]+'px';
		   divcrt.style.backgroundColor=propertiesObj.likeslicecolor;
		   $(divcrt).css("opacity","0")
		   		   
		   $('#divmain').append(divcrt)
		   $(divcrt).bind("mousedown",mousedown_div);
       }    		   
	
	 
	}
	
	if(redraw!='')
	redrawslice()
	
	
	var ver = getInternetExplorerVersion();
	
	var span=document.createElement("span")
	
	var cntr1=document.createElement("center")
	
	if(propertiesObj.compRTL == true){
	var cntr1=document.createElement("center")
	cntr1.setAttribute("style", "float:right;");
	}else{
	var cntr1=document.createElement("center")
	}
	
	$('#'+propertiesObj.contnrId).append(cntr1)
	
	if(propertiesObj.clearBTNShow)
	{
	var btn=document.createElement("input")
	 $(btn).attr({id:'noopt',type:'button',value:propertiesObj.clearBTN});
	 $(btn).css({background:propertiesObj.buttonBGColor,position:'relative', color:propertiesObj.buttonTextColor, border: 'solid 2px #FFF', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px',paddingBottom: '5px', borderRadius: '5px',cursor:'pointer'});
	 
	 if (ver > -1) {
        if (ver >= 9.0)
            btn.style.top=(parseInt(propertiesObj.imgheight)+5)+'px';
        else
            btn.style.top=(parseInt(propertiesObj.imgheight)+5)+'px';
	}	
    else	
	 btn.style.top=(parseInt(propertiesObj.imgheight)+5)+'px';
	
	 $(cntr1).append(span)
	 $(span).append(btn)
	 $(btn).bind("click",click_btn);
	
	}
	
	if(propertiesObj.noopinion)
	{
	  var btn2=document.createElement("input")
	   $(btn2).attr({id:'noopt',type:'button',value:propertiesObj.noopinionBTN});
	   $(btn2).css({background: propertiesObj.buttonBGColor,position:'relative', color:propertiesObj.buttonTextColor, border: 'solid 2px #FFF', paddingLeft: '10px', paddingRight: '10px', paddingTop: '5px',paddingBottom: '5px', borderRadius: '5px',cursor:'pointer'});
	   if (ver > -1) {
         if (ver >= 9.0)
            btn2.style.top=(parseInt(propertiesObj.imgheight)+5)+'px';
         else
            btn2.style.top=(parseInt(propertiesObj.imgheight)+5)+'px';
	    }	
      else	
	   btn2.style.top=(parseInt(propertiesObj.imgheight)+5)+'px';
	  $(cntr1).append(span)
	  $(span).append(btn2)
	  $(btn2).bind("click",click_btn2);
	}
	
	 
	 var cntr2=document.createElement("center")
	$('#'+propertiesObj.contnrId).append(cntr2)
    var txtbx=document.createElement("input")
	 $(txtbx).attr({id:'txtbx',type:'text'})
	 txtbx.style.position='relative';
	 if (ver > -1) {
        if (ver >= 9.0)
            txtbx.style.top=(parseInt(propertiesObj.imgheight)+30)+'px';
        else
            txtbx.style.top=(parseInt(propertiesObj.imgheight)+30)+'px';
	}	
    else	
	 txtbx.style.top=(parseInt(propertiesObj.imgheight)+30)+'px';
	
	 txtbx.style.width='600px';
	 txtbx.style.height='5px';
	
     $(cntr2).append(txtbx);
	 
	document.getElementById('txtbx').style.visibility = "hidden" 
	
}




function redrawslice()
{
redraw=redraw.split("#");
var clrtboxflag=0;
  for(i=0;i<redraw.length;i++)
   {
      var split1=redraw[i].toString();
	  split1=split1.split(":");
	  output[i]=split1[1];
	  if(split1[1]==0)
	   {
	     $('.'+(i+1)).css("opacity","0");
		 $('.'+(i+1)).css("backgroundColor",propertiesObj.likeslicecolor);
	   }
	  else if(split1[1]==1) 
	   {
	    $('.'+(i+1)).css("opacity",propertiesObj.opacityval);
		$('.'+(i+1)).css("backgroundColor",propertiesObj.likeslicecolor);
		clrtboxflag=1;
	   }
	   else if(split1[1]==2) 
	   {
	    $('.'+(i+1)).css("opacity",propertiesObj.opacityval);
		$('.'+(i+1)).css("backgroundColor",propertiesObj.unlikeslicecolor);
		clrtboxflag=1;
	   }
	   
   }
   if(clrtboxflag==0)
    $("#_Q0").val('');
   
}


function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}


function click_btn()
{
      var text='';
	  for(i=0;i<n.length-1;i++)
	 {
	   text=text+('slice'+(i+1)+':'+0+"#");
	 }
	 text=text+('slice'+(i+1)+':'+0);
	 
	 $('#txtbx').val('');
	 $('#_Q0').val('')
	for(i=0;i<n.length;i++)
	 {
	   
	      $('.'+(i+1)).css("backgroundColor",propertiesObj.likeslicecolor);
		  $('.'+(i+1)).css("opacity","0");
		  output[i]=0;
		  
	  }
}


function click_btn2()
{
      var text='';
	  for(i=0;i<n.length-1;i++)
	 {
	   text=text+('slice'+(i+1)+':'+0+"#");
	 }
	 text=text+('slice'+(i+1)+':'+0);
	 $('#txtbx').val(text);
	 $('#_Q0').val(text);
	
	for(i=0;i<n.length;i++)
	 {
	   
	      $('.'+(i+1)).css("backgroundColor",propertiesObj.likeslicecolor);
		  $('.'+(i+1)).css("opacity","0");
		  output[i]=0;
		  
	  }
	  document.forms[0].submit()
}




function mousedown_div()
	{
	   var cls=$(this).attr('class')
	   var color = new RGBColor(propertiesObj.likeslicecolor);
	   
	  //alert($('.'+cls).css("backgroundColor"))
	  
	  if(propertiesObj.neutral && propertiesObj.like &&  propertiesObj.dislike)
	  {
		if($('.'+cls).css("opacity")==0)
		{
		 $('.'+cls).css("opacity",propertiesObj.opacityval);
		 output[cls-1]=1;
		 }
		else if($('.'+cls).css("backgroundColor")==color.toRGB())
		{
		$('.'+cls).css("backgroundColor",propertiesObj.unlikeslicecolor);
		$('.'+cls).css("opacity",propertiesObj.opacityval);
		output[cls-1]=2;
		}
		else
		{
          $('.'+cls).css("backgroundColor",propertiesObj.likeslicecolor);
		  $('.'+cls).css("opacity","0");
		  output[cls-1]=0;
		}
	  }
	  else if(propertiesObj.neutral&& propertiesObj.dislike)
     {
	  
	   if($('.'+cls).css("opacity")==0)
		{
		 $('.'+cls).css("opacity",propertiesObj.opacityval);
		 $('.'+cls).css("backgroundColor",propertiesObj.unlikeslicecolor);
		 output[cls-1]=2;
		 }
		 else
		{
          //$('.'+cls).css("backgroundColor",propertiesObj.likeslicecolor);
		  $('.'+cls).css("opacity","0");
		  output[cls-1]=0;
	 }
	 }
     else if(propertiesObj.neutral&& propertiesObj.like)
     {
	  
	   if($('.'+cls).css("opacity")==0)
		{
		 $('.'+cls).css("opacity",propertiesObj.opacityval);
		 output[cls-1]=1;
		 }
		 else
		{
          //$('.'+cls).css("backgroundColor",propertiesObj.likeslicecolor);
		  $('.'+cls).css("opacity","0");
		  output[cls-1]=0;
	 }
	 }
	 else{
	      alert("Invalid Selction of Interests");
	 } 
		
		var text='';
	  for(i=0;i<n.length-1;i++)
	 {
	   text=text+('slice'+(i+1)+':'+output[i]+"#");
	 }
	 text=text+('slice'+(i+1)+':'+output[i]);
	 $('#txtbx').val(text);
         $('#_Q0').val(text)
         //document.getElementById(propertiesObj.outputtxtboxid).val=(text);
          
	}


return {
        init : init                
       }
}
