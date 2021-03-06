/**
 * @file DOMObject.class.js
 * @author Liu Denggao
 * @created 2012.5.23
 * @modified 2012.5.23
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");

js.domx.DOMObject=function(){
	this.__original=null;
};
var _$class=js.domx.DOMObject;
var _$proto=_$class.prototype;

_$class.$name="DOMObject";
_$class.$abstract=true;
_$class.$context=js.domx.DOM;
_$proto.$class=_$class;

//:property-------------------------

_$class.getName = function() {
	return this.$name;
}
_$class.toString = function(){
	return ("[Object " + this.getName() + "]");
}
_$proto.getClass=function(){
	return this.$class;
}
_$proto.getOriginal=function(){
	return this.__original;
}
_$proto.toString = function(){
	return ("[object " + this.getClass().getName() + "]");
}
_$proto.valueOf = function(){
	return this.__original;
}
_$proto.instanceOf=function (clazz) {
	return  this instanceof clazz;
}

//:method-----------

_$class.getContext=function(){
	return this.$context;
}
_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
