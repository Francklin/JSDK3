/** 
 * JavaScript Native Language Basic Extras 
 * @file: base.js 
 * @version: V2.12 
 * @author: liu denggao 
 * @mail: francklin.liu@gmail.com 
 * @home: http://www.tringsoft.com 
 * @date: 2007-2014.8.9 
 * @update: 
 ************************************************/ 


(function(){
/**
 * String of base
 * @file: base.String.js
 * @version: V0.2
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2012.02.29
 **************************/

/**
 * \u5b57\u7b26\u4e32\u6574\u7406\uff0c\u5254\u9664\u5b57\u7b26\u4e32\u4e2d\u9996\u5c3e\u4e0a\u7684\u7a7a\u5b57\u7b26
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
 * \u5b57\u7b26\u4e32\u53cd\u5411
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
		case 0:	//\u5de6
			var startIndex=this.indexOf(startStr);
			var endIndex=this.indexOf(endStr,startIndex+1);
			break;
		case 1: //\u6700\u5927
			var startIndex=this.indexOf(startStr);
			var endIndex=this.lastIndexOf(endStr);
			break;
		case 2:	//\u53f3
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

/**
 * Number of base
 * @file: base.Number.js
 * @version: V0.2
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2012.5.29
 **************************/

/**
 * \u5728\u4e00\u4e2a\u8303\u56f4\u4e2d\u7684\u533a\u57df
 * @return 
 *	(1)iOptions=0:  -1, n<min; 0, n>=min&&n<=max; 1, n>max;
 *	(2)iOptions=1:  -1, n<=min; 0, n>min&&n<max; 1, n>=max;
 * @created 2010.8.2
 * @modified 2010.11.10
 */
Number.prototype.atAround=function(min,max,iOptions){
	if(typeof(min)!="number"||typeof(max)!="number"||min>max){
		throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
	}
	iOptions=iOptions==undefined?0:iOptions;
	switch(iOptions){
		case 0:
			if(this<min){
				return -1;
			}else if(this>=min&&this<=max){
				return 0;
			}else if(this>max){
				return 1;
			}
			break;
		case 1:
			if(this<=min){
				return -1;
			}else if(this>min&&this<max){
				return 0;
			}else if(this>=max){
				return 1;
			}
			break;
	}
	throw new Error(1000,"Method 'atAround' of class 'Number' run error!");
}
/**
 * \u662f\u5426\u5728\u4e00\u4e2a\u8303\u56f4\u5185
 * @return 
 * @created 2010.11.10
 * @modified 2010.11.10
 */
Number.prototype.isWithin=function(min,max){
	if(typeof(min)!="number"||typeof(max)!="number"||min>max){
		throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
	}
	if(this>=min&&this<=max) return true;
	else return false;
}
/**
 * \u662f\u5426\u5728\u4e00\u4e2a\u8303\u56f4\u5916
 * @return 
 * @created 2010.11.10
 * @modified 2010.11.10
 */
Number.prototype.isWithout=function(min,max){
	if(typeof(min)!="number"||typeof(max)!="number"||min>max){
		throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
	}
	if(this>=min&&this<=max) return false;
	else return true;
}
Number.prototype.adjust=function(num){
	return (this+num).byPrecision(this.getPrecision());
}
Number.prototype.getPrecision=function(){
	var str=this.toString();
	var at=str.indexOf(".");
	return at<0?0:(str.length-at-1);
}
Number.prototype.byPrecision=function(iBits){
	var str=this.toString();
	var at=str.indexOf(".");
	if(at<0){
		return this;
	}else if(str.length-at-1<=iBits){
		return this;
	}else{
		str=(this+5*Math.pow(10,-iBits-1)).toString();
		at=str.indexOf(".");
		if(at<0){
			return parseFloat(str);
		}else if(str.length-at-1<=iBits){
			return parseFloat(str);
		}else{
			return parseFloat(str.slice(0,at+iBits+1));
		}
	}
}
Number.prototype.toStrByPrec=function(iBits){
	var str=this.toString();
	var at=str.indexOf(".");
	if(at<0){
		return str+"."+[].fill("0",iBits).join("");
	}else if(str.length-at-1<=iBits){
		return str+[].fill("0",iBits-(str.length-at-1)).join("");
	}else{
		str=(this+5*Math.pow(10,-iBits-1)).toString();
		at=str.indexOf(".");
		if(at<0){
			return str+"."+[].fill("0",iBits).join("");
		}else if(str.length-at-1<=iBits){
			return str+[].fill("0",iBits-(str.length-at-1)).join("");
		}else{
			return str.slice(0,at+iBits+1);
		}
	}
}

/**
 * Date of base
 * @file: base.Date.js
 * @version: V0.2
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2012.5.30
 **************************/


/**
 * compute time
 * @para iValue
 * @para vFromType
 *		(1)0|time
 *		(2)1|h
 *		(3)2|m
 *		(4)3|s
 *		(5)4|ms
 * @para vToType
 *		(1)0|hh:mm:ss:ms
 *		(2)1|h
 *		(3)2|m
 *		(4)3|s
 *		(5)4|ms
 * @return array or number
 * @author denggao liu
 * @created 2011.9.21
 * @modified 2010.11.11
 */
Date.computeTime=function(iValue,vFromType,vToType){
	var iFromType;
	var iToType;
	switch(vFromType.toString().toLowerCase()){
		case "0":
		case "time":
			iFromType=0;
			break;
		case "1":
		case "h":
			iFromType=1;
			break;
		case "2":
		case "m":
			iFromType=2;
			break;
		case "3":
		case "s":
			iFromType=3;
			break;
		case "4":
		case "ms":
			iFromType=4;
			break;
		default:
			iFromType=0;
	}
	switch(vToType.toString().toLowerCase()){
		case "0":
		case "hh:mm:ss:ms":
			iToType=0;
			break;
		case "1":
		case "h":
			iToType=1;
			break;
		case "2":
		case "m":
			iToType=2;
			break;
		case "3":
		case "s":
			iToType=3;
			break;
		case "4":
		case "ms":
			iToType=4;
			break;
		default:
			iToType=0;
	}
	if(iFromType==0){
		var iHour=iValue.getHours();
		var iMinute=iValue.getMinutes();
		var iSecond=iValue.getSeconds();
		var iMilliseconds=iValue.getMilliseconds();
		return (
			iToType==0?[iHour,iMinute,iSecond,iMilliseconds]
			:iToType==1?iHour
			:iToType==2?(iHour*60+iMinute)
			:iToType==3?(iHour*60*60+iMinute*60+iSecond)
			:iToType==4?((iHour*60*60+iMinute*60+iSecond)*1000+iMilliseconds)
			:0
		);
	}else if(iFromType<=3){
		return (
			iToType==0?[Math.floor(iValue*Math.pow(60,1-iFromType))
				,Math.floor((iValue=iValue%Math.pow(60,iFromType-1))*Math.pow(60,2-iFromType))
				,Math.floor((iValue=iValue%Math.pow(60,iFromType-2))*Math.pow(60,3-iFromType))
				,0
			]
			:iToType<=3?Math.floor(iValue*Math.pow(60,iToType-iFromType))
			:iToType==4?Math.floor(iValue*Math.pow(60,3-iFromType)*1000)
			:0
		);
	}else if(iFromType==4){
		return (
			iToType==0?[Math.floor(iValue*Math.pow(60,-2)*Math.pow(1000,-1))
				,Math.floor((iValue=iValue%(Math.pow(60,2)*Math.pow(1000,1)))*Math.pow(60,-1)*Math.pow(1000,-1))
				,Math.floor((iValue=iValue%(Math.pow(60,1)*Math.pow(1000,1)))*Math.pow(60,0)*Math.pow(1000,-1))
				,iValue%Math.pow(1000,1)
			]
			:iToType<=3?Math.floor(iValue*Math.pow(60,iToType-3)*Math.pow(1000,-1))
			:iToType==4?iValue
			:0
		);
	}else{
		return 0;
	}
}
/**
 * @para sPart: date,time,datetime
 * @para sDateSep: date separator
 * @created: 2012.5.30
 */
Date.prototype.toSTDString=function(sPart,sDateSep){
	var iYear=this.getFullYear();
	var iMonth=this.getMonth()+1;
	var iDay=this.getDate();
	var iHour=this.getHours();
	var iMinute=this.getMinutes();
	var iSecond=this.getSeconds();
	var sDate=[("0000"+iYear).slice(-4),("00"+iMonth).slice(-2),("00"+iDay).slice(-2)].join(sDateSep||"-");
	var sTime=[("00"+iHour).slice(-2),("00"+iMinute).slice(-2),("00"+iSecond).slice(-2)].join(":");
	switch(sPart&&sPart.toLowerCase()){
		case "date":
			return sDate;
		case "time":
			return sTime;
		case "datetime":
		default:
			return sDate+" "+sTime;
	}
}



/**
 * Array of base
 * @file: base.Array.js
 * @version: V0.9.1
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2014.8.9
 **************************/

/**
 * @return: array
 * @created: 2012.5.21
 * @modified: 2012.6.21
 */
Array.from=function(item){
	if(item==null){
		return [];
	}else if(!(item instanceof Object)
		&&item.constructor&&(item.constructor instanceof Object)){
		return [item];
	}else if(item instanceof this){
		return item;
	}else if(Object.prototype.toString.apply(item) === '[object Array]'){
		return item;
	}else{
		try{
			return this.prototype.slice.call(item);
		}catch(e){}
		try{
			var values=[];
			for(var i=0;i<item.length;i++){
				values[i]=item[i];
			}
			return values;
		}catch(e){}
		return [item];
	}
}
/**
 * @return: The original array including the new values.
 * @created: 2012.3.28
 */
Array.prototype.append=function(){
	var array=this.concat.apply([],arguments);
	for(var i=0;i<array.length;i++){
		this[this.length]=array[i];
	}
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.include=function(item,toLast){
	var index=-1;
	for(var i=0;i<this.length;i++){
		if(this[i]===item){
			index=i;break;
		}
	}
	if(index<0){
		this[this.length]=item;
	}else if(toLast){
		this.splice(index,1);
		this[this.length]=item;
	}	
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.combine=function(otherArray){
	for(var i=0;i<otherArray.length;i++){
		var flag=0;
		for(var j=0;j<this.length;j++){
			if(otherArray[i]===this[j]){
				flag=1;break;
			}
		}
		if(!flag) this[this.length]=otherArray[i];
	}
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.interlace=function(otherArray,align){
	var array=[];
	align=align||"left";
	switch(align.toLowerCase()){
		case "left":
			for(var i=0,k=0;i<this.length;i++){
				array[k++]=this[i];
				array[k++]=otherArray[Math.min(i,this.length-1,otherArray.length-1)];
			}
			break;
		case "right":
			for(var i=0,k=0;i<this.length;i++){
				array[k++]=otherArray[Math.min(i,this.length-1,otherArray.length-1)];
				array[k++]=this[i];
			}
			break;
	}
	for(var i=0;i<array.length;i++){
		this[i]=array[i];
	}
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.insert=function(item,index){
	index=index==undefined?-1:index;
	if(index>=this.length){
		index=this.length;
	}else if(index<=-this.length-1){
		index=0;
	}else if(index<0){
		index=this.length+1+index;
	}
	var array1=this.slice(index);
	this[index]=item;
	for(var i=0;i<array1.length;i++){
		this[index+1+i]=array1[i];
	}
	return this;
}
/**
 * fill array with one value
 * @para vValue
 * @para isAutoExpand
 * @para iStartIndex
 * @para iLength
 * @created 2010.05.08
 */
Array.prototype.fill=function(vValue,iLen,iStart,isAutoExpand){
	isAutoExpand=isAutoExpand==undefined?true:isAutoExpand;
	iStart=iStart==undefined?0:iStart;
	iLen=iLen==undefined?this.length:iLen;
	if(!isAutoExpand){
		if(iStart<0||iStart>=this.length||iLen<0) return this;
		var iEnd=Math.min(this.length,iStart+iLen)-1;
	}else{
		var iEnd=iStart+iLen-1;
	}
	for(var i=iStart;i<=iEnd;i++){
		this[i]=vValue;
	}
	return this;
}
/**
 * @function\uff1a\u6e05\u7406\u5783\u573e
 * @description\uff1a\u6e05\u7a7a\u5185\u5bb9\u4e3a\u7a7a\u7684\u6570\u7ec4\u5143\u7d20,\u89c4\u5219\u4e3a: 
 *			(1)undefined
 *			(2)null
 *			(3)""
 * @created\uff1a2009.07.18
 * @modified: 2012.3.28
 */	
Array.prototype.trim=function(){
	var array=[];
	for(var i=0,j=0;i<this.length;i++){
		if(this[i]===undefined||this[i]===null||this[i]==="") continue;
		array[j++]=this[i];
	}
	this.splice(0,this.length);
	for(var i=0;i<array.length;i++){
		this[i]=array[i];
	}
	return this;
}
/**
 * @created: 2009.4.16
 * @modified: 2012.3.28
 */
Array.prototype.unique=function(){
	var array=[];
	for(var i=this.length-1;i>=0;i--){
		var item=this[i];
		var flag=0;
		for(var j=i-1;j>=0;j--){
			if(item===this[j]){
				flag=1;
				break;
			}
		}
		if(!flag) array[array.length]=item;
	}
	if(array.length==this.length) return this;
	this.splice(0,this.length);
	for(var i=array.length-1,j=0;i>=0;i--){
		this[j++]=array[i];
	}
	return this;
}
/**
 * remove element of array by index
 * @return element
 * @modified 2010.11.09
 */
Array.prototype.removeAt=function(index){
	return this.splice(index,1);
}
/**
 * @description: Removes all occurrences of an item from the array.
 * @return: This array with all occurrences of the item removed.
 * @created: 2012.3.28
 */
Array.prototype.erase=function(item){
	for(var i=this.length-1;i>=0;i--){
		if(this[i]===item) {
			this.splice(i,1);
		}
	}
	return this;
}
/**
 * clear empty array
 * @return array
 */
Array.prototype.clear=function(){
	this.splice(0,this.length);
	return this;
}
/**
 * @created: 2013.5.13
 * @modified: 2013.5.13
 */
Array.getFirst=function(arr,fn,bind){
	if(!fn){
		return arr.length>0?arr[0]:undefined;
	}else{
		for(var i=0,len=arr.length;i<len;i++){
			if(!bind&&fn(arr[i],i,arr)){
				return arr[i];
			}else if(bind&&fn.call(bind,arr[i],i,arr)){
				return arr[i];
			}
		}
	}
}
/**
 * @created: 2012.3.28
 * @modified: 2013.3.25
 */
Array.prototype.getFirst=function(fn,bind){
	if(!fn){
		return this.slice(0,1).pop();
	}else{
		for(var i=0,len=this.length;i<len;i++){
			if(!bind&&fn(this[i],i,this)){
				return this[i];
			}else if(bind&&fn.call(bind,this[i],i,this)){
				return this[i];
			}
		}
	}
}
/**
 * @created: 2013.5.13
 * @modified: 2013.5.13
 */
Array.getLast=function(arr,fn,bind){
	if(!fn){
		return arr.length>0?arr[arr.length-1]:undefined;
	}else{
		for(var i=arr.length-1;i>=0;i--){
			if(!bind&&fn(arr[i],i,arr)){
				return arr[i];
			}else if(bind&&fn.call(bind,arr[i],i,arr)){
				return arr[i];
			}
		}
	}
}
/**
 * @created: 2012.3.28
 * @modified: 2013.3.25
 */
Array.prototype.getLast=function(fn,bind){
	if(!fn){
		return this.slice(-1).pop();
	}else{
		for(var i=this.length-1;i>=0;i--){
			if(!bind&&fn(this[i],i,this)){
				return this[i];
			}else if(bind&&fn.call(bind,this[i],i,this)){
				return this[i];
			}
		}
	}
}
/**
 * @created: 2012.3.28
 */
Array.prototype.find=function(vKey,isNoCase,isContains){
	var typeName=typeof(vKey);
	if(typeName!="string"){
		return this.indexOf(vKey);
	}else if(isNoCase&&isContains){
		vKey=vKey.toLowerCase();
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))
				&&this[i].toLowerCase().contains(vKey)){
				return i;
			}
		}
	}else if(isNoCase){
		vKey=vKey.toLowerCase();
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].toLowerCase()==vKey)){
				return i;
			}
		}
	}else if(isContains){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].indexOf(vKey)>=0)){
				return i;
			}
		}	
	}else{
		return this.indexOf(vKey);
	}
	return -1;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.contains=function(item){
	for(var i=0;i<this.length;i++){
		if(this[i]===item){
			return true;
		}
	}
	return false;
}
/**
 * is equal
 * @modified: 2010.11.7
 */
