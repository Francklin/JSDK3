/**
 * @file DOMObject.js
 * @author Liu Denggao
 * @created 2012.3.13
 * @modified 2012.3.13
 * @version 0.1
 * @since JSDK3
 */

$package("js.dom");
js.dom.DOMObject=function(){};
var _$class=js.dom.DOMObject;
var _$proto=_$class.prototype;

_$class.$name="DOMObject";
_$proto.$class=_$class;

//:property-------------------------

_$class.getName = function() {
	return this.$name;
}
_$proto.getClass=function(){
	return this.$class;
}