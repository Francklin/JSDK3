
/**
 * keyset scan code
 * @file: global.key.js
 * @author: liu denggao
 * @date: 2007-2011.06.02
 **************************/

KEY_F1			: 112,
KEY_F2			: 113,
KEY_F3			: 114,
KEY_F4			: 115,
KEY_F5			: 116,
KEY_F6			: 117,
KEY_F7			: 118,
KEY_F8			: 119,
KEY_F9			: 120,
KEY_F10			: 121,
KEY_F11			: 122,
KEY_F12			: 123,
KEY_Enter		: 13,
KEY_Backspace	: 8,
KEY_Insert		: 45,
KEY_Delete		: 46,
KEY_Space		: 32,
KEY_Home		: 36,
KEY_End			: 35,
KEY_PageUp		: 33,
KEY_PageDown	: 34,
KEY_Up			: 38,
KEY_Down		: 40,
KEY_Left		: 37,
KEY_Right		: 39,
KEY_NUM_Min		: 48,
KEY_NUM_Max		: 57,
KEY_LET_Min		: 65,
KEY_LET_Max		: 90,
KEY_LET_FST		: 65,
KEY_LET_LST		: 90,
KEY_MIN_Min		: 96,
KEY_MIN_Max		: 105
,

/**
 * base global function for JSDK3 Lite
 * @file: global.base.js
 * @version: 1.5.1
 * @author: liu denggao
 * @created: 2007
 * @modified: 2013.8.2-2013.11.5
 **************************/

"_xmlHttp": loader.getXMLHttpRequest(),
"_xmlDom" : loader.getXMLDOMDocument(),
"_xmlParser" : loader.getXMLDOMParser(),

/**
 * @created: 2012.3.22
 * @modified: 2012.3.22
 */
"is": function(obj,type){
	var toString = Object.prototype.toString,undefined; 
	return (type === "Null" && obj === null) || 
		(type === "Undefined" && obj === undefined ) || 
		toString.call(obj).slice(8,-1) === type; 
},
/**
 * @modified: 2011.6.2
 */
"isArray" : function(value){
	if(value instanceof Array){
		return true;
	}else if(Object.prototype.toString.apply(value) === '[object Array]'){
		return true;
	}else{
		return false;
	}
},
/**
 * @created: 2011.6.2
 */
"isEmpty" : function(value){
	if(!this.isArray(value)){
		switch(typeof(value)){
			case "undefined":
				return true;
			case "string":
				return value=="";
			case "number":
				return false;
			case "boolean":
				return false;
			case "object":
				if(value instanceof String){
					return value=="";
				}else if(value instanceof Array){
					return value.length==0;
				}else{
					return value==null;
				}
		}
	}else if(value.length==0){
		return true;
	}else{
		return false;
	}
},
/**
 * @created: 2011.6.2
 */
"isNumber" : function(value,isSensitive){
	if(typeof(value)=="object"){
		if(value instanceof Number){
			return true;
		}else if(value instanceof String){
			return !isSensitive&&value!=""&&!isNaN(value);
		}
	}else if(typeof(value)=="number"){
		return true;
	}else{
		return !isSensitive&&value!=""&&!isNaN(value);
	}
},
/**
 * @created: 2011.12.28
 */
"isDate": function(value,isSensitive){
	if(typeof(value)=="object"){
		if(value instanceof Date){
			return true;
		}else if(value instanceof String){
			return !isSensitive&&!isNaN(new Date(value.replace(/-/g,"/").replace(/\./g,"/")));
		}
	}else if(typeof(value)=="string"){
		return !isSensitive&&!isNaN(new Date(value.replace(/-/g,"/").replace(/\./g,"/")));
	}else{
		return false;
	}
},
/**
 * @created: 2011.6.2
 * @modified: 2012.9.10-2013.10.18
 */
"globalEval" : function(code,host,isReturn){
	var external=host||this.Engine.getExternal();
	if ( code ) {
		if(!isReturn){
			if(external.execScript){
				external.execScript(code);
			}else{
				(function(code){
					external["eval"].call(external, code);
				})(code);
			}
		}else if("\v"=="v"){	//for IE8-
			return (new Function("return ("+code+");")());
		}else{
			return (function(code){
				return external["eval"].call(external, code);
			})(code);
		}
	}
},
"attempt" : function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return undefined;
},
/**
 * @since: JSDK3 V1.8.1
 * @created: 2012.3.23
 * @modified: 2013.1.6-2013.9.8
 * @invoke: 
 *	(1)extend(target,source)
 *	(2)extend(isDeep,target,source)
 */
"extend": function(){
	var argLen=arguments.length;
	var isDeep=false,target={},source;
	if(argLen==2){
		target=arguments[0],source=arguments[1];
	}else if(argLen==3&&this.is(arguments[0],"Boolean")){
		isDeep=arguments[0],target=arguments[1],source=arguments[2];
	}else{
		return;
	}
	if(!isDeep){
		for(var key in source) { 
			target[key] = source[key]; 
		}
	}else{
		for(var key in source) { 
			var copy = source[key]; 
			if(target === copy) continue;	// Prevent never-ending loop
			if(this.is(copy,"Object")){ 
				target[key] = arguments.callee.call(this,target[key] || {}, copy); 
			}else if(this.is(copy,"Array")){ 
				target[key] = arguments.callee.call(this,target[key] || [], copy); 
			}else{ 
				target[key] = copy; 
			} 
		} 
	}
	return target; 
}
,

/**
 * global function for id
 * @file: function.id.js
 * @author: liu denggao
 * @created: 2012.05.14
 * @modified: 2012.05.14
 **************************/

/**
 * output id number
 * @description 
 * @invoke 
 * @para iTimelyOptions: -1, only datetime; 0, universal; 1, normal; 2, timely
 * @para iLen: length of id.
 *		(1)8: for normal or timely
 *		(2)9: for normal or timely
 *		(3)10: for normal or timely
 *		(4)11: for normal or timely
 *		(5)16: only for universal
 *		(6)32: only for universal
 * @return
 * @author liudenggao
 * @origCreated 2010.12.26
 * @created 2012.05.14
 */
