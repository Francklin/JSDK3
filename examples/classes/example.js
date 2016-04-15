var example={
	title: function(){
		var pathname=window.location.pathname.replace(/\\/,"/").rightBack("classes/").leftBack(".");
		return "Examples: Classes>"+(pathname.indexOf("@")>0?pathname.leftBack("/").replace("@",""):pathname).replace(/\//g,".");
	}()
}
