/**
 * @file XMLNodeList.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.25
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.XML");

js.domx.XMLNodeList=function(){};
var _$class=js.domx.XMLNodeList;

_$class.$name="XMLNodeList";
_$class.$context=js.domx.XML;
_$class.$extends(js.domx.DOMNodeList);
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
