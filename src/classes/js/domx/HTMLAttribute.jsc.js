/**
 * @file HTMLAttribute.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.28
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.HTML");

js.domx.HTMLAttribute=function(){};
var _$class=js.domx.HTMLAttribute;

_$class.$name="HTMLAttribute";
_$class.$abstract=true;
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getName=function(){
	return this.__original.name;
}
_$proto.getValue=function(){
	return this.__original.value;
}
_$proto.getOwnerElement=function(){
	return this.getClass().getContext().obj(this.__original.ownerElement);
}

//:method-------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
