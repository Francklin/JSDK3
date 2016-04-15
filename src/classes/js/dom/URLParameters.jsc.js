/**
 * @function URLParameters for JSDK2 Version 1.1 Build 20090713
 * @file URLParameters.js
 * @description 
 * @author Liu Denggao
 * @date 2009.07.13
 * @modified: 2011.10.22
 */

$package("js.dom");

js.dom.URLParameters=function(sPrmts){
	this._items=[];
	this._URLParameters(sPrmts);
};
var _$class=js.dom.URLParameters;
var _$proto=_$class.prototype;

_$proto._URLParameters=function(sPrmts){
	if(sPrmts==null){
		sPrmts=window.location.search.right("?");
	}
	var items=sPrmts?sPrmts.split("&"):[];
	for(var i=0,j=0;i<items.length;i++){
		this._items[j]=[];
		if(items[i]=="") continue;
		this._items[j][0]=decodeURIComponent(items[i].split("=")[0]);
		this._items[j][1]=decodeURIComponent(items[i].right("="));
		j++;
	}
}
_$class._instance=new _$class();

_$class.getPrmts=function (){
	return this._instance.getPrmts();
};
_$class.getPrmtValue=function(sName){
	return this._instance.getPrmtValue(sName);
}
_$class.getHasPrmt=function(sName){
	return this._instance.getHasPrmt(sName);
}

_$proto.getPrmts=function(){
	return this._items;
}
_$proto.getPrmtValue=function(sName){
	for(var i=0;i<this._items.length;i++){
		if(this._items[i][0].toLowerCase()==sName.toLowerCase()) {
			return this._items[i][1];
		}
	}
	return "";
}
_$proto.getHasPrmt=function(sName){
	for(var i=0;i<this._items.length;i++){
		if(this._items[i][0].toLowerCase()==sName.toLowerCase()) {
			return true;
		}
	}
	return false;
}
_$proto.setPrmt=function(sName,sValue){
	for(var i=0;i<this._items.length;i++){
		if(this._items[i][0].toLowerCase()==sName.toLowerCase()) {
			this._items[i][1]=sValue;
			return;
		}
	}
	return;
}
/*
 * @CreatedDate 2009.07.13
 */
_$proto.getQuery=function(){
	var items=[];
	for(var i=0;i<this._items.length;i++){
		items[i]=this._items[i][0]+"="+encodeURIComponent(this._items[i][1]);
	}
	return items.join("&");
}
