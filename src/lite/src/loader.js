var loader=window["__JSDK_Namespace__"]={};
loader.getXMLHttpRequest=function () {
	// Create XMLHttpRequest Object
	var progId, progIds = ["MSXML2.XMLHTTP.6.0"
		, "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
	return function () {
		var flag=-1;
		if(progId){
			return new ActiveXObject(progId);
		}else if(window.location.host==""){
			flag=typeof(ActiveXObject)!="undefined"?0:1;
		}else if(typeof(XMLHttpRequest)!="undefined"){
			flag=1;
		}else if(typeof(ActiveXObject)!="undefined"){
			flag=0;
		}
		if(flag==1){
			return new XMLHttpRequest();
		}else{
			for (var i = 0; i < progIds.length; i++) {
				try	{
					return new ActiveXObject(progId = progIds[i]);
				} catch (ex) {
					progId = null;
				}
			}
		}
	};
}();
loader.getXMLDOMDocument=function () {
	var progId, progIds = ["MSXML2.DOMDocument.6.0"
		, "MSXML2.DOMDocument", "Microsoft.XMLDOM"];
	return function () {
		if (typeof(ActiveXObject)=="undefined") {
			return null;
		} else if (progId != null) {
			return new ActiveXObject(progId);
		} else {
			for (var i = 0; i < progIds.length; i++) {
				try	{
					return new ActiveXObject(progId = progIds[i]);
				} catch (ex) {
					progId = null;
				}
			}
		}
	};
}();
loader.getXMLDOMParser=function () {
	return function(){
		if (typeof(DOMParser)!="undefined") {
			return new DOMParser();
		}
	}
}();