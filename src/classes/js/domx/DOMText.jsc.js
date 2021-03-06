/**
 * @file DOMText.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.25
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");

js.domx.DOMText=function(){};
var _$class=js.domx.DOMText;

_$class.$name="DOMText";
_$class.$abstract=true;
_$class.$context=js.domx.DOM;
_$class.$extends(js.domx.DOMNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getData=function(){
	return this.__original.data;
}
_$proto.getLength=function(){
	return this.__original.length;
}

//:method-------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