Array.prototype.equal=function(otherArray){
	if(this.length!=otherArray.length) return false;
	for(var i=0;i<this.length;i++){
		if(this[i]!==otherArray[i]) return false;
	}
	return true;
}
/**
 * is equal
 * @created: 2012.12.17
 * @modified: 2012.12.17
 */
Array.prototype.equalWith=function(otherArray,ignoreSeq,ignoreCase){
	if(this.length!=otherArray.length) return false;
	if(!ignoreSeq){
		for(var i=0;i<this.length;i++){
			if(!ignoreCase){
				if(this[i]!==otherArray[i]) return false;
			}else if(typeof(this[i])=="string"&&typeof(otherArray[i])=="string"){
				if(this[i].toLowerCase()!==otherArray[i].toLowerCase()) return false;
			}else{
				if(this[i]!==otherArray[i]) return false;
			}
		}
	}else{
		var otherArray1=otherArray.concat();
		for(var i=0;i<this.length;i++){
			var j=0;
			for(;j<otherArray1.length;j++){
				if(!ignoreCase){
					if(this[i]===otherArray1[j]) break;
				}else if(typeof(this[i])=="string"&&typeof(otherArray1[j])=="string"){
					if(this[i].toLowerCase()===otherArray1[j].toLowerCase()) break;
				}else{
					if(this[i]===otherArray[i]) break;
				}
			}
			if(j<otherArray1.length){	//found
				otherArray1.splice(j,1);
			}else{		//no found
				return false;
			}
		}
	}

	return true;
}
/**
 * whether this array belong to another array.
 * @created: 2012.12.17
 * @modified: 2012.12.17
 */
