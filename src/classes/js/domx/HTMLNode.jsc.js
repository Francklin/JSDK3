/**
 * @file HTMLNode.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.25
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.HTML");

js.domx.HTMLNode=function(){};
var _$class=js.domx.HTMLNode;

_$class.$name="HTMLNode";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.DOMNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getTextContent=function(){
	var text=this.__original.text||this.__original.textContent||"";
	var text1=text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
	return text1||(text?" ":"");
}

//:method----------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}