"newId": function(iTimelyOptions,iLen){
	var date=new Date();
	var iYear=date.getFullYear(); 
	var iCentYear=iYear%100;
	var iCent=iYear-iCentYear;
	var iMonth=date.getMonth()+1;
	var iDay=date.getDate();
	var iHour=date.getHours();
	var iMinute=date.getMinutes();
	var iSecond=date.getSeconds();
	var iMilliseconds=date.getMilliseconds();

	var retValue="";

	switch(iTimelyOptions){
		case 0:			//universal
			iLen=iLen||16;
			switch(iLen){
				case 16:		//16\u4f4d\u5341\u516d\u8fdb\u5236=HEX(4(\u4e16\u7eaa\u5e74\u6708\u65e5)+7(\u65f6\u5206\u79d2\u6beb\u79d2)+5(\u968f\u673a\u6570))
					var dtStart=new Date(iCent,0,1);
					var iDate=Math.floor((date-dtStart)/(1000*60*60*24))+1;
					var sDate=[].fill("0",4).concat(iDate.toString(16)).join("").slice(-4);
					var iTime=iHour*60*60*1000+iMinute*60*1000+iSecond*1000+iMilliseconds;
					var sTime=[].fill("0",7).concat(iTime.toString(16)).join("").slice(-7);
					var sRandom=[].fill("0",5).concat(Math.random().toString(16).replace(".","")).join("").slice(-5);
					retValue=sDate+sTime+sRandom;
					break;
				case 32:		//32\u4f4d\u5341\u8fdb\u5236=DEC(8(\u5e74\u6708\u65e5)+9(\u65f6\u5206\u79d2\u6beb\u79d2)+15(\u968f\u673a\u6570))
					var sDate=[("0000"+iYear).slice(-4),("00"+iMonth).slice(-2),("00"+iDay).slice(-2)].join("");
					var sTime=[("00"+iHour).slice(-2),("00"+iMinute).slice(-2),("00"+iSecond).slice(-2)
							,("000"+iMilliseconds).slice(-3)].join("");
					var sRandom=[].fill("0",15).concat(Math.random().toString().replace(".","")).join("").slice(-15);
					retValue=sDate+sTime+sRandom;
					break;
			}
			break;
		case 1:			//normal	
			iLen=iLen||11;
			switch(iLen){
				case 8:		//8\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(25(\u6708\u65e5\u65f6\u5206\u79d2)+16(\u968f\u673a\u6570))
					var dtStart=new Date(iYear,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",25).concat(iTime.toString(2)).join("").slice(-25);
					var sRandom=[].fill("0",16).concat(Math.random().toString(2)).join("").slice(-16);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",8).concat(parseInt(sBin,2).toString(36)).join("").slice(-8);
					break;
				case 9:		//9\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(25(\u6708\u65e5\u65f6\u5206\u79d2)+21(\u968f\u673a\u6570))
					var dtStart=new Date(iYear,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",25).concat(iTime.toString(2)).join("").slice(-25);
					var sRandom=[].fill("0",21).concat(Math.random().toString(2)).join("").slice(-21);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",9).concat(parseInt(sBin,2).toString(36)).join("").slice(-9);
					break;
				case 10:	//10\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(32(\u5e74\u6708\u65e5\u65f6\u5206\u79d2)+19(\u968f\u673a\u6570))
					var dtStart=new Date(iCent,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",19).concat(Math.random().toString(2)).join("").slice(-19);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",10).concat(parseInt(sBin,2).toString(36)).join("").slice(-10);
					break;
				case 11:	//11\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(32(\u5e74\u6708\u65e5\u65f6\u5206\u79d2)+24(\u968f\u673a\u6570))
					var dtStart=new Date(iCent,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",24).concat(Math.random().toString(2)).join("").slice(-24);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",11).concat(parseInt(sBin,2).toString(36)).join("").slice(-11);
					break;
			}
			break;
		case 2:			//timely
			iLen=iLen==undefined?11:iLen;
			switch(iLen){
				case 8:		//8\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(27(\u65f6\u5206\u79d2\u6beb\u79d2)+14(\u968f\u673a\u6570))
					var dtStart=new Date(iYear,date.getMonth(),iDay,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",27).concat(iTime.toString(2)).join("").slice(-27);
					var sRandom=[].fill("0",14).concat(Math.random().toString(2)).join("").slice(-14);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",8).concat(parseInt(sBin,2).toString(36)).join("").slice(-8);
					break;
				case 9:		//9\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(27(\u65f6\u5206\u79d2\u6beb\u79d2)+19(\u968f\u673a\u6570))
					var dtStart=new Date(iYear,date.getMonth(),iDay,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",27).concat(iTime.toString(2)).join("").slice(-27);
					var sRandom=[].fill("0",19).concat(Math.random().toString(2)).join("").slice(-19);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",9).concat(parseInt(sBin,2).toString(36)).join("").slice(-9);
					break;
				case 10:	//10\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(32(\u65e5\u65f6\u5206\u79d2\u6beb\u79d2)+19(\u968f\u673a\u6570))
					var dtStart=new Date(iYear,date.getMonth(),1,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",19).concat(Math.random().toString(2)).join("").slice(-19);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",10).concat(parseInt(sBin,2).toString(36)).join("").slice(-10);
					break;
				case 11:	//11\u4f4d\u4e09\u5341\u516d\u8fdb\u5236=BIN(32(\u65e5\u65f6\u5206\u79d2\u6beb\u79d2)+24(\u968f\u673a\u6570))
					var dtStart=new Date(iYear,date.getMonth(),1,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",24).concat(Math.random().toString(2)).join("").slice(-24);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",11).concat(parseInt(sBin,2).toString(36)).join("").slice(-11);
					break;
			}
			break;
		default:
			var sDate=[("0000"+iYear).slice(-4),("00"+iMonth).slice(-2),("00"+iDay).slice(-2)].join("");
			var sTime=[("00"+iHour).slice(-2),("00"+iMinute).slice(-2),("00"+iSecond).slice(-2)
							,("000"+iMilliseconds).slice(-3)].join("");
			retValue=sDate+sTime;
	}
	return retValue.toUpperCase();
},
"newUnid": function(iBits){
	iBits=iBits||16;
	var aValues=[];
	for(var i=0;i<iBits;i++){
		aValues[i]=Math.floor(Math.random()*16.0).toString(16).toUpperCase();
	} 
	return aValues.join("");
},
"newGuid": function(){
	return [S4(),S4(),"-",S4(),"-",S4(),"-",S4(),"-",S4(),S4(),S4()].join("");   
	function S4(){   
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);   
	}
}

,

/**
 * global function for URI(Uniform Resource Identifier)
 * @file: function.js
 * @author: liu denggao
 * @created: 2011.7.27
 * @modified: 2011.11.16
 **************************/

/**
 * get full path of 'sUrlPath' on current path 'sCurPath'
 * @para sSep: can only as a char 
 * @created: 2011.7.27
 * @modified: 2011.11.16
 */
"getURIFullPath" : function(sCurPath,sUriPath,sSep){
	sCurPath=sCurPath.replace(new RegExp("\\"+sSep+"+$"),"");
	sSep=sSep?sSep:"/";
	var aValues=sUriPath.split(sSep);
	if(sUriPath==""){
		return sCurPath;
	}else if(aValues[0]==""){
		return sUriPath;
	}else if(aValues[0].indexOf(":")>=0){		//is full path
		return sUriPath;
	}else if(aValues[0]=="."){
		return arguments.callee(sCurPath,aValues.slice(1).join(sSep),sSep);
	}else if(aValues[0]==".."){
		if(sCurPath.indexOf(sSep)>=0){
			return arguments.callee(sCurPath.slice(0,sCurPath.lastIndexOf(sSep))
				,aValues.slice(1).join(sSep),sSep);
		}else{
			return arguments.callee(sCurPath,aValues.slice(1).join(sSep),sSep);
		}
	}else{
		return [sCurPath,sUriPath].join(sSep);
	}
},

/**
 * Get relative path
 * @description: not support cross query
 * @para sTargetPath: query by mode that is first up and down
 * @created 2011.7.27
 * @modified 2011.11.16
 */
"getURIRelPath" : function(sCurPath,sUriFullPath,sSep){
	sCurPath=sCurPath.replace(new RegExp("\\"+sSep+"+$"),"");
	sSep=sSep?sSep:"/";
	var aCurPaths=sCurPath.split(sSep);
	var aUriPaths=sUriFullPath.split(sSep);
	var iRelUpLevel=0,aRelUpPaths=[],aRelDownPaths=[];
	if(aCurPaths[0]==""){	//is absolute path
		iRelUpLevel=aCurPaths.length-1;
		aRelDownPaths=aUriPaths.slice(1);
	}else{
		for(var i=0;i<aCurPaths.length;i++){
			if(aCurPaths[i]=="."){
				aCurPaths.splice(i,1);
				i--;
			}
		}
		for(var i=0;i<aUriPaths.length;i++){
			if(aUriPaths[i]=="."){
				aUriPaths.splice(i,1);
				i--;
			}
		}
		if((aCurPaths[0]==".."||aUriPaths[0]=="..")&&(aCurPaths[0]!=aUriPaths[0])){
			return "";		//can not reach.
		}
		aCurPaths.unshift(".");
		aUriPaths.unshift(".");
	}
	for(var i=aCurPaths.length-1;i>=0;i--){
		if(aUriPaths.join(sSep).toLowerCase().indexOf(
			aCurPaths.slice(0,i+1).join(sSep).toLowerCase()+sSep)==0){
			iRelUpLevel=aCurPaths.length-1-i;
			aRelDownPaths=aUriPaths.slice(i+1);
			break;
		}
	}
	//up
	for(var i=0;i<iRelUpLevel;i++){
		aRelUpPaths[i]="..";
	}

	return [].concat(aRelUpPaths,aRelDownPaths).join(sSep);
},
/**
 * get parameter of url
 * @created: 2011.11.02
 * @modified: 2011.11.02
 */
"getURIPrmt" : function(sPrmts,sName){
	sPrmts=(sPrmts.toString().match(/^[^?]*[?]?([^?#]+)[#]?/)||[null,""]).pop();
	var items=sPrmts?sPrmts.split("&"):[];
	for(var i=0,j=0;i<items.length;i++){
		if(items[i]=="") continue;
		var sName1=decodeURIComponent(items[i].split("=")[0]);
		if(sName1.toLowerCase()==sName.toLowerCase()){
			return decodeURIComponent(items[i].right("=")); 
		}
	}
}

,

/**
 * global function for parser
 * @file: function.parser.js
 * @version: V1.2
 * @author: liu denggao
 * @created: 2011.8.20
 * @modified: 2012.9.10-2013.8.3
 **************************/

/**
 * @created: 2011.8.20
 */
"parseJSON": function(data){
	try{
		var func=new Function("return("+data+");");
	}catch(e){
	}
	return !!func?func():func;
},
/**
 * @adapt: JSDK3 v1.8.10
 * @created: 2011.8.20
 * @modified: 2013.8.3
 */
"parseXML": function(data){
	if(this._xmlParser){
		return this._xmlParser.parseFromString(data,"text/xml");
	}else if(this._xmlDom){
		this._xmlDom.loadXML(data.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
		return this._xmlDom;
	}
},
/**
 * @para xml: xml data
 * @para tmpl: json tmplater
 * @created: 2011.9.8
 * @modified: 2012.9.10
 * @since: JSDK3 v1.8.7
 */
"xml2json" : function(xml,tmpl) {
 
	// Create the return object
	var obj = {};
 
	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@"+attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}
 
	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes[i];
			var nodeName = item.nodeName;
			var tmplValue=tmpl&&tmpl[nodeName];
			if (typeof(obj[nodeName]) == "undefined") {
				if(!tmpl){
					obj[nodeName] = this.xml2json(item);
				}else if(tmplValue instanceof Array){
					obj[nodeName] = [this.xml2json(item,tmplValue.getLast())];
				}else{
					obj[nodeName] = this.xml2json(item,tmplValue);
				}
			} else {
				if (!(obj[nodeName] instanceof Array)) {
					obj[nodeName] = [obj[nodeName]];
				}
				if(!tmpl){
					obj[nodeName].push(this.xml2json(item));
				}else if(tmplValue instanceof Array){
					obj[nodeName].push(this.xml2json(item,tmplValue.getLast()));
				}else{
					obj[nodeName].push(this.xml2json(item,tmplValue));
				}
			}
		}
	}
	return obj;
},
/**
 * @created: 2011.9.8
 * @description: not commend
 */
"xml2json_old" : function(xml) {
 
	// Create the return object
	var obj = {};
 
	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}
 
	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes[i];
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = this.xml2json_old(item);
			} else {
				if (!(obj[nodeName] instanceof Array)) {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(this.xml2json_old(item));
			}
		}
	}
	return obj;
}

,

/**
 * global function for charset
 * @file: function.charset.js
 * @version: V0.1
 * @since: JSDK3 V1.5.4
 * @author: liu denggao
 * @created: 2011.9.7
 **************************/

/**
 * convert wide string of utf16 of type to byte string of utf8 of type.
 * @since: JSDK3 V1.5.4
 * @created: 2011.9.7
 */
"utf16to8" : function(str) {
	var out, i, len, c;

	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
},
/**
 * convert byte string of utf8 of type to wide string of utf16 of type.
 * @since: JSDK3 V1.5.4
 * @created: 2011.9.7
 */
"utf8to16" : function(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
		 c = str.charCodeAt(i++);
		 switch(c >> 4){ 
		   case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		     // 0xxxxxxx
		     out += str.charAt(i-1);
		     break;
		   case 12: case 13:
		     // 110x xxxx   10xx xxxx
		     char2 = str.charCodeAt(i++);
		     out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		     break;
		   case 14:
		     // 1110 xxxx  10xx xxxx  10xx xxxx
		     char2 = str.charCodeAt(i++);
		     char3 = str.charCodeAt(i++);
		     out += String.fromCharCode(((c & 0x0F) << 12) |
		        ((char2 & 0x3F) << 6) |
		        ((char3 & 0x3F) << 0));
		     break;
		 }
	}

    return out;
},
/**
 * convert binary to 'BSTR' type
 */
"bin2str" : function(bin){
	var hex_str=this.bin2hex(bin);
	var ret_str="";
	for(var i=0;i<hex_str.length;i+=2){
		ret_str+=String.fromCharCode(parseInt("0x"+hex_str.charAt(i)+hex_str.charAt(i+1)));
	}
	return ret_str;
},
/**
 * convert binary to hex string
 * only support for IE
 */
"bin2hex" : function(bin){
	var _xmlDom=Engine.getLoader().getXMLDOMDocument();
	var _xmlParser=Engine.getLoader().getXMLDOMParser();
	var xml=null;
	var node=null;
	if(_xmlDom){
		xml=_xmlDom;
	}else{
		xml=_xmlParser.parseFromString("","text/xml");
	}
	node=xml.createElement("root");
	node.dataType = "bin.hex";
	node.nodeTypedValue=bin;
	return node.text||node.textContent;
},
"str2hex" : function(s){
	var v,i, f = 0, a = [];  
	s += '';
	f = s.length;  

	for (i = 0; i<f; i++) {  
		a[i] = s.charCodeAt(i).toString(16).replace(/^([\da-f])$/,"0$1");  
	}  
	  
	return a.join('');
}

,

/**
 * global function for execute
 * @file: global.exec.js
 * @version: V0.5 beta
 * @author: liu denggao
 * @created: 2013.5.31
 * @modified: 2013.6.1
 **************************/
 
 /**
 * @para func: required. func()
 *		notice:
 *		1)return 1: exit task, return not 1: wait task.
 * @pata driver: optional
 * @para para: parameter for driver
 * @author: liudenggao
 * @created: 2012.10.12
 * @modified: 2012.10.15-2013.5.31
 */
"exec" : function(){
	var _timer=null;
	var _timer1=null;
	var _drivers={};
	var _mainTasks=[];
	var _subTasks=[];
	var _doneSubTaskCount=0;
	var _backTasks=[];		//all back tasks for current task
	var _backTaskIdCount=0;	//for id of back tasks
	var _curTask=null;		//current task
	var _curSubTask=null;	//current sub task
	var _html=[];			//html to write for current task
	var _state=0;			//0, ready; 1, running
	var _flag=0;			//0, no finished main task; 1, finished main task, but not contains back tasks.
	function startNextTask(){
		if(!_mainTasks.length) return;
		_state=1;
		_timer=window.setTimeout(function(){
			doNextTask();
			_timer=null;
		},0);
	}
	function startNextSubTask(){
		if(!_subTasks.length) return;
		_timer1=window.setTimeout(function(){
			try{ 
				_doneSubTaskCount++;
				_curSubTask=_subTasks.shift();
				var ret=_curSubTask.action();
			}catch(e){
			}
			if(ret===false){
				onFinishTask();
			}else if(!_subTasks.length){
				onFinishTask();
			}else{
				startNextSubTask();
			}
		},0);
	}
	function doNextTask(){
		try{ 
			_flag=0;
			_html.clear();
			_subTasks.clear();
			_doneSubTaskCount=0;
			_backTasks.clear();
			_backTaskIdCount=0;
			_curTask=_mainTasks.shift();
			_curTask.action();
		}catch(e){
		}
	}
	/**
	 * @para func: func()
	 */
	function callBack(func){
		var id=_backTaskIdCount++;
		var task=_backTasks[_backTasks.length]={
			"id": id,
			"action": function(){
				try{func.apply(this,arguments);}catch(e){};
				onFinishBackTask(id);
			}
		}
		return task.action;
	}
	//when finished a back tasks of a main task.
	function onFinishBackTask(id){
		for(var i=0;i<_backTasks.length;i++){
			if(_backTasks[i].id==id){
				_backTasks.removeAt(i);
				break;
			}
		}
		if(_backTasks.length==0&&_flag==1) onFinishAllBackTasks();
	}
	//when finished all back tasks of a main task.
	function onFinishAllBackTasks(){
		onFinishTask();
	}
	function onFinishTask(){
		_state=0;
		if(_html.length) _curTask.container.insertAdjacentHTML("beforeBegin",_html.join(""));
		if(_curTask.onFinished) try{_curTask.onFinished(_curTask.data);}catch(e){};
		startNextTask();
	}
	_drivers={
		/**
		 * @para func: required. func(container,callBack)
		 *		notice:
		 *		1)return 1: exit task, return not 1: wait task.
		 * @pata container: optional
		 *		1)when document is loading, get current script tag element.
		 * @author: liudenggao
		 * @created: 2012.10.12
		 * @modified: 2012.10.15
		 */
		"do": function(func,para){
			var container=para&&para.container;
			if(document.readyState.equal(["loading","interactive"])){
				var scripts=document.getElementsByTagName("SCRIPT");
				container=scripts[scripts.length-1];
				container.write=function(sHtml){
					_html.push(sHtml);
				}
				container.writeln=function(sHtml){
					_html.push(sHtml+"<br>");
				}
			}
			_mainTasks.push({
				"container": container,
				"data": para&&para.data,
				"onFinished": para&&para.onFinished, 
				"action":	function(){
					var ret=func(container,callBack,this.data);
					_flag=1;	//finished main task.
					if(func.length<2){	//no call back
						onFinishTask();
					}else{	//has call back
						if(ret) {						//no call back
							onFinishTask();	
						}else if(!_backTasks.length){	//no call back or finished all call back.
							onFinishTask();	
						}
					}
				}
			});
			if(!_state) startNextTask();
		},
		/**
		 * @para func: required. func(items,start,count,seq,data)
		 *		para items: Array or Collection, original data
		 *		para start: Number, index of data, start from 0
		 *		para count: Number, count of data
		 *		para seq: Number, while seq ,start from 0
		 *		notice:
		 *		1)return 1: exit task, return not 1: wait task.
		 * @pata para: required.
		 *		1)items: required, Array or Collection
		 *		2)start: optional, Number
		 *		3)count: optional, Number
		 *		4)size: optional, Number
		 *		5)data: optional, Variant, user custom data
		 *		6)onFinished: optional, Function
		 * @author: liudenggao
		 * @created: 2013.5.31
		 * @modified: 2013.5.31
		 */		
		"while": function(func,para){
			var count=para.count||para.items&&para.items.length||0;
			_mainTasks.push({
				"items": para.items,
				"start": para.start||0,
				"count": count,
				"size": para.size||Math.ceil(Math.max(count/100,5)),
				"data": para.data,
				"event": {
					"onFinished": para.onFinished
				},
				//onFinished(end,count,data)
				"onFinished": function(){
					if(this.event.onFinished) this.event.onFinished.call(this,this.start
								+_doneSubTaskCount*this.size,_doneSubTaskCount*this.size,this.data);
				},
				"action":	function(){
					if(this.size){
						for(var i=0,len=Math.ceil(this.count/this.size);i<len;i++){
							_subTasks.push({
								index: i,
								parent: this,
								action: function(){
									try{
										return func(para.items,this.parent.start+this.index*this.parent.size
												,this.parent.size,this.index,this.parent.data);
									}catch(e){
										return false;
									}
								}
							});
						}					
					}else{	//\u6839\u636e\u6bcf\u4e2a\u5b50\u4efb\u52a1\u6267\u884c\u7684\u65f6\u95f4\u52a8\u6001\u53d8\u5316\u6bcf\u6b21\u6267\u884c\u7684\u5b50\u5faa\u73af\u6570
						//to do...
					}
					startNextSubTask();
					_flag=1;	//finished main task.
					if(!_subTasks.length) onFinishTask();
				}
			});
			if(!_state) startNextTask();
		}
	}
	return function(func,driver,para){
		_drivers[driver||"do"](func,para);
	}
}()

,

/**
 * global function for ajax for lite edition
 * @file: function.ajax.js
 * @version: V2.3.1 beta
 * @support: IE6+, IE9+, Firefox3+, Chrome13+, Safari5+, Opera11+
 * @author: liu denggao
 * @created: 2011.7.26
 * @modified: 2013.4.12-2013.8.6
 ********************************/

/**
 *  ajax
 * @since: JSDK3 V1.7.7
 * @invoke: 
 *		(1)ajax(url[,settings])
 *		(2)ajax(settings)
 * @para settings:
 *		.type: default: 'GET'. Can is 'GET' or 'POST'
 *		.xhr: XMLHttpRequest
 *		.url:
 *		.data:
 *		.cache: default: true
 *		.async: default: true
 *		.contentType:	default: 'application/x-www-form-urlencoded'
 *		.mimeType: 
 *		.charset: charset of response
 *		.context: 
 *		.complete: callback function on success or error. usage:
 *			complete(xhr,textStatus)
 *		.success: callback function on success. usage: 
 *			success(data,textStatus,xhr)
 *		.error: callback functon on error. usage:
 *			error(xhr,textStatus,errorThrown)
 *		.convert: charset convert program. usage:
 *			convert(bstr)
 *		.dataType: bin,text,json,xml
 * @description: 
 * @author: liudenggao
 * @created: 2012.3.9
 * @modified: 2012.3.16-2013.8.6
 */
"ajax": function(){
	//var loader=Engine.getLoader();
	var global=this;
	var _xmlHttp=loader.getXMLHttpRequest();
	var _xmlDom=loader.getXMLDOMDocument();
	var _xmlParser=loader.getXMLDOMParser();
	function get(settings,xmlHttp,url,data){
		url=url.replace(/^\/[^/\:]+\:\//,"/");	//for local file for IE
		if(data){
			if(typeof(data)=="object"){
				data=serialize(data,"PRMT");
			}
			url+=(url.match(/\?/) ? "&" : "?") + data;
		}
		xmlHttp.open("GET", url, settings.async);
		if(xmlHttp.overrideMimeType) { //Firefox
			xmlHttp.overrideMimeType(settings.mimeType+(settings.charset?("; charset="+settings.charset):"")); 
		}
		if(data){
			xmlHttp.setRequestHeader("Content-Type", settings.contentType);
			data=null;
		}
		if(!settings.cache){
			xmlHttp.setRequestHeader("Pragma","no-cache");
			xmlHttp.setRequestHeader("If-Modified-Since","0");
		}
		if(settings.async){
			xmlHttp.onreadystatechange=function(){
				onReadyStateChange(settings,xmlHttp);
			};
			xmlHttp.send(null);
		}else{
			xmlHttp.send(null);
			return onReadyStateChange(settings,xmlHttp);
		}
	}
	function post(settings,xmlHttp,url,data){
		if(data){
			if(typeof(data)=="object"){
				data=serialize(data,"PRMT");
			}
		}
		xmlHttp.open("POST", url, settings.async);
		if(xmlHttp.overrideMimeType) { //Firefox
			xmlHttp.overrideMimeType(settings.mimeType+(settings.charset?("; charset="+settings.charset):"")); 
		}
		xmlHttp.setRequestHeader("Content-Type", settings.contentType);
		if(settings.async){
			xmlHttp.onreadystatechange=function(){
				onReadyStateChange(settings,xmlHttp);
			};
			xmlHttp.send(data);
		}else{
			xmlHttp.send(data);
			return onReadyStateChange(settings,xmlHttp);
		}
	}
	function onReadyStateChange(settings,xmlHttp){
		var content="";
		if(xmlHttp.readyState == 4) {	//data receive completed
		   //200 return OK of request status
		   if(xmlHttp.status == 200) {
				try{
					content=getOnReady(xmlHttp,settings.dataType,settings.charset,settings.convert);
					settings.complete.call(settings.context,xmlHttp,"");
					settings.success.call(settings.context,content,"",xmlHttp);
					return content;
				}catch(e){
				}
		   }else if(xmlHttp.status == 0
				&&!xmlHttp.getAllResponseHeaders()){
				try{
					content=getOnReady(xmlHttp,settings.dataType,settings.charset,settings.convert);
					settings.complete.call(settings.context,xmlHttp,"");
					settings.success.call(settings.context,content,"",xmlHttp);
					return content;
				}catch(e){
				}
		   }else{
				return settings.error(xmlHttp,"","get resource error !");
		   }
		}
	}
	function getOnReady(xmlHttp,sFormat,sCharset,fpConvert){
		var contentType=xmlHttp.getResponseHeader("Content-Type").split(";")[0];
		switch(sFormat.toLowerCase()){
			case "text":
				return getTextOnReady(xmlHttp,sCharset,fpConvert);
			case "xml":
				var xml;
				try{
					var _xmlDom=loader.getXMLDOMDocument();
					if(contentType=="text/xml"||contentType=="application/xml"||xmlHttp.overrideMimeType){
						if(_xmlParser){
							xml=_xmlParser.parseFromString(xmlHttp.responseText,"text/xml");
						}else{
							xml=xmlHttp.responseXML;
						}
					}else if(contentType==""||contentType=="application/octet_stream"){
						if(_xmlParser){
							xml=_xmlParser.parseFromString(xmlHttp.responseText,"text/xml");
						}else if(_xmlDom){
							_xmlDom.loadXML(getTextOnReady(xmlHttp,sCharset,fpConvert)
									.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
							xml=_xmlDom;
						}
					}else if(contentType.split("/")[0]=="text"){
						if(_xmlParser){
							xml=_xmlParser.parseFromString(xmlHttp.responseText,"text/xml");
						}else if(_xmlDom){
							_xmlDom.loadXML(getTextOnReady(xmlHttp,sCharset,fpConvert)
									.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
							xml=_xmlDom;
						}
					}
					if(xml&&xml.documentElement
						&&xml.documentElement.nodeName.toLowerCase()!="parsererror") 
						return xml;
				}catch(e){
				}
				return null;
			case "json":
				try{
					var func=new Function("return("+getTextOnReady(xmlHttp,sCharset,fpConvert)+");");
				}catch(e){
				}
				return !!func?func():func;
			default:
				return xmlHttp.responseBody;
		}
	}
	function getTextOnReady(xmlHttp,sCharset,fpConvert){
		var origCharset=(""+xmlHttp.getResponseHeader("Content-Type")).right(";").right("charset=").valueOf();
		if(!xmlHttp.overrideMimeType&&!origCharset&&sCharset
			&&typeof(fpConvert)=="function"){
			return fpConvert(global.bin2str(xmlHttp.responseBody));
		}
		return xmlHttp.responseText;
	}
	function serialize(obj,dataType){
		dataType=dataType||"JSON";
		switch(dataType.toUpperCase()){
			case "JSON":
				//to do...
				break;
			case "PRMT":
				var values=[];
				for(var key in obj){
					if(obj.hasOwnProperty(key))
						values[values.length]=encodeURIComponent(key)+"="+encodeURIComponent(obj[key].toString());
				}
				return values.join("&");
		}
	}
	return function(arg1,arg2){
		//if(!global) global=Engine.getApp();
		var settings={
			type: "GET",
			xhr: _xmlHttp,
			url: "",
			data: "",
			cache: true,
			async: true,
			charset: "",
			mimeType: "",
			contentType: 'application/x-www-form-urlencoded',
			context: null,
			complete: function(xhr,textStatus){
			
			},
			success: function(data,textStatus,xhr){
			
			},
			error: function(xhr, textStatus, errorThrown){
			
			},
			convert: null,
			dataType: "bin"
		};	
		var settings1;
		if(arg1&&!(arg1 instanceof String)){
			settings1=arg1;
		}else if(arg2){
			settings1=arg2;
		}
		for(var key in settings1){
			if(settings1.hasOwnProperty(key)){
				settings[key]=settings1[key];
			}
		}
		if(arg1 instanceof String){
			settings.url=arg1;
		}
		if(settings.async){
			settings.xhr=loader.getXMLHttpRequest();
		}
		if(!settings.mimeType){
			switch(settings.dataType.toLowerCase()){
				case "bin":
					settings.mimeType="application/octet_stream";break;
				case "text":
					settings.mimeType="text/plain";break;
				case "json":
					settings.mimeType="text/plain";break;
				case "xml":
					settings.mimeType="text/xml";break;
				default:
					settings.mimeType="application/octet_stream";break;
			}
		}
		settings.context=settings;
		if(settings.type=="GET"){
			return get(settings,settings.xhr,settings.url,settings.data);
		}else if(settings.type=="POST"){
			return post(settings,settings.xhr,settings.url,settings.data);
		}
	}
}(),

/**
 * get
 * @since: JSDK3 V1.2.4
 * @author: liudenggao
 * @created: 2011.6.23
 * @modified: 2012.03.16
 * @log: solve an problem caused by multiple asynchronous operations.
 */
"get": function(sUrl,vData,isCache,fpCallBack,sDataType,sCharset,fpConvert){
	var settings={
		type: "GET",
		url: sUrl,
		data: vData,
		cache: isCache,
		async: !!fpCallBack,
		charset: sCharset
	};
	if(typeof(fpCallBack)=="function"){
		settings.success=fpCallBack;
	}
	if(sDataType){
		settings.dataType=sDataType;
	}
	if(typeof(fpConvert)=="function"){
		settings.convert=fpConvert;
	}
	return this.ajax(settings);
},

/**
 *  post
 * @since: JSDK3 V1.7.7
 * @author: liudenggao
 * @created: 2012.3.9
 * @modified: 2012.3.9
 */
"post": function(sUrl,vData,fpCallBack,sDataType){
	var settings={
		type: "POST",
		url: sUrl,
		data: vData,
		async: !!fpCallBack
	};
	if(typeof(fpCallBack)=="function"){
		settings.success=fpCallBack;
	}
	if(sDataType){
		settings.dataType=sDataType;
	}
	return this.ajax(settings);
},

/**
 * get image size
 * @source:
	 * -------------
	 * \u56fe\u7247\u5934\u6570\u636e\u52a0\u8f7d\u5c31\u7eea\u4e8b\u4ef6 - \u66f4\u5feb\u83b7\u53d6\u56fe\u7247\u5c3a\u5bf8
	 * @version	2011.05.27
	 * @author	TangBin
	 * @see		http://www.planeart.cn/?p=1121
	 * @param	{String}	\u56fe\u7247\u8def\u5f84
	 * @param	{Function}	\u5c3a\u5bf8\u5c31\u7eea
	 * @param	{Function}	\u52a0\u8f7d\u5b8c\u6bd5 (\u53ef\u9009)
	 * @param	{Function}	\u52a0\u8f7d\u9519\u8bef (\u53ef\u9009)
	 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
	 * -------------
 * @modifier: liudenggao
 * @created: 2013.4.12
 */
"getImage": (function () {
	var list = [], intervalId = null,

	// \u7528\u6765\u6267\u884c\u961f\u5217
	tick = function () {
		var i = 0;
		for (; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i]();
		};
		!list.length && stop();
	},

	// \u505c\u6b62\u6240\u6709\u5b9a\u65f6\u5668\u961f\u5217
	stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, load, error) {
		var onready, width, height, newWidth, newHeight,
			img = new Image();
		
		img.src = url;

		// \u5982\u679c\u56fe\u7247\u88ab\u7f13\u5b58\uff0c\u5219\u76f4\u63a5\u8fd4\u56de\u7f13\u5b58\u6570\u636e
		if (img.complete) {
			ready.call(img);
			load && load.call(img);
			return;
		};
		
		width = img.width;
		height = img.height;
		
		// \u52a0\u8f7d\u9519\u8bef\u540e\u7684\u4e8b\u4ef6
		img.onerror = function () {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};
		
		// \u56fe\u7247\u5c3a\u5bf8\u5c31\u7eea
		onready = function () {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
				// \u5982\u679c\u56fe\u7247\u5df2\u7ecf\u5728\u5176\u4ed6\u5730\u65b9\u52a0\u8f7d\u53ef\u4f7f\u7528\u9762\u79ef\u68c0\u6d4b
				newWidth * newHeight > 1024
			) {
				ready.call(img);
				onready.end = true;
			};
		};
		onready();
		
		// \u5b8c\u5168\u52a0\u8f7d\u5b8c\u6bd5\u7684\u4e8b\u4ef6
		img.onload = function () {
			// onload\u5728\u5b9a\u65f6\u5668\u65f6\u95f4\u5dee\u8303\u56f4\u5185\u53ef\u80fd\u6bd4onready\u5feb
			// \u8fd9\u91cc\u8fdb\u884c\u68c0\u67e5\u5e76\u4fdd\u8bc1onready\u4f18\u5148\u6267\u884c
			!onready.end && onready();
		
			load && load.call(img);
			
			// IE gif\u52a8\u753b\u4f1a\u5faa\u73af\u6267\u884conload\uff0c\u7f6e\u7a7aonload\u5373\u53ef
			img = img.onload = img.onerror = null;
		};

		// \u52a0\u5165\u961f\u5217\u4e2d\u5b9a\u671f\u6267\u884c
		if (!onready.end) {
			list.push(onready);
			// \u65e0\u8bba\u4f55\u65f6\u53ea\u5141\u8bb8\u51fa\u73b0\u4e00\u4e2a\u5b9a\u65f6\u5668\uff0c\u51cf\u5c11\u6d4f\u89c8\u5668\u6027\u80fd\u635f\u8017
			if (intervalId === null) intervalId = setInterval(tick, 40);
		};
	};
})()

,

/**
 * global query function for document
 * @file: global.query.js
 * @version: V1.0
 * @since: JSDK3 v1.9.0
 * @sourceProject: hackwaly / Q
 * @sourceUrl: https://github.com/hackwaly/Q
 * @created: 2012.12.20
 * @modified: 2012.12.20
 **************************/

"query": (function (){
    var d = document;
    d._Q_rev = 0;
    
    var MUTATION = false;
    var _onMu = function (){
        d._Q_rev ++;
        MUTATION = true;
    };
    if (d.addEventListener) {
        d.addEventListener('DOMNodeInserted', _onMu, false);
        d.addEventListener('DOMNodeRemoved', _onMu, false);
    }

    var BY_ID1;
    var BY_CLASS;
    var HAS_TEXT_CONTENT = false;
    var IE678 = window.ActiveXObject && !d.addEventListener;
    (function (){
        var div = d.createElement('div');
        div.innerHTML = '.<a name="d"></a><div id="d"></div>';
        HAS_TEXT_CONTENT = !!div.textContent;
        BY_ID1 = div.getElementsByTagName('*')["d"] === div.lastChild;
        div.innerHTML = '<div class="t e"></div><div class="t"></div>';
        div.lastChild.className = 'e';
        BY_CLASS = div.getElementsByClassName && div.getElementsByClassName('e').length == 2;
    })();
    var BY_NAME = !!d.getElementsByName;
    var BY_ELEMENT = typeof d.documentElement.nextElementSibling !== 'undefined';
    var BY_CHILDREN = !!d.documentElement.children;
    var BY_CHILDREN_TAG = BY_CHILDREN && !!d.documentElement.children.tags;

    var PATTERN = /(?:\s*([ ~+>,])\s*)?(?:([:.#]?)((?:[\w\u00A1-\uFFFF-]|\\.)+|\*)|\[\s*((?:[\w\u00A1-\uFFFF-]|\\.)+)(?:\s*([~^$|*!]?=)\s*((['"]).*?\7|[^\]]*))?\s*\])/g;
    
    function trim(str){
        return str.replace(/^\s*|\s*$/g, '');
    }
    function make(kind, array){
        return (array.kind = kind, array);
    }
    var parse = function (){
        var text;
        var index;

        function match(regex){
            var mc = (regex.lastIndex = index, regex.exec(text));
            return mc && mc.index == index ? (index = regex.lastIndex, mc) : null;
        }
        function dequote(str){
            var ch = str.charAt(0);
            return ch == '"' || ch == "'" ? str.slice(1, -1) : str;
        }
        function error(){ throw ['ParseError', text, index]; }

        function parse(){
            var mc, simple, seq = [], chain = [seq], group = [chain];
            while (mc = match(PATTERN)) {
                if (mc[1]) {
                    if (mc[1] == ',') group.push(chain = []);
                    if (seq.length) chain.push(seq = []);
                    if (mc[1] != ',') seq.comb = mc[1];
                }
                simple = [mc[4] || mc[3]];
                if (mc[6]) simple.push(dequote(mc[6]));
                simple.kind = mc[5] || (mc[4] ? '[' : mc[2] || 'T');
                if (simple[0] == '*' && simple.kind != 'T') error();
                if (mc[2] == ':') {
                    simple.kind = ':' + mc[3];
                    if (text.charAt(index) == '(') {
                        index ++;
                        if (mc[3] == 'not' || mc[3] == 'has') {
                            var t = index;
                            simple[0] = parse();
                            simple[1] = text.slice(t, index);
                            if (text.charAt(index) == ')') index ++; else error();
                        } else {
                            var tmpIndex = text.indexOf(')', index);
                            if (tmpIndex != -1) {
                                simple[0] = trim(text.slice(index, tmpIndex));
                                index = tmpIndex + 1;
                            } else error();

                            if (mc[3].indexOf('nth') == 0) {
                                var tmp = simple[0];
                                tmp = (tmp == 'even' ? '2n' : tmp == 'odd' ? '2n+1' :
                                    (tmp.indexOf('n') == -1 ? '0n': '') + tmp.replace(/\s*/g, '')).split('n');
                                simple[0] = !tmp[0] ? 1 : Number(tmp[0]) | 0;
                                simple[1] = Number(tmp[1]) | 0;
                            } else if (mc[3] == 'contains') {
                                simple[0] = dequote(simple[0]);
                            }
                        }
                    }
                }
                seq.push(simple);
            }
            return group;
        }

        return function (selector){
            return (text = selector, index = 0, selector = parse(), match(/\s*/g), index < text.length) ? error() : selector;
        };

    }();

    var fRMap = { '#': 9, 'N': BY_NAME ? 7 : 0, '.': BY_CLASS ? 6 : 0, 'T': 5 };
    var tRMap = { '#': 9, '=': 9, '[': 8, 'N': 9, 'T': 8, '.': 5,  '~=': 3, '|=': 3, '*=': 3,
        ':not': 6, ':has': 1, ':contains': 3, ':nth-child': 2, ':nth-last-child': 2,
        ':first-child': 3, ':last-child': 3, ':only-child': 3, ':not-ex': 7 };
    var efMap = { id: '#', name: 'N' };
    var testingOrder = function (a, b){ return a.tR - b.tR; };
    var regPos = /:(nth|eq|gt|lt|first|last|even|odd)$/;
    
    function process(seq){
        var finder, t;
        var k = seq.length;
        while (k --) {
            var simple = seq[k];
            // \u8f6c\u5316[id="xxx"][name="xxx"][tagName="xxx"][className~="xxx"]\u4e4b\u7c7b\u7684\u9009\u62e9\u5668
            // \u8bc6\u522b:root,html|head|body|title\u7b49\u5168\u5c40\u4ec5\u4e00\u4e2a\u7684\u6807\u7b7e\u7684\u9009\u62e9\u5668\uff0c\u5ffd\u7565*\u9009\u62e9\u5668
            // \u5408\u5e76\u7c7b\u9009\u62e9\u5668\u4ee5\u4fbf\u4e8e\u4f7f\u7528getElementsByClassName
            if (simple.kind == ':html') simple = make('T', 'html');
            if (simple.kind == '=') {
                if (efMap[simple[0]]) simple = make(efMap[simple[0]], [simple[1]]);
            } else if (simple.kind == '~=' && simple[0] == 'className') simple = make('.', [simple[1]]);
            if (simple.kind == 'T') {
                if (simple[0] == '*') simple.kind = '*'; else seq.tag = simple;
                t = simple[0].toLowerCase();
            } else if (simple.kind == '.') {
                if (!seq.classes) seq.classes = simple; else {
                    seq.classes.push(simple[0]);
                    simple.kind = '*';
                }
            }
            if (simple.kind == ':not' && !((t=simple[0],t.length==1)&&(t=t[0],t.length==1))) {
                simple.kind = ':not-ex';
            }
            //remark: \u8fd9\u91cc\u662f\u4e3a\u4e86\u652f\u6301sizzle\u7684setFilter\u7cfb\u5217
            if (regPos.test(simple.kind)) {
                simple[0] = Number(simple[0]) | 0;
                var newSimple = make(simple.kind, simple.slice(0));
                simple.kind = '*';
                if (!seq.allPoses) {
                    seq.allPoses = [newSimple];
                } else {
                    seq.allPoses.push(newSimple);
                }
            }
            // \u8ba1\u7b97\u9009\u62e9\u5668\u7684\u5f97\u5206\u7528\u4e8e\u4f18\u5148\u7ea7\u6392\u5e8f\u7b49\u7b56\u7565
            simple.fR = fRMap[simple.kind] | 0;
            simple.tR = tRMap[simple.kind] | 0;
            if (simple.fR && (!finder || simple.fR > finder.fR)) finder = simple;
            seq[k] = simple;
        }
        // \u6309\u7167\u4f18\u5148\u7ea7\u5bf9\u7528\u4e8e\u6d4b\u8bd5\u7684\u9009\u62e9\u5668\u8fdb\u884c\u6392\u5e8f
        seq.sort(testingOrder);
        // \u8bb0\u5f55\u7528\u4e8egetElementXXX\u7684\u6700\u4f73\u7684\u9009\u62e9\u5668
        seq.$ = finder;
        return seq;
    }
    // \u5bf9chain\u8fdb\u884c\u5904\u7406
    // \u6ce8\u610f\u4e3a\u4e86\u5904\u7406\u65b9\u4fbf, \u8fd4\u56de\u7684\u6570\u7ec4\u662f\u5012\u5e8f\u7684
    // div p a => [div] [p] [a]
    // div p>a => [div] [p>a]
    function slice(chain){
        var part = [];
        var parts = [part];
        var k = chain.length;
        while (k --) {
            var seq = chain[k];
            seq = process(seq);
            seq.N = 'node' + k;
            //remark: \u8fd9\u91cc\u662f\u4e3a\u4e86\u652f\u6301sizzle\u7684setFilter.
            if (seq.allPoses) {
                if (!chain.allPoses) {
                    chain.allPoses = [];
                }
                chain.allPoses.push.apply(chain.allPoses, seq.allPoses);
            }
            if (seq.$ && (!part.fR || seq.$.fR > part.fR || (seq.$.fR == part.fR && parts.length == 1))) {
                part.fR = seq.$.fR;
                part.fI = part.length;
            }
            part.push(seq);
            if (seq.comb == ' ' && k && part.fI != null) {
                parts.push(part = []);
                part.fR = 0;
            }
            if (k == chain.length - 1 && seq.tag) chain.tag = seq.tag;
        }
        for (var i=0; i<parts.length; i++) {
            part = parts[i];
            var part1 = parts[i + 1];
            if (part1 != null) {
                if (part.fR > part1.fR || (part.fR == part1.fR && part1.fI != 0)){
                    parts.splice(i + 1, 1);
                    part.push.apply(part, part1);
                    i --;
                } else {
                    part.R = part1[0].N;
                }
            } else {
                part.R = 'root';
                part.isFirst = true;
//                // \u5982\u679c\u5c5e\u4e8eQ("~ span._result", el)\u8fd9\u79cd\u60c5\u51b5
//                if (part[part.length - 1].comb !== ' ') {
//                    part.fI = part.length - 1;
//                }
            }
        }
        // \u5982\u679c\u6ca1\u6709\u627e\u5230\u4efb\u4f55\u4e00\u4e2a\u53ef\u4ee5\u7528\u4e8efind\u7684seq.
        if (parts[0].fI == null) {
            parts[0].fI = 0;
            parts[0][0].$ = make('*', ['*']);
        }
        return parts;
    }

    function format(tpl, params){
        return tpl.replace(/#\{([^}]+)\}/g, function (m, p){
            return params[p] == null ? m : params[p] + '';
        });
    }

    var CTX_NGEN = 0;

    var TPL_DOC = '/*^var doc=root.ownerDocument||root;^*/';
    var TPL_XHTML = TPL_DOC + '/*^var xhtml=Q._isXHTML(doc);^*/';
    var TPL_CONTAINS = IE678 ? '#{0}.contains(#{1})' : '#{0}.compareDocumentPosition(#{1})&16';
    var TPL_QID = '#{N}._Q_id||(#{N}._Q_id=++qid)';
    var TPL_FIND = {
        '#': 'var #{N}=Q._byId("#{P}", #{R});if(#{N}){#{X}}',
        'N': TPL_DOC + 'var #{N}A=doc.getElementsByName("#{P}");for(var #{N}I=0,#{N};#{N}=#{N}A[#{N}I];#{N}I++){if(#{R}===doc||' + format(TPL_CONTAINS, ['#{R}', '#{N}']) +'){#{X}}}',
        'T': 'var #{N}A=#{R}.getElementsByTagName("#{P}");for(var #{N}I=0,#{N};#{N}=#{N}A[#{N}I];#{N}I++){#{X}}',
        '.': 'var #{N}A=#{R}.getElementsByClassName("#{P}");for(var #{N}I=0,#{N};#{N}=#{N}A[#{N}I];#{N}I++){#{X}}',
        '*': 'var #{N}A=#{R}.getElementsByTagName("*");for(var #{N}I=0,#{N};#{N}=#{N}A[#{N}I];#{N}I++){#{X}}',
        '+': BY_ELEMENT ? '/*^var #{N};^*/if(#{N}=#{R}.nextElementSibling){#{X}}' : 'var #{N}=#{R};while(#{N}=#{N}.nextSibling){if(#{N}.nodeType==1){#{X}break;}}',
        '~': BY_ELEMENT ? '/*^var #{N}H={};^*/var #{N}=#{R};while(#{N}=#{N}.nextElementSibling){if(#{N}H[' + TPL_QID + '])break;#{N}H[' + TPL_QID + ']=1;#{X}}' : '/*^var #{N}H={};^*/var #{N}=#{R};while(#{N}=#{N}.nextSibling){if(#{N}.nodeType==1){if(#{N}H[' + TPL_QID + '])break;#{N}H[' + TPL_QID + ']=1;#{X}}}',
        '>': 'var #{N}A=#{R}.children||#{R}.childNodes;for(var #{N}I=0,#{N};#{N}=#{N}A[#{N}I];#{N}I++){if(#{N}.nodeType==1){#{X}}}',
        '>T': 'var #{N}A=#{R}.children.tags("#{P}");for(var #{N}I=0,#{N};#{N}=#{N}A[#{N}I];#{N}I++){#{X}}'
    };
    var TPL_LEFT = 'var #{R}V={_:false};NP_#{R}:{P_#{R}:{#{X}break NP_#{R};}#{R}V._=true;#{Y}}';
    var TPL_TOPASS = 'if(t=#{N}H[' + TPL_QID + ']){if(t._){break P_#{R};}else{break NP_#{R};}}#{N}H[' + TPL_QID + ']=#{R}V;#{X}';
    var TPL_TOPASS_UP = format(TPL_TOPASS, { X: 'if(#{N}!==#{R}){#{X}}' });
    var TPL_PASSED = 'break P_#{R};';
    var TPL_PASS = {
        '>': '/*^var #{N}H={};^*/var #{N}=#{C}.parentNode;' + TPL_TOPASS_UP,
        ' ': '/*^var #{N}H={};^*/var #{N}=#{C};while(#{N}=#{N}.parentNode){' + TPL_TOPASS_UP + '}',
        '+': BY_ELEMENT ? '/*^var #{N}H={};var #{N};^*/if(#{N}=#{C}.previousElementSibling){#{X}}' : '/*^var #{N}H={};^*/var #{N}=#{C};while(#{N}=#{N}.previousSibling){#{X}break;}',
        '~': BY_ELEMENT ? '/*^var #{N}H={};^*/var #{N}=#{C};while(#{N}=#{N}.previousElementSibling){' + TPL_TOPASS + '}' : '/*^var #{N}H={};^*/var #{N}=#{C};while(#{N}=#{N}.previousSibling){' + TPL_TOPASS + '}'
    };
    var TPL_MAIN = 'function(root){var result=[];var qid=Q.qid,t,l=result.length;BQ:{#{X}}Q.qid=qid;return result;}';
    var TPL_HELP = '/*^var #{N}L;^*/if(!#{N}L||!(' + format(TPL_CONTAINS, ['#{N}L', '#{N}']) +')){#{X}#{N}L=#{N};}';
    var TPL_PUSH = 'result[l++]=#{N};';
    var TPL_INPUT_T = TPL_XHTML + '/*^var input_t=!xhtml?"INPUT":"input";^*/';
    var TPL_POS = '/*^var pos=-1;^*/';
    var TPL_TEST = {
        'T': TPL_XHTML +'/*^var #{N}T=!xhtml?("#{0}").toUpperCase():"#{0}";^*/#{N}.nodeName==#{N}T',
        '#': '#{N}.id=="#{0}"',
        'N': '#{N}.name=="#{0}"',
        
        '[': IE678 ? '(t=#{N}.getAttributeNode("#{0}"))&&(t.specified)' : '#{N}.hasAttribute("#{0}")',
        '=': '#{A}=="#{1}"',
        '!=': '#{A}!="#{1}"',
        '^=': '(t=#{A})&&t.slice(0,#{L})=="#{1}"',
        '$=': '(t=#{A})&&t.slice(-#{L})=="#{1}"',
        '*=': '(t=#{A})&&t.indexOf("#{1}")!==-1',
        '|=': '(t=#{A})&&(t=="#{1}"||t.slice(0,#{L})=="#{P}")',
        '~=': '(t=#{A})&&(" "+t+" ").indexOf("#{P}")!==-1',
        
        ':element': '#{N}.nodeType==1',
        ':contains': '(#{N}.' + (HAS_TEXT_CONTENT ? 'textContent' : 'innerText') + '||"").indexOf("#{0}")!==-1',
        ':first-child': BY_ELEMENT ? '#{N}.parentNode.firstElementChild===#{N}' : 'Q._isFirstChild(#{N})',
        ':nth-child': TPL_DOC + '/*^var rev=doc._Q_rev||(doc._Q_rev=Q.qid++);^*/Q._index(#{N},#{0},#{1},rev)',
        ':last-child': BY_ELEMENT ? '#{N}.parentNode.lastElementChild===#{N}' : 'Q._isLastChild(#{N})',
        ':only-child': BY_ELEMENT ? '(t=#{N}.parentNode)&&(t.firstElementChild===#{N}&&t.lastElementChild===#{N})' : 'Q._isOnlyChild(#{N})',
        
        ':not-ex': '/*^var _#{G}=Q._hash(Q("#{1}",root));qid=Q.qid;^*/!_#{G}[' + TPL_QID + ']',
        ':has': '(t=Q("#{1}", #{N}),qid=Q.qid,t.length>0)',
        ':parent': '!!#{N}.firstChild',
        ':empty': '!#{N}.firstChild',
        
        ':header': '/h\\d/i.test(#{N}.nodeName)',
        ':input': '/input|select|textarea|button/i.test(#{N}.nodeName)',
        ':enabled': '#{N}.disabled===false&&#{N}.type!=="hidden"',
        ':disabled': '#{N}.disabled===true',
        ':checked': '#{N}.checked===true',
        ':selected': '(#{N}.parentNode.selectedIndex,#{N}.selected===true)',
        
        // TODO: \u8fd9\u4e9b\u4f2a\u7c7b\u53ef\u4ee5\u8f6c\u5316\u6210\u4e3a\u6807\u7b7e\u9009\u62e9\u5668\u52a0\u4ee5\u4f18\u5316\uff01
        ':focus': TPL_DOC + '#{N}===doc.activeElement',
        ':button': TPL_INPUT_T + '#{N}.nodeName==="button"||(#{N}.nodeName===input_t&&#{N}.type==="button")',
        ':submit': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="submit"',
        ':reset': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="reset"',
        ':text': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="text"&&(t=#{N}.getAttribute("type"),t==="text"||t===null)',
        ':radio': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="radio"',
        ':checkbox': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="checkbox"',
        ':file': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="file"',
        ':password': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="password"',
        ':image': TPL_INPUT_T + '#{N}.nodeName===input_t&&#{N}.type==="image"'
    };

    function genAttrCode(attr){
        if (attr == 'for') return '#{N}.htmlFor';
        if (attr == 'class') return '#{N}.className';
        if (attr == 'type') return '#{N}.getAttribute("type")';
        if (attr == 'href') return '#{N}.getAttribute("href",2)';
        return '(#{N}["' + attr + '"]||#{N}.getAttribute("' + attr + '"))';
    }

    function genTestCode(simple){
        if (simple.kind.indexOf('=') !== -1) {
            simple.A = genAttrCode(simple[0]);
        }
        var t;
        switch (simple.kind) {
        case '.':
            var k = simple.length;
            var buff = [];
            while (k --) {
                buff.push('t.indexOf(" #{'+ k +'} ")!==-1');
            }
            return format('(t=#{N}.className)&&((t=" "+t+" "),(' + buff.join(' && ') + '))', simple);
        case '^=':
        case '$=':
            simple.L = simple[1].length;
            break;
        case '|=':
            simple.L = simple[1].length + 1;
            simple.P = simple[1] + '-';
            break;
        case '~=':
            simple.P = ' ' + simple[1] + ' ';
            break;
        case ':nth-child':
//        case ':nth-last-child':
            if (simple[0] == 1 && simple[1] == 0) return '';
            break;
        case ':not':
            t = genCondCode(simple[0][0][0]);
            return t ? '!(' + t + ')' : 'false';
        case ':not-ex':
        case ':has':
            simple.G = CTX_NGEN ++;
            break;
        case '*':
            return '';
        }
        return format(TPL_TEST[simple.kind], simple);
    }
    function genCondCode(seq){
        var buff = [];
        var k = seq.length;
        var code;
        while (k --) {
            var simple = seq[k];
            if (code = genTestCode(simple)) {
                buff.push(code);
            }
        }
        return buff.join(' && ');
    }
    function genThenCode(seq){
        var code = genCondCode(seq);
        return code ? format('if('+code+'){#{X}}', { N: seq.N }) : '#{X}';
    }
    var NEEDNOT_ELEMENT_CHECK = { '#': 1, 'T': 1, '.': 1, 'N': 1, ':element': 1 };
    function genFindCode(seq, R, comb){
        comb = comb || seq.comb || ' ';
        var tpl;
        if (comb == ' ') {
            var finder = seq.$;
            if (finder) {
                tpl = TPL_FIND[finder.kind];
                // \u6709hack\u7684\u5acc\u7591, \u8ba9\u4ea7\u751ftest\u4ee3\u7801\u65f6\u5ffd\u7565\u5df2\u7ecf\u7528\u4e8efind\u7684seq.
                finder.kind = '*';
            } else {
                tpl = TPL_FIND['*'];
                if (IE678 && !NEEDNOT_ELEMENT_CHECK[seq[seq.length - 1].kind]) {
                    seq.push(make(':element', []));
                }
            }
        } else if (BY_CHILDREN_TAG && comb == '>' && seq.tag) {
            tpl = TPL_FIND['>T'];
            finder = seq.tag;
            seq.tag.kind = '*';
        } else {
//            if (!BY_ELEMENT && (comb == '+' || comb == '~') && !NEEDNOT_ELEMENT_CHECK[seq[seq.length - 1].kind]) {
//                seq.push(make(':element', []));
//            }
            tpl = TPL_FIND[comb];
        }
        return format(tpl, {
            P: finder && (finder.kind == '.' ? finder.join(' ') : finder[0]),
            N: seq.N,
            R: R,
            X: genThenCode(seq)
        });
    }
    function genNextCode(part, thenCode){
        var code = '#{X}';
        var k = part.fI;
        while (k --) {
            code = format(code, { X: genFindCode(part[k], part[k+1].N) });
        }
        var nextCode;
        if (!thenCode) {
            if (part.fI == 0 && (k = part[0].$.kind) && (k != 'S' && k != '#')) {
                nextCode = format(TPL_HELP, { N: part[0].N });
                code = format(code, { X: nextCode })
            }
        } else {
            nextCode = format(thenCode, { N: part[0].N });
            code = format(code, { X: nextCode });
        }
        return code;
    }
    function genPassCode(seq, C, comb){
        return format(TPL_PASS[comb], {
            N: seq.N,
            C: C,
            X: genThenCode(seq)
        });
    }
    function genLeftCode(part){
        var code = TPL_LEFT;
        for (var i=part.fI+1,l=part.length; i<l; i++) {
            var seq = part[i];
            var lastSeq = part[i-1];
            code = format(code, { X: genPassCode(seq, lastSeq.N, part[i-1].comb) });
        }
        code = format(code, { X: TPL_PASSED });
        code = format(code, { R: part.R });
        return code;
    }
    function genPartCode(part, thenCode){
        var code = genFindCode(part[part.fI], part.R, !part.isFirst ? ' ' : null);
        var nextCode = genNextCode(part, thenCode);
        if (part.fI < part.length - 1) {
            var passCode = genLeftCode(part);
            nextCode = format(passCode, { Y: nextCode });
        }
        return format(code, { X: nextCode });
    }
    
    function genThatCode(seq){
        var obj = {};
        var k = seq.length;
        while (k --) {
            var simple = seq[k];
            if (simple.kind == ':first') {
                simple = make(':nth', [0]);
            } else if (simple.kind == ':last') {
                obj.last = 1;
            }
            if (simple.kind == ':lt') {
                obj.lt = obj.lt == null ? simple[0] : Math.min(obj.lt, simple[0]);
            } else if (simple.kind == ':gt') {
                obj.gt = obj.gt == null ? simple[0] : Math.max(obj.gt, simple[0]);
            } else if (simple.kind == ':eq' || simple.kind == ':nth') {
                if (obj.eq && obj.eq !== simple[0]) {
                    obj.no = true;
                } else obj.eq = simple[0];
            } else if (simple.kind == ':even' || simple.kind == ':odd') {
                obj[simple.kind.slice(1)] = 1;
            }
        }
        if ((obj.lt != null && obj.eq != null && obj.eq >= obj.lt) || (obj.lt != null && obj.gt != null && obj.lt <= obj.gt) || (obj.even && obj.odd)) {
            obj.no = 1;
        }
        
        if (obj.no) {
            return '/*^break BQ;^*/';
        }
        var buff = [];
        if (obj.even) {
            buff.push('pos%2===0');
        } else if (obj.odd) {
            buff.push('pos%2===1');
        }
        var code = obj.eq == null ? TPL_PUSH : 'if(pos===' + obj.eq + '){result=[#{N}];break BQ;}';
        if (obj.gt != null) {
            buff.push('pos>'+obj.gt);
        }
        code = buff.length ? 'if (' + buff.join('&&') + '){' + code + '}' : code;
        code = obj.lt != null ? 'if (pos<' + obj.lt + '){' + code + '}else break BQ;' : code;
        if (obj.last) {
            code += '/*$result=result.slice(-1);$*/';
        }
        return code;
    }
    function genCode(chain){
        var parts = slice(chain);

        var thenCode = chain.allPoses ? TPL_POS + 'pos++;' + genThatCode(chain.allPoses) : TPL_PUSH;
        CTX_NGEN = 0;
        var code = '#{X}';
        
        var k = parts.length;
        while (k --) {
            var part = parts[k];
            code = format(code, { X: genPartCode(part, k == 0 ? thenCode : false ) });
        }
        return code;
    }

    var documentOrder;
    if (typeof d.documentElement.sourceIndex == 'number') {
        documentOrder = function (nodeA, nodeB){ return nodeA === nodeB ? 0 : nodeA.sourceIndex - nodeB.sourceIndex; };
    } else if (d.compareDocumentPosition) {
        documentOrder = function (nodeA, nodeB){ return nodeA === nodeB ? 0 : nodeB.compareDocumentPosition(nodeA) & 0x02 ? -1 : 1; };
    }
    function uniqueSort(nodeSet, notUnique){
        if (!nodeSet.length) return nodeSet;
        nodeSet.sort(documentOrder);
        if (notUnique) return nodeSet;
        var resultSet = [nodeSet[0]];
        var node, j = 0;
        for (var i=1, l=nodeSet.length; i<l; i++) {
            if (resultSet[j] !== (node = nodeSet[i])) {
                resultSet[++ j] = node;
            }
        }
        return resultSet;
    }

    function compile(expr){
        var group = parse(expr);
        var tags = {};
        var k = group.length;
        while (k --) {
            var chain = group[k];
            var code = genCode(chain);
            if (tags && chain.tag && !tags[chain.tag[0]]) {
                tags[chain.tag[0]] = 1;
            } else {
                tags = null;
            }
            var hash = {};
            var pres = [];
            var posts = [];
            code = code.replace(/\/\*\^(.*?)\^\*\//g, function (m, p){
                return (hash[p] || (hash[p] = pres.push(p)), '');
            });
            code = code.replace(/\/\*\$(.*?)\$\*\//g, function (m, p){
                return (hash[p] || (hash[p] = posts.push(p)), '');
            });
            code = format(TPL_MAIN, { X: pres.join('') + code + posts.join('') });
            group[k] = new Function('Q', 'return(' + code + ')')(Q);
        }
        if (group.length == 1) {
            return group[0];
        }
        return function (root){
            var k = group.length;
            var result = [];
            while (k --) {
                result.push.apply(result, group[k](root));
            }
            return uniqueSort(result, tags != null);
        };
    }

    Q._hash = function (result){
        var hash = result._Q_hash;
        if (hash == null) {
            hash = result._Q_hash = {};
            var k = result.length;
            var qid = Q.qid;
            while (k --) {
                var el = result[k];
                hash[el._Q_id||(el._Q_id=++qid)] = 1;
            }
            Q.qid = qid;
        }
        return hash;
    };
    var _slice = Array.prototype.slice;
    Q._toArray1 = function (staticNodeList){
        var k = staticNodeList.length;
        var a = new Array(k);
        while (k --) {
            a[k] = staticNodeList[k];
        }
        return a;
    };
    Q._toArray = function (staticNodeList){
        try {
            return _slice.call(staticNodeList, 0);
        } catch(ex){}
        return (Q._toArray = Q._toArray1)(staticNodeList);
    };
    
    function queryXML(expr, root){
        throw ['NotImpl'];
    }
    var cache = {};
    var inQuery = false;
    function query(expr, root){
        var doc = root.ownerDocument || root;
        var ret;
        if (!doc.getElementById) {
            return queryXML(expr, root);
        }
        if (root === doc && doc.querySelectorAll && !/#/.test(expr)) {
            try { return Q._toArray(doc.querySelectorAll(expr)); } catch(ex){}
        }
        var fn  = cache[expr] || (cache[expr] = compile(expr));
        if (!inQuery) {
            inQuery = true;
            if (!MUTATION) {
                doc._Q_rev = Q.qid ++;
            }
            ret = fn(root);
            inQuery = false;
        } else {
            ret = fn(root);
        }
        return ret;
    }

    Q.qid = 1;
    Q._byId = function (id, root){
        if (root.getElementById) {
            return root.getElementById(id);
        }
        if (BY_ID1) {
            return root.getElementsByTagName('*')[id];
        }
        var node = root.ownerDocument.getElementById(id);
        if (node && Q.contains(root, node) && (!IE678 || (node.id === id || node.getAttributeNode('id').nodeValue === id))) {
            return node;
        }
        return null;
    };
    Q._in = function (nodes, nodeSet){
        var hash = Q._hash(nodeSet);
        var ret = [];
        for (var i=0; i<nodes.length; i++) {
            var node = nodes[i];
            if (hash[node._Q_id||(node._Q_id=++Q.qid)]) {
                ret.push(node);
            }
        }
        return ret;
    };
    Q.matches = function (expr, set){
        return Q(expr, null, null, set);
    };
    Q.contains = d.documentElement.contains ? function (a, b){
        return a !== b && a.contains(b);
    } : function (a, b) {
        return a !== b && a.compareDocumentPosition(b) & 16;
    };
    Q._has = function (node, nodes){
        for (var i=0, tnode; tnode=nodes[i++];) {
            if (!Q.contains(node, tnode)) return false;
        }
        return true;
    };
    Q._index = function (node, a, b, rev){
        var parent = node.parentNode;
        if (parent._Q_magic !== rev) {
            var tnode;
            var count = 1;
            if (BY_ELEMENT) {
                tnode = parent.firstElementChild;
                while (tnode) {
                    tnode._Q_index = count ++;
                    tnode = tnode.nextElementSibling;
                }
            } else {
                var nodes = parent.children || parent.childNodes;
                for (var i=0; tnode=nodes[i]; i++) {
                    if (tnode.nodeType == 1) {
                        tnode._Q_index = count ++;
                    }
                    tnode = tnode.nextSibling;
                }
            }
            parent._Q_count1 = count;
            parent._Q_magic = rev;
        }
        return a ? (node._Q_index - b) % a == 0 : node._Q_index == b;
    };
    Q._isOnlyChild = function (node){
        return Q._isFirstChild(node) && Q._isLastChild(node);
    };
    Q._isFirstChild = function (node){
        while (node = node.previousSibling) {
            if (node.nodeType == 1) return false;
        }
        return true;
    };
    Q._isLastChild = function (node){
        while (node = node.nextSibling) {
            if (node.nodeType == 1) return false;
        }
        return true;
    };
    Q._isXHTML = function (doc){
        return doc.documentElement.nodeName == 'html';
    };
    function Q(expr, root, result, seed){
        root = root || d;
        var ret = query(expr, root);
        if (seed) {
            ret = Q._in(seed, ret);
        }
        if (result) {
            ret.push.apply(result, ret);
        } else {
            result = ret;
        }
        return result;
    }
    return Q;
})(),

/**
 * global function for document
 * @file: function.dom.js
 * @version: V2.5
 * @author: liu denggao
 * @created: 2011.07.01
 * @modified: 2012.12.19
 **************************/

"dom": function(value,obj){
	var element=null;
	var elements=[];
	var className="";
	obj=obj||document;
	function getNodesByClassNames(aNodes,aClassNames){
		return aNodes.select(function(element){
			if(element.nodeName.charAt(0)=="#") return false;
			var className1=(element.getAttribute("class")||element.getAttribute("className")||"").trim();
			var classNames1=className1=""?[]:className1.split(" ");
			return aClassNames.belongTo(classNames1,true,true);
		});
	}
	function getChildNodesByClassNames(node,sTagName,aClassNames,sId){
		var nodes=(node||document).getElementsByTagName(sTagName||"*");
		var nodes1=[];
		for(var i=0;i<nodes.length;i++){
			var node1=nodes[i];
			if(node1.nodeName.charAt(0)=="#") continue;
			if(sId&&node1.getAttribute("id")!=sId) continue;
			var className1=(node1.getAttribute("class")||node1.getAttribute("className")||"").trim();
			var classNames1=className1==""?[]:className1.split(" ");
			if(aClassNames.belongTo(classNames1,true,true)){
				nodes1[nodes1.length]=node1;
			}
		}
		return nodes1;
	}
	function getChildNodesById(node,sId){
		var nodes=(node||document).getElementsByTagName("*");
		var nodes1=[];
		for(var i=0;i<nodes.length;i++){
			var node1=nodes[i];
			if(node1.nodeName.charAt(0)=="#") continue;
			if((node1.getAttribute("id")||"")==sId){
				nodes1[nodes1.length]=node1;
				break;
			}
		}
		return nodes1;
	}
	function getChildNodesByName(node,sName){
		var nodes=(node||document).getElementsByTagName("*");
		var nodes1=[],nodes2=[];
		var sName1=sName.toLowerCase();
		for(var i=0;i<nodes.length;i++){
			var node1=nodes[i];
			if(node1.nodeName.charAt(0)=="#") continue;
			if((node1.getAttribute("name")||"").toLowerCase()==sName1){
				nodes1[nodes1.length]=node1;
			}
			if(!nodes2.length&&node1.getAttribute("id")==sName){
				nodes2=[node1];
			}
		}
		return nodes1.length?nodes1:nodes2;
	}
	switch(typeof(value)){
		case "undefined":
			break;
		case "string":
			var selector=value;
			//syntax format of element selector: [tag][.class1[.class2[...]]][#id[#]]
			var regElementSel=/^([^\*\.\#\[\]\s]*)((?:\s*\.[^\*\.\#\[\]\s]+)*)(\s*#[^\*\.\#\[\]]+[\#]?)*$/;
			//syntax format of element selector: [tag][name='value']
			var regAttribSel=/^([^\*\.\#\[\]]*)\[([^\*\.\#\!\*\^\$\[\]\=]+)(([\!|\^|\$]?\=)\'([^\*\'\"\[\]]+)\')?\]$/;
			var matchs=null;
			if(selector==""){
				return null;
			}else if(selector=="*"){
				return Array.from(obj.getElementsByTagName("*"));
			}else if(matchs=selector.match(regElementSel)){
				if(!matchs[1]&&!matchs[2]&&matchs[3]&&obj==document){
					if(matchs[3].slice(-1)=="#"){
						elements=document.getElementsByName(matchs[3].slice(1,-1));
						if(elements.length) return Array.from(elements);
					}
					element=document.getElementById(matchs[3].slice(1));
					return element?[element]:[];
				}else{
					if(!matchs[1]){
						elements=[obj];
					}else{
						elements=obj.getElementsByTagName(matchs[1]);
					}
					if(matchs[2]){
						var elements1=[];
						var aClassNames=matchs[2].split(".").map(function(item){
							return item.trim();
						}).trim();
						for(var i=0;i<aClassNames.length;i++){
							for(var j=0,jLen=elements.length;j<jLen;j++){
								elements1.append(getChildNodesByClassNames(elements[j],"",[aClassNames[i]],""));
							}
							elements=elements1.unique();
							elements1=[];
						}
					}
					if(matchs[3]){
						var isFindAll=matchs[3].slice(-1)=="#";
						var id=matchs[3].match(/\s*\#([^#]+)\#?/)[1].trim();
						var elements1=[];
						if(!isFindAll){
							for(var j=0,jLen=elements.length;j<jLen;j++){
								elements1.append(getChildNodesById(elements[j],id));
								if(elements1.length) break;
							}
							elements=elements1;
							elements1=[];
						}else{
							for(var j=0,jLen=elements.length;j<jLen;j++){
								elements1.append(getChildNodesByName(elements[j],id));
							}
							elements=elements.length>1?elements1.unique():elements1;
							elements1=[];
						}
					}
					return Array.from(elements);
				}
			}else if(matchs=selector.match(regAttribSel)){
				var tagName=matchs[1];
				var attrName=matchs[2];
				var operate=matchs[4];
				var attrValue=matchs[5];
				var attrValue1;
				var atIndex;
				var elements1=[];
				elements=obj.getElementsByTagName(tagName||"*");
				if(!attrName){
					return Array.from(elements);
				}if(!attrValue){
					for(var i=0,iLen=elements.length;i<iLen;i++){
						element=elements[i];
						if(element.nodeName.charAt(0)=="#") continue;
						if(element.getAttribute("name")!=null){
							elements1[elements1.length]=element;
						}
					}
					return elements1;
				}else{
					for(var i=0,iLen=elements.length;i<iLen;i++){
						element=elements[i];
						if(element.nodeName.charAt(0)=="#") continue;						
						if(element.getAttribute(attrName)!=null){
							attrValue1=element.getAttribute(attrName).toString();
							switch(operate){
								case "=":
									if(attrValue1==attrValue){
										elements1[elements1.length]=element;
									}
									break;
								case "!=":
									if(attrValue1!=attrValue){
										elements1[elements1.length]=element;
									}
									break;
								case "*=":
									if(attrValue1.indexOf(attrValue)>=0){
										elements1[elements1.length]=element;
									}
									break;
								case "^=":
									if(attrValue1.indexOf(attrValue)==0){
										elements1[elements1.length]=element;
									}
									break;
								case "$=":
									atIndex=attrValue1.lastIndexOf(attrValue);
									if(atIndex>=0&&attrValue1.slice(atIndex)==attrValue){
										elements1[elements1.length]=element;
									}
									break;
							}
							
						}
					}
					return elements1;
				}
			}
			break;
	}
	return [];
}