/**
 * Define JSDK3 Framework Loader
 * @file: loader.js
 * @description: 
 * @version: V3.1.20131225
 * @product: JSDK3 v1.9.0
 * @support: IE6+, IE9+, Firefox3+, Chrome13+, Safari5+, Opera11+
 * @invoke: <script src="(jsdk3_path)/jsdk3x/loader.js"
 *			 [cache="true"]
 *			 [debug="false"]  
 *			 [develop="false"]
 *			 [appName="JSDK"]
 *			 [appMode="auto|main|sub|alone"]
 *			 [loadMode="auto|sync|async|compat"]
 *			 [token="jsdk"]
 *			 [domain="[domain_name]"]
 *			 [version="version"]
 *			 [locale="auto|(lang)|_byUrl|_byBrowser|_byUser|_bySystem"]
 *			 [environment="/service/environment.xml"]
 *			 [resource="[resource_name]"]
 *			 [include="[mylib[.version]][;...]"]
 *		    ></script>
 * @author: liu denggao
 * @created: 2011.06.06
 * @modified: 2013.12.25
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 * @opensource: http://francklin.github.com/JSDK
 * @copyright: (C) 2007-2013 Tringsoft Studio.
 ************************************************************/

(function JSDK3Loader(window,oEnviron){
try{
var document=window.document;
var jsdk=window["__JSDK_Namespace__"];
var loader=window["_$JSDK3Loader$_"]=jsdk&&jsdk.Engine.getLoader()||arguments.callee;
if(jsdk){
	var jsre=jsdk.Engine.runtimeEnvironment;
	var environ=loader.getTagAttribs(["include","contentType"]);
	switch(environ.contentType){
		case "import":
			if(environ.include){
				environ.include=environ.include.split(";");
				for(var i=0,libs=environ.include||[];i<libs.length;i++){
					var values=libs[i].match(/([^\.]*)[\.]?([0-9\.]*)/);
					jsre.loadClassLib(values[1],values[2]);
				}
			}
			jsdk.Engine.pretreatEnvironment.eval(environ.text);
			break;
		case "script":
			jsdk.Engine.scriptEnvironment.eval(environ.text);
			break;
	}
	return;
}
//-------
loader.name="JSDK3Loader";
loader.version="3.1.20131225";
loader.mode=0;		//0, internal; 1, external
loader.path="";	
loader.config=null;	//public config
loader.environ=oEnviron;
loader.resources=[];
loader.tasks=[];
loader.loadedCode="";
loader.getXMLHttpRequest=function () {
	// Create XMLHttpRequest Object
	var progId, progIds = ["MSXML2.XMLHTTP.6.0"
		, "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
	return function () {
		var flag=-1;
		if(progId){
			return new ActiveXObject(progId);
		}else if(window.location.host==""){
			flag=typeof(ActiveXObject)!="undefined"?0:1;
		}else if(typeof(XMLHttpRequest)!="undefined"){
			flag=1;
		}else if(typeof(ActiveXObject)!="undefined"){
			flag=0;
		}
		if(flag==1){
			return new XMLHttpRequest();
		}else{
			for (var i = 0; i < progIds.length; i++) {
				try	{
					return new ActiveXObject(progId = progIds[i]);
				} catch (ex) {
					progId = null;
				}
			}
		}
	};
}();
loader.getXMLDOMDocument=function () {
	var progId, progIds = ["MSXML2.DOMDocument.6.0"
		, "MSXML2.DOMDocument", "Microsoft.XMLDOM"];
	return function () {
		if(progId) {
			return new ActiveXObject(progId);
		}else if(typeof(ActiveXObject)=="undefined"){
			return null;
		}else{
			for (var i = 0; i < progIds.length; i++) {
				try	{
					return new ActiveXObject(progId = progIds[i]);
				} catch (ex) {
					progId = null;
				}
			}
		}
	};
}();
loader.getXMLDOMParser=function () {
	return function(){
		if (typeof(DOMParser)!="undefined") {
			return new DOMParser();
		}
	}
}();
loader.getFileData=function(sFilePath,isNoCache){
	try{
		isNoCache=isNoCache==undefined?false:isNoCache;
		loader._xmlHttp.open("GET", sFilePath, false);
		if(loader._xmlHttp.overrideMimeType) {
			loader._xmlHttp.overrideMimeType("text/plain"); 
		}
		if(isNoCache){
			loader._xmlHttp.setRequestHeader("Pragma","no-cache");
			loader._xmlHttp.setRequestHeader("If-Modified-Since","0");
		}
		loader._xmlHttp.send(null);
		if(loader._xmlHttp.readyState == 4) {		//data accept complete
			if(loader._xmlHttp.status == 200) {		//return request ok
				return loader._xmlHttp.responseText;
			}else if(loader._xmlHttp.status == 0
				&&!loader._xmlHttp.getAllResponseHeaders()){	//request local
				return loader._xmlHttp.responseText;
			}
		}
	}catch(ex){
		throw "Get file error!\nfile: \""+sFilePath+"\" \ndata: "+ex.message||ex;
	}
}
loader.getFileResource=function(sFilePath,isNoCache){
	var code="";
	var root=sFilePath.split("/")[0];
	if(root==""||root=="."||root==".."){
		//none
	}else{
		for(var i=0;i<this.resources.length;i++){
			code=this.resources[i].entity[sFilePath]||"";
			if(!!code) return code;
		}
		sFilePath=this.environ.path+"/"+sFilePath;
	}
	return this.getFileData(sFilePath,isNoCache);
}
loader.loadResource=function(obj){
	if(!this.resources[obj.manifest.name]){
		this.resources[obj.manifest.name]=this.resources[this.resources.length]=obj;
	}
	if(!this.environ.develop&&this.environ.loadMode=="compat") this.onLoadedFile(obj.manifest.name);
}
loader.loadScriptFile=function(){
	var head=document.getElementsByTagName("HEAD")[0];
	return function(url,callback,name){
		var scr=document.createElement("SCRIPT");
		scr.type = "text/javascript"; 
		scr.src = url; 
		if(scr.readyState){
			//IE
			scr.onreadystatechange=function(){
				if (scr.readyState == "loaded" || scr.readyState == "complete"){ 
					scr.onreadystatechange = null; 
					try{
						callback&&callback(name);
					}catch(e){
					}
				}
			}
		}else{
			//Firefox, Opera, Chrome, Safari 3+ 
			scr.onload = function(){
				try{
					callback&&callback(name);
				}catch(e){
				}
			}
		}
		this.tasks.push(name);
		head.appendChild(scr);
	}
}();
loader.getTagAttribs=function(incAttribs){
	var elScript, oAttribs={};
	for(var scripts=document.getElementsByTagName("SCRIPT"),i=scripts.length-1;i>=0;i--){
		if((scripts[i].token||"").toLowerCase()=="jsdk"){	//2013.10.21
			elScript=scripts[i]; break;
		}else if(scripts[i].src.search(/^.*[\\|\/]?(\.|\.\.|src|jsdk3|(jsdk3([\_|\\|\/][v]?[0-9\.]+)?[x]?))[\\|\/]loader\.js$/i)>=0) {
			elScript=scripts[i]; break;
		}else if(scripts[i].src.search(/^.*[\\|\/]loader\.js$/i)>=0){	//loader on other place
			this.mode=1;
			elScript=scripts[i]; break;
		}
	}
	if(!elScript) return null;
	for(var i=0;i<incAttribs.length;i++){
		oAttribs[incAttribs[i]]=elScript.getAttribute(incAttribs[i]);
	}
	oAttribs.text=elScript.text;
	return oAttribs;
}
loader.compareVersion=function(ver1,ver2){
	if(ver1==ver2){
		return 0;
	}else if(!ver1){
		return 1;
	}else if(!ver2){
		return -1;
	}else{
		var values1=ver1.split(".");
		var values2=ver2.split(".");
		var len=Math.min(values1.length,values2.length);
		for(var i=0;i<len;i++){
			if(parseInt(values1[i],10)<parseInt(values2[i],10)){
				return -1;
			}else if(parseInt(values1[i],10)>parseInt(values2[i],10)){
				return 1;
			}else if(values1[i]=="x"){
				return 1;
			}else if(values2[i]=="x"){
				return -1;
			}
		}
		if(values1.slice(len).join("").replace(/0/,"")==values2.slice(len).join("").replace(/0/g,"")){
			return 0;
		}else{
			return values1.length<values2.length?-1:1;
		}
	}
}
loader.loadCore=function(){
	this.environ.loader=this;
	this.environ.location=window.location;
	this.environ.appFilePath=window.location.pathname;
	this.engine=new (eval("''||"+this.loadedCode))(window
		,(window.parent&&window.parent!=window)?window.parent
			:(window.opener&&window.opener!=window?window.opener:null)
		,this.environ);
}
loader.onLoadedFile=function(name){
	for(var i=0;i<this.tasks.length;i++){
		if(this.tasks[i]==name) { this.tasks.splice(i,1);break; }
	}
	if(this.tasks.length==0) this.onReady();
}
loader.onReady=function(){
	switch(loader.environ.appMode){
		case "main":
			loader.loadedCode=loader.getFileResource("jsre.js",!loader.environ.cache);
			break;
		case "sub": 
			if(window.parent&&window.parent!=window){
				loader.loadedCode=window.parent.__JSDK_Namespace__.Engine.getLoader().loadedCode;
				break;
			}else if(window.opener&&window.opener!=window){
				loader.loadedCode=window.opener.__JSDK_Namespace__.Engine.getLoader().loadedCode;
				break;
			}else{
				loader.environ.appMode="alone";
			}
		default:
			loader.loadedCode=loader.getFileResource("jsre.js",!loader.environ.cache);
	}
	this.loadCore();
}
if(!loader._xmlHttp) loader._xmlHttp=loader.getXMLHttpRequest();
if(!loader.loadedCode){
	if(!loader.environ){
		var environ=loader.getTagAttribs(["appName","appMode","loadMode","token","domain","develop"
				,"debug","cache","version","locale","environment","resource","include","src"]);
		loader.path=environ.src.match(/^(.*?)[\/]?([^(?:\\|\/)]+)$/)[1]||".";
		loader.environ={
			debug : (/^(true|1)$/i).test(environ.debug||"false"),
			develop : (/^(true|1)$/i).test(environ.develop||"false"),
			cache : (/^(true|1)$/i).test(environ.cache||"true"),
			appName : environ.appName,
			appMode : environ.appMode,
			loadMode : environ.loadMode||"",
			domain: environ.domain,
			locale : environ.locale,
			version: environ.version,
			environment : environ.environment,
			resource : environ.resource?environ.resource.split(";"):[],
			include : environ.include?environ.include.split(";"):[],
			src : environ.src,
			path : loader.path,
			text : environ.text
		};
		if(loader.mode==1){
			for(var i=0,parents=[window.parent,window.top,window.opener];i<parents.length;i++){
				var parent=parents[i]&&parents[i]["_$"+loader.name+"$_"];
				if(parent){
					loader.config=parent.config;
					loader.resources=parent.resources;
					break;
				}
			}
			loader.config=loader.config||eval(loader.getFileData(loader.path+"/config.js",true));
			var attr=["appName","loadMode","debug","develop","cache","version","locale","resource","include"];
			for(var i=0;i<attr.length;i++){
				if(!environ[attr[i]]&&loader.config[attr[i]]!=undefined){
					loader.environ[attr[i]]=loader.config[attr[i]];
				}
			}
			loader.environ.src=loader.path+"/"+loader.config.src;
			loader.environ.path=loader.environ.src.match(/^(.*?)[\/]?([^(?:\\|\/)]+)$/)[1]||".";
		}
	}else{
		if(loader.environ.debug==undefined) loader.environ.debug=false;
		if(loader.environ.cache==undefined) loader.environ.cache=true;
	}
	if(!loader.environ.version){
		//var JSRE_Path=loader.environ.src=loader.environ.src.replace(/^(.*(?:\\|\/))([^(?:\\|\/)]+)$/g,"$1jsre.js");
	}else{ 
		//var JSRE_Path=loader.environ.src=loader.environ.src.replace(/^(.*(?:\\|\/))([^(?:\\|\/)]+)$/g,"$1history/jsdk3_v"+loader.environ.version+"/jsre.js");
	}
	if(!loader.environ.develop&&loader.environ.resource.length){
		if(!loader.environ.loadMode||loader.environ.loadMode=="async"){
			for(var i=0,libs=loader.environ.resource;i<libs.length;i++){
				loader.loadScriptFile(loader.environ.path+"/lib/resources/"+libs[i]+".js",function(name){
					loader.onLoadedFile(name);
				},libs[i]);
			}
			return;
		}else if(loader.environ.loadMode=="compat"){ 	//developer manual add script element for loading resource library file on external.
			loader.tasks=[].concat(loader.environ.resource);
			return;
		}
	}
}
loader.onReady();
//---
}catch(e){
if(!loader.environ||loader.environ.debug) alert("JSDK3 Loaded fail: "+e.description);
}
})(window);