Array.prototype.belongTo=function(otherArray,ignoreSeq,ignoreCase){
	if(this.length>otherArray.length) return false;
	if(!ignoreSeq){
		for(var i=0,iLen=otherArray.length-this.length+1;i<iLen;i++){
			var j=0;
			if(!ignoreCase){
				if(this[j]!==otherArray[i]) continue;
			}else if(typeof(this[j])=="string"&&typeof(otherArray[i])=="string"){
				if(this[j].toLowerCase()!==otherArray[i].toLowerCase()) continue;
			}else{
				if(this[j]!==otherArray[i]) continue;
			}
			for(;j<this.length;j++){
				if(!ignoreCase){
					if(this[j]!==otherArray[i+j]) break;
				}else if(typeof(this[j])=="string"&&typeof(otherArray[i+j])=="string"){
					if(this[j].toLowerCase()!==otherArray[i+j].toLowerCase()) break;
				}else{
					if(this[j]!==otherArray[i+j]) break;
				}
			}
			if(j>=this.length) return true;
		}
		return false;
	}else{
		var otherArray1=otherArray.concat();
		for(var i=0;i<this.length;i++){
			var j=0;
			for(;j<otherArray1.length;j++){
				if(!ignoreCase){
					if(this[i]===otherArray1[j]) break;
				}else if(typeof(this[i])=="string"&&typeof(otherArray1[j])=="string"){
					if(this[i].toLowerCase()===otherArray1[j].toLowerCase()) break;
				}else{
					if(this[i]===otherArray[i]) break;
				}
			}
			if(j<otherArray1.length){	//found
				otherArray1.splice(j,1);
			}else{		//no found
				return false;
			}
		}
		return true;
	}
}
/**
 * @created: 2010.11.6
 */
