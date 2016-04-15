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
