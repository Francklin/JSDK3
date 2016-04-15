

/**
 * JSDK, core module
 * @function: defines JSDK & core components
 * @file: kernel.js
 * @version: V1.11.0
 * @since: JSDK3 V0.1
 * @adapt: JSDK3 V1.9.0
 * @quote: Engine
 * @author: liu denggao 
 * @modified: 2013.8.29-2014.1.3
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 *******************************************/
(function(Engine){
var Global = this;
var Class;
var jsre = Engine.runtimeEnvironment, ex;
var logger = jsre.logger;
var _classes={};
eval(
/** 
 * @modified: 2014.1.3
 */
(function(obj){
	var classNames=[];
	for(var className in obj){
		if(!obj.hasOwnProperty(className)){
			continue;
		}else if(obj[className].define){
			var clazz=_classes[className]=Global[className]=Class.create(className,obj[className].define,obj[className].extend);
			var objClass=obj[className];
			delete objClass.define;
			delete objClass.extend;
			if(objClass.base) {
				if(objClass.base[1]==0){
					jsre.copyNamespace(jsre.getNativeClasses(objClass.base[0]),objClass.base[3],clazz);
					jsre.copyNamespace(jsre.getNativeClasses(objClass.base[0]).prototype,objClass.base[4],clazz.prototype);
				}else if(objClass.base[1]==1){
					clazz.$encapsulate(jsre.getNativeClasses(objClass.base[0]),[].concat(objClass.base[3],objClass.base[4]),objClass.base[2]);
				}
				delete objClass.base;
			}else{
				classNames[classNames.length]=className;
			}
			for(var key in objClass){
				if(objClass.hasOwnProperty(key)){
					if(key.slice(-1)=="_"){	//static
						clazz[key.slice(0,-1)]=objClass[key];
					}else{
						clazz.prototype[key]=objClass[key];
					}
				}
			}
			var ex=["valueOf","toString"];	//no be list on IE
			for(var i=0,key,iLen=ex.length;i<iLen;i++) {
				if(objClass.hasOwnProperty(key=ex[i])){
					if(key.slice(-1)=="_"){	//static
						clazz[key.slice(0,-1)]=objClass[key];
					}else{
						clazz.prototype[key]=objClass[key];
					}
				}
			}
		}else if(eval("typeof("+className+")!=\"undefined\"")){
			var clazz=eval(className);
			var objClass=obj[className];
			for(var key in objClass){
				if(objClass.hasOwnProperty(key)){
					if(key.slice(-1)=="_"){	//static
						clazz[key.slice(0,-1)]=objClass[key];
					}else{
						clazz.prototype[key]=objClass[key];
					}
				}
			}
		}else{
			logger.log("JSDK Initializing definiens of root class...");
			Class=Global[className]=Function;
			var objClass=obj[className];
			for(var key in objClass){
				if(objClass.hasOwnProperty(key)){
					if(key.slice(-1)=="_"){	//static
						Class[key.slice(0,-1)]=objClass[key];
					}else{
						Class.prototype[key]=objClass[key];
					}
				}
			}
			logger.log("JSDK Initializing definiens of base class...");
		}
	}
	return classNames.map(function(name){
		return "var "+name+"=_classes[\""+name+"\"];";
	}).join("");
})
({
	"Class":
{
	/**
	 * Create the type with the specified name,
	 * constructor and super type.
	 * @modified: 2013.1.5
	 */
	"create_": function(name, constructor, superClass) {
		if(!constructor||typeof(constructor)=="function"){
			var clazz = constructor || new Class();
			if(name!="Object") clazz.$extends(superClass || Global.Object || Object);
			else clazz.prototype.$class=clazz;
			clazz.$name = name;
		}else{
			var objClass=constructor;
			var clazz = constructor.define;
			if(name!="Object") clazz.$extends(objClass.extend || Global.Object || Object);
			else clazz.prototype.$class=clazz;
			clazz.$name = name;
			if(objClass.base){
				var baseClass=jsre.getNativeClasses(objClass.base[0]);
				if(objClass.base[1]==0){	//direct
					for(var i=0,keys=objClass.base[3];i<keys.length;i++){
						clazz[keys[i]]=baseClass[keys[i]];
					}
					for(var i=0,keys=objClass.base[3];i<keys.length;i++){
						clazz.prototype[keys[i]]=baseClass[keys[i]];
					}
				}else{		//indirect
					clazz.$encapsulate(baseClass,objClass.base[3].concat(objClass.base[4]),objClass.base[2]);
				}
			}
			for(var key in objClass){
				if(objClass.hasOwnProperty(key)
					&&!key.equal(["define","extend","base"])){
					if(key.slice(-1)=="_"){	//static
						clazz[key.slice(0,-1)]=objClass[key];
					}else{
						clazz.prototype[key]=objClass[key];
					}
				}
			}
		}
		
		return clazz;
	},
	/**
	 * Loads and return the type with the specified name.
	 * @param name class name
	 * @type Class
	 * @modified: 2012.10.18
	 */
	"forName_" : function(name) {
		return _classes[name]||Engine.runtimeEnvironment.loadClass(name);
	},
	/**
	  * Extends class prototype
	  */
	"$super" : null,
	"$class" : Function,
	"$name" : "Class",
	/**
	 * Add method of class
	 */
	"addProperty":	function(isStatic,isPublic,sName,oImpt){
		sName=sName.charAt(0).toUpperCase()+sName.slice(1);
		var sNameForGet=(isPublic?"":"_")+(typeof(oImpt.get)=="function"?"get":"")+sName;
		var sNameForSet=(isPublic?"":"_")+(typeof(oImpt.set)=="function"?"set":"")+sName;
		if(isStatic){
			if(oImpt.get) this[sNameForGet] = oImpt.get; 
			if(oImpt.set) this[sNameForSet] = oImpt.set; 
		}else{
			if(oImpt.get) this.prototype[sNameForGet] = oImpt.get; 
			if(oImpt.set) this.prototype[sNameForSet] = oImpt.set; 
		}
		return this; 
	},

	/**
	 * Add method of class
	 */
	"addMethod":	function(isStatic,isPublic,sName,func){
		sName=isPublic?sName:("_"+sName);
		if(isStatic){
			this[sName] = func; 
		}else{
			this.prototype[sName] = func; 
		}
		return this;
	},

	/**
	 * Add event listener 
	 * @created: 2011.8.2
	 */
	"addEventListener":	function(isStatic,isPublic,sName,fnListener){
		sName=(isPublic?"":"_")+"on"+sName.replace("on","");
		if(isStatic){
			this[sName] = fnListener;
		}else{
			this.prototype[sName] = fnListener;
		}
		return this;
	},

	/**
	 * Create a new instance of this class
	 */
	"newInstance" : function() {
		for (var a = [], i = 0, l = arguments.length; i < l; i++) {
			a.push("arguments[" + i +"]");
		}
		return eval("new this(" + a.join(",") + ")");
	},

	/**
	 * Let a instance object existed extends the class.
	 * @description: 
	 * @notice: 
	 *    (1)Constructor of property of object should not been list in IE.
	 *    (2)Constructor of property of object should been list that when is setted in Firefox.
	 * @para
	 *   (1)oInstance
	 *   (2)vApplyOptions
	 *        1)0|instanse
	 *        2)1|extends
	 *        3)2|implement
	 *        4)3|copy
	 *   (3)isOverwrite
	 * @since: JSDK3 V0.1
	 * @adapt: JSDK3 V1.5.6
	 * @author: Liu Denggao
	 * @date: 2010.1.8
	 * @modified: 2011.9.21
	 */
	"applyInstance" : 	function(oInstance,vApplyOptions,isOverwrite) {
		var aClasses=[].concat(jsre.getNativeClasses("Object"),oInstance.$class||[],oInstance.$super||[],oInstance.$implements||[]);
		for(var i=0;i<aClasses.length;i++){
			if(aClasses[i]===this) return oInstance;
		}
		vApplyOptions=vApplyOptions==undefined?"implement":vApplyOptions;
		var hasConstructor=!!oInstance.constructor;
		var aKrnMembers=["valueOf","toString"],aKrnMembers1=aKrnMembers.concat([]);
		var aKeys=[],aKrnKeys=[];
		for (var key in this.prototype) {
			var flag=0;
			for(var i=0;i<aKrnMembers1.length;i++){
				if(key==aKrnMembers1[i]) {
					aKrnKeys=aKrnKeys.concat(aKrnMembers1.splice(i,1));
					flag=1;
					break;
				}
			}
			if(!flag) aKeys[aKeys.length]=key;
		}
		//add kernel members
		if(!hasConstructor&&isOverwrite){
			for(var i=0,key,iLen=aKrnKeys.length;i<iLen;i++) {
				key=aKrnKeys[i];
				oInstance[key]=this.prototype[key];
			}
			for(var i=0,key,iLen=aKrnMembers.length;i<iLen;i++) {
				if(this.prototype.hasOwnProperty(key=aKrnMembers[i])){
					oInstance[key]=this.prototype[key];
				}else if(this.getSuperclass()&&this.getSuperclass().prototype.hasOwnProperty(key)){
					oInstance[key]=this.prototype[key];
				}
			}
		}
		for (var i=0,iLen=aKeys.length,key;i<iLen;i++) {
			try{  
				key=aKeys[i];
				//Avert member of base class is assignment many times.
				var isExists=false;
				for(var j=0;j<aClasses.length;j++){
					if(aClasses[j].prototype.hasOwnProperty(key)
						&&aClasses[j].prototype[key]===this.prototype[key]
						&&aClasses[j].prototype[key]===oInstance[key]) {
						isExists=true;
						break;
					}
				}
				if(isExists) continue; 
				if(typeof(oInstance[key])=="undefined"){
					oInstance[key]=this.prototype[key];
				}else if(isOverwrite){
					//backup original member of instance-----
					var aOldKeys=[];
					for(var oldKey=key,j=0;typeof(oInstance[oldKey])!="undefined"&&j<1000;j++){
						aOldKeys[j]=oldKey;
						oldKey="__"+oldKey+"__";
					}
					for(var j=aOldKeys.length-1;j>=0;j--){
						oInstance["__"+aOldKeys[j]+"__"]=oInstance[aOldKeys[j]];
					}
					oInstance[key]=this.prototype[key];
				}
			}catch(e){
			}
		}
		switch(vApplyOptions){
			case 0:
			case "0":
			case "instance":
				try{oInstance.$class=oInstance.constructor=this;}catch(e){}
				oInstance.$implements=(oInstance.$implements||[]).concat(this.$implements||[]);
				break;
			case 1:
			case "1":
			case "extends":
				if(hasConstructor){
					if(oInstance["__constructor__"]){
						oInstance["constructor"]=oInstance["__constructor__"];
					}
				}else{
					try{oInstance.constructor=this;}catch(e){}
				}
				oInstance.$class=oInstance.constructor;
				oInstance.$super=this;	//super of this instance object
				oInstance.$implements=(oInstance.$implements||[]).concat(this.$implements||[]);
				try{ delete oInstance["__constructor__"]; }catch(e){}
				try{ delete oInstance["__$class__"]; }catch(e){}
				break;
			case 2:
			case "2":
			case "implement":
				if(hasConstructor){
					if(oInstance["__constructor__"]){
						oInstance["constructor"]=oInstance["__constructor__"];
					}
				}else{
					try{ delete oInstance["constructor"]; }catch(e){}
				}
				oInstance.$class=oInstance.constructor;
				oInstance.$implements=(oInstance.$implements||[]).concat(this.$implements||[],this);
				try{ delete oInstance["__constructor__"]; }catch(e){}
				try{ delete oInstance["__$class__"]; }catch(e){}
				break;
			case 3:
			case "3":
			case "copy":
				if(hasConstructor){
					if(oInstance["__constructor__"]){
						oInstance["constructor"]=oInstance["__constructor__"];
					}
				}else{
					try{ delete oInstance["constructor"]; }catch(e){}
				}
				oInstance.$class=oInstance.constructor;
				try{ delete oInstance["__constructor__"]; }catch(e){}
				try{ delete oInstance["__$class__"]; }catch(e){}
				break;
		}
		return oInstance;
	},

	/**
	 * Returns the name of the entity represented
	 *  by this class object,as a String.
	 */
	"getName":	function() {
		return this.$name;
	},

	/**
	 * Returns the class representing the superclass
	 *  of the entity represented by this class.
	 */
	"getSuperclass" : function() {
		return this.$super;
	},

	/**
	 * Makes itself extend the specified class
	 */
	"$extends": function(clazz) {
		try {
			if (typeof((typeof(clazz) != "string") ? clazz
				: (clazz = Class.forName(clazz))) != "function") {
				throw new Global.Exception("Class.$extends() Error: the super "
					+ "class '" + clazz + "' is invalid.");
			}
			var p = this.prototype = new clazz();
			p.$class = p.constructor = this;
			this.$super = clazz;
			return p;
		} catch(ex) {
			throw new Global.Exception("class.$extends() Error.", ex);
		}
	},
	/**
	 * Makes itself implement the specified class or object
	 * @created: 2011.6.3
	 * @modified: 2011.06.3
	 */
	"$implement" : function(obj){
		var ex=["valueOf","toString"];	//no be list on IE
		if(typeof(obj) == 'object'){
			for(var p in obj) {
				if(obj.hasOwnProperty(p)){
					this.prototype[p] = obj[p];
				}
			}
			for(var i=0,p,iLen=ex.length;i<iLen;i++) {
				if(obj.hasOwnProperty(p=ex[i])){
					this.prototype[p] = obj[p];
				}
			}
		}
		return this;
	},
	/**
	 * Encapsulate other base class as this class
	 * @invoke: clazz.$encapsulate(clazz[,members[,instance]])
	 * @description: only support encapsulate method of class.
	 * @created: 2012.5.11
	 * @modified: 2012.5.11-2014.4.15
	 */
	"$encapsulate":	 function(clazz,members,instanceName){
		var codes=[];
		instanceName=instanceName||"__original";
		if(this.$base) return;
		this.$base=clazz;
		if(!members){
			for(var p in clazz) {
				if(clazz.hasOwnProperty(p)&&typeof(clazz[p])=="function"){
					//this[p] = new Function("return this.$base."+p+".apply(this.$base,arguments);");
					codes[codes.length]="this['"+p+"']=function(){return this.$base."+p+".apply(this.$base,arguments);};";
				}
			}
			for(var p in clazz.prototype) {
				if(clazz.prototype.hasOwnProperty(p)&&typeof(clazz.prototype[p])=="function"){
					//this.prototype[p] = new Function("return this."+instanceName+"."+p+".apply(this."+instanceName+",arguments);");
					codes[codes.length]="this.prototype['"+p+"']=function(){return this."+instanceName+"."+p+".apply(this."+instanceName+",arguments);};";
				}
			}
		}
		members=members||["valueOf","toString"];
		for(var i=0;i<members.length;i++){
			var p=members[i];
			if(clazz.hasOwnProperty(p)&&typeof(clazz[p])=="function"){
				//this[p] = new Function("return this.$base."+p+".apply(this.$base,arguments);");
				codes[codes.length]="this['"+p+"']=function(){return this.$base."+p+".apply(this.$base,arguments);};";
			}
			if(clazz.prototype.hasOwnProperty(p)&&typeof(clazz.prototype[p])=="function"){
				//this.prototype[p] = new Function("return this."+instanceName+"."+p+".apply(this."+instanceName+",arguments);");
				codes[codes.length]="this.prototype['"+p+"']=function(){return this."+instanceName+"."+p+".apply(this."+instanceName+",arguments);};";
			}
		}
		eval(codes.join(""));
		return this;
	}		

}

		,
	"Function":
{
	/**
	 * Call constructor or method of superclass
	 * @description the constructor is not normal class function but is custom method function. 
	 * @created 2010.6.19-2010.6.20
	 */
	"$upcall" : function(oThis){
		var argn=arguments.length;
		if(argn<1){ 
			throw new Error('The first parameter must be swapped object.'); 
		} 
		var thatBase=oThis; 
		do{ 
			for(var key in thatBase){
				if(thatBase[key]==arguments.callee.caller){
					var target = thatBase;
					while(target[key] == getBase(target)[key]){ 
						target = getBase(target);
					} 
					if(("_"+target.getClass().getName())==key){	//call constructor method of superclass
						key="_"+target.getClass().getSuperclass().getName();
					}
					if(argn==1){
						return getBase(target)[key].call(oThis); 
					}else{
						var args = []; 
						for(var i=1;i<argn;i++){ 
							args.push(arguments[i]); 
						}
						return getBase(target)[key].apply(oThis, args); 
					} 
				}
			}
		}
		while(thatBase=getBase(thatBase));
		function getBase(oThat){
			return oThat.getClass().getSuperclass().prototype;
		}
	},
	/**
	 * Call constructor or method of superclass of superclass
	 * @description the constructor is not normal class function but is custom method function. 
	 * @created 2011.8.29
	 * @modified 2010.7.8
	 */
	"$uppercall" : function(oThis){
		var argn=arguments.length;
		if(argn<1){ 
			throw new Error('The first parameter must be swapped object.'); 
		} 
		var thatBase=oThis; 
		do{ 
			for(var key in thatBase){
				if(thatBase[key]==arguments.callee.caller){
					var target = thatBase;
					while(target[key] == getBase(target)[key]){ 
						target = getBase(target);
					} 
					if(("_"+target.getClass().getName())==key){	//call constructor method of superclass
						key="_"+target.getClass().getSuperclass().getSuperclass().getName();
					}
					target=getBase(getBase(target));	//get superclass of superclass
					if(argn==1){
						return target[key].call(oThis); 
					}else{
						var args = []; 
						for(var i=1;i<argn;i++){ 
							args.push(arguments[i]); 
						}
						return target[key].apply(oThis, args); 
					} 
				}
			}
		}
		while(thatBase=getBase(thatBase));
		function getBase(oThat){
			return oThat.getClass().getSuperclass().prototype;
		}
	}
}

		,
	"Object":

/**
 * Defines the Object type
 * @created: 2011.7.29
 * @modified: 2012.7.21
 */
{
	"define": function(value){
		this._value=value;
		switch(typeof(value)){
			case "undefined":
				this._value={};
				return this;
			case "string":
				return new Global.String(value);
			case "number":
				return new Global.Number(value);
			case "boolean":
				return new Boolean(value);
			case "object":
				if(value instanceof jsre.getNativeClasses("String")){
					return new Global.String(value);
				}else if(value instanceof jsre.getNativeClasses("Number")){
					return new Global.Number(value);
				}else if(value instanceof jsre.getNativeClasses("Date")){
					return Global.Date.newInstanceFrom(value);
				}else if(value.constructor==jsre.getNativeClasses("Object")){
					if(this instanceof Global.Object){
						return this;
					}else{
						return new Global.Object(value);
					}
				}else{
					return value;
				}
		}
	},
	"toString_": function(){
		return ("[Object " + this.getName() + "]");
	},
	/**
	 * Returns the runtime class of an object.
	 */
	"getClass" : function() {
		return this.$class;
	},
	/**
	 * Returns a string representation of the object.
	 */
	"toString" : function () {
		return ("[object " + this.getClass().getName() + "]");
	},
	"valueOf" : function(){
		return this._value;
	},
	/**
	 * Determines whether this object is an
	 * istanceof the specified type
	 */
	"instanceOf" : function (c) {
		return (this instanceof (typeof(c)
			== "string"	? Class.forName(c) : c));
	},
	/**
	 * has event
	 * @created 2011.7.15
	 */
	"hasEvent" : function(sEvent){
		if(typeof(this[sEvent])!="function") return false;
		return true;
	},
	/**
	 * Add event listener 
	 * @created: 2011.8.11
	 */
	"addEventListener": function(sName,fnListener){
		if(typeof(fnListener)=="function") 
			this[sName] = fnListener;
	},
	/**
	 * fire event
	 * @created 2011.7.15
	 * @modified 2011.7.15
	 */
	"fireEvent" : function(sEvent,oEventObject){
		if(typeof(this[sEvent])!="function") return;
		try{
			return this[sEvent](oEventObject);
		}catch(e){
			throw new Error(1000,"Event '"+sEvent+"' of object '"+this.getClass().getName()+"' has been runned error!\nSource: "
				+e.description);
		}
	}	
}

		,
	"Exception":
/**
 * Defines the Exception type.
 */
{
	"define": function(message, cause) {
		this.number = Engine._deviceNumber * 0x10000 + 0x1;
		this.message = message || "no message";
		this.cause = cause;
	},
	/**
	 * Returns the name of this exception.
	 */
	"getName" : function () {
		return this.getClass().getName();
	},

	/**
	 * Returns the message of this exception.
	 */
	"getMessage" : function () {
		return this.message;
	},

	/**
	 * Returns the cause of this exception.
	 */
	"getCause" : function () {
		return this.cause;
	},

	/**
	 * Returns a string representation of the exception.
	 */
	"toString" : function() {
		return this.getName() + ":" + this.getMessage();
	},

	/**
	 * Prints this throwable and its backtrace
	 *  to the standard exception stream.
	 */
	"printStackTrace" : function(printer) {
		var s = this.toString();
		var e = this.cause;
		while(e != null) {
			s += "\r\n\tat ";
			if (e instanceof Error) {
					s += "Error:" + e.number 
						+ "," + e.message;
			} else {
				s += e.toString();
			}
			e = e.cause;
		}
		if (!printer) {
			//jsre.console.write(s + "\r\n");
		} else {
			//printer.println(s);
		}
	}
}

		,
	"String":
/**
 * Defines the String type.
 * @modified: 2013.8.29
 */
{
	"define": function(value) {
		this._value=(value||"").toString();
		this.length=this._value.length;
	},
	"extend": "Object",
	/**
	 * encapsulate(class|className,mode,instanceName[,staticMembers[,instanceMembers])
	 * @para mode: 0, direct, 1, indirect
	 */	
	"base": ["String",0,"_value",["fromCharCode"],[
		'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search',
		'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
	]],
	"toString" : function(){
		return this._value;
	},
	"valueOf" : function(){
		return this._value;
	},
	"trim" : function(){
		return Object(this.replace(/^\s+|\s+$/g, ''));
	},
	"ltrim" : function(sChars){
		return Object(this.replace(/^\s+/g, ''));
	},
	"rtrim" : function(sChars){
		return Object(this.replace(/\s+$/g, ''));
	},	
	"clean" : function(){
		return Object(this.replace(/\s+/g, ' ').trim());
	},
	"left" : function(subString){
		switch(typeof(subString)){
			case "string":
				var intAt=this.indexOf(subString);
				if(intAt<=0) return Object("");
				return Object(this.slice(0,intAt));
			case "number":
				var iLen=subString;
				return Object(this.slice(0,iLen));
			default:
				return Object("");
		}
	},
	"leftBack" : function(subString){
		var intAt=this.lastIndexOf(subString);
		if(intAt<=0) return Object("");
		return Object(this.slice(0,intAt));
	},
	"middle" : function(startStr,endStr,vOptions){
		vOptions=vOptions==undefined?0:vOptions;
		switch(vOptions){
			case 0:	//left
			case "left":
				var startIndex=this.indexOf(startStr);
				var endIndex=this.indexOf(endStr,startIndex+1);
				break;
			case 1: //max
			case "max":
				var startIndex=this.indexOf(startStr);
				var endIndex=this.lastIndexOf(endStr);
				break;
			case 2:	//right
			case "right":
				var endIndex=this.lastIndexOf(endStr);
				var startIndex=this.lastIndexOf(startStr,endIndex-1);
				break;
		}
		if(startIndex<0||endIndex<0) return Object("");
		if(startIndex>=endIndex) return Object("");
		return Object(this.slice(startIndex+startStr.length,endIndex));
	},	
	"right" : function(subString){
		switch(typeof(subString)){
			case "string":
				var intAt=this.indexOf(subString);
				if(intAt<0) return Object("");
				return Object(this.slice(intAt+subString.length));
			case "number":
				var iLen=subString;
				return Object(this.slice(this.length-iLen));
			default:
				return Object("");
		}
	},
	"rightBack" : function(subString){
		var intAt=this.lastIndexOf(subString);
		if(intAt<0) return Object("");
		return Object(this.slice(intAt+subString.length));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"reverse" : function(){	
		return Object(this.split("").reverse().join(""));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */	
	"repeat" : function(iCount){
		var values=[],str=this.toString();
		if(iCount==undefined||isNaN(iCount)) return Object(str);
		while(iCount--){values[values.length]=str};

		return Object(values.join(""));
	},
	/**
	 * @created: 2011.8.19
	 * @modified: 2012.9.28-2013.11.21
	 */
	"truncate" : function(iMaxLen,iOptions,paddingStr){
		var str=this.toString(),str1=[];
		iOptions=iOptions==undefined?1:iOptions;
		paddingStr=paddingStr||"";
		if(paddingStr.length>=iMaxLen) return Object(str);
		switch(iOptions){
			case 0: 	//by ascii count
				var count=this.getAsciiCount()+this.getNonAsciiCount()*2;
				if(count>iMaxLen){
					for(var i=0,j=iMaxLen-paddingStr.length;j>0;i++,j--){
						if(str.charCodeAt(i)<=0xFF){
							str1[str1.length]=str.charAt(i);
						}else if(j>1){
							str1[str1.length]=str.charAt(i);
							j--;
						}
					}
					str=str1.join("")+paddingStr;
				}
				break;
			case 1: 	//by char count
				if(str.length>iMaxLen){
					str=str.slice(0,iMaxLen-paddingStr.length)+paddingStr;
				}
				break;
		}
		return Object(str);
	},
	/**
	 * static method format
	 * @example 
	 *		format('{0}, {2}, {1}', 'abc', 'def', 'ghi');
	 * 		return "abc, ghi, def".
	 * @origCreated: 2010.06.28
	 * @created: 2013.8.29	 
	 */
	"format": function(){
		var str=this.toString();
		var argn=arguments.length;
		var strn=str.length;
		if(argn==0) return this;

		var aOutput=[],i=0;
		for(i=0;i<strn-1;){
			if(str.charAt(i)=='{'&&str.charAt(i+1)!='{'){
				var index = 0, indexStart = i+1, j=0;
				//check number
				for(j=indexStart;j<=strn-2;j++){
					var ch = str.charAt(j);
					if(ch<'0'||ch>'9') break;
				}
				if(j>indexStart){	//has number
					if(str.charAt(j)=='}'){ //priority process struct with transferred meaning.
						for(var k=j-1;k>=indexStart;k--){
							index += (str.charCodeAt(k)-48)*Math.pow(10, j-1-k);
						}
						if(argn>index){	//has target data
							aOutput[aOutput.length]=arguments[index];
							i+=j-indexStart+2;
						}else{	//no target data
							aOutput[aOutput.length]=str.slice(i,j);
							i+=j-indexStart+1;
						}
						continue;
					}
				}
				aOutput[aOutput.length]=str.charAt(i++);
			}else if(str.charAt(i)=='{'&&str.charAt(i+1)=='{'){
				i++;
				aOutput[aOutput.length]=str.charAt(i++);
			}else if(str.charAt(i)=='}'&&str.charAt(i+1)=='}'){
				i++;
				aOutput[aOutput.length]=str.charAt(i++);
			}else{
				aOutput[aOutput.length]=str.charAt(i++);
			}
		}
		aOutput[aOutput.length]=str.substr(i);
		return Object(aOutput.join(""));
	 },
	/**
	 * @created: 2011.9.3
	 * @since: JSDK3 V1.5.4
	 */
	"xsplit" : function(vOptions,vSepStr){
		var sSepStr="";

		if(!(vSepStr instanceof Array)){
			return this.split(vSepStr);
		}
		var values=[];
		switch(vOptions){
			case "":
			case "first":
				for(var i=0,iLen=vSepStr.length;i<iLen;i++){
					if(this.indexOf(vSepStr[i])>=0){
						sSepStr=vSepStr[i];
						break;
					}
				}
				values=this.split(sSepStr);
				break;
			case "any":
				var nearStrIndex, arrayIndex;
				var sTemp=this.toString();
				while(sTemp.length){
					nearStrIndex=sTemp.length;
					arrayIndex=-1;
					for(var i=0,iStrIndex=0,iLen=vSepStr.length;i<iLen;i++){
						iStrIndex=sTemp.indexOf(vSepStr[i]);
						if(iStrIndex>=0&&iStrIndex<nearStrIndex){
							nearStrIndex=iStrIndex;
							arrayIndex=i;
						}
					}
					if(arrayIndex>=0){
						values[values.length]=sTemp.slice(0,nearStrIndex);
						sTemp=sTemp.slice(nearStrIndex+vSepStr[arrayIndex].length);
					}else{
						values[values.length]=sTemp;
						sTemp="";
					}
				}
				break;
			case "group":	//must contain an even number of elements
				if(!vSepStr.length||vSepStr.length%2!=0){
					throw "Parameter 'vSepStr' of method 'xsplit' of class 'String' must contain an even number of elements.";
				}
				var nearStrIndex,curGroupIndex;
				var sLeft="",sRight="";
				var isLeft=true;
				var sTemp=this.toString();
				while(sTemp.length){
					nearStrIndex=sTemp.length;
					if(isLeft){
						curGroupIndex=-1;
						for(var i=0,iStrIndex=0,iLen=vSepStr.length;i<iLen;i+=2){
							iStrIndex=sTemp.indexOf(vSepStr[i]);
							if(iStrIndex>=0&&iStrIndex<nearStrIndex){
								nearStrIndex=iStrIndex;
								curGroupIndex=i;
							}
						}
						if(curGroupIndex>=0){
							sLeft=vSepStr[curGroupIndex];
							sRight=vSepStr[curGroupIndex+1];
							values.push(["",sTemp.slice(0,nearStrIndex)]);
							sTemp = sTemp.slice(nearStrIndex+sLeft.length);
						}else{
							values.push(["",sTemp]);
							break;
						}
					}else{
						nearStrIndex = sTemp.indexOf(sRight);
						if(nearStrIndex>=0){
							values.push([sLeft+sRight,sTemp.slice(0,nearStrIndex)]);
							sTemp = sTemp.slice(nearStrIndex+sRight.length);
						}else{
							throw "Missing closing delimiter \""+sRight+"\"";
						}
					}
					isLeft = !isLeft;
				}
				if(!isLeft&&sTemp==""){
					throw "Missing closing delimiter \""+sRight+"\"";
				}
				break;
			case "complex":
				break;
		}
		return values;
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */	
	"padLeft" : function(totalWidth,paddingChar){
		if(this.length>=totalWidth) return this;
		else return Object(Object(paddingChar).repeat(totalWidth-this.length)+this.valueOf());
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */	
	"padRight" : function(totalWidth,paddingChar){
		if(this.length>=totalWidth) return this;
		else return Object(this.valueOf()+Object(paddingChar).repeat(totalWidth-this.length));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"hasAscii" : function(){
		var reg=/[\x00-\xff]+/gi;
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"hasNonAscii" : function(){
		var reg=/[^\x00-\xff]+/gi;
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"getAsciiCount" : function(){
		return this.replace(/[^\x00-\xff]*/g,"").length;
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"getNonAsciiCount" : function(){
		return this.replace(/[\x00-\xff]*/g,"").length;
	},
	/**
	 * @since: JSDK3 V1.6.0
	 * @created: 2011.9.22
	 */
	"encodeNonAscii" : function(){
		return (this.toString().replace(/([^\x00-\xff])/g,function($1){
				return "\\u"+($1).charCodeAt(0).toString(16).slice(-4);
			}));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"isAllAscii" : function(){
		var reg=/^[\x00-\xff]*$/gi;
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"isAllLetter" : function(iOptions){
		iOptions=iOptions==undefined?0:iOptions;
		switch(iOptions){
			case 0:
				var reg=/^[a-z]*$/gi;
				break;
			case 1:
				var reg=/^[a-z]*$/g;
				break;
			case 2:
				var reg=/^[A-Z]*$/g;
				break;
		}
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"isAllNumber" : function(){
		var reg=/^[0-9]*$/gi;
		return reg.test(this);
	},
	"equal" : function(vStrings,isNoCase){
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
	},
	/**
	 * @created: 2011.8.19
	 * @modified: 2011.8.22
	 */
	"serialize" : function(){
		return ("\""+this.toString().replace(/\\/g,"\\\\").replace(/\"/g,"\\\"")
			.replace(/\n/g,"\\n").replace(/\r/g,"\\r")
			.replace(/([^\x00-\xff])/g,function($1){
				return "\\u"+($1).charCodeAt(0).toString(16).slice(-4);
			})+"\"");
	}
}

		,
	"Number":
/**
 * Defines the Number type.
 */
{
	define: function(value) {
		this._value=(value||0).valueOf();
		this.MAX_VALUE=this._value.MAX_VALUE;
		this.MIN_VALUE=this._value.MIN_VALUE;
		this.NaN=this._value.NaN;
		this.NEGATIVE_INFINITY=this._value.NEGATIVE_INFINITY;
	},
	"extend": "Object",
	/**
	 * encapsulate(class|className,mode,instanceName[,staticMembers[,instanceMembers])
	 * @para mode: 0, direct, 1, indirect
	 */	
	base: ["Number",0,"_value",["POSITIVE_INFINITY"],["toFixed","toPrecision","toExponential","toLocaleString"]],
	toString : function(){
		return this._value.toString();
	},
	valueOf : function(){
		return this._value;
	},
	isWithin : function(min,max){
		if(typeof(min)!="number"||typeof(max)!="number"||min>max){
			throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
		}
		if(this>=min&&this<=max) return true;
		else return false;
	},
	isWithout : function(min,max){
		if(typeof(min)!="number"||typeof(max)!="number"||min>max){
			throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
		}
		if(this>=min&&this<=max) return false;
		else return true;
	},
	/**
	 * area in special scope
	 * @return 
	 *	(1)iOptions=0:  -1, n<min; 0, n>=min&&n<=max; 1, n>max;
	 *	(2)iOptions=1:  -1, n<=min; 0, n>min&&n<max; 1, n>=max;
	 * @created 2011.8.19
	 * @modified 2011.08.31
	 */
	atAround : function(min,max,vOptions){
		if(typeof(min)!="number"||typeof(max)!="number"||min>max){
			throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
		}
		vOptions=vOptions==undefined?0:vOptions;
		switch(vOptions){
			case 0:
			case "[]":
				if(this<min){
					return -1;
				}else if(this>=min&&this<=max){
					return 0;
				}else if(this>max){
					return 1;
				}
				break;
			case 1:
			case "()":
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
}

		,
	"Date":
/**
 * Defines the Date type.
 */
{
	"define": function(value) {
		var _class=jsre.getNativeClasses("Date");
		this._value=value==undefined?(new _class()):value;
	},
	"extend": "Object",
	/**
	 * encapsulate(class|className,mode,instanceName[,staticMembers[,instanceMembers])
	 * @para mode: 0, direct, 1, indirect
	 */	
	"base": ["Date",1,"_value",[],[
		"getDate","getDay","getFullYear","getHours","getMilliseconds","getMinutes","getMonth",
		"getSeconds","getTime","getTimezoneOffset","getUTCDate","getUTCDay","getUTCFullYear",
		"getUTCHours","getUTCMilliseconds","getUTCMinutes","getUTCMonth","getUTCSeconds","getVarDate",
		"getYear","setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth",
		"setSeconds","setTime","setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds",
		"setUTCMinutes","setUTCMonth","setUTCSeconds","setYear","toGMTString","toLocaleString","toUTCString",
		"parse","UTC","valueOf","toString"
	]],
	"newInstanceFrom_": function(nativeDate){
		var date=new this();
		date._value=nativeDate;
		return date;
	},
	/**
	 * Compare Date
	 * @para srcDate
	 * @para tarDate
	 * @para compareMethod: -3,second; -2,minute; -1,hour; 0,by time; 1,by day; 2,by month; 3,by year
	 * @para isAccurate: 
	 * @return array or number
	 * @author denggao liu
	 * @created 2011.9.21
	 * @modified 2011.9.21
	 */	
	"compareDate_": function(srcDate,tarDate,compareMethod,isAccurate){
		//to do...
	},
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
	"computeTime_": function(iValue,vFromType,vToType){
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
	},
	/**
	 * @para sPart: date,time,datetime
	 * @para sDateSep: date separator
	 * @created: 2012.5.30
	 */
	"toSTDString": function(sPart,sDateSep){
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
}

}));
})