Array.prototype.indexOf=function(item,startIndex) { 
	var n=this.length;
	var i=startIndex==undefined?0:(startIndex<0?Math.max(0,n+startIndex):startIndex); 
	for(; i < n; i++){
		if(i in this && this[i] === item) return i; 
	}
	return -1;
}
/**
 * @created: 2010.11.6
 */
Array.prototype.lastIndexOf=function(item,startIndex){ 
	var n=this.length;
	var i=startIndex==undefined?(n-1):startIndex;
	if(startIndex<0){
		i=Math.max(0,n-1+startIndex);
	}else if(startIndex>n-1){
		i=n-1;
	}
	for(;i>=0;i--){
		if(i in this && this[i] === item) return i; 
	}
	return -1;
}
/**
 * @function: forEach
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2010.11.7
 * @modified: 2012.3.28
 */
Array.prototype.forEach=function(fn,bind){
	for(var i=0,len=this.length;i<len;i++){
		if(bind) fn.call(bind, this[i], i, this);
		else fn(this[i], i, this);
	}
}
/**
 * @function: map
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @return: The new mapped array.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.map=function(fn,bind){
	var array=[];
	if(!fn) return this.concat(); 
	for(var i=0,len=this.length;i<len;i++){
		if(bind) array[i]=fn.call(bind, this[i], i, this);
		else array[i]=fn(this[i], i, this);
	}
	return array;
}
/**
 * @function: every
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.every=function(fn,bind){
	var array=[];
	for(var i=0,len=this.length;i<len;i++){
		if(!bind&&!fn(this[i],i,this)){
			return false;
		}else if(bind&&!fn.call(bind,this[i],i,this)){
			return false;
		}
	}
	return true;
}
/**
 * @function: every
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.some=function(fn,bind){
	var array=[];
	for(var i=0,len=this.length;i<len;i++){
		if(!bind&&fn(this[i],i,this)){
			return true;
		}else if(bind&&fn.call(bind,this[i],i,this)){
			return true;
		}
	}
	return false;
}
/**
 * select elements
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2010.11.7
 * @modified: 2012.3.28
 */
