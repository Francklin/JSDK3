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