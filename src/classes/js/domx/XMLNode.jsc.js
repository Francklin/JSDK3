/**
 * @file XMLNode.class.js
 * @author Liu Denggao
 * @created 2012.5.24
 * @modified 2012.5.24
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.XML");

js.domx.XMLNode=function(){};
var _$class=js.domx.XMLNode;

_$class.$name="XMLNode";
_$class.$context=js.domx.XML;
_$class.$extends(js.domx.DOMNode);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getChildNodes=function(){
	var retValues=[];
	var childNodes=this.__original.childNodes;
	for(var i=0,iLen=childNodes.length;i<iLen;i++){
		var node=childNodes[i];
		if(node.nodeType==3&&node.data
			.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") continue;
		retValues[retValues.length]=childNodes[i];
	}
	return this.getClass().getContext().obj(retValues,"NodeList");
}
_$proto.getFirstChild=function(){
	var childNodes=this.__original.childNodes;
	for(var i=0,len=childNodes.length;i<len;i++){
		var node=childNodes[i];
		if(node.nodeType==3&&node.data
			.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") continue;
		return this.getClass().getContext().obj(node);
	}
}
_$proto.getNextSibling=function(){
	var el=this.__original.nextSibling;
	if(!el){
		return null;
	}else if(el.nodeType==3&&el.data
		.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") {
		el=el.nextSibling; // Moz. Opera
	}
	return this.getClass().getContext().obj(el);
}
_$proto.getPreviousSibling=function(){
	var el=this.__original.previousSibling;
	if(!el){
		return null;
	}else if(el.nodeType==3&&el.data
		.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") {
		el=el.previousSibling; // Moz. Opera
	}
	return this.getClass().getContext().obj(el);
}
_$proto.getLastChild=function(){
	var childNodes=this.__original.childNodes;
	for(var i=childNodes.length-1;i>=0;i--){
		var node=childNodes[i];
		if(node.nodeType==3&&node.data
			.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '')=="") continue;
		return this.getClass().getContext().obj(node);
	}
}
_$proto.getTextContent=function(){
	var text=this.__original.text||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}
_$proto.getText=function(){
	var text=this.__original.text||this.__original.textContent||"";
	return text.replace(/^[\s\r\n]*|[\s\r\n]*$/g, '');
}

//:method---------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
_$proto.selectSingleNode=function(xpath){
	var node;
	if(typeof(this.__original.selectSingleNode)!="undefined"){
		node=this.__original.selectSingleNode();
	}else{
		var x = this.selectNodes(xpath);
		if (!x.length) return null ;
		node=x[0];
	}
	return this.getClass().getContext().obj(node);
}
_$proto.selectNodes=function(xpath){
	var nodes;
	if(typeof(this.__original.selectNodes)!="undefined"){
		nodes=this.__original.selectNodes(xpath);
	}else if(typeof(XPathEvaluator)!="undefined"){
		var xpe = new XPathEvaluator();
		var nsResolver = xpe.createNSResolver(this.__original.ownerDocument==null? 
			this.__original.documentElement:this.__original.ownerDocument.documentElement);
		var result = xpe.evaluate(xpath, this.__original, nsResolver, 0 , null );
		var found = [];
		var res;
		while (res = result.iterateNext()) found.push(res);
		nodes = found;
	}
	return this.getClass().getContext().obj(nodes,"NodeList");
}

