/**
 * @file XMLText.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.24
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.XML");

js.domx.XMLText=function(){
	this._data="";
};
var _$class=js.domx.XMLText;

_$class.$name="XMLText";
_$class.$abstract=true;
_$class.$context=js.domx.XML;
_$class.$extends(js.domx.XMLNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$proto.getData=function(){
	return this._data;
}
_$proto.getLength=function(){
	return this._data.length;
}

//:method-------

_$class.getContext=function(){
	return this.$context;
}
_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	var text=original.data.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
	obj.__original=original;
	obj._data=text;
	return obj;
}

