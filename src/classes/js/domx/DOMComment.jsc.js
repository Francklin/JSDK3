/**
 * @file DOMComment.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.25
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");

js.domx.DOMComment=function(){};
var _$class=js.domx.DOMComment;

_$class.$name="DOMComment";
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



