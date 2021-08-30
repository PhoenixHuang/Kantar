window.onload=setStyles;
function setStyles()
{
     try
	{
        var parentObj = document.getElementById("ko-innersurveypage");	
		var calRefObj = document.getElementById("_Q0");	
		var imglens=document.getElementsByClassName("jetzoom-lens");
		parentObj.appendChild(imglens);
		
		var jetblank=document.getElementsByClassName("jetzoom-blank");
		parentObj.appendChild(jetblank);
		
		var imgloader=document.getElementsByClassName("jetzoom-ajax-loader");
		parentObj.appendChild(imgloader);
		
		
		}
		catch(err)
	{
		alert(err.message)
	}
}	