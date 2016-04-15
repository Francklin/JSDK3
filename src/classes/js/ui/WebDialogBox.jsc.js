/**
 * @file: WebDialogBox.class.js
 * @version: V1.0 Beta
 * @since: JSDK3 V1.6.0
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.10.12
 * @modified: 2011.10.19
 * @mail: francklin.liu@gmail.com 
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.ui");
$import("js.dom.HTML");
$import("js.dom.DOMTemplate");

/**
 * WebDialogBox Class of public
 * @created: 2011.10.12
 * @modified: 2011.10.12
 */
js.ui.WebDialogBox=function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
	this._id="";
	this._left=0;
	this._top=0;
	this._minWidth=100;
	this._minHeight=50;
	this._width=0;
	this._height=0;
	this._driver="";
	this._mode=0;
	this._htmlElement=null;
	this._stylePath="";
	this._styleElement=null;
	this.returnValue;
	this._callBack;
	this._WebDialogBox(sURL,vArguments,oOptions,oFeatures,fnCallBack);
}

var _$class = js.ui.WebDialogBox;

with(_$class){
	$name="WebDialogBox";
	$extends("Object");
	_$class._styleLib={
		"std" : Engine.runtimeEnvironment.getResPath("js.ui")
					+"/WebDialogBox/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?"std.IE.css":"std.css")
	}
	_$class._styleSkin="std";
	_$class._styleElement=null;
	_$class._appStyleElement=null;
	_$class._apps=[];
	_$class._isApped=false;
	_$class.__usedIdCount=0;
	
	//:constructor----------------------------------------
	
	addMethod(false,false,"WebDialogBox",function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
		var _emptyHtml="<div class=\"empty\">no data</div>";
		this._id="DBX"+(++this.getClass().__usedIdCount);
		this._driver=oOptions.driver||"html";
		this._mode=oOptions.mode!=undefined?oOptions.mode:0;
		this._width=oFeatures.width||this._minWidth;
		this._height=oFeatures.height||this._minHeight;
		this._left=oFeatures.left||0;
		this._top=oFeatures.top||0;
		this._stylePath=oFeatures.style||"";
		this._htmlElement=document.body.appendChild(document.createElement("div"));
		this._callBack=fnCallBack;
		this._setStyleSkin(this._stylePath);
		
		with(this._htmlElement){
			if(Browser.Engine.trident) setAttribute("className","WebDialogBox");
			else setAttribute("class","WebDialogBox");
			onclick=function(event){
				event=event||window.event;
				event.cancelBubble=true;
			}
		}
		this._htmlElement.style.left=this._left+"px";
		this._htmlElement.style.top=this._top+"px";
		this._htmlElement.style.width=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?this._width:(this._width-2))+"px";
		this._htmlElement.style.height=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?this._height:(this._height-2))+"px";
		switch(this._driver){
			case "html":
				if(typeof(sURL)!="string"){
					this._htmlElement.innerHTML=_emptyHtml;
				}else if(sURL.charAt(0)=="#"){
					var el=Global.dom(sURL).pop();
					this._htmlElement.innerHTML=el?(el.value||el.text||_emptyHtml):_emptyHtml;
				}else{
					this._htmlElement.innerHTML=sURL;
				}
				break;
			case "page":
				if(typeof(sURL)!="string"){
					this._htmlElement.innerHTML=_emptyHtml;
				}else if(sURL.charAt(0)=="#"){
					//to do...
					this._htmlElement.innerHTML=_emptyHtml;
				}else{
					with(this._htmlElement){
						innerHTML="<iframe frameborder=0 style=\"width:100%;height:100%;\" src=\""+sURL+"\"></iframe>";
					}
				}
				break;
			case "template":
				var tpl,json;
				if(sURL instanceof Global.DOMTemplate){
					tpl=sURL;
				}else if(typeof(sURL)!="string"){
					//none---
				}else if(sURL.charAt(0)=="#"){
					tpl=Global.DOMTemplate.newInstanceWithId(sURL.slice(1));
				}else{
					tpl=Global.DOMTemplate.newInstanceWithUrl(sURL);
				}
				switch(typeof(vArguments)){
					case "string":
						if(vArguments.slice(0,9)=="url(xml):"){
							json=Global.xml2json(Global.get(vArguments.slice(0,9),"",false,"","XML"));
						}else if(vArguments.slice(0,10)=="url(json):"){
							json=Global.get(vArguments.slice(0,10),"",false,"","JSON");
						}else{
							json={};
						}
						break;
					case "object":
						json=vArguments;
						break;
				}
				if(tpl&&json){
					this._htmlElement.innerHTML=tpl.parse(json);
					if(json.init) json.init(this,this._htmlElement);
				}else{
					this._htmlElement.innerHTML=_emptyHtml;
				}
				break;
		}
		this.getClass().fireEvent("_onDialogOpened",this);
	});
	
	//:property-------------------------------------------
	
	addProperty(false,true,"width",{
		get: function(){
			return this._width;
		}
	});
	addProperty(false,true,"height",{
		get: function(){
			return this._height;
		}
	});
	addProperty(false,true,"mode",{
		get: function(){
			return this._mode;
		}
	});
	
	//:method--------------------------------------------
	
	/**
	 * method show(sURL,vArguments,oOptions,oFeatures,fnCallBack)
	 * @para sURL: String, element id or html code.
	 * @para vArguments: Variant. 
		(1)driver="html|page": value: Variant.
		(2)driver="template": value: 
			1)url(xml)
			2)url(json)
			3)xml
			4)json 
	 * @para oOptions: object
	 	{
			driver: "html|page|template"
			mode: 0,modal dialog; 1,modeless dialog
	 	}
	 * @para oFeatures:
	 * @para fnCallBack:
	 */
	addMethod(true,true,"show",function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
		new this(sURL,vArguments,oOptions,oFeatures,fnCallBack);
	});	
	addMethod(true,true,"addStyleSkin",function(sName,sPath){
		this._styleLib[sName]=sPath;
	});
	addMethod(true,true,"setStyleSkin",function(sName){
		this._styleSkin=sName;
		if(!this._styleElement){
			var style = this._styleElement = document.createElement("link"); 
			style.type = "text/css";
			style.rel = "stylesheet";
			style.href = this._styleLib[sName];
			document.getElementsByTagName("HEAD")[0].appendChild(style);
		}else{
			this._styleElement.style.href = this._styleLib[sName];
		}
	});	
	addMethod(true,false,"addAppStyleContainer",function(){
		var style = this._appStyleElement = document.createElement("style"); 
		style.type = "text/css";
		document.getElementsByTagName("HEAD")[0].appendChild(style);
	});
	addMethod(false,false,"setStyleSkin",function(sPath){
		if(!this._styleElement){
			var style = this._styleElement = document.createElement("link"); 
			style.type = "text/css";
			style.rel = "stylesheet";
			style.href = sPath;
			document.getElementsByTagName("HEAD")[0].appendChild(style);
		}else{
			this._styleElement.style.href = sPath;
		}
	});	
	addMethod(false,true,"close",function(){
		if(this._htmlElement) this._htmlElement.parentNode.removeChild(this._htmlElement);
		if(this._styleElement) this._styleElement.parentNode.removeChild(this._styleElement);
		this.fireEvent("_onClose");
	});	
	addMethod(true,true,"fireEvent",function(sEvent,oEventObject){
		if(typeof(this[sEvent])!="function") return;
		try{
			return this[sEvent](oEventObject);
		}catch(e){
			throw new Error(1000,"Event '"+sEvent+"' of object '"+this.getName()+"' has been runned error!\nSource: "
				+e.description);
		}
	});	
	
	//:event----------------------------
	
	addEventListener(true,false,"onDialogOpened",function(oDialog){
		this._apps[this._apps.length]=oDialog;
	});
	addEventListener(true,false,"onDialogClosed",function(oDialog){
		this._apps.removeElement(this._apps.findElement(oDialog));
	});
	addEventListener(false,false,"onClose",function(){
		this._htmlElement=null;
		this._styleElement=null;
		this.getClass().fireEvent("_onDialogClosed",this);
		if(this._callBack) this._callBack(this.returnValue);
		this._callBack=null;
	});
}

