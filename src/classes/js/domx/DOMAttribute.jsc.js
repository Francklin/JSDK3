/**
 * @file DOMAttribute.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.25
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");

js.domx.DOMAttribute=function(){};
var _$class=js.domx.DOMAttribute;

_$class.$name="DOMAttribute";
_$class.$abstract=true;
_$class.$context=js.domx.DOM;
_$class.$extends(js.domx.DOMNode);
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
