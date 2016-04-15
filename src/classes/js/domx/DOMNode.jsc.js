/**
 * @file DOMNode.class.js
 * @author Liu Denggao
 * @created 2012.5.23
 * @modified 2012.5.25
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");
$import("js.domx.DOMObject");

js.domx.DOMNode=function(){};
var _$class=js.domx.DOMNode;

_$class.$name="DOMNode";
_$class.$abstract=true;
_$class.$context=js.domx.DOM;
_$class.$extends(js.domx.DOMObject);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getNodeType=function(){
	return this.__original.nodeType;
}
_$proto.getNodeName=function(){
	return this.__original.nodeName;
}
_$proto.getNodeValue=function(){
	return this.__original.nodeValue;
}
_$proto.getOwnerDocument=function(){
	return this.getClass().getContainer().obj(this.__original.ownerDocument);
}
_$proto.getParentNode=function(){
	return this.getClass().getContext().obj(this.__original.parentNode);
}
_$proto.getChildNodes=function(){
	return this.getClass().getContext().obj(this.__original.childNodes,"NodeList");
}
_$proto.getFirstChild=function(){
	return this.getClass().getContext().obj(this.__original.firstChild);
}
_$proto.getNextSibling=function(){
	return this.getClass().getContext().obj(this.__original.nextSibling);
}
_$proto.getPreviousSibling=function(){
	return this.getClass().getContext().obj(this.__original.previousSibling);
}
_$proto.getLastChild=function(){
	return this.getClass().getContext().obj(this.__original.lastChild);
}
_$proto.getTextContent=function(){
	var text=this.__original.text||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}

//:method-------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
_$proto.hasAttributes=function(){
	return this.__original.hasAttributes();
}
_$proto.hasChildNodes=function(){
	return this.__original.hasChildNodes();
}
_$proto.appendChild=function(node){
	var el=this.getClass().getContext().obj(node);
	this.__original.appendChild(el.valueOf());
	return el;
}
_$proto.cloneNode=function(cloneAll){
	var el=this.__original.cloneNode(!!cloneAll);
	return this.getClass().getContext().obj(el);
}
_$proto.insertBefore=function(oNewNode, oChildNode){
	var el=this.getClass().getContext().obj(oNewNode);
	if(!oChildNode){
		this.__original.insertBefore(el.valueOf());
	}else{
		var el1=this.getClass().getContext().obj(oChildNode);
		this.__original.insertBefore(el.valueOf(),el1.valueOf());
	}
	return el;
}
_$proto.removeChild=function(el){
	var el=this.getClass().getContext().obj(el);
	var el1=this.__original.removeChild(el.valueOf());
	return el1?el:ell;
}
_$proto.replaceChild=function(newNode,oldNode){
	var el1=this.getClass().getContext().obj(newNode);
	var el2=this.getClass().getContext().obj(oldNode);
	var el3=this.__original.replaceChild(el1.valueOf(),el2.valueOf());
	return el3?el2:el3;
}
