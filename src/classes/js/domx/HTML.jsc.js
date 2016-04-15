/**
 * @file HTML.class.js
 * @author Liu Denggao
 * @created 2012.5.25
 * @modified 2012.5.25
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOM");

js.domx.HTML=function(){};

var _$class=js.domx.HTML;

_$class.$name="HTML";
_$class.$extends(js.domx.DOM);
var _$proto=_$class.prototype;


//:field-------------------------------

_$class._instance=new _$class();

//:property-------------------------

_$class.getName = function() {
	return this.$name;
}
_$class.toString = function(){
	return ("[Object " + this.getName() + "]");
}
_$class.obj = function(vNode,vClazz){
	return this._instance._$getObj(vNode,vClazz);
}