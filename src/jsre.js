/**
 * Define JSDK namespace and runtime environment.
 * @file: jsre.js
 * @product: JSDK3 v1.9.0
 * @description: 
 * @version: V2.3.0.20131218
 * @support: IE6+, IE9+, Firefox 3.6+, Chrome 13+, Safari 5+, Opera 11+
 * @para oHost:
 * @para oParentHost:
 * @para oEnviron:
 * @return: JSDK3 Engine Instance
 * @author: liu denggao
 * @created: 2010.01.03
 * @modified: 2013.12.18
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 * @opensource: http://francklin.github.com/JSDK
 * @copyright: (C) 2007-2013 Tringsoft Studio.
 ************************************************************/

(function(oHost,oParentHost,oEnviron){
	this._loader=oEnviron.loader||arguments.callee.caller;
	this._parent=null;
	this._external=oHost;
	this._app=null;
	this._name="JSDK";
	this._version="V2.3.0.20131218";
	this._deviceNumber=0x0912;

	this.getLoader=function(){
		return this._loader;
	}
	this.getParent=function(){
		return this._parent;
	}
	this.getExternal=function(){
		return this._external;
	}
	this.getApp=function(){
		return this._app;
	}
	this.getName=function(){
		return this._name;
	}
	this.getAppName=function(){
		return this.runtimeEnvironment._appName;
	}
	this.getAppCodeName=function(){
		return this.runtimeEnvironment._appCodeName;
	}
	this.getVersion=function(){
		return this._version;
	}
	this.getLoaded=function(){
		return this.runtimeEnvironment._state==1;
	}

	/* JSDK Runtime Environment */
	this.runtimeEnvironment={
		"_sysConfig": null,
		"_appName"	: "",
		"_appCodeName" : "__JSDK_Namespace__",
		"_engine"	: null,
		"_ce"		: null,
		"_pe"		: null,
		"_state"		: 0,			//初始化状态	
		"_shellMode"	: "Browser",
		"_xmlHttp"	: null,
		"_rootHome"	: "",
		"_classHome"	: "",
		"_rootPath"	: "",
		"_appFilePath" : "",
		"_appFullPath" : "", //实际应用文件夹全路径，
		"_appRelPath" : "", //以本框架的根目录为相对路径的当前应用路径
		"_isDebug"	: false,
		"_isDevelop" : false,
		"_isCache"  : true,
		"_isLocal"	: true,
		"_appMode" : "",
		"_domain" : "",	//站点域
		"_environmentURL" : "",
		"_localeLanguage" : "",
		"_hasUnprocessedErrors" : false,
		"_resources" : [],
		"_coreCodes" : [],
		"_classCodes" : [],
		"_classLibs" : [],
		"_nativeClasses" : [],
		"_fileExtension" : null,
		"_CONST" 	: {
			"_XMLHTTP" : {
				"ERR_IE_FILENOTEXSIT" : -2146697211,
				"ERR_FF_FILENOTEXSIT" : 1012
			}
		},

		// jsre.config
		"config" : function () {

			// Gets the config for jsdk
			var config = {};
			return {
				/**
				 * Returns the value of the specified parameter
				 */
				"getParameter" : function (name) {
					return config[name] || config.el && config.el.getAttribute(name);
				},
				/**
				 * get pretreatment code
				 */
				"getPretreatCode" : function(){
					return config["text"] || config.el && config.el.getAttribute("text");
				},
				/**
				 * Initializes or destroies the config
				 */
				"init" : function (cfg) {
					config = cfg || {};
				},
				"destroy" : function () {
					config = null;
				}
			};
		}(),

		// logger
		"logger" : function (engine) {
			var logs = [],_jsre=null,win=null;
			return {
				/**
				 * Logs a message.
				 */
				"log" : function (sMessage,isError) {
					if(!_jsre) _jsre=engine.runtimeEnvironment;
					logs.push({"message": sMessage
						, "date" : new Date()});
					if(isError) _jsre._hasUnprocessedErrors=true;
					if(_jsre&&_jsre._isDebug&&_jsre._state==1) this.printLog(logs.getLast());
				},
				/**
				 * Gets an array of the all logs.
				 */
				"getLogs" : function() {
					return logs.concat([]);
				},
				"print": function(text){
					if(!_jsre) _jsre=engine.runtimeEnvironment;
					switch(_jsre._shellMode){
						case "Browser":
							try{
								if(!win) win=window.open("","JSDK_Console");
								win.document.writeln("<pre style=\"margin:0\">"+text+"</pre>");
							}catch(e){
								_jsre.$messageBox(text);
							}
							break;
						default:
							_jsre.$messageBox(text);
					}
				},
				"printLog": function(log){
					this.print(["[", log.date.toSTDString()
							, ":" ,("000"+log.date.getMilliseconds()).slice(-3), "] "
							, log.message].join(""));
				}
			};
		}(this),
		
		//method-------------------------------------

		/**
		 * Initializes JSDK namespace.
		 * @modified: 2013.9.4-2013.12.11
		 */
		"initialize" : function(oEngine,oHost,oParentHost,oEnviron,oResource) {
			this._engine=oEngine;
			try{
				//考虑跨域问题
				this._engine._parent=!oParentHost?null:(!oParentHost[this._appCodeName]?null:oParentHost[this._appCodeName].Engine);
			}catch(e){
				this._engine._parent=null;
			}
			var external=this._engine._external;
			var jsre = this, logger = jsre.logger, ex;
			var __temp,_lang;
			try{
				logger.log("JSDK Initializing runtime-environment...");
				this._resources=this._engine._loader.resources||[];
				this._nativeClasses=[Object,Function,String,Number,Boolean,Date,Math,Array,Error];
				this.copyNamespace({
					"Object": Object,
					"Function": Function,
					"String": String,
					"Number": Number,
					"Boolean": Boolean,
					"Date": Date,
					"Math": Math,
					"Array": Array,
					"Error": Error
				},"",this._nativeClasses);
				this.checkShellMode();
				this.config.init(oEnviron);
				logger.log("JSDK Retrieving system properties...");
				this._xmlHttp=this.getXMLHttpRequest();
				this._rootHome=this.config.getParameter("src").split("/").slice(0,-1).join("/");
				this._classHome=this._rootHome+"/classes";
				this._libHome=this._rootHome+"/lib";
				this._sysConfig=typeof(__temp=this.getFileResource("config.json"))=="string"&&this.parseJSON(__temp)||__temp;
				this._fileExtension=this._sysConfig["file-extension"];
				this._environmentURL=this.config.getParameter("environment")||"";
				this._isCache=this.config.getParameter("cache");
				this._isDebug=this.config.getParameter("debug");
				this._isDevelop=this.config.getParameter("develop");
				this._appName=this.config.getParameter("appName")||this._engine._name;
				this._appMode=this.config.getParameter("appMode")||"alone";
				this._domain=this.config.getParameter("domain");
				if(external[this._appName]!=undefined){
					logger.log("Application namespace of JSDK named \""
						+this._appName+"\" has been used.");
					throw new Error(0,"Application namespace of JSDK named \""
						+this._appName+"\" has been used.");
					return;
				}
				if(__temp=this.config.getParameter("locale")) {
					//2013.9.5
					switch(__temp.toLowerCase()){
						case "auto":
						case "_bybrowser":
							_lang=external.navigator.browserLanguage||external.navigator.language;
							break;
						case "_byuser":
							_lang=external.navigator.userLanguage||external.navigator.language;
							break;
						case "_bysystem":
							_lang=external.navigator.systemLanguage||external.navigator.language;
							break;
						case "_byurl":
							_lang=(external.location.query.match(/[?&]lang=([a-zA-Z-]+)/)||[null,""]).pop();
							break;
						default:
							_lang=__temp;
					}
					this._localeLanguage=function(){
						var values=_lang.split("-");
						values[0]=values[0].toLowerCase();
						if(values.length==2) values[1]=values[1].toUpperCase();
						return values.join("-");
					}();
				}
				switch(this._appMode){
					case "":
					case "alone":
						logger.log("JSDK Start loading modules... ");
						this.globalEval(this.getFileResource("bin/base.js"));
						this.loadModule("kernel",this.getFileResource("bin/kernel.js"));
						break;
					case "main":
						this._coreCodes[this._coreCodes.length]=["base.js",this.getFileResource("bin/base.js")];
						this._coreCodes["base.js"]=this._coreCodes.length-1;
						this._coreCodes[this._coreCodes.length]=["kernel.js",this.getFileResource("bin/kernel.js")];
						this._coreCodes["kernel.js"]=this._coreCodes.length-1;
						this._coreCodes[this._coreCodes.length]=["global.js",this.getFileResource("bin/global.js")];
						this._coreCodes["global.js"]=this._coreCodes.length-1;
						logger.log("JSDK Start loading modules... ");
						this.globalEval(this._coreCodes[this._coreCodes["base.js"]][1]);
						this.loadModule("kernel",this._coreCodes[this._coreCodes["kernel.js"]][1]);
						break;
					case "sub":
						if(this._engine._parent){
							var _coreCodes=this._engine._parent.runtimeEnvironment._coreCodes;
							logger.log("JSDK Start loading modules... ");
							this.globalEval(_coreCodes[_coreCodes["base.js"]][1]);
							this.loadModule("kernel",_coreCodes[_coreCodes["kernel.js"]][1]);
							break;
						}
						break;
				}			
				this._appFilePath=this.config.getParameter("appFilePath");
				this._appFullPath=this.config.getParameter("appFilePath").leftBack("/");
				this._appRelPath=this.getCurRelPath(this._appFullPath,this._rootHome,"/");
				this._rootPath=this.getFileFullPath(this._appFullPath,this._rootHome,"/");
				//load classes lib------------
				if(__temp=this.config.getParameter("include")){
					for(var i=0,libs=__temp||[];i<libs.length;i++){
						var values=libs[i].match(/([^\.]*)[\.]?([0-9\.]*)/);
						this.loadClassLib(values[1],values[2]);
					}
				}
				this._ce=this._engine.compileEnvironment;
				this._pe=this._engine.pretreatEnvironment;
				this._ce.initialize(this);
				this._pe.initialize(this);
				//initialize namespace ---------------------
				logger.log("JSDK Initializing namespace...");
				var $=this._engine._app=external[this._appName]=external[this._appCodeName]=function(){
					var JSDK=function(){
						var len=arguments.length;
						if(len>0){
							if(typeof(arguments[0])=="string"){
								return JSDK.query.apply(JSDK,arguments);
							}else if(typeof(arguments[0])=="function"){
								return JSDK.exec.apply(JSDK,arguments);
							}
						}
					}
					this.copyNamespace(this._ce.getNamespace(),"",JSDK);
					return JSDK;
				}.apply(this);
				logger.log("JSDK Initialization started.");
			}catch(ex){
				logger.log("JSDK Initialize error: " + (ex.message || ex),true);
				jsre._state = -9;
			}finally{
				var p=function(){
					var s = [], logs = logger.getLogs();
					for (var i = 0; i < logs.length; i++) {
						var d = logs[i].date;
						s.push(["\r\n[", d.toSTDString()
							, ":" ,("000"+d.getMilliseconds()).slice(-3), "] "
							, logs[i].message].join(""));
					}
					return ("JSDK3 Log, URL: " + external.document.URL
						+ "\r\n\r\nlogs: \r\n---" + s.join(""));
				}
				if(this._isDebug){
					logger.print(p());
				}else if(this._hasUnprocessedErrors){
					this.$messageBox("JSDK Load fail!");
				}
				jsre._state=1;	//初始化完成
				if(this._isDebug||this._sysConfig.log["@enabled"]){
					if(this._sysConfig.log["@enabledSend"]&&!this._isLocal&&this._sysConfig.log.send.url){
						if(oHost.addEventListener){
							oHost.addEventListener("load",function(){
								try{$.post(jsre._sysConfig.log.send.url,{body:p()},new Function());}
								catch(e){}
							});
						}else if(oHost.attachEvent){
							oHost.attachEvent("onload",function(){
								try{$.post(jsre._sysConfig.log.send.url,{body:p()},new Function());}
								catch(e){}
							});
						}
					}				
				}				
			}
		},

		/**
		 * Determines whether JSDK is alive.
		 */
		"isAlive" : function() {
			return (!this._engine._external||this._engine._external.closed);
		},

		"getRootPath" : function(){
			return this._rootPath;
		},
		"getRootHome" : function(){
			return this._rootHome;
		},
		"getClassHome" : function(){
			return this._classHome;
		},
		"getAppFilePath" : function(){
			return this._appFilePath;
		},
		"getAppFullPath" : function(){
			return this._appFullPath;
		},		
		"getAppRelPath" : function(){
			return this._appRelPath;
		},
		"getAppMode": function(){
			return this._appMode;
		},
		"getShellMode": function(){
			return this._shellMode;
		},
		"getDomain": function(){
			return this._domain;
		},
		"getNativeClasses" : function(sName){
			if(sName==undefined) return this._nativeClasses;
			else return this._nativeClasses[sName];
		},
		"getLocaleLanguage": function(){
			return this._localeLanguage;
		},
		
		/**
		 * Check shell mode
		 */
		"checkShellMode" : function(){
			var external=this._engine._external;
			if(external&&external.document){
				this._shellMode="Browser";
				this._isLocal=external.location.host=="";
			}else if(external.WScript){
				this._shellMode="Windows";
			}
		},
		
		/**
		 * Returns an XMLHttpRequest instance.
		 */
		"getXMLHttpRequest" : function () {
			// Create XMLHttpRequest Object
			var progId, progIds = ["MSXML2.XMLHTTP.6.0"
				, "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			return function () {
				if (typeof(ActiveXObject)=="undefined") {
					return new XMLHttpRequest();
				} else if (progId != null) {
					return new ActiveXObject(progId);
				} else {
					for (var i = 0; i < progIds.length; i++) {
						try	{
							return new ActiveXObject(progId = progIds[i]);
						} catch (ex) {
							progId = null;
						}
					}
				}
			};
		}(),

		/**
		 * Judge file is exists.
		 */
		"isFileExists" : function(sFilePath){
			this._xmlHttp.open("HEAD", sFilePath, false);
			try{
				this._xmlHttp.send();
			}catch(e){
				if(e.number&&e.number==this._CONST
					._XMLHTTP.ERR_IE_FILENOTEXSIT){		//for IE
					return false;
				}else if(e.code&&e.code==this._CONST
					._XMLHTTP.ERR_FF_FILENOTEXSIT){		//for Firefox
					return false;
				}
				throw e;
			}
			if(this._xmlHttp.readyState == 4){
				if(this._xmlHttp.status == 200) {
					return true;
				}else if(this._xmlHttp.status == 404){
					return false;
				}else if(this._xmlHttp.status == 0
					&&!this._xmlHttp.getAllResponseHeaders()){
					return true;
				}
			}
			return false;
		},

		/**
		 * Get file data
		 * @para sFilePath: file full path
		 * @modified: 2011.8.4
		 */
		"getFileData" : function(sFilePath){
			try{
				//isNoCache=isNoCache==undefined?!this._isCache:isNoCache;
				this.logger.log("Getting file '"+sFilePath+"'...");
				this._xmlHttp.open("GET", sFilePath, false);
				if(this._xmlHttp.overrideMimeType) { //Firefox
					this._xmlHttp.overrideMimeType("text/plain"); 
				}else{	//IE
					//this._xmlHttp.setRequestHeader("Content-Type","text/plain");
				}
				/*
				if(isNoCache){
					this._xmlHttp.setRequestHeader("Pragma","no-cache");
					this._xmlHttp.setRequestHeader("If-Modified-Since","0");
				}*/
				
				this._xmlHttp.send(null);
				if(this._xmlHttp.readyState == 4) {		//data accept complete
					if(this._xmlHttp.status == 200) {	//return request ok
						return this._xmlHttp.responseText;
					}else if(this._xmlHttp.status == 0
						&&!this._xmlHttp.getAllResponseHeaders()){	//request local
						return this._xmlHttp.responseText;
					}
				}
			}catch(ex){
				this.logger.log("Get file '"+sFilePath+"' fail!");
				throw new Error(ex.number,"Get file error!\nfile: \""+sFilePath+"\" \ndata: "+ex.message||ex);
			}
			this.logger.log("Get file '"+sFilePath+"' fail!");
		},
		/**
		 * 相对于根目录
		 * @since: JSDK3 v1.9.0
		 * @modified: 2013.12.18
		 */
		"getFileResource" : function(sFilePath,onlyCache){
			var code="";
			var root=sFilePath.split("/")[0];
			if(root==""||root=="."||root==".."){
				//none
			}else if(this._isDevelop){
				sFilePath=this._rootHome+"/"+sFilePath;
			}else{
				for(var i=0;i<this._resources.length;i++){
					code=this._resources[i].entity[sFilePath]||"";
					if(!!code) return code;
				}
				sFilePath=this._rootHome+"/"+sFilePath;
			}
			return !onlyCache&&this.getFileData(sFilePath)||"";
		},
		/**
		 * @created: 2011.8.5
		 */
		"getResPath" : function(sPackage){		
			return this._classHome+"/"+sPackage.replace(/\./g,"/")+"/_res";
		},
		/**
		 * Get class code for locale language
		 * @para sClassFullName
		 * @para sVersion: 
		 * @para sLocale:
		 * @return: Array(version,locale,filepath,code)
		 * @modified: 2011.8.20-2013.8.29
		 */
		"__getClassCodeFromFile" : function(sClassFullName,sVersion,sLocale){
			var baseFilePath=this._classHome+"/"+sClassFullName.replace(/\./g,"/")+(sVersion?("_V"+sVersion):"");
			var files=[],sCode="";
			sLocale=sLocale?sLocale:this._localeLanguage;
			if(!sLocale){
				if(!this._isDevelop){
					files=[["",baseFilePath+this._fileExtension["class"].compile]
						,["",baseFilePath+this._fileExtension["class"].source]];
				}else{
					files=[["",baseFilePath+this._fileExtension["class"].source]
						,["",baseFilePath+this._fileExtension["class"].compile]];
				}
			}else{
				if(!this._isDevelop){
					files=[[sLocale,baseFilePath+"_"+sLocale+this._fileExtension["class"].compile]
						,["",baseFilePath+this._fileExtension["class"].compile]
						,[sLocale,baseFilePath+"_"+sLocale+this._fileExtension["class"].source]
						,["",baseFilePath+this._fileExtension["class"].source]];
				}else{
					files=[[sLocale,baseFilePath+"_"+sLocale+this._fileExtension["class"].source]
						,["",baseFilePath+this._fileExtension["class"].source]
						,[sLocale,baseFilePath+"_"+sLocale+this._fileExtension["class"].compile]
						,["",baseFilePath+this._fileExtension["class"].compile]];
				}
			}
			for(var i=0;i<files.length;i++){
				try{
					sCode=this.getFileData(files[i][1]);
					if(sCode!=undefined) return [sVersion,files[i][0],files[i][1],sCode];
				}catch(e){
					if(e.number&&e.number==this._CONST
						._XMLHTTP.ERR_IE_FILENOTEXSIT){		//for IE
						continue;
					}else if(e.code&&e.code==this._CONST
						._XMLHTTP.ERR_FF_FILENOTEXSIT){		//for Firefox
						continue;
					}else{
						break;
					}
				}
			}			
			/*
			if(this._isLocal||this._localeLanguage==""){
				for(var i=0;i<files.length;i++){
					try{
						sCode=this.getFileData(files[i][1]);
						if(sCode!=undefined) return [sVersion,files[i][0],files[i][1],sCode];
					}catch(e){
						if(e.number&&e.number==this._CONST
							._XMLHTTP.ERR_IE_FILENOTEXSIT){		//for IE
							continue;
						}else if(e.code&&e.code==this._CONST
							._XMLHTTP.ERR_FF_FILENOTEXSIT){		//for Firefox
							continue;
						}else{
							break;
						}
					}
				}
			}else{
				for(var i=0;i<files.length;i++){
					try{
						if(!this.isFileExists(files[i][1])) continue;
						sCode=this.getFileData(files[i][1]);
						if(sCode!=undefined) return [sVersion,files[i][0],files[i][1],sCode];
					}catch(e){
						if(e.number&&e.number==this._CONST
							._XMLHTTP.ERR_IE_FILENOTEXSIT){		//for IE
							continue;
						}else if(e.code&&e.code==this._CONST
							._XMLHTTP.ERR_FF_FILENOTEXSIT){		//for Firefox
							continue;
						}else{
							break;
						}
					}
				}			
			}
			*/
			return ["","","",""];		//[version,locale,file,code]
		},
		/**
		 * Get class code from lib
		 * @return: Array(version,locale,libName,code)
		 * @created: 2011.8.20
		 * @modified: 2012.4.25
		 */
		"__getClassCodeFromLibs" : function(sClassFullName,sVersion,sLocale){
			var sCode="";
			if(this._isDevelop) return "";	//开发时不从类库中取类代码
			switch(this._appMode){
				case "":
				case "alone":
				case "main": 
					for(var i=0,iLen=this._classLibs.length;i<iLen;i++){
						var entity=this._classLibs[i][3].entity;
						if(sCode=entity[sClassFullName]){
							return sCode;
						}
					}
					break;
				case "sub":
					if(this._engine._parent){
						return this._engine._parent.runtimeEnvironment.__getClassCodeFromLibs(sClassFullName,sVersion,sLocale);
					}
					break;
			}
			return "";
		},
		/**
		 * @function __getClassCodeFromCache(sClassFullName,sLocale)
		 * @created 2011.8.20
		 * @updated 2011.8.21
		 */
		"__getClassCodeFromCache" : function(sClassFullName,sVersion,sLocale){
			sLocale=sLocale==undefined?this._localeLanguage:sLocale;
			var sCode="";
			switch(this._appMode){
				case "":
				case "alone":
				case "main":
					var index=this._classCodes[sClassFullName];
					if(index==undefined){
						return "";
					}else if(this._classCodes[index][0]==sVersion){
						return this._classCodes[index][3];
					}else{
						return "";
					}
					break;
				case "sub":
					if(this._engine._parent){
						this._engine._parent.runtimeEnvironment.__getClassCodeFromCache(sClassFullName,sVersion,sLocale);
					}
					break;
			}
			return "";
		},
		"getClassCode" : function(sClassFullName,sVersion,sLocale){
			var sCode="",values=[];
			sLocale=sLocale==undefined?this._localeLanguage:sLocale;
			switch(this._appMode){
				case "":
				case "alone":
				case "main":
					sCode=this.__getClassCodeFromCache(sClassFullName,sVersion,sLocale);
					if(!sCode){
						sCode=this.__getClassCodeFromLibs(sClassFullName,sVersion,sLocale);
						if(!sCode){
							values=this.__getClassCodeFromFile(sClassFullName,sVersion,sLocale);
							if(sCode=values[3]){
								this._addClassCode(sClassFullName,values[0],values[1],sCode);
							}
						}
					}
					break;
				case "sub":
					if(this._engine._parent){
						return this._engine._parent.runtimeEnvironment.getClassCode(sClassFullName,sVersion,sLocale);
					}
					break;
			}
			return sCode;	
		},
		/**
		 * @function _addClassCode(sClassFullName,sVersion,sLocale,sCode)
		 * @created 2011.8.20
		 */
		"_addClassCode" : function(sClassFullName,sVersion,sLocale,sCode){
			if(undefined!=this._classCodes[sClassFullName]) return;
			this._classCodes[this._classCodes.length]=[sClassFullName,sVersion,sLocale,sCode];
			this._classCodes[sClassFullName]=this._classCodes.length-1;
		},
		/**
		 * @created: 2011.8.23
		 * @modified: 2013.12.11
		 */
		"getCoreCode" : function(sName){
			var sCode="";
			if(this._coreCodes.hasOwnProperty(sName)){
				return sCode=this._coreCodes[this._coreCodes[sName]][1];
			}else if(this._appMode=="sub"&&this._engine._parent){
				return sCode=this._engine._parent.runtimeEnvironment.getCoreCode(sName);
			}else{
				return sCode=this.getFileResource("bin/"+sName);
			}
		},
		/**
		 * @para 
		 *   (1)srcObj: source object
		 *   (2)tarObj: target object
		 * @date: 2009.12.28 
		 * @modified: 2011.6.3
		 */
		"copyNamespace" : function(srcObj,vFilter,tarObj,isOverwrite){
			if(typeof(srcObj)!="object"&&typeof(srcObj)!="function") return;
			else if(typeof(tarObj)!="object"&&typeof(tarObj)!="function") return;
			else if(Object.prototype.toString.apply(srcObj) === "[object Array]") return;
			//else if(Object.prototype.toString.apply(tarObj) === "[object Array]") return;
			if(!vFilter){
				for(var sProp in srcObj){
					if(srcObj.hasOwnProperty(sProp)){
						try{
							if(isOverwrite){
								tarObj[sProp]=srcObj[sProp];
							}else if(tarObj[sProp]==undefined){
								tarObj[sProp]=srcObj[sProp];
							}
						}catch(e){
							//
						}
					}
				}
			}else if(typeof(vFilter)=="function"){
				var fnFilter=vFilter;
				for(var sProp in srcObj){
					if(srcObj.hasOwnProperty(sProp)&&fnFilter(sProp)){
						try{
							if(isOverwrite){
								tarObj[sProp]=srcObj[sProp];
							}else if(tarObj[sProp]==undefined){
								tarObj[sProp]=srcObj[sProp];
							}
						}catch(e){
							//
						}
					}
				}
			}else if(vFilter instanceof Array){
				var values=vFilter;
				for(var i=0,sProp;i<values.length;i++){
					if(srcObj.hasOwnProperty(sProp=values[i])){
						try{
							if(isOverwrite){
								tarObj[sProp]=srcObj[sProp];
							}else if(tarObj[sProp]==undefined){
								tarObj[sProp]=srcObj[sProp];
							}
						}catch(e){
							//
						}
					}
				}
			}
			
		},

		/**
		 * load module
		 * @modified: 2012.10.17
		 */
		"loadModule" : function(sName, sCode){
			try{
				this._engine[sName]=new (new Function("return("+sCode+");")())(this._engine);
			}catch(ex){
				this.logger.log("JSDK Load module '"+sName+"' error: " + (ex.message || ex),true);
			}
		},
		"loadPackage" : function(){
			//to do...
		},
		/**
		 * loading class after framework loaded.
		 * @modified: 2011.9.23
		 */
		"loadClass" : function(sClassFullName,sVersion){
			var oClass=null;
			var sName=sClassFullName.split(".").pop();
			var sPath=sClassFullName.left(".");
			switch(0){
				case 0: 
					try{
						oClass=this.getMember(this._engine.kernel,sClassFullName);
						if(typeof(oClass)=="function") return oClass;
						else if(typeof(oClass)=="undefined") break;
						else throw "Class '"+ sClassFullName + "' is invalid.";
					}catch(e){
					}
				case 1:
					try{
						oClass=this.getMember(this._ce._namespace,sClassFullName);
						if(typeof(oClass)=="function") return oClass;
						else if(typeof(oClass)=="undefined") break;
						else throw "Class '"+ sClassFullName + "' is invalid.";
					}catch(e){
					}
			}
			if(typeof(oClass)!="undefined") {
				return oClass;
			}else if(this._engine._app){
				this._ce._namespace.$import(sClassFullName,sVersion);
				var oClass=this.getMember(this._engine._app,sClassFullName);
				if(typeof(oClass)=="undefined") throw new Error(1000,"Class '"+ sClassFullName + "' be not found.");
				//this.setMember(this._engine._app,sClassFullName,oClass);
				if(sPath!=""&&typeof(this._engine._app[sName])=="undefined"){
					this._engine._app[sName]=oClass;
				}
			}else{
				throw "Class '"+ sClassFullName + "' be not found.";
			}
			return oClass;					
		},
		/**
		 * load class package
		 */
		/**
		 * load class lib
		 * @description: 
		 * @remark: 类库的格式不包含类的版本和语言。
		 * @created: 2011.8.20
		 * @modified: 2013.12.18
		 */
		"loadClassLib" : function(sName,sVersion,sLocale){
			this.logger.log("JSDK Loading lib '"+sName+"'...");
			var baseFilePath=this._libHome.right(this._rootHome+"/")+"/classes/"+sName+(sVersion?("_v"+sVersion):"");
			var files=[],sCode="",vCode="",oLib=null;
			sLocale=sLocale?sLocale:this._localeLanguage;
			if(this._classLibs.hasOwnProperty(sName)){
				return;
			}else if(this._appMode=="sub"&&this._engine._parent){
				vCode=this.getFileResource(baseFilePath+this._fileExtension.lib,true);
				if(vCode!=undefined) {
					this._classLibs[this._classLibs.length]=[sName,sVersion,sLocale
							,typeof(vCode)=="string"&&this.parseJSON(vCode)||vCode];
					this._classLibs[sName]=this._classLibs.length-1;
				}else{
					this._engine._parent.runtimeEnvironment.loadClassLib(sName,sVersion,sLocale);
				}
				return;
			}else{
				if(!sLocale){
					files=[["",baseFilePath+this._fileExtension.lib]];
				}else{
					files=[[sLocale,baseFilePath+"_"+sLocale+this._fileExtension.lib]
						,["",baseFilePath+this._fileExtension.lib]];
				}
			}
			for(var i=0;i<files.length;i++){
				try{
					vCode=this.getFileResource(files[i][1]);
					if(vCode!=undefined) {
						this._classLibs[this._classLibs.length]=[sName,sVersion,sLocale
								,typeof(vCode)=="string"&&this.parseJSON(vCode)||vCode];
						this._classLibs[sName]=this._classLibs.length-1;
						return;
					}
				}catch(e){
					if(e.number&&e.number==this._CONST
						._XMLHTTP.ERR_IE_FILENOTEXSIT){		//for IE
						continue;
					}else if(e.code&&e.code==this._CONST
						._XMLHTTP.ERR_FF_FILENOTEXSIT){		//for Firefox
						continue;
					}else{
						break;
					}
				}
			}
			this.logger.log("JSDK Load lib '"+sName+"' fail!");
		},
		
		/**
		 * @date: 2011.10.17

		 */
		"getFileFullPath" : function(sCurPath,sFilePath,sSep){
			sCurPath=sCurPath.replace(new RegExp("\\"+sSep+"+$"),"");
			sSep=sSep?sSep:"/";
			var aValues=sFilePath.split(sSep);
			if(sFilePath==""){
				return sCurPath;
			}else if(aValues[0]==""){
				return sFilePath;
			}else if(aValues[0].indexOf(":")>=0){		//is full path
				return sFilePath;
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
				return [sCurPath,sFilePath].join(sSep);
			}
		},
		/**
		 * 以目标路径为相对目录来取当前路径
		 * @description: 可能还有很多种非正常情况没有考虑，比如暂不支持交叉查询.
		 * @para sTargetPath: 按先向上再向下查询方式
		 * @date 2010.1.29
		 */
		"getCurRelPath" : function(sCurFullPath,sTargetPath,sSep){
			sSep=sSep?sSep:"\\";
			var aCurPaths=sCurFullPath.split(sSep);
			var aTarPaths=sTargetPath.split(sSep);
			var iTarUpLevel=0,iTarDownLevel=0;
			var iRelUpLevel=0,aRelUpPaths=[],aRelDownPaths=[];
			if(aTarPaths[0]==""){	//目标路径是绝对路径
				iRelUpLevel=aTarPaths.length-1;
				aRelDownPaths=aCurPaths.slice(1);
			}else{
				for(var i=0;i<aTarPaths.length;i++){
					if(aTarPaths[i]==".") continue;
					else if(aTarPaths[i]==".."){
						iTarUpLevel++;
					}else{
						iTarDownLevel++;
					}
				}
				iRelUpLevel=iTarDownLevel;
				//向下
				for(var i=0,j=aCurPaths.length-iTarUpLevel;i<iTarUpLevel;i++){
					aRelDownPaths[i]=aCurPaths[j++];
				}
			}
			//向上
			for(var i=0;i<iRelUpLevel;i++){
				aRelUpPaths[i]="..";
			}

			return [].concat(aRelUpPaths,aRelDownPaths).join(sSep);
		},
		
		/**
		 *
		 */
		"$try" : function(){
			for (var i = 0, l = arguments.length; i < l; i++){
				try {
					return arguments[i]();
				} catch(e){}
			}
			return undefined;
		},
		
		/**
		 *
		 */
		"globalEval" : function(sCode){
			var external=this._engine._external;
			if(external.execScript){	//for IE
				external.execScript(sCode);	
			}else if(external.eval){	//for Firefox
				external.eval(sCode);
			}else if(external.Script){	//for SpiderMonkey Engine
				external.Script(sCode);
			}
		},		
		
		/**
		 *
		 */
		"$execLibScript" : function(srcFilePath){
			//to do...
		},
		
		/**
		 * Message Box
		 * @call: messageBox(sMessage[,iButtons[,sTitle]])
		 */
		"$messageBox" : function(sMessage, iButtons, sTitle){
			switch(this._shellMode){
				case "Browser":
					alert(sMessage);
					break;
				case "Windows":
					WScript.echo(sMessage);
					break;
			}
		},
		
		/**
		 * @date: 2010.1.28
		 */
		"toBoolFromStr" : function(vValue){
			return (/^(true|1)$/i).test(vValue); 
		},
		
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
		 * 不用eval的原因是这样更高效些。
		 */
		"getMember" : function(oObj,sFullName){
			var aNames=sFullName.split(".");
			for(var i=0,len=aNames.length;i<len;i++){
				oObj=oObj[aNames[i]];
				if(oObj==undefined) break;
			}
			return oObj;
		},
		/**
		 * 不用eval的原因是这样更高效些。
		 * @date: 2010.1.26
		 * @modified: 2011.10.28
		 */
		"setMember" : function(oObj,sFullName,vValue,isAutoCreatePath){
			var aNames=sFullName.split(".");
			var oParentObj=oObj;
			for(var i=0,len=aNames.length;i<len-1;i++){
				oObj=oParentObj[aNames[i]];
				if(oObj){
					oParentObj=oObj;
					continue;
				}else if(isAutoCreatePath){
					oParentObj=oObj=oParentObj[aNames[i]]={};
					continue;
				}else{
					break;
				}
			}
			if(!oObj) throw "not found member '"+sFullName+"'.";
			oObj[aNames.pop()]=vValue;
		},
		
		/**
		 * Destroys JSDK namespace.
		 */
		"destroy" : function () {
			var jsre = _JSDK_Namespace.runtimeEnvironment;
			//to do...
		}
	};

	/* JSDK Compile Environment */
	this.compileEnvironment=new function(){
		var _jsre=null;
		var _classesLoaded={};			//所有已装载的类及包路径
		var _classesShortcut={};		//定义了快捷路径(省去了全路径)的类
		var _classesFullShortcut={};	//定义了带全路径名的快捷路径的类
		var _global={};
		this._namespace={
			"Global": null,
			"Engine" : null,
			"Console" : null,
			/**
			 * @date: -2011.10.31
			 */
			"$package" : function(sPackageName){
				var oObj=this,oObj1=_classesLoaded,aNames=sPackageName.split(".");
				for(var i=0,len=aNames.length;i<len;i++){
					if(typeof(oObj[aNames[i]])!="object") {
						oObj=oObj[aNames[i]]={};
						oObj1=oObj1[aNames[i]]={};
					}else{
						oObj=oObj[aNames[i]];
						oObj1=oObj1[aNames[i]];
					}
				}
				if(_jsre._engine._app){
					oObj=_jsre._engine._app;
					for(var i=0,len=aNames.length;i<len;i++){
						if(typeof(oObj[aNames[i]])!="object") {
							oObj=oObj[aNames[i]]={};
						}else{
							oObj=oObj[aNames[i]];
						}
					}
				}
			},
			/**
			 * @date: -2011.10.28
			 * @para sClassFullName
			 * @para sVersion:  added on 2011.8.4
			 */
			"$import" : function(sClassFullName,sVersion){
				var oClass;
				try{
					//判断类是否在之前已经导入，防止重新加载
					if(undefined!=_jsre.getMember(this,sClassFullName)) return;
					var sName=sClassFullName.split(".").pop();
					var sPath=sClassFullName.left(".");
					//执行类代码
					with(this) eval(_jsre.getClassCode(sClassFullName,sVersion));
					//增加命名空间---
					oClass=_jsre.getMember(this,sClassFullName);
					if(undefined==oClass) throw "error!";
					_jsre.setMember(_classesLoaded,sClassFullName,oClass);
					if(_jsre._engine._app&&!_jsre.getMember(_jsre._engine._app,sClassFullName)){
						_jsre.setMember(_jsre._engine._app,sClassFullName,oClass,true);
					}
					_classesFullShortcut[sClassFullName]=oClass;
					if(sPath!=""&&typeof(_classesShortcut[sName])=="undefined"){
						_classesShortcut[sName]=oClass;
						if(_jsre._engine._app){
							_jsre._engine._app[sName]=oClass;
						}
					}
					if(sPath!=""&&typeof(this[sName])=="undefined"){
						this[sName]=oClass;
					}
								
				}catch(e){
					_jsre.logger.log(e.description,true);
					_jsre.logger.log("Import class \""+sClassFullName+"\" error!",true);
				}
			},
			
			"$res" : function(sRelFilePath){
				//to do...
			}
		};
		
		//method------------------

		this.initialize=function(jsre){
			_jsre=jsre;
			_jsre.logger.log("JSDK Initializing compile environment...");
			_jsre.copyNamespace(_jsre._engine.kernel,"",_global);
			_jsre.copyNamespace(
				(new Function("Engine","return ("
					+_jsre.getCoreCode("global.js")
					+")"))(_jsre._engine)
				,"",_global
			);
			_jsre.copyNamespace(_global,"",this._namespace);
			this._namespace.Global=this._namespace;
			this._namespace.Engine=_jsre._engine;
			this._namespace.Console=_jsre.logger;
			_jsre.logger.log("JSDK Initialized compile environment.");
		};
		this.addNamespace=function(moduleName,oObj,isOverwrite){
			switch(moduleName){
				case "global":
					_jsre.copyNamespace(oObj,"",_global,isOverwrite);
					_jsre.copyNamespace(oObj,"",this._namespace,isOverwrite);
					break;
				case "":
					_jsre.copyNamespace(oObj,"",this._namespace,isOverwrite);
					break;
			}
		}
		this.getNamespace=function(){
			var obj={};
			_jsre.copyNamespace({
				Engine: _jsre._engine
			},"",obj);
			_jsre.copyNamespace(_global,"",obj);
			_jsre.copyNamespace(_classesLoaded,"",obj);
			_jsre.copyNamespace(_classesShortcut,"",obj);
			return obj;
		}
		this.getLoadedClassNames=function(){
			var values=[];
			for(var p in _classesFullShortcut){
				if(_classesFullShortcut.hasOwnProperty(p)){
					values[values.length]=p;
				}
			}
			return values;
		}
		this.eval=function(sCode){
			try{
				with(this._namespace) eval(sCode);
			}catch(e){
				_jsre.logger.log(e,true);
				_jsre.logger.log("Execute code error!");
			}
		}
	};

	/* JSDK Pretreatment Environment */
	this.pretreatEnvironment=new function(){
		var _jsre=null;
		var _namespace=null;
		
		//method------------------
		var Global=null;
		var $import=function(sClassFullName,sVersion){
			_namespace.$import(sClassFullName,sVersion);
		}
		this.initialize=function(jsre){
			Global=_namespace=jsre._ce._namespace;
			_jsre=jsre;
			_jsre.logger.log("JSDK Initializing appplication environment...");
			_jsre.loadClassLib("lang");
			$import("js.lang.natives.Object");
			$import("js.lang.natives.Function");
			$import("js.lang.natives.String");
			$import("js.lang.natives.Number");
			$import("js.lang.natives.Boolean");
			$import("js.lang.natives.Date");
			$import("js.lang.natives.Math");
			$import("js.lang.natives.Array");
			$import("js.lang.natives.Error");
			$import("js.lang.Object");
			$import("js.lang.Exception");
			$import("js.lang.String");
			$import("js.lang.Number");
			$import("js.lang.Date");
			switch(_jsre._shellMode){
				case "Browser":
					_jsre._coreCodes[_jsre._coreCodes.length]=["shell-re.js",_jsre.getFileResource("shell/webbrowser/re.js")];
					_jsre._coreCodes["shell-re.js"]=_jsre._coreCodes.length-1;
					eval("("+_jsre._coreCodes[_jsre._coreCodes.length-1][1]+")(_jsre._engine,Global,_jsre._rootHome+\"/shell/webbrowser\");");
					break;
				case "Windows":
					break;
			}
			eval(_jsre.config.getPretreatCode());	
			_jsre.logger.log("JSDK Initialized application environment.");	
			//initialize extension patch
			if(_jsre._sysConfig["extension-patch"]&&_jsre._sysConfig["extension-patch"]["@enabled"]){
				_jsre._coreCodes[_jsre._coreCodes.length]=["ext-patch.js",_jsre.getFileData(
							_jsre._rootHome+"/patch/"+_jsre._sysConfig["extension-patch"]["file"])];
				_jsre._coreCodes["ext-patch.js"]=_jsre._coreCodes.length-1;
				eval("("+_jsre._coreCodes[_jsre._coreCodes.length-1][1]+")(_jsre._engine,Global,_jsre._rootHome+\"/patch\");");
			}
		}
		this.eval=function(code){
			eval(code);
		}
	};

	/* JSDK Script Environment */
	this.scriptEnvironment=new function(){
		this.eval=function(code){
			eval(code);
		}
	}
	
	/* Kernel Component */
	this.kernel={};

	//Initialize
	{
		this.runtimeEnvironment.initialize(this,oHost,oParentHost,oEnviron);
	}
})