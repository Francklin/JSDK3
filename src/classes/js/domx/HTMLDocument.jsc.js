/**
 * @file HTMLDocument.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.24
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");

js.domx.HTMLDocument=function(){};

var _$class=js.domx.HTMLDocument;

_$class.$name="HTMLDocument";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLNode);
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
_$proto.getBody=function(){
	return this.getClass().getContext().obj(this.__original.body,"Element");
}
_$proto.getCookie=function(){
	return this.__original.cookie;
}
_$proto.getDomain=function(){
	return this.__original.domain;
}
_$proto.setDomain=function(name){
	this.__original.domain=name;
}
_$proto.getReferrer=function(){
	return this.__original.referrer;
}
_$proto.getTitle=function(){
	return this.__original.title;
}
_$proto.setTitle=function(text){
	this.__original.title=text;
}
_$proto.getURL=function(){
	return this.__original.URL;
}
_$proto.getCharset=function(){
	return this.__original.charset;
}
_$proto.setCharset=function(sCharset){
	this.__original.charset=sCharset;
}

//:collection-----------

_$proto.getAll=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.all,"ElementList");
	else return this.getClass().getContext().obj(this.__original.all[index],"Element");
}
_$proto.getFrames=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.frames,"ElementList");
	else return this.getClass().getContext().obj(this.__original.frames[index],"Element");
}
_$proto.getScripts=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.scripts,"ElementList");
	else return this.getClass().getContext().obj(this.__original.scripts[index],"Element");
}
_$proto.getForms=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.forms,"ElementList");
	else return this.getClass().getContext().obj(this.__original.forms[index],"Element");
}
_$proto.getImages=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.images,"ElementList");
	else return this.getClass().getContext().obj(this.__original.images[index],"Element");
}
_$proto.getLinks=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.links,"ElementList");
	else return this.getClass().getContext().obj(this.__original.links[index],"Element");
}
_$proto.getAnchors=function(index){
	if(index==undefined) return this.getClass().getContext().obj(this.__original.anchors,"ElementList");
	else return this.getClass().getContext().obj(this.__original.anchors[index],"Element");
}

//:method------------

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
_$proto.getElementsByName=function(name){
	return this.getClass().getContext().obj(this.__original.getElementsByName(name),"ElementList");
}
_$proto.open=function(){
	this.__original.open();
}
_$proto.write=function(text){
	this.__original.write(text);
}
_$proto.writeln=function(text){
	this.__original.writeln(text);
}
_$proto.close=function(){
	this.__original.close();
}