/**
 * @file XMLElement.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.25
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOMElement");
$import("js.domx.XML");

js.domx.XMLElement=function(){};
var _$class=js.domx.XMLElement;

_$class.$name="XMLElement";
_$class.$context=js.domx.XML;
_$class.$extends(js.domx.XMLNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getTagName=function(){
	return this.__original.tagName;
}
_$proto.getAttributes=function(){
	return this.__original.attributes;
}
_$proto.getChildNodes=function(){
	var retValues=[];
	var childNodes=this.__original.childNodes;
	for(var i=0,iLen=childNodes.length;i<iLen;i++){
		var node=childNodes[i];
		if(node.nodeType==3&&node.data
			.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") continue;
		retValues[retValues.length]=childNodes[i];
	}
	return this.getClass().getContext().obj(retValues,"NodeList");
}
_$proto.getFirstChild=function(){
	var childNodes=this.__original.childNodes;
	for(var i=0,len=childNodes.length;i<len;i++){
		var node=childNodes[i];
		if(node.nodeType==3&&node.data
			.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") continue;
		return this.getClass().getContext().obj(node);
	}
}
_$proto.getNextSibling=function(){
	var el=this.__original.nextSibling;
	if(!el){
		return null;
	}else if(el.nodeType==3&&el.data
		.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") {
		el=el.nextSibling; // Moz. Opera
	}
	return this.getClass().getContext().obj(el);
}
_$proto.getPreviousSibling=function(){
	var el=this.__original.previousSibling;
	if(!el){
		return null;
	}else if(el.nodeType==3&&el.data
		.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") {
		el=el.previousSibling; // Moz. Opera
	}
	return this.getClass().getContext().obj(el);
}
_$proto.getLastChild=function(){
	var childNodes=this.__original.childNodes;
	for(var i=childNodes.length-1;i>=0;i--){
		var node=childNodes[i];
		if(node.nodeType==3&&node.data
			.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") continue;
		return this.getClass().getContext().obj(node);
	}
}
_$proto.getTextContent=function(){
	var text=this.__original.text||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}
_$proto.getText=function(){
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
_$proto.getAttribute=function(name){
	return this.__original.getAttribute(name);
}
_$proto.getElementsByTagName=function(tagName){
	return this.getClass().getContext().obj(this.__original.getElementsByTagName(tagName),"Element");
}
_$proto.hasAttribute=function(name){
	if(this.__original.hasAttribute) return this.__original.hasAttribute(name);
	else return typeof(this.__origibal.getAttribute(name))!="undefined";
}
_$proto.setAttribute=function(name,value){
	this.__original.setAttribute(name,value);
}