Array.prototype.select=function(fn,bind){
	var array=[];
	for(var i=0,j=0,len=this.length;i<len;i++){
		if(!bind&&fn(this[i],i,this)){
			array[j++]=this[i];
		}else if(bind&&fn.call(bind,this[i],i,this)){
			array[j++]=this[i];
		}
	}
	return array;
}
/**
 * filter elements
 * @description: same with select method.
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @return:  The new filtered array.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.filter=function(fn,bind){
	var array=[];
	for(var i=0,j=0,len=this.length;i<len;i++){
		if(!bind&&fn(this[i],i,this)){
			array[j++]=this[i];
		}else if(bind&&fn.call(bind,this[i],i,this)){
			array[j++]=this[i];
		}
	}
	return array;
}
/**
 * @invoke: eval(fn(x,y));
 * @created: 2012.3.28
 */
Array.prototype.eval=function(fn,bind){
	var value=this.length>0?this[0]:"";
	for(var i=1;i<this.length;i++){
		if(bind) value=fn.call(bind,value,this[i]);
		else value=fn(value,this[i]);
	}
	return value;
}
/**
 *
 * @description:  Creates an object with key-value pairs based on the array of keywords passed in and the current content of the array.
 * @created: 2012.3.28
 */
Array.prototype.associate=function(otherArray){
	var obj={};
	for(var i=0;i<this.length;i++){
		obj[this[i].toString()]=otherArray.length>i?otherArray[i]:null;
	}
	return obj;
}
/**
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.isSameValues=function(){
	var vValue=this.length==0?"":this[0];
	for(var i=0;i<this.length;i++){
		if(vValue!==this[i]) return false;
	}
	return true;
}
/**
 * @created: 2013.4.2
 * @modified: 2013.4.2
 */
Array.prototype.isUniqueValues=function(){
	for(var i=this.length-1;i>=0;i--){
		var item=this[i];
		var flag=0;
		for(var j=i-1;j>=0;j--){
			if(item===this[j]){
				return false;
			}
		}
	}
	return true;
}


//old----------
 
