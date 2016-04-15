/**
 * String of base
 * @file: base.String.js
 * @version: V0.2
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2012.02.29
 **************************/

/**
 * 字符串整理，剔除字符串中首尾上的空字符
 * @date: -2010.6.18
 */
String.prototype.trim=function(){
	return this.replace(/^\s+|\s+$/g, '');
}
/**
 * @date: 2010.6.18
 */
String.prototype.clean=function(){
	return this.replace(/\s+/g, ' ').trim();
}
/**
 * 字符串反向
 * @modified: 2011.8.1
 */
String.prototype.reverse=function(){	
	return this.split("").reverse().join("");
}
/**
 *
 * @modified 2010.11.09
 */
String.prototype.left=function(subString){
	switch(typeof(subString)){
		case "string":
			var intAt=this.indexOf(subString);
			if(intAt<=0) return("");
			return this.slice(0,intAt);
		case "number":
			var iLen=subString;
			return this.slice(0,iLen);
		default:
			return "";
	}
}
/**
 *
 * @created 2010.11.09
 */
String.prototype.leftBack=function(subString){
	var intAt=this.lastIndexOf(subString);
	if(intAt<=0) return("");
	return this.slice(0,intAt);
}
/**
 *
 * @modified 2011.7.25
 */
String.prototype.middle=function(startStr,endStr,iOptions){
	iOptions=iOptions==undefined?0:iOptions;
	switch(iOptions){
		case 0:	//左
			var startIndex=this.indexOf(startStr);
			var endIndex=this.indexOf(endStr,startIndex+1);
			break;
		case 1: //最大
			var startIndex=this.indexOf(startStr);
			var endIndex=this.lastIndexOf(endStr);
			break;
		case 2:	//右
			var endIndex=this.lastIndexOf(endStr);
			var startIndex=this.lastIndexOf(startStr,endIndex-1);
			break;
	}
	if(startIndex<0||endIndex<0) return "";
	if(startIndex>=endIndex) return "";
	return this.slice(startIndex+startStr.length,endIndex);
}
/**
 *
 * @modified 2010.11.09
 */
String.prototype.right=function(subString){
	switch(typeof(subString)){
		case "string":
			var intAt=this.indexOf(subString);
			if(intAt<0) return("");
			return this.slice(intAt+subString.length);
		case "number":
			var iLen=subString;
			return this.slice(this.length-iLen);
		default:
			return "";
	}
}
/**
 * @modified 2010.11.09
 */
String.prototype.rightBack=function(subString){
	var intAt=this.lastIndexOf(subString);
	if(intAt<0) return("");
	return this.slice(intAt+subString.length);
}
/**
 * @created 2012.02.29
 * @modified 2012.02.29
 */
String.prototype.word=function(sep,index){
	var values=this.split(sep);
	if(index<0) index=values.length+index;
	if(index>=0&&index<values.length){
		return values[index];
	}else{
		return "";
	}
}
/**
 * @created 2010.11.11
 */
String.prototype.hasAscii=function(){
	var reg=/[\x00-\xff]+/gi;
	return reg.test(this);
}
/**
 * @created 2011.1.26
 */
String.prototype.hasNonAscii=function(){
	var reg=/[^\x00-\xff]+/gi;
	return reg.test(this);
}
/**
 * @created 2011.01.26
 */
String.prototype.getAsciiCount=function(){
	return this.replace(/[^\x00-\xff]*/g,"").length;
}
/**
 * @created 2011.01.26
 */
String.prototype.getNonAsciiCount=function(){
	return this.replace(/[\x00-\xff]*/g,"").length;
}
String.prototype.equal=function(vStrings,isNoCase){
	if(!arguments.length) return false;
	isNoCase=isNoCase==null?false:isNoCase;
	if(vStrings instanceof Array){
		for(var i=0;i<vStrings.length;i++){
			if(isNoCase&&(this.toLowerCase()==vStrings[i].toLowerCase())) {
				return true;
			}else if(!isNoCase&&(this.toString()==vStrings[i])) {
				return true;
			}
		}
	}else{
		return this.toLowerCase()==vStrings.toLowerCase();
	}
	return false;
}
String.prototype.serialize=function(){
	return ("\""+this.toString().replace(/\\/g,"\\\\").replace(/\"/g,"\\\"")
		.replace(/\n/g,"\\n").replace(/\r/g,"\\r")
		.replace(/([^\x00-\xff])/g,function($1){
			return "\\u"+($1).charCodeAt(0).toString(16).slice(-4);
		})+"\"");
}