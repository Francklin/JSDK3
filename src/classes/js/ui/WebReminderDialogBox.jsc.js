/**
 * @file: WebReminderDialogBox.class.js
 * @version: V0.9 Beta
 * @since: JSDK3 V1.6.0
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.10.19
 * @modified: 2012.6.21-2014.5.21
 * @mail: francklin.liu@gmail.com 
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.ui");
$import("js.dom.HTML");
$import("js.dom.DOMTemplate");

/**
 * WebReminderDialogBox Class of public
 * @created: 2011.10.12
 * @modified: 2011.10.12
 */
js.ui.WebReminderDialogBox=function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
	this._id="";
	this._left=0;
	this._top=0;
	this._minWidth=100;
	this._minHeight=50;
	this._width=0;
	this._height=0;
	this._indexInSames=0;	//index in same type dialog of current page client area.
	this._driver="";
	this._mode=0;
	this._htmlElement=null;
	this._stylePath="";
	this._styleElement=null;
	this._callBack;
	this.returnValue;
	this.__timer;
	this.__startEffect;
	this.__stayInterval=0;
	this.__stayEffect;
	this.__exitEffect;
	this.__isAllowExit=true;
	this.__isForceExit=false;
	this.__isExiting=false;
	this._WebReminderDialogBox(sURL,vArguments,oOptions,oFeatures,fnCallBack);
}

var _$class = js.ui.WebReminderDialogBox;