/**
 * \u529f\u80fd\uff1a\u589e\u52a0\u5355\u4e2a\u5143\u7d20
 * \u63cf\u8ff0\uff1a
 * \u53c2\u6570\uff1a
 *  (1)vValue
 *  (2)isKeepOnly: \u53ef\u9009\uff0c\u662f\u5426\u4fdd\u6301\u552f\u4e00\u6027\uff0c\u9ed8\u8ba4\u4e3a\u5426
 *		1)true:   \u5728\u589e\u52a0\u8be5\u5143\u7d20\u524d\uff0c\u5148\u5224\u65ad\u8be5\u5143\u7d20\u662f\u5426\u5df2\u5b58\u5728\u4e8e\u8be5\u6570\u7ec4\u4e2d\uff0c\u5982\u679c\u662f\u5219\u4e0d\u7528\u6dfb\u52a0\uff0c\u5426\u5219\u5219\u6dfb\u52a0\u3002
 *		2)false:  \u5728\u589e\u52a0\u8be5\u5143\u7d20\u65f6\uff0c\u4e0d\u7528\u5224\u65ad\u8be5\u5143\u7d20\u662f\u5426\u5df2\u5b58\u5728\u4e8e\u8be5\u6570\u7ec4\u4e2d
 *  (3)isNoCase:  \u662f\u5426\u4e0d\u533a\u5206\u5927\u5c0f\u5199,\u9ed8\u8ba4\u4e3a\u5426
 * \u65e5\u671f\uff1a2009.07.18
 * @modified: 2010.11.10
 */
Array.prototype.addElement=function(vValue,isKeepOnly,isNoCase){
	var index=this.findElement(vValue,isNoCase);
	if(isKeepOnly&&index>=0) return;
	else this[this.length]=vValue;
	return vValue;
}
/**
 * \u529f\u80fd\uff1a\u589e\u52a0\u5355\u4e2a\u5143\u7d20
 * \u63cf\u8ff0\uff1a
 * \u53c2\u6570\uff1a
 *  (1)vValue
 *  (2)iOptions: \u53ef\u9009\uff0c\u662f\u5426\u4fdd\u6301\u552f\u4e00\u6027\uff0c\u9ed8\u8ba4\u4e3a\u5426
 *		1)0: \u5728\u589e\u52a0\u8be5\u5143\u7d20\u65f6\uff0c\u4e0d\u7528\u5224\u65ad\u8be5\u5143\u7d20\u662f\u5426\u5df2\u5b58\u5728\u4e8e\u8be5\u6570\u7ec4\u4e2d
 *		2)1: \u5728\u589e\u52a0\u8be5\u5143\u7d20\u524d\uff0c\u5148\u5224\u65ad\u8be5\u5143\u7d20\u662f\u5426\u5df2\u5b58\u5728\u4e8e\u8be5\u6570\u7ec4\u4e2d\uff0c\u5982\u679c\u662f\u5219\u4e0d\u7528\u6dfb\u52a0\uff0c\u5426\u5219\u5219\u6dfb\u52a0\u3002
 *		3)2: \u5728\u589e\u52a0\u8be5\u5143\u7d20\u524d\uff0c\u5148\u5224\u65ad\u8be5\u5143\u7d20\u662f\u5426\u5df2\u5b58\u5728\u4e8e\u8be5\u6570\u7ec4\u4e2d\uff0c\u5982\u679c\u662f\u5219\u5148\u5220\u9664\u65e7\u5143\u7d20\u518d\u6dfb\u52a0\u65b0\u5143\u7d20\uff0c\u5426\u5219\u5219\u76f4\u63a5\u6dfb\u52a0\u65b0\u5143\u7d20\u3002
 *  (3)isNoCase:  \u662f\u5426\u4e0d\u533a\u5206\u5927\u5c0f\u5199,\u9ed8\u8ba4\u4e3a\u5426
 * \u521b\u5efa\u65e5\u671f\uff1a2010.04.25
 * @modified 2010.11.10
 */
Array.prototype.addElementX=function(vValue,iOptions,isNoCase){
	switch(iOptions){
		case 0:
			break;
		case 1:
			var index=this.findElement(vValue,isNoCase);
			if(index>=0) return;
			break;
		case 2:
			var index=this.findElement(vValue,isNoCase);
			if(index>=0) this.removeElement(index);
			break;
	}
	this[this.length]=vValue;
	return vValue;
}
/**
 * \u589e\u52a0\u4efb\u610f\u591a\u4e2a\u5143\u7d20
 * @return: return the array
 * @created: 2010.01.04
 */
Array.prototype.addElements=function(){
	for(var i=0,l=arguments.length;i<l;i++){
		this[this.length]=arguments[i];
	}
	return this;
}
/**
 * \u8fde\u63a5\u5143\u7d20\u8ddfArray.concat()\u65b9\u6cd5\u5dee\u4e0d\u591a\uff0c\u53ea\u4e0d\u8fc7\u662f\u4e0d\u4ee5\u65b0\u6570\u7ec4\u51fa\u73b0
 * @return: return the array
 * @created: 2010.11.10
 */
