/**
 * @file HTMLElement.class.js
 * @author Liu Denggao
 * @created 2012.5.23
 * @modified 2012.6.18
 * @version 0.2
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.DOMElement");
$import("js.domx.HTML");

js.domx.HTMLElement=function(){};
var _$class=js.domx.HTMLElement;

_$class.$name="HTMLElement";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getTagName=function(){
	return this.__original.tagName;
}
_$proto.getAttributes=function(){
	return this.__original.attributes;
}
_$proto.getTextContent=function(){
	var text=this.__original.innerText||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}
_$proto.getInnerText=function(){
	var text=this.__original.innerText||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}
_$proto.setInnerText=function(sText){
	this.__original.innerText=sText;
}
_$proto.getInnerHTML=function(){
	return this.__original.innerHTML;
}
_$proto.setInnerHTML=function(sHtml){
	this.__original.innerHTML=sHtml;
}

//:method-------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
_$proto.getAttribute=function(name){
	return this.__original.getAttribute(name);
}
_$proto.getElementsByTagName=function(tagName){
	return this.getClass().getContext().obj(this.__original.getElementsByTagName(tagName),"Element");
}
_$proto.hasAttribute=function(name){
	if(this.__original.hasAttribute) return this.__original.hasAttribute(name);
	else return typeof(this.__origibal.getAttribute(name))!="undefined";
}
_$proto.setAttribute=function(name,value){
	this.__original.setAttribute(name,value);
}
_$proto.addEventListener=function(sEventName, fnListener){
	if(/$on[A-Z]{1}/.test(sEventName)){
		if(typeof(fnListener)=="function") 
			this[sEventName] = fnListener;
	}else if(this.__original.addEventLister){
		this.__original.addEventLister(sEventName, fnListener);
	}else if(this.__original.attachEvent){
		this.__original.attachEvent(sEventName, fnListener);
	}else{
		throw new Error(1000,"add event listener occur error!");
	}
}
_$proto.fireEvent=function(sEventName,oEvent){
	if(/^_?on[A-Z]{1}/.test(sEventName)){
		if(typeof(this[sEventName])!="function") return;
		try{
			return this[sEventName].apply(this,Array.from(arguments).slice(1));
		}catch(e){
			throw new Error(1000,"Event '"+sEventName+"' of object '"+this.getClass().getName()
				+"' has been runned error!\nSource: "
				+e.description);
		}
	}else if(this.__original.fireEvent){
		if(!oEvent) this.__original.fireEvent(sEventName);
		else this.__original.fireEvent(sEventName,oEvent);
	}else if(this.__original.ownerDocument.createEvent){
		var doc=this.__original.ownerDocument;
		if(!oEvent) oEvent = doc.createEvent("Events");
		var evt=null;
		if(oEvent.constructor==Event){
			evt = doc.createEvent("Events");
			evt.initEvent(sEventName.replace(/^on/,""), oEvent.bubbles, oEvent.cancelable);
		}else if(oEvent.constructor==MouseEvent){
			evt = doc.createEvent("MouseEvents");
			evt.initMouseEvent(
				sEventName.replace(/^on/,""), 
				oEvent.bubbles, 
				oEvent.cancelable,
				oEvent.view,
				oEvent.detail,
				oEvent.screenX,
				oEvent.screenY, 
				oEvent.clientX, 
				oEvent.clientY, 
				oEvent.ctrlKey,
				oEvent.altKey,
				oEvent.shiftKey,
				oEvent.metaKey,
				oEvent.button,
				oEvent.relatedTarget
			);
		}else if(oEvent.constructor==UIEvent){
			evt = doc.createEvent("UIEvents");
			evt.initUIEvent(sEventName.replace(/^on/,""), oEvent.bubbles,oEvent.view,oEvent.detail);
		}else{
			return;
		}
		this.__original.dispatchEvent(evt);
	}else{
		throw new Error(1000,"fire event '"+sEventName+"' occur error!");
	}
}
