/**
 * @file: PopupDialog.class.js
 * @version: V1.9.4
 * @description: popup dialog
 * @since: JSDK3 V1.6.0
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.9.22
 * @modified: 2013.6.18
 * @update: 
		2013.6.03 added properpty 'autoHide'
		2013.2.28 added align mode for position
		2013.2.28 fixed popup issue in IE9 standard mode
		2012.7.20 fixed no repaint style in IE7 and IE8.
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.ui");
$import("js.dom.HTML");
$import("js.dom.DOMTemplate");

/**
 * PopupDialog Class of public
 * @created: 2011.9.22
 * @modified: 2011.9.22-2013.6.3
 */
js.ui.PopupDialog=function(){}

var _$class = js.ui.PopupDialog;

with(_$class){
	$name="PopupDialog";
	$extends("Object");
	_$class._styleLib={
		"std" : function(){
			var path=Engine.runtimeEnvironment.getResPath("js.ui")+"/PopupDialog";
			if(!Browser.Engine.trident){
				return path+"/std.css";
			}else if(Browser.Engine.version<=3){
				return path+"/std.IE6.css";
			}else if(document.compatMode=="CSS1Compat"){
				return path+"/std.css";
			}else{
				return path+"/std.IE.css";
			}
		}()
	}
	_$class._styleSkin="";
	_$class._defaultStyleSkin="std";
	_$class._styleElement=null;
	_$class._isApped=false;
	_$class._isHidden=true;
	_$class._isAutoHide=true;
	_$class._htmlElement=null;
	_$class._outerElement=null;
	_$class._overlayElement=null;
	_$class._bodyStyleElement=null;
	_$class._callBack=null;
	_$class.returnValue;
	_$class.DISPLAY_MODE_CONTEXT=0;
	_$class.DISPLAY_MODE_DROPDOWN=1;
	_$class.DISPLAY_MODE_POSITION=2;
	_$class.DISPLAY_ALIGN_LEFT=0;
	_$class.DISPLAY_ALIGN_CENTER=1;
	_$class.DISPLAY_ALIGN_RIGHT=2;
	_$class.DISPLAY_ALIGN_UP=3;
	_$class.DISPLAY_ALIGN_MIDDLE=4;
	_$class.DISPLAY_ALIGN_BOTTOM=5;
	
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
			{
				event: EventObject,
				driver: String,
				mode: [Number],
				autoHide: [Boolean],default is true, only for display mode as position.
			}
	 * @para oFeatures:
			{
				width: [Number],
				height: [Number]
			}
	 * @para fnCallBack:
	 */
	addMethod(true,true,"show",function(sURL,vArguments,oOptions,oFeatures,fnCallBack){
		if(!this._isHidden) this.hide();
		this._isHidden=false;
		var _this=this;
		var _owner=oOptions.owner;
		var _owner_htmElem=_owner.nodeName?_owner:(_owner.getHtmlElement?_owner.getHtmlElement():null);
		var _win_width=document.compatMode!="CSS1Compat"?document.body.clientWidth:document.documentElement.clientWidth;
		var _win_height=document.compatMode!="CSS1Compat"?document.body.clientHeight:document.documentElement.clientHeight;
		var _win_left=document.compatMode!="CSS1Compat"?document.body.scrollLeft
				:!Global.Browser.Engine.webkit?document.documentElement.scrollLeft
				:document.body.scrollLeft;
		var _win_top=document.compatMode!="CSS1Compat"?document.body.scrollTop
				:!Global.Browser.Engine.webkit?document.documentElement.scrollTop
				:document.body.scrollTop;
		var _event=oOptions.event;
		var _driver=oOptions.driver||"html";								//html,page,template
		var _mode=oOptions.mode!=undefined?oOptions.mode:(_owner?1:0);		//0,context dialog; 1,dropdown dialog; 2, position dialog;
		var _autoHide=this._isAutoHide=_mode!=2||oOptions.autoHide==undefined||oOptions.autoHide;		//2013.6.3
		var _minWidth=oFeatures.minWidth||100;
		var _minHeight=oFeatures.minHeight||50;
		var _width=oFeatures.width||_minWidth;
		var _height=oFeatures.height||_minHeight;
		var _align=oFeatures.align!=undefined?oFeatures.align:this.DISPLAY_ALIGN_CENTER;
		var _left=oFeatures.left!=undefined?oFeatures.left:(_mode==2?-1:0);
		var _top=oFeatures.top!=undefined?oFeatures.top:(_mode==2?-1:0);
		var _right=oFeatures.right!=undefined?oFeatures.right:(_mode==2?-1:0);
		var _bottom=oFeatures.bottom!=undefined?oFeatures.bottom:(_mode==2?-1:0);
		var _emptyHtml="<div class=\"empty\">no data</div>";
		this._htmlElement=document.body.appendChild(document.createElement("div"));
		this._callBack=fnCallBack;	
		if(!this._styleSkin) this.setStyleSkin(this._defaultStyleSkin);	
		if(oFeatures.style) this.setBodyStyle(oFeatures.style);
		switch(_mode){
			case 0:		//context dialog
				_left=_event.pageX||(_event.clientX + document.body.scrollLeft - document.body.clientLeft);
				_top=_event.pageY||(_event.clientY + document.body.scrollTop - document.body.clientTop);
				break;
			case 1:		//dropdown dialog
				var _owner_left=HTML.getLeftOnDoc(_owner_htmElem);
				var _owner_top=HTML.getTopOnDoc(_owner_htmElem);
				var _owner_width=_owner_htmElem.offsetWidth;
				var _owner_height=_owner_htmElem.offsetHeight;
				var _owner_leftWidth=_owner_left-_win_left+1;
				var _owner_rightWidth=(_win_left+_win_width-1)-(_owner_left+_owner_width-1)+1;
				var _owner_topHeight=_owner_top-_win_top+1;
				var _owner_bottomHeight=(_win_top+_win_height-1)-(_owner_top+_owner_height-1)+1;
				_width=Math.max(_minWidth,oFeatures.width||_owner_htmElem.offsetWidth);
				if(_width>_win_width){
					_left=_win_left;							//靠近窗口左边在右边显示
				}else if(_width<=_owner_width+_owner_rightWidth){
					_left=_owner_left;							//按目标元素的左边对齐在右边显示
				}else if(_width<=_owner_width+_owner_leftWidth){
					_left=_owner_left+_owner_width-1-_width;	//按目标元素的右边对齐在左边显示
				}else{
					_left=_win_left+_win_width-_width;		//靠近窗口右边在左边显示
				}
				if(_height>_win_height){
					_top=_win_top;								//靠近窗口顶部在下面显示
				}else if(_height<=_owner_bottomHeight){
					_top=_owner_top+_owner_height;				//靠近目标元素底部在下面显示
				}else if(_height<=_owner_topHeight){
					_top=_owner_top-_height;					//靠近目标元素顶部在上面显示
				}else{
					_top=_win_top+_win_height-_height;		//靠近窗口底部在上面显示
				}
				break;
			case 2:		//position dialog;
				this._overlayElement=this._htmlElement;
				this._outerElement=document.body.appendChild(document.createElement("div"));
				this._htmlElement=this._outerElement.appendChild(document.createElement("div"));
				with(this._overlayElement){
					className="PopupDialogOverlay";
					setAttribute("class","PopupDialogOverlay");
					//2013.6.14
					if(Global.Browser.Engine.trident&&Global.Browser.Engine.version==3){	//for IE6
						innerHTML="<iframe frameborder=0 scrolling=no src=\"about:blank\""
							+" style=\"width:100%;height:100%;z-index:-1;left:0;top:0;position:absolute;\""
							+" onload=\"this.contentWindow.document.body.style.backgroundColor="
							+" this.parentNode.currentStyle.backgroundColor!='transparent'?"
							+" this.parentNode.currentStyle.backgroundColor:this.parentNode.firstChild.currentStyle.backgroundColor;\"></iframe>";
					}
				}
				with(this._outerElement){
					className="PopupDialogOuter";
					setAttribute("class","PopupDialogOuter");
				}
				if(_left!=-1&&_right!=-1){
					_left=-1;
				}
				if(_top!=-1&&_bottom!=-1){
					_top=-1;
				}
				if((_left!=-1||_right!=-1)&&(_top!=-1||_bottom!=-1)){	//设置了所有坐标
					//none
				}else if(_left!=-1||_right!=-1){
					switch(_align){
						case 3:
							_top=0;
							break;
						case 4:
							_top=Math.foolr((_win_height-_height)/2);
							break;
						case 5:
							_bottom=0;
							break;
						default:
							_top=Math.floor((_win_height-_height)/2);
							break;
					}
				}else if(_top!=-1||_bottom!=-1){
					switch(_align){
						case 0:
							_left=0;
							break;
						case 1:
							_left=Math.floor((_win_width-_width)/2);
							break;
						case 2:
							_right=0;
							break;
					}
				}else{
					switch(_align){
						case 0:		//left
							_left=0;
							_top=Math.floor((_win_height-_height)/2);
							break;
						case 1:		//center
							_left=Math.floor((_win_width-_width)/2);
							_top=Math.floor((_win_height-_height)/2);
							break;
						case 2:		//right
							_right=0;
							_top=Math.floor((_win_height-_height)/2);
							break;
						case 3:		//up
							_left=Math.floor((_win_width-_width)/2);
							_top=0;
							break;
						case 4:		//middle
							_left=Math.floor((_win_width-_width)/2);
							_top=Math.floor((_win_height-_height)/2);
							break;
						case 5:		//bottom
							_left=Math.floor((_win_width-_width)/2);
							_bottom=0;
							break;
					}
					
				}
				break;
		}
		with(this._htmlElement){
			className="PopupDialog";
			setAttribute("class","PopupDialog");
			onclick=function(event){
				event=event||window.event;
				event.cancelBubble=true;
			}
		}
		if(_left!=-1) this._htmlElement.style.left=_left+"px";
		if(_top!=-1) this._htmlElement.style.top=_top+"px";
		if(_right!=-1) this._htmlElement.style.right=_right+"px";
		if(_bottom!=-1) this._htmlElement.style.bottom=_bottom+"px";
		this._htmlElement.style.width=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?_width:(_width-2))+"px";
		this._htmlElement.style.height=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?_height:(_height-2))+"px";
		this._htmlElement.style.zIndex=100;
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
					this._htmlElement.innerHTML=tpl.parse(json,null);
					if(json.init) json.init(this,this._htmlElement);
				}else{
					this._htmlElement.innerHTML=_emptyHtml;
				}
				break;
		}
		//2013.6.14
		if(Browser.Engine.trident&&Browser.Engine.version==3){	//for IE6
			this._htmlElement.appendChild(document.createElement("<iframe frameborder=0 scrolling=no src=\"about:blank\""
				+" style=\"width:100%;height:100%;z-index:-1;left:0;top:0;position:absolute;\""
				+" onload=\"this.contentWindow.document.body.style.backgroundColor="
				+" this.parentNode.currentStyle.backgroundColor!='transparent'?"
				+" this.parentNode.currentStyle.backgroundColor:this.parentNode.firstChild.currentStyle.backgroundColor;\"></iframe>"));
		}
		//event------------
		if(_event){
			_event.cancelBubble=true;
			_event.returnValue=_event.result={
				activeApp: _this
			}
		}
		if(!this._isApped){
			document.body.attachEvent("onclick",function(event){
				event=event||window.event;
				var data=event.result||event.returnValue;
				if(typeof(data)=="object"&&data.activeApp==_this){
					return;
				}else if(!_this._isHidden&&_this._isAutoHide){
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
		if(this._outerElement) this._outerElement.parentNode.removeChild(this._outerElement);
		if(this._overlayElement) this._overlayElement.parentNode.removeChild(this._overlayElement);
		if(this._bodyStyleElement) this._bodyStyleElement.parentNode.removeChild(this._bodyStyleElement);
		if(this._callBack) this._callBack(this.returnValue);
		this._isHidden=true;
		this._htmlElement=null;
		this._outerElement=null;
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
		var _this=this;
		var style = this._bodyStyleElement = document.createElement("link"); 
		style.type = "text/css";
		style.rel = "stylesheet";
		style.href = sPath;
		style.onload=function(){
			_this._htmlElement.style.zoom=1;
		}
		document.getElementsByTagName("HEAD")[0].appendChild(style);
	});	
}

