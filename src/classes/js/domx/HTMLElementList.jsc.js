/**
 * @file HTMLElementList.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.28
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.HTML");

js.domx.HTMLElementList=function(){}

var _$class=js.domx.HTMLElementList;

_$class.$name="HTMLElementList";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLNodeList);
var _$proto=_$class.prototype;

//:property---------

_$class.getContext=function(){
	return this.$context;
}

//:method--------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	obj._isArray=Global.isArray(original);
	return obj;
}