Array.prototype.appendElements=function(){
	var aValues=[].concat.apply(this,arguments);
	for(var i=0;i<aValues.length;i++){
		this[this.length]=aValues[i];
	}
	return this;
}
/**
 * \u8fde\u63a5\u5143\u7d20\u8ddfArray.concat()\u65b9\u6cd5\u5dee\u4e0d\u591a\uff0c\u53ea\u4e0d\u8fc7\u662f\u4e0d\u4ee5\u65b0\u6570\u7ec4\u51fa\u73b0
 * @return: return the array
 * @modified: 2010.11.10
 */
Array.prototype.concatElements=function(){
	var aValues=[].concat.apply(this,arguments);
	for(var i=0;i<aValues.length;i++){
		this[this.length]=aValues[i];
	}
	return this;
}
/**
 * insert new element to specified position of array
 */
Array.prototype.insertElement=function(newElement,tarIndex){
	if(tarIndex==null) return this[this.length]=newElement;
	if(tarIndex<0||tarIndex>this.length) return newElement;
	var aSplitter1=this.slice(tarIndex);
	this[tarIndex]=newElement;
	for(var i=0;i<aSplitter1.length;i++){
		this[tarIndex+1+i]=aSplitter1[i];
	}
	return newElement;
}
/**
 * \u79fb\u52a8\u5143\u7d20\u5230\u6307\u5b9a\u7684\u76ee\u6807\u4f4d\u7f6e(\u6839\u636e\u504f\u79fb\u91cf)
 * @return 
 * @modified 2010.11.10
 */
Array.prototype.moveElement=function(srcIndex,iOffset){
	if(srcIndex<0) return;
	if(srcIndex>this.length) return;
	if((srcIndex+iOffset)<0) return;
	if((srcIndex+iOffset)>=this.length) return;
	//****
	for(var i=0;i<Math.abs(iOffset);i++){
		this.swapElement(srcIndex+(iOffset>0?i:-i),srcIndex+(iOffset>0?i+1:-i-1));
	}
	return this[srcIndex];
}
/**
 * \u79fb\u52a8\u5143\u7d20\u5230\u6307\u5b9a\u7684\u76ee\u6807\u4f4d\u7f6e(\u6839\u636e\u76ee\u6807\u7d22\u5f15)
 * @return 
 * @modified 2010.11.10
 */
Array.prototype.moveElementTo=function(srcIndex,tarIndex){
	return this.moveElement(srcIndex,tarIndex-srcIndex);
}
/**
 * \u4ea4\u6362\u5143\u7d20
 * @modified 2010.11.09
 */
Array.prototype.swapElement=function(srcIndex,tarIndex){
	if(srcIndex==tarIndex) return;
	if(srcIndex<0||srcIndex>=this.length) return;
	if(tarIndex<0||tarIndex>=this.length) return;
	var element=this[tarIndex];
	this[tarIndex]=this[srcIndex];
	this[srcIndex]=element;
	
	return this;
}
/**
 * @function: find element in array
 * @description: thought search speed
 * @para vKey: search key
 * @para isNoCase:	if no differentiate character case. optional, default as false
 * @para isContains: if search element that contains the key. optional, default as false
 * @created: 2009.03.29
 * @modified: 2009.07.22
 */
Array.prototype.findElement=function(vKey,isNoCase,isContains){
	var typeName=typeof(vKey);
	if(typeName!="string"){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i]==vKey)){
				return i;
			}
		}
	}else if(isNoCase&&isContains){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].toLowerCase().indexOf(vKey.toLowerCase())>=0)){
				return i;
			}
		}
	}else if(isNoCase){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].toLowerCase()==vKey.toLowerCase())){
				return i;
			}
		}
	}else if(isContains){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].indexOf(vKey)>=0)){
				return i;
			}
		}	
	}else{
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i]==vKey)){
				return i;
			}
		}
	}
	return -1;
}
/**
 * remove element of array by index
 * @return element
 * @modified 2010.11.09
 */
Array.prototype.removeElement=function(index){
	return this.splice(index,1);
}
/**
 * @function: is contains specified element
 * @modified: 2010.11.09
 */
Array.prototype.isContains=function(item){
	for(var i=0;i<this.length;i++){
		if(this[i]===item){
			return true;
		}
	}
	return false;
}
/**
 * @function: isSingleType
 * @notice: \u6ce8\u610f,\u5982\u679c\u7c7b\u578b\u4e3aobject,\u5219\u53ef\u80fd\u4e0d\u80fd\u51c6\u786e\u5224\u65ad
 * @para isCaseBase: \u662f\u5426\u533a\u5206\u57fa\u672c\u7c7b\u578b\u7684\u503c\u548c\u5bf9\u8c61,\u9ed8\u8ba4\u4e0d\u533a\u5206,\u4f8b\u5982\uff1a\u201d"123"\u201d\u548c\u201cnew String("123")\u201d
 * @para isCaseObject: \u662f\u5426\u533a\u5206\u5bf9\u8c61\u7c7b\u578b\uff0c\u9ed8\u8ba4\u533a\u5206
 * @author: liu denggao
 * @created: 2009.12.08
 */
