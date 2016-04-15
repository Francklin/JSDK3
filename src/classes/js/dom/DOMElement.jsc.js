/**
 * @file DOMElement.js
 * @invoke: DOMElement.applyInstance(el)
 * @author Liu Denggao
 * @date 2010.01.04-2010.03.13
 * @modified 2011.6.21
 * @version 0.3
 * @since JSDK3
 */

$package("js.dom");
js.dom.DOMElement=function(oObj){
	this.__srcObj=oObj;
};
var _$class=js.dom.DOMElement;
_$class.$extends("Object");
var _$proto=_$class.prototype;

_$class.$name="DOMElement";

//:property-------------------------

_$class.getName = function() {
	return this.$name;
}

_$proto.getFirstChild=function(){
	var childNodes=this.childNodes;
	for(var i=0,len=childNodes.length;i<len;i++){
		if(childNodes[i].nodeName=="#text") continue;
		return childNodes[i];
	}
}
_$proto.getNextSibling=function(){
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
_$proto.getPreviousSibling=function(){
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
_$proto.getLastChild=function(){
	var childNodes=this.childNodes;
	for(var i=childNodes.length-1;i>=0;i--){
		if(childNodes[i].nodeName=="#text") continue;
		return childNodes[i];
	}
}
_$proto.getText=function(){
	return this.text.replace(/^(\n|\r)/,"");
}