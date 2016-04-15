/**
 * @version: V0.1
 * @author: liu denggao
 * @created: 2014.8.8
 * @modified: 2014.8.8
 * @homepage: http://www.tringsoft.com
 **************************************/

(function(){

if(typeof(HTMLElement)!="undefined"){
	//for IE11+
	typeof(HTMLElement.prototype.all)!="undefined"||Object.defineProperty(HTMLElement.prototype,"all",{
		get: function(){
			return this.getElementsByTagName("*");
		}
	});
	//for IE11+
	HTMLElement.prototype.attachEvent||(HTMLElement.prototype.attachEvent=function($name, $handler) {
		this.addEventListener($name.replace(/^on/,""), $handler, false);
	});
}
if(typeof(Element)!="undefined"){
	Object.defineProperty(Element.prototype,"$childNodes",{
		get: function(){
			var retValues=[];
			var childNodes=this.childNodes;
			for(var i=0,iLen=childNodes.length;i<iLen;i++){
				if(childNodes[i].nodeName=="#text") continue;
				retValues[retValues.length]=childNodes[i];
			}
			return retValues;
		}
	});
	Object.defineProperty(Element.prototype,"$firstChild",{
		get: function(){
			var childNodes=this.childNodes;
			for(var i=0,len=childNodes.length;i<len;i++){
				if(childNodes[i].nodeName=="#text") continue;
				return childNodes[i];
			}
		}
	});
	Object.defineProperty(Element.prototype,"$nextSibling",{
		get: function(){
			var el;
			if(!this.nextSibling){
				return null;
			}else if(this.nextSibling.nodeType==3) {
				el=this.nextSibling.nextSibling; // Moz. Opera
			}else {
				el=this.nextSibling; // IE
			}
			return el;
		}
	});
	Object.defineProperty(Element.prototype,"$previousSibling",{
		get: function(){
			var el;
			if(!this.previousSibling){
				return null;
			}else if(this.previousSibling.nodeType==3) {
				el=this.previousSibling.previousSibling; // Moz. Opera
			}else {
				el=this.previousSibling; // IE
			}
			return el;
		}
	});
	Object.defineProperty(Element.prototype,"$lastChild",{
		get: function(){
			var childNodes=this.childNodes;
			for(var i=childNodes.length-1;i>=0;i--){
				if(childNodes[i].nodeName=="#text") continue;
				return childNodes[i];
			}
		}
	});
}
if(typeof(Element)!="undefined"&&typeof(Element.prototype.tagName)!="undefined"){
	//for IE9+
	Object.defineProperty(Element.prototype,"xml",{
		get: function(){
			try {
				return new XMLSerializer().serializeToString( this );
			} catch(ex){
				var d = document.createElement("div");
				d.appendChild(this.cloneNode(true));
				return d.innerHTML;
			}
		}
	});
	//for IE9+
	Object.defineProperty(Element.prototype,"text",{
		get: function(){
			return this.textContent.replace(/^[\s\r\n]*/g, '').replace(/[\s\r\n]*$/g, '');
		}
	});
}
if(typeof(Node)!="undefined"){
	Object.defineProperty(Node.prototype,"$childNodes",{
		get: function(){
			var retValues=[];
			var childNodes=this.childNodes;
			for(var i=0,iLen=childNodes.length;i<iLen;i++){
				if(childNodes[i].nodeName=="#text") continue;
				retValues[retValues.length]=childNodes[i];
			}
			return retValues;
		}
	});
	Object.defineProperty(Node.prototype,"$firstChild",{
		get: function(){
			var childNodes=this.childNodes;
			for(var i=0,len=childNodes.length;i<len;i++){
				if(childNodes[i].nodeName=="#text") continue;
				return childNodes[i];
			}
		}
	});
	Object.defineProperty(Node.prototype,"$nextSibling",{
		get: function(){
			var el;
			if(!this.nextSibling){
				return null;
			}else if(this.nextSibling.nodeType==3) {
				el=this.nextSibling.nextSibling; // Moz. Opera
			}else {
				el=this.nextSibling; // IE
			}
			return el;
		}
	});
	Object.defineProperty(Node.prototype,"$previousSibling",{
		get: function(){
			var el;
			if(!this.previousSibling){
				return null;
			}else if(this.previousSibling.nodeType==3) {
				el=this.previousSibling.previousSibling; // Moz. Opera
			}else {
				el=this.previousSibling; // IE
			}
			return el;
		}
	});
	Object.defineProperty(Node.prototype,"$lastChild",{
		get: function(){
			var childNodes=this.childNodes;
			for(var i=childNodes.length-1;i>=0;i--){
				if(childNodes[i].nodeName=="#text") continue;
				return childNodes[i];
			}
		}
	});
	//for IE9+
	Node.prototype.selectSingleNode||(Node.prototype.selectSingleNode=function (xpath){
		var x = this.selectNodes(xpath);
		if (!x.length) return null ;
		return x[0];
	});
	//for IE9+
	Node.prototype.selectNodes||(Node.prototype.selectNodes=function (xpath){
		var _xml=new XMLSerializer().serializeToString(this);
		var _xmlDom=__JSDK_Namespace__._xmlDom;
		_xmlDom.loadXML(_xml.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
		
		return _xmlDom.selectNodes(xpath);
	});
}

})();