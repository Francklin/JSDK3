/**
 * @file: WebDialogBox.class.js
 * @version: V1.0.1 Alpha
 * @since: JSDK3 V1.6.0
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.10.12
 * @modified: 2012.6.21-2013.12.18
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
js.ui.WebDialogBox=function(){}

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
	_$class._isApped=false;
	_$class._isHidden=true;
	_$class._htmlElement=null;
	_$class._bodyStyleElement=null;
	_$class._callBack=null;
	_$class.returnValue;
	
	//:property-------------------------------------------
	
	addProperty(true,true,"htmlElement",{
		get: function(){
			return this._htmlElement;
		}
	});
	addProperty(true,true,"isHidden",{
		get: function(){
			return this._isHidden;
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
	 * @para oOptions:
	 * @para oFeatures:
	 * @para fnCallBack:
	 */
	addMethod(true,true,"show",function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
		if(!this._isHidden) this.hide();
		this._isHidden=false;
		var _this=this;
		var _owner=oOptions.owner;
		var _owner_htmElem=_owner.nodeName?_owner:(_owner.getHtmlElement?_owner.getHtmlElement():null);
		var _event=oOptions.event;
		var _driver=oOptions.driver||"html";								//html,page,template
		var _mode=oOptions.mode!=undefined?oOptions.mode:(_owner?1:0);		//0,context dialog; 1,dropdown dialog; 2, position dialog;
		var _minWidth=100;
		var _minHeight=50;
		var _width=oFeatures.width||_minWidth;
		var _height=oFeatures.height||_minHeight;
		var _left=oFeatures.left||0;
		var _top=oFeatures.top||0;
		var _emptyHtml="<div class=\"empty\">no data</div>";
		this._htmlElement=document.body.appendChild(document.createElement("div"));
		this._callBack=fnCallBack;
		
		switch(_mode){
			case 0:		//context dialog
				_left=_event.pageX||(_event.clientX + document.body.scrollLeft - document.body.clientLeft);
				_top=_event.pageY||(_event.clientY + document.body.scrollTop - document.body.clientTop);
				break;
			case 1:		//dropdown dialog
				_left=HTML.getLeftOnDoc(_owner_htmElem);
				_top=HTML.getBottomOnDoc(_owner_htmElem)+1;
				_width=oFeatures.width||Math.max(_minWidth,_owner_htmElem.offsetWidth);
				break;
			case 2:		//position dialog;
				break;
		}
		with(this._htmlElement){
			className="WebDialogBox";
			setAttribute("class","WebDialogBox");
			onclick=function(event){
				event=event||window.event;
				event.cancelBubble=true;
			}
		}
		this._htmlElement.style.left=_left+"px";
		this._htmlElement.style.top=_top+"px";
		this._htmlElement.style.width=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?_width:(_width-2))+"px";
		this._htmlElement.style.height=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?_height:(_height-2))+"px";
		switch(_driver){
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
		if(oFeatures.style) this.setBodyStyle(oFeatures.style);
		//event------------
		_event.returnValue=_event.result={
			activeApp: _this
		}
		if(!this._isApped){
			document.body.attachEvent("onclick",function(event){
				event=event||window.event;
				var data=event.result||event.returnValue;
				if(typeof(data)=="object"&&data.activeApp==_this){
					return;
				}else if(!_this._isHidden){
					if(data) data.activeApp=null;
					_this.hide();
				}
			});
			this._isApped=true;
		}
	});	
	addMethod(true,true,"hide",function(){
		if(this._isHidden) return;
		if(this._htmlElement) this._htmlElement.parentNode.removeChild(this._htmlElement);
		if(this._bodyStyleElement) this._bodyStyleElement.parentNode.removeChild(this._bodyStyleElement);
		if(this._callBack) this._callBack(this.returnValue);
		this._isHidden=true;
		this._htmlElement=null;
		this._bodyStyleElement=null;
		this._callBack=null;
		this.returnValue=undefined;
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
	addMethod(true,true,"setBodyStyle",function(sPath){
		var style = this._bodyStyleElement = document.createElement("link"); 
		style.type = "text/css";
		style.rel = "stylesheet";
		style.href = sPath;
		document.getElementsByTagName("HEAD")[0].appendChild(style);
	});		
}

