/**
 * for IE
 * @created: 2011.9.28
 * @modified: 2014.8.8
 */
function(Engine,Browser,window,rootHome){
	_jsre._ce.addNamespace("global",{STR_NewLine:"\r\n"},true);
	if(Browser.Engine.version>=7&&window.constructor){	//for IE11+
		_jsre.globalEval(_jsre.getFileResource(rootHome.right(_jsre._rootHome+"/")+"/patch/all-patch-std.js"));
		js.dom.DOMWindow.applyInstance(window,"copy",true);
		js.dom.HTMLDocument.applyInstance(window.document,"copy",true);
	}else if(Browser.Engine.version>=5&&window.constructor){	//for IE9+
		_jsre.globalEval(_jsre.getFileResource(rootHome.right(_jsre._rootHome+"/")+"/patch/all-patch-std.js"));
		js.dom.DOMWindow.applyInstance(window,"copy",true);
		js.dom.HTMLDocument.applyInstance(window.document,"copy",true);
	}else if(Browser.Engine.version>=4&&window.constructor){	//for IE8+
		_jsre.globalEval(_jsre.getFileResource(rootHome.right(_jsre._rootHome+"/")+"/patch/all-patch-std.js"));
		js.dom.DOMWindow.applyInstance(window,"copy",true);
		js.dom.HTMLDocument.applyInstance(window.document,"copy",true);
	}else{
		js.dom.DOMWindow.applyInstance(window,"instance",true);
		js.dom.HTMLDocument.applyInstance(window.document,"instance",true);
	}
}