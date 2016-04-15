/**
 * for Opera
 * @created: 2011.9.28
 * @modified: 2013.12.13
 */
function(Engine,Browser,window,rootHome){
	_jsre._ce.addNamespace("global",{STR_NewLine:"\r\n"},true);
	_jsre.globalEval(_jsre.getFileResource(rootHome.right(_jsre._rootHome+"/")+"/patch/patch-IE.js"));
	js.dom.DOMWindow.applyInstance(window,"copy",true);
	js.dom.HTMLDocument.applyInstance(window.document,"copy",true);
}