with(_$class){
	$name="WebReminderDialogBox";
	$extends("Object");
	_$class.MAX_ZINDEX=1000;
	_$class._styleLib={
		"std" : Engine.runtimeEnvironment.getResPath("js.ui")
					+"/WebReminderDialogBox/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?"std.IE.css":"std.css")
	}
	_$class._styleSkin="std";
	_$class._styleElement=null;
	_$class._appStyleElement=null;
	_$class._apps=[];
	_$class._isApped=false;
	_$class.__usedIdCount=0;
	
	//:constructor----------------------------------------
	
	addMethod(false,false,"WebReminderDialogBox",function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
		var _this=this;
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
		this.__startEffect=oOptions.startEffect;
		this.__stayInterval=oOptions.stayInterval||0;
		this.__stayEffect={};
		this.__exitEffect=oOptions.exitEffect;
		this._setStyleSkin(this._stylePath);
		
		for(var i=0,objs=this.getClass()._apps;i<objs.length;i++){
			var obj=objs[i];
			if(obj==this){
				break;
			}else if(obj.__startEffect.enabled&&obj.__startEffect.from==this.__startEffect.from){
				this._indexInSames++;
			}
		}
		with(this._htmlElement){
			className="WebDialogBox";
			setAttribute("class","WebDialogBox");
			onclick=function(event){
				event=event||window.event;
				event.cancelBubble=true;
			}
			onmouseover=function(){
				if(_this.__isForceExit) return;
				_this.__isAllowExit=false;
				this.style.zIndex=_this.getClass().MAX_ZINDEX;	
				if(_this.__isExiting) clearInterval(_this._timer);
				return false;
			}
			onmouseout=function(){
				if(_this.__isAllowExit) return;
				_this.__isAllowExit=true;
				this.style.zIndex="";
				if(_this.__isExiting) _this._playExitingEffect();
				return false;
			}
		}
		if(this.__startEffect&&this.__startEffect.enabled){
			this._htmlElement.style.display="none";
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
		if(this.__startEffect&&this.__startEffect.enabled){
			this._playStartingEffect();
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
			startEffect: {
				enabled: true|false
				delay: delay time length, unit is timeout
				from: left|top|right|bottom
				speed: many ms per times, default as 20
				step: move many pixel per times, default as 5
				proc: process function
			}
			stayInterval: 0, no exit, default;
			exitEffect: {
				enabled: true|false
				apply: auto|manual|all
				delay:
				to: left|top|right|bottom
				speed:
				step:
				proc:
			}
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
		this.__isForceExit=true;
		this.fireEvent("_onBeforeClose");
	});	
	addMethod(false,false,"playStartingEffect",function(){
		var _this=this;
		var _clientWidth=document.compatMode!="CSS1Compat"?document.body.clientWidth:document.documentElement.clientWidth;
		var _clientHeight=document.compatMode!="CSS1Compat"?document.body.clientHeight:document.documentElement.clientHeight;
		var _scrollLeft=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
		var _scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		this.__isExiting=false;
		if(this.__startEffect&&this.__startEffect.enabled){
			this._htmlElement.style.display="";
			switch(this.__startEffect.from){
				case "left":
					this._htmlElement.style.left=-this._width+document.body.scrollLeft;
					break;
				case "top":
					this._htmlElement.style.top=-this._height+document.body.scrollTop;
					break;
				case "right":
					this._htmlElement.style.left=document.body.clientWidth+document.body.scrollLeft;
					break;
				case "left,bottom":
					//to do...
					this._htmlElement.style.top=document.body.clientHeight+document.body.scrollTop;
					break;
				case "right,bottom":
					this._htmlElement.style.left=_clientWidth+_scrollLeft-this._width+"px";
					this._htmlElement.style.top=_clientHeight+_scrollTop-this._indexInSames*this._height+"px";
					break;
			}
			this.__startEffect.remainSteps=Math.ceil((this._indexInSames+1)*this._height/this.__startEffect.step);
			this.__startEffect.proc=function(){
				try{
					switch(_this.__startEffect.from){
						case "right,bottom": 
							_this._htmlElement.style.top=Math.max(parseInt(_this._htmlElement.style.top)-_this.__startEffect.step,
										_clientHeight+_scrollTop-(_this._indexInSames+1)*_this._height)+"px";
							if(--_this.__startEffect.remainSteps<=0){
								clearInterval(_this._timer);
								_this._playStayingEffect();
							}
							break;
					}
				}catch(e){
					clearInterval(_this._timer);
				}
					
			}
		}
		this._timer=setInterval(this.__startEffect.proc,this.__startEffect.speed);
	});
	addMethod(false,false,"playStayingEffect",function(){
		if(!this.__stayInterval) return;
		var _this=this;
		var _clientWidth=document.compatMode!="CSS1Compat"?document.body.clientWidth:document.documentElement.clientWidth;
		var _clientHeight=document.compatMode!="CSS1Compat"?document.body.clientHeight:document.documentElement.clientHeight;
		this.__isExiting=false;
		this.__stayEffect.speed=10;
		this.__stayEffect.step=10;
		this.__stayEffect.remainSteps=Math.ceil(this.__stayInterval/this.__stayEffect.step);
		this.__stayEffect.proc=function(){
			try{
				var _scrollLeft=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
				var _scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
				switch(_this.__startEffect.from){
					case "right,bottom":
						_this._htmlElement.style.left=_clientWidth+_scrollLeft-_this._width+"px";
						_this._htmlElement.style.top=_clientHeight+_scrollTop-(_this._indexInSames+1)*_this._height+"px";
						break;
				}
				if(_this.__isAllowExit&&_this.__exitEffect&&_this.__exitEffect.enabled
					&&--_this.__stayEffect.remainSteps<=0){
					clearInterval(_this._timer);
					_this._playExitingEffect();
				}
			}catch(e){
				clearInterval(_this._timer);
			}
		}
		this._timer=setInterval(this.__stayEffect.proc,this.__stayEffect.speed);
	});
	addMethod(false,false,"playExitingEffect",function(){
		if(!this.__exitEffect||!this.__exitEffect.enabled) return;
		var _this=this;
		var _clientWidth=document.compatMode!="CSS1Compat"?document.body.clientWidth:document.documentElement.clientWidth;
		var _clientHeight=document.compatMode!="CSS1Compat"?document.body.clientHeight:document.documentElement.clientHeight;
		var _scrollLeft=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);
		var _scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		clearInterval(this._timer);
		this.__isAllowExit=true;
		this.__isExiting=true;
		this.__exitEffect.remainSteps=Math.ceil((this._indexInSames+1)*this._height/this.__exitEffect.step);
		this.__exitEffect.proc=function(){
			try{
				switch(_this.__exitEffect.to){
					case "right,bottom":
						_this._htmlElement.style.top=Math.min(parseInt(_this._htmlElement.style.top)+_this.__exitEffect.step,
								_clientHeight+_scrollTop)+"px";
						if(--_this.__exitEffect.remainSteps<=0){
							_this.__isExiting=false;
							clearInterval(_this._timer);
							_this.fireEvent("_onClose");
						}
						break;
				}
			}catch(e){
				clearInterval(_this._timer);
			}
		}
		this._timer=setInterval(this.__exitEffect.proc,this.__exitEffect.speed);
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
	addEventListener(false,false,"onBeforeClose",function(){
		if(this.__exitEffect&&this.__exitEffect.enabled){
			this._playExitingEffect();
		}else{
			this.fireEvent("_onClose");
		}
	});
	addEventListener(false,false,"onClose",function(){
		this.__isExiting=false;
		clearInterval(this._timer);
		if(this._htmlElement) this._htmlElement.parentNode.removeChild(this._htmlElement);
		if(this._styleElement) this._styleElement.parentNode.removeChild(this._styleElement);
		this._htmlElement=null;
		this._styleElement=null;
		this.getClass().fireEvent("_onDialogClosed",this);
		if(this._callBack) this._callBack(this.returnValue);
		this._callBack=null;
	});
}

