/**
 * @file HTMLElement.js
 * @invoke: HTMLElement.applyInstance(el)
 * @author Liu Denggao
 * @created 2010.01.04
 * @modified 2011.6.21
 * @version 0.3
 * @since JSDK3 V0.3
 */

$package("js.dom");
$import("js.dom.DOMElement");

js.dom.HTMLElement=function(oObj){
	this.__srcObj=oObj;
};
var _$class=js.dom.HTMLElement;
_$class.$extends(js.dom.DOMElement);
var _$proto=_$class.prototype;

_$class.$name="HTMLElement";

//:property-------------------------

_$class.getName = function() {
	return this.$name;
}

/**
 * @support: 
 */
_$proto.$get=function(id){
	
}

/**
 * @support: 
 */
_$proto.$all=function(){
	
}
