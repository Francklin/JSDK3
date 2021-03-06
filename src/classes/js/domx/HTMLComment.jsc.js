/**
 * @file HTMLComment.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.28
 * @version 1.0
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.HTML");

js.domx.HTMLComment=function(){
	this._data="";
};
var _$class=js.domx.HTMLComment;

_$class.$name="HTMLComment";
_$class.$abstract=true;
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getData=function(){
	return this._data;
}
_$proto.getLength=function(){
	return this._data.length;
}

//:method-------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	var text=original.data.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
	text=text||(original.data==""?"":" ");
	obj.__original=original;
	obj._data=text;
	return obj;
}

