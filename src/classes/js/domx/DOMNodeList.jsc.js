/**
 * @file DOMNodeList.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.25
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");
$import("js.domx.DOMObject");

js.domx.DOMNodeList=function(){
	this._isArray=false;
};
var _$class=js.domx.DOMNodeList;

_$class.$name="DOMNodeList";
_$class.$context=js.domx.DOM;
_$class.$extends(js.domx.DOMObject);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getLength=function(){
	return this.__original.length;
}

//:method-----------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	obj._isArray=Global.isArray(original);
	return obj;
}
_$proto.getItem=function(index){
	var node=this._isArray?this._original[index]:this.__original.item(index);
	return this.getClass().getContext().obj(node);
}
_$proto.toArray=function(){
	if(this._isArray){
		return this.__original.concat();
	}else{
		var array=[];
		for(var i=0;i<this.__original.length;i++){
			array.push(this.__original.item(i));
		}
		return array;
	}
}