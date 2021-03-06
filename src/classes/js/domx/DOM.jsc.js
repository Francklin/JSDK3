/**
 * @file DOM.class.js
 * @author Liu Denggao
 * @created 2012.5.23
 * @modified 2012.5.24
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");

js.domx.DOM=function(){};

var _$class=js.domx.DOM;
var _$proto=_$class.prototype;

_$class.$name="DOM";
_$class.$virtual=true;

//:const-----------------------------

_$class.NODETYPE_ELEMENT=1
_$class.NODETYPE_ATTRIBUTE=2
_$class.NODETYPE_TEXT=3
_$class.NODETYPE_COMMENT=8
_$class.NODETYPE_DOCUMENT=9

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
_$proto.getClass=function(){
	return this.$class;
}
_$proto._$getClassFor=function(sName){
	var clazz=this.getClass();
	for(var i=0,clazz1;i<3&&!!clazz;i++){
		clazz1=js.domx[clazz.getName()+sName];
		if(clazz1) return clazz1;
		else if(clazz.getName()=="DOM") return;
		else clazz=clazz.$super;
	}
}
_$proto._$getObj=function(vNode,vClazz){
	var obj,DOM=js.domx.DOM;
	if(!vNode) {
		return vNode;
	}else if(vClazz){
		if(typeof(vClazz)=="string"){
			return this._$getClassFor(vClazz).newInstanceFrom(vNode);
		}else{
			return vClazz.newInstanceFrom(vNode);
		}
	}else if(!vNode.constructor){
		if(vNode.length>=0){
			return this._$getClassFor("NodeList").newInstanceFrom(vNode);
		}
	}else if(Global.isArray(vNode)){
		return this._$getClassFor("NodeList").newInstanceFrom(vNode);
	}else if(typeof(NodeList)!="undefined"&&(vNode instanceof NodeList)){
		return this._$getClassFor("NodeList").newInstanceFrom(vNode);
	}else if(vNode instanceof this._$getClassFor("Object")) {
		return vNode;
	}else if(vNode instanceof js.domx.DOMObject){
		return this._$getClassFor("Node").newInstanceFrom(vNode.valueOf());
	}
	switch(vNode.nodeType){
		case DOM.NODETYPE_ELEMENT:
			obj=this._$getClassFor("Element").newInstanceFrom(vNode);
			break;
		case DOM.NODETYPE_ATTRIBUTE:
			obj=this._$getClassFor("Attribute").newInstanceFrom(vNode);
		case DOM.NODETYPE_TEXT:
			obj=this._$getClassFor("Text").newInstanceFrom(vNode);
			break;
		case DOM.NODETYPE_COMMENT:
			obj=this._$getClassFor("Comment").newInstanceFrom(vNode);
			break;
		case DOM.NODETYPE_DOCUMENT:
			obj=this._$getClassFor("Document").newInstanceFrom(vNode);
			break;
	}
	return obj;
}