/**
 * @file XMLDocument.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.24
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.XML");

js.domx.XMLDocument=function(){};

var _$class=js.domx.XMLDocument;

_$class.$name="XMLDocument";
_$class.$context=js.domx.XML;
_$class.$extends(js.domx.XMLNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getDoctype=function(){
	return this.__original.doctype;
}
_$proto.getDocumentElement=function(){
	return this.getClass().getContext().obj(this.__original.documentElement,"Element");
}
_$proto.getText=function(){
	var text=this.__original.text||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}

//:method----

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
_$proto.createElement=function(tagName){
	return this.getClass().getContext().obj(this.__original.createElement(tagName),"Element");
}
_$proto.createTextNode=function(text){
	return this.getClass().getContext().obj(this.__original.createTextNode(text),"Text");
}
_$proto.getElementById=function(id){
	return this.getClass().getContext().obj(this.__original.getElementById(id),"Element");
}
_$proto.getElementsByTagName=function(tagName){
	return this.getClass().getContext().obj(this.__original.getElementsByTagName(tagName),"ElementList");
}