/**
 * base global function
 * @file: function.js
 * @version: 1.5.1
 * @author: liu denggao
 * @created: 2007
 * @modified: 2013.5.31-2013.9.8-2013.10.18
 **************************/

"_xmlHttp": Engine.getLoader().getXMLHttpRequest(),
"_xmlDom" : Engine.getLoader().getXMLDOMDocument(),
"_xmlParser" : Engine.getLoader().getXMLDOMParser(),

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
 * Message Box
 * @call: messageBox(sMessage[,iButtons[,sTitle]])
 */
"messageBox" : function(sMessage, iButtons, sTitle){
	alert(sMessage);

},
/**
 * @created: 2011.6.2
 */
"globalizing" : function(sObjName,fnFilter,isOverwrite,isContainsAll){
	var obj=eval(sObjName);
	var __items__=[];
	if(typeof(obj) == 'object'){
		for(var p in obj) {
			if((isContainsAll?true:obj.hasOwnProperty(p))
				&&p!="prototype"&&p.indexOf("_")<0){
				if(typeof(fnFilter)=="function"){
					if(!fnFilter(p)) continue;
				}
				if(isOverwrite){
					__items__[__items__.length]="var "+p
							+"=function(){ return "+sObjName+"."+p+".apply("+sObjName+",arguments); };";
				}else{
					__items__[__items__.length]="if(typeof("+p+")==\"undefined\") { "+"var "+p
							+"=function(){ return "+sObjName+"."+p+".apply("+sObjName+",arguments); }; }";
				}
			}
		}
	}
	return __items__.join("");
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
"$try" : function(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return undefined;
},
/**
 * synchronized sleep script executing function
 * max wait 1 second.
 * @date: 2010.1.14
 */
"$sleep" : function(timeout){
	var startDate=new Date();
	timeout=Number(timeout);
	while((new Date())-startDate<Math.min(timeout,1000));
},
/**
 * synchronized wait a condition
 * @date: 2010.1.14
 */
"$wait" : function(iTimeout,fnFlag){
	var startDate=new Date();
	var flag=false;
	iTimeout=Number(iTimeout);
	if(typeof(fnFlag)!="function") return;
	while((new Date())-startDate<Math.min(iTimeout,1000)){
		if(flag=!!fnFlag()) break;
	}
	return flag;
},
/**
 * @created: 2011.6.2
 */
"obj": function(obj,clazz){
	var namespace=this;
	var values1=["string","number","boolean"];
	var values2=[String,Number,Boolean,Date,Array];
	var values2a=["String","Number","Boolean","Date","Array"];
	var typename=typeof(obj);
	if(obj==undefined) return;
	for(var i=0;i<values1.length;i++){
		if(values1[i]==typename){
			clazz=namespace[values2a[i]];
			return new clazz(obj);
		}
	}
	if(typename=="object"){
		var i=0;
		for(;i<4;i++){
			if(obj instanceof values2[i]){
				clazz=namespace[values2a[i]];
				return new clazz(obj);
			}
		}
		for(;i<values2.length;i++){
			if(obj instanceof values2[i]){
				clazz=namespace[values2a[i]];
				return clazz.newInstanceFrom(obj);
			}
		}
		if(typeof(clazz)=="function"){
			return clazz.newInstanceFrom(obj);
		}
	}
	return obj;
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