Array.prototype.isSingleType=function(isCaseBase,isCaseObject){
	isCaseBase=isCaseBase==undefined?false:isCaseBase;
	isCaseObject=isCaseObject==undefined?true:isCaseObject;
	
	var sType="";
	if(isCaseObject){
		if(!this.length){
			sType="";
		}else if(!isCaseBase){
			sType=this[0].constructor||typeof(this[0]);
		}else if(typeof(this[0])=="object"){
			sType=this[0].constructor||typeof(this[0]);
		}else{
			sType=typeof(this[0]);
		}
		for(var i=1;i<this.length;i++){
			var sType1="";
			if(!isCaseBase){
				sType1=this[i].constructor||typeof(this[i]);
			}else if(typeof(this[i])=="object"){
				sType1=this[i].constructor||typeof(this[i]);
			}else{
				sType1=typeof(this[i]);
			}
			if(sType!=sType1) return false;
		}
	}else{
		if(!this.length){
			sType="";
		}else if(!isCaseBase){
			sType=Object.prototype.toString.apply(this[0]);
		}else if(typeof(this[0])=="object"){
			sType=Object.prototype.toString.apply(this[0]);
		}else{
			sType=typeof(this[0]);
		}
		for(var i=1;i<this.length;i++){
			var sType1="";
			if(!isCaseBase){
				sType1=Object.prototype.toString.apply(this[i]);
			}else if(typeof(this[i])=="object"){
				sType1=Object.prototype.toString.apply(this[i]);
			}else{
				sType1=typeof(this[i]);
			}
			if(sType!=sType1) return false;
		}
	}
	return true;
}
/**
 * @created: 2009.12.2
 * @modified: 2010.11.09
 */
Array.prototype.isSingleValue=function(){
	var vValue=!this.length?"":this[0];
	for(var i=0;i<this.length;i++){
		if(vValue!==this[i]) return false;
	}
	return true;
}

/**
 * @function: join all elements  of array as a string by separator
 * @description: \u7528\u5206\u9694\u7b26\u8fde\u63a5\u6570\u7ec4\u4e3a\u5355\u4e00\u5b57\u7b26\u4e32\uff0c\u5f53\u5206\u9694\u7b26\u4e3a\u6570\u7ec4\u65f6\uff0c\u5206\u522b\u586b\u8865\u5230\u5bf9\u5e94\u7684\u4f4d\u7f6e\u3002
 * 			\u4f8b\u5982\uff1a[22,52,48,999].joinAsStr(["\u65f6","\u5206","\u79d2","\u6beb\u79d2"]) -> "22\u65f652\u520648\u79d2999\u6beb\u79d2"
 *			\u3001[22,52,48,999].joinAsStr(["\u65f6","\u5206","\u79d2","\u6beb\u79d2"],1) -> "\u65f622\u520652\u79d248\u6beb\u79d2999"
 *			\u3001[0,52,48,0].joinAsStr(["\u65f6","\u5206","\u79d2","\u6beb\u79d2"],0,[0]) -> "52\u520648\u79d2"
 
 * @para vSeparator:
 * @para iAlign: 0, this on left, separator on right; 1, this on right, separator on left
 * @para vTrims: any value or array.\u672c\u6570\u7ec4\u7684\u9996\u5c3e\u5143\u7d20\u7b26\u5408\u8fd9\u4e2a\u503c\u7684\u5c06\u88ab\u5220\u9664\u3002
 * @author: liu denggao
 * @created: 2009.12.03
 * @modified: 2010.11.12
 */	
Array.prototype.joinAsStr=function(vSeparator,iAlign,vTrims){
	iAlign=iAlign==undefined?0:iAlign;	
	var aTrims=[];
	if(Object.prototype.toString.apply(vTrims) === '[object Array]'){
		aTrims=vTrims;
	}else{
		aTrims=[vTrims];
	}
	if(Object.prototype.toString.apply(vSeparator) !== '[object Array]'){
		return this.join(vSeparator);
	}else{
		var aValues=[];
		if(iAlign==0){
			for(var i=0,k=0;i<this.length;i++){
				if(!aTrims.isContains(this[i])){
					aValues[k++]=this[i];
					aValues[k++]=vSeparator[Math.min(i,this.length-1,vSeparator.length-1)];
				}
			}
		}else{
			for(var i=0,k=0;i<this.length;i++){
				if(!aTrims.isContains(this[i])){
					aValues[k++]=vSeparator[Math.min(i,this.length-1,vSeparator.length-1)];
					aValues[k++]=this[i];
				}
			}
		}
		return aValues.join("");	
	}
}

})()
