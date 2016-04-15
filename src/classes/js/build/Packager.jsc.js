/**
 * @file Packager.js
 * @support: IE6+
 * @author Liu Denggao
 * @created 2011.7.15
 * @modified 2013.8.30-2013.12.13
 * @version 1.7 beta
 * @since JSDK3 V1.3
 * @update:
		v1.8
		2014.08.07 修改打包资源时获取源文件的路径，先查找已最小化的脚本
		v1.7
		2013.12.13 增强了打包文件的功能，可向最终文件添加头部和尾部代码
		v1.6
		2013.12.9 增加了打包资源的功能
		v1.3.1 -> v1.4
		2013.8.30 增加了多语言设置
 */

$package("js.build");
$import("js.build.Compressor");

/**
 * Create a new Packager instance.
 */
js.build.Packager=function(mode) {
	this._mode=0;
	this._names=[];
	this._files=[];
	this._isCompress=false;
	this._localeLang="";
	this._Packager(mode);
}

var _$class = js.build.Packager;
_$class.$extends("Object");
var _$proto = js.build.Packager.prototype;

_$class.MODE={
	FILE: 0,
	CLASS: 1,
	TEMPLATE: 2, 
	RESOURCE: 3,
	PRODUCT: 4
}

//:constructor-------------------

_$proto._Packager=function(mode){
	this._mode=mode;
}

//:property----------------------

_$proto.getMode=function(){
	return this._mode;
}
_$proto.setMode=function(value){
	if(value===this._mode) return;
	this._mode=value;
	this.fireEvent("_onModeChange");
}
_$proto.getIsCompress=function(){
	return this._isCompress;
}
_$proto.setIsCompress=function(value){
	this._isCompress=value;
}
_$proto.getLocaleLang=function(){
	return this._localeLang;
}
_$proto.setLocaleLang=function(value){
	this._localeLang=value;
}

//:method-------------------------

