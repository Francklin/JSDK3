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
	 * @memo: has been optimized
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