_$proto.addFile=function(sFilePath){
	this._files[this._files.length]=sFilePath;
}
_$proto.addFolder=function(){
	var fso = new ActiveXObject("Scripting.FileSystemObject");
}
_$proto.addClasses=function(sClassFullName){
	var jsre=Engine.runtimeEnvironment;
	this._names[this._names.length]=sClassFullName;
	this._files[this._files.length]="classes/"+sClassFullName.replace(/\./g,"/")
			+Global.get(jsre.getRootHome()+"/config.json","",false,"","JSON")["file-extension"]["class"].compile;
}
_$proto.clearEmpty=function(){
	this._names=[];
	this._files=[];
}
_$proto.build=function(sComment,oInfo,vSepa,sOutput){
	switch(this._mode){
		case 0:
			return this._buildForFile(sComment,vSepa,sOutput);
		case 1:
			return this._buildForClass(sComment,oInfo,sOutput);
		case 2:
			return;
		case 3:
			return this._buildForResource(sComment,oInfo,sOutput);
		case 4:
			return this._buildForProduct(sComment,sOutput);
	}
	return ;
}
_$proto._buildForFile=function(sComment,vSepa,sOutput){
	if(!this._files.length) return;

	var jsre=Engine.runtimeEnvironment;
	var sSepa="",sHeader="",sFooter="";
	var compressor=new Global.Compressor(1);
	var location=jsre.config.getParameter("location");
	if(typeof(vSepa)=="string"){
		sSepa=vSepa;
	}else if(Global.isArray(vSepa)){
		if(vSepa.length==1){
			sSepa=vSepa[0];
		}else if(vSepa.length==2){
			sHeader=vSepa[0],sFooter=vSepa[1];
		}else if(vSepa.length==3){
			sHeader=vSepa[0],sSepa=vSepa[1],sFooter=vSepa[2];
		}
	}
	sOutput=Global.getURIFullPath(jsre.getRootPath().slice(1).replace(/\//g,"\\"),sOutput,"\\");
	var sCode="";
	var oEvent = document.createEventObject();
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var file = fso.CreateTextFile(sOutput, true,false);
	if(!this._isCompress){
		file.WriteLine(sComment);
		if(sHeader) file.WriteLine(sHeader);
		for(var i=0,iLen=this._files.length;i<iLen;i++){
			var sFile=Global.getURIFullPath(jsre.getRootPath(),this._files[i].replace(/\\/g,"/"));
			if(!location.hostname){
				sFile=location.protocol+"//"+sFile;
			}
			var errors=[];
			try{
				oEvent.result = {
					filePath: sFile
				};
				this.fireEvent("_onPackagingFile",oEvent);
				try{
					sCode=Global.get(sFile,"",false,"","Text");
					sCode=Global.obj(sCode).encodeNonAscii();
				}catch(e){
					errors[errors.length]=e;
					sCode="";
				}
				file.Write(sCode);
				if(errors.length==0&&(i<iLen-1)) {
					file.WriteLine(sSepa||"");
					file.WriteLine("");
				}
			}catch(e){
				errors[errors.length]=e;
			}
			if(errors.length) {
				oEvent.result = {
					filePath: sFile,
					errors: errors
				};
				this.fireEvent("_onPackageFileFail",oEvent);
			}
		}
		file.WriteLine("");
		if(sFooter) file.WriteLine(sFooter);
	}else{
		var text="";
		text+=sComment+Global.STR_NewLine+sHeader;
		for(var i=0,iLen=this._files.length;i<iLen;i++){
			var sFile=Global.getURIFullPath(jsre.getRootPath(),this._files[i].replace(/\\/g,"/"));
			if(!location.hostname){
				sFile=location.protocol+"//"+sFile;
			}
			var errors=[];
			try{
				oEvent.result = {
					filePath: sFile
				};
				this.fireEvent("_onPackagingFile",oEvent);
				try{
					sCode=Global.get(sFile,"",false,"","Text");
					sCode=Global.obj(sCode).encodeNonAscii();
				}catch(e){
					errors[errors.length]=e;
					sCode="";
				}
				text+=sCode+Global.STR_NewLine;
				if(errors.length==0&&(i<iLen-1)) {
					text+=(sSepa||"")+Global.STR_NewLine+Global.STR_NewLine;
				}
			}catch(e){
				errors[errors.length]=e;
			}
			if(errors.length) {
				oEvent.result = {
					filePath: sFile,
					errors: errors
				};
				this.fireEvent("_onPackageFileFail",oEvent);
			}
		}
		text+=sFooter;
		file.Write(compressor.compress(text));
	}
	file.Close();

	oEvent.result = {
		output: sOutput
	};
	this.fireEvent("_onCompleted",oEvent);
	return;
}
_$proto._buildForClass=function(sComment,oManifest,sOutput){
	if(!this._files.length) return;

	var jsre=Engine.runtimeEnvironment;
	var compressor=new Global.Compressor(0);
	var location=jsre.config.getParameter("location");
	sOutput=Global.getURIFullPath(jsre.getRootPath().slice(1).replace(/\//g,"\\"),sOutput,"\\");
	var sCode="";
	var sExtName=Global.get(jsre.getRootHome()+"/config.json","",false,"","JSON")["file-extension"]["class"].compile;
	var oEvent = document.createEventObject();
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var file = fso.CreateTextFile(sOutput, true,false);
	file.WriteLine(sComment);
	file.WriteLine("{");
	file.WriteLine("manifest : {");
	var aTemps=[];
	for(var p in oManifest){
		if(oManifest.hasOwnProperty(p)){
			aTemps[aTemps.length]=("\""+p+"\" : \""+oManifest[p]+"\"");
		}
	}
	file.WriteLine(aTemps.join(","));
	file.WriteLine("},");
	file.WriteLine("entity : {");
	for(var i=0,iLen=this._names.length;i<iLen;i++){
		var aFiles=[this._names[i]];
		var aLangs=[""];
		var sFile="",sLang="";
		if(this._localeLang){
			aFiles.insert(this._names[i]+"_"+this._localeLang,0);
			aLangs.insert(this._localeLang,0);
		}
		aFiles=aFiles.map(function(item){
			var sFile=Global.getURIFullPath(jsre.getRootPath(),"classes/"+item.replace(/\./g,"/")+sExtName);
			if(!location.hostname){
				sFile=location.protocol+"//"+sFile;
			}
			return sFile;
		});
		oEvent.result = {
			fullName: this._names[i]
		};
		this.fireEvent("_onPackagingClass",oEvent);
		var errors=[];
		try{
			for(var j=0;j<aFiles.length;j++){
				var sFile1=aFiles[j];
				var sLang1=aLangs[j];
				oEvent.result = {
					fullName: this._names[i],
					filePath: sFile1
				};
				this.fireEvent("_onPackagingClassFile",oEvent);
				try{
					sCode=Global.get(sFile1,"",false,"","Text");
				}catch(e){
					//aFiles1[aFiles1.length]=sFile;
					//errors[errors.length]=e;
					sCode="";
					oEvent.result = {
						fullName: this._names[i],
						filePath: sFile1,
						error: e
					};
					this.fireEvent("_onPackageClassFileFail",oEvent);
				}
				if(sCode!=""){
					sFile=sFile1;
					sLang=sLang1;
					break;
				}
			}
			file.Write("\""+this._names[i]+"\" : "+Global.obj(compressor.compress(sCode)).serialize());
			if(errors.length==0) {
				file.WriteLine((i<iLen-1)?",":"");
			}
		}catch(e){
			errors[errors.length]=e;
		}
		if(sCode!=""){
			oEvent.result = {
				fullName: this._names[i],
				filePath: sFile,
				lang: sLang
			};
			this.fireEvent("_onPackageClassSuccess",oEvent);
		}else if(sCode=="") {
			oEvent.result = {
				fullName: this._names[i],
				errors: errors
			};
			this.fireEvent("_onPackageClassFail",oEvent);
		}else if(errors.length){
			oEvent.result = {
				fullName: this._names[i],
				errors: errors
			};
			this.fireEvent("_onPackageClassError",oEvent);
		}
	}
	file.WriteLine("}");
	file.WriteLine("}");
	file.Close();
	
	oEvent.result = {
		output: sOutput
	};
	this.fireEvent("_onCompleted",oEvent);
	return;
}
_$proto._buildForResource=function(sComment,oManifest,sOutput){
	if(!this._files.length) return;

	var jsre=Engine.runtimeEnvironment;
	var compressor=new Global.Compressor(1);
	var location=jsre.config.getParameter("location");
	sOutput=Global.getURIFullPath(jsre.getRootPath().slice(1).replace(/\//g,"\\"),sOutput,"\\");
	var sCode="";
	var oEvent = document.createEventObject();
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var file = fso.CreateTextFile(sOutput, true,false);
	file.WriteLine(sComment);
	file.WriteLine("_$JSDK3Loader$_&&_$JSDK3Loader$_.loadResource({");
	file.Write("manifest : {");
	var aTemps=[];
	for(var p in oManifest){
		if(oManifest.hasOwnProperty(p)){
			aTemps[aTemps.length]=("\""+p+"\" : \""+oManifest[p]+"\"");
		}
	}
	file.Write(aTemps.join(","));
	file.WriteLine("},");
	file.WriteLine("entity : {");
	for(var i=0,iLen=this._files.length;i<iLen;i++){
		sCode="";
		var sExtName=this._files[i].rightBack(".").toLowerCase();
		var sFile=Global.getURIFullPath(jsre.getRootPath(),this._files[i]);
		var sMinFile=sExtName=="js"?Global.getURIFullPath(jsre.getRootPath(),"min/"+this._files[i]):"";	//2014.8
		if(!location.hostname){
			sFile=location.protocol+"//"+sFile;
			sMinFile=sMinFile?(location.protocol+"//"+sMinFile):"";	//2014.8
		}
		oEvent.result = {
			filePath: this._files[i]
		};
		this.fireEvent("_onPackagingResFile",oEvent);
		var errors=[];
		try{
			if(sMinFile){
				sCode=Global.get(sMinFile,"",false,"","Text");
			}
			if(!sCode){
				sCode=Global.get(sFile,"",false,"","Text");
			}
			//file.Write("\""+this._files[i]+"\" : "+Global.obj(compressor.compress(sCode)).serialize());
			if(!this._isCompress){
				if(sExtName!="json"){
					file.Write("\""+this._files[i]+"\" : "+Global.obj(sCode).serialize());
				}else{
					file.Write("\""+this._files[i]+"\" : "+sCode);
				}
			}else{
				if(sExtName!="json"){
					file.Write("\""+this._files[i]+"\" : "+Global.obj(compressor.compress(sCode)).serialize());
				}else{
					file.Write("\""+this._files[i]+"\" : "+compressor.compress(sCode));
				}
			}
			if(errors.length==0) {
				file.WriteLine((i<iLen-1)?",":"");
			}
		}catch(e){
			errors[errors.length]=e;
		}
		if(sCode!=""){
			oEvent.result = {
				filePath: this._files[i]
			};
			this.fireEvent("_onPackageResFileSuccess",oEvent);
		}else if(sCode=="") {
			oEvent.result = {
				filePath: this._files[i],
				errors: errors
			};
			this.fireEvent("_onPackageResFileFail",oEvent);
		}else if(errors.length){
			oEvent.result = {
				filePath: this._files[i],
				errors: errors
			};
			this.fireEvent("_onPackageResFileError",oEvent);
		}
	}
	file.WriteLine("}");
	file.WriteLine("});");
	file.Close();
	
	oEvent.result = {
		output: sOutput
	};
	this.fireEvent("_onCompleted",oEvent);
	return;
}
_$proto._buildForProduct=function(sComment,sOutput){

}
_$proto.attachEvent=function(sEvent, fpNotify){
	switch(sEvent){
		case "onPackagingFile":
		case "onPackageFileError":
		case "onPackageFileFail":
		case "onPackageFileSuccess":
		case "onPackagingClass":
		case "onPackagingClassFile":
		case "onPackageClassError":
		case "onPackageClassFileFail":
		case "onPackageClassFail":
		case "onPackageClassSuccess":
		case "onPackagingResFile":
		case "onPackageResFileError":
		case "onPackageResFileFail":
		case "onPackageResFileSuccess":
		case "onCompleted":
			this[sEvent]=fpNotify;
			break;
		default:
	}
}

//:event--------------------------------

_$proto._onModeChange=function(){
	this._files=[];
}
_$proto._onPackagingFile=function(oEvent){
	this.fireEvent("onPackagingFile",oEvent);
}
_$proto._onPackageFileError=function(oEvent){
	this.fireEvent("onPackageFileError",oEvent);
}
_$proto._onPackageFileFail=function(oEvent){
	this.fireEvent("onPackageFileFail",oEvent);
}
_$proto._onPackagingClass=function(oEvent){
	this.fireEvent("onPackagingClass",oEvent);
}
_$proto._onPackagingClassFile=function(oEvent){
	this.fireEvent("onPackagingClassFile",oEvent);
}
_$proto._onPackageClassError=function(oEvent){
	this.fireEvent("onPackageClassError",oEvent);
}
_$proto._onPackageClassFileFail=function(oEvent){
	this.fireEvent("onPackageClassFileFail",oEvent);
}
_$proto._onPackageClassFail=function(oEvent){
	this.fireEvent("onPackageClassFail",oEvent);
}
_$proto._onPackageClassSuccess=function(oEvent){
	this.fireEvent("onPackageClassSuccess",oEvent);
}
_$proto._onPackagingResFile=function(oEvent){
	this.fireEvent("onPackagingResFile",oEvent);
}
_$proto._onPackageResFileError=function(oEvent){
	this.fireEvent("onPackageResFileError",oEvent);
}
_$proto._onPackageResFileFail=function(oEvent){
	this.fireEvent("onPackageResFileFail",oEvent);
}
_$proto._onPackageResFileSuccess=function(oEvent){
	this.fireEvent("onPackageResFileSuccess",oEvent);
}
_$proto._onCompleted=function(oEvent){
	this.fireEvent("onCompleted",oEvent);
}
