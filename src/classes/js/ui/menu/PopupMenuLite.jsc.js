/**
 * @file: PopupMenuLite.class.js
 * @version: V1.7.6
 * @since: JSDK3 V1.3.0
 * @support: IE6+, IE9+ Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.7.29
 * @modified: 2012.9.27
 * @mail: francklin.liu@gmail.com 
 * @homepage: http://www.tringsoft.com
 * @update: 增加了“onDoAction”事件
 ***************************************/

$package("js.ui.menu");
$import("js.dom.HTML");

/**
 * PopupMenuLite Class of public
 * @para options:
		options:{
			offset: Number,
			minWidth: Number,
			padWidth: Number
		}
 * @created: 2011.7.29
 * @modified: 2011.8.22
 */
js.ui.menu.PopupMenuLite=function(owner,mode,options){
	this._id="";
	this._owner=null;
	this._owner_htmElem=null;
	this._mode=0;	//0,context menu; 1,dropdown menu; 2, position menu;
	this._mainMenu=null;
	this._activeMenu=null;
	this._isHideOnMouseLeave;
	this._offset=0;
	this._minWidth=0;
	this._padWidth=0;
	this._version="1.7.4 Final 20111109";
	this.__usedIdCount=0;
	this._PopupMenuLite(owner,mode,options);
}

var _$class = js.ui.menu.PopupMenuLite;
var _$proto = _$class.prototype;

with(_$class){
	$name="PopupMenuLite";
	$extends("Object");
	_$class._icons={
		checked	: "<span style=\"width:12px;height:12px;display:inline-block;overflow:hidden\"><span style=\"font-family:Marlett;font-size:16px;position:relative;top:-2;left:-1\">a</span></span>",
		radioed	: "<span style=\"width:12px;height:12px;display:inline-block;overflow:hidden\"><span style=\"font-family:Marlett;font-size:9px;position:relative;top:2;\">n</span></span>",
		arrow	: "<span style=\"width:12px;height:12px;display:inline-block;overflow:hidden\"><span style=\"font-family:'wingdings 3';font-size:12px;position:relative;top:;left:\">}</span></span>",
		blank	: "<span style=\"width:12px;height:12px;display:inline-block;overflow:hidden\">&nbsp;</span>"
	}
	_$class._styleLib={
		"classic" : Engine.runtimeEnvironment.getResPath("js.ui.menu")
					+"/PopupMenuLite/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?"Classic.IE.css":"Classic.css"),
		"xp": Engine.runtimeEnvironment.getResPath("js.ui.menu")
					+"/PopupMenuLite/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?"XP.IE.css":"XP.css")
	}
	_$class._styleSkin="classic";
	_$class._styleElement=null;
	_$class._activeAppMenu=null;
	_$class._isInstanced=false;
	
	//:constructor--------------------------------------------

	prototype._PopupMenuLite=function(owner,mode,options){
		var thisObj=this;
		this._owner=owner;
		this._owner_htmElem=owner.nodeName?owner:(owner.getHtmlElement?owner.getHtmlElement():null);
		if(typeof(mode)!="undefined") this._mode=mode;
		this._isHideOnMouseLeave=false;
		this._offset=options&&options.offset||0;
		if(options&&options.minWidth){
			this._minWidth=options.minWidth;			
		}
		if(options&&options.padWidth){
			this._padWidth=options.padWidth;
		}		
		this.getClass().fireEvent("_onAppInstanced",this);
	}

	//:property--------------------------------------------
	
	addProperty(true,true,"activeAppMenu",{
		get : function(){
			return this._activeAppMenu;
		}
	});
	addProperty(false,true,"owner",{
		get : function(){
			return this._owner;
		}
	});
	addProperty(false,true,"ownerHtmlElement",{
		get : function(){
			return this._owner_htmElem;
		}
	});
	addProperty(false,true,"mode",{
		get : function(){
			return this._mode;
		},
		set : function(value){
			this._mode=value;
		}
	});
	addProperty(false,true,"isHideOnMouseLeave",{
		get : function(){
			return this._isHideOnMouseLeave;
		},
		set : function(value){
			this._isHideOnMouseLeave=value;
		}
	});
	addProperty(false,true,"mainMenu",{
		get : function(){
			return this._mainMain;
		}
	});
	addProperty(false,true,"activeMenu",{
		get: function(){
			return this._mainMenu;
		}
	});
	addProperty(false,true,"version",{
		get : function(){
			return this._version;
		}
	});
	addProperty(false,true,"allCount",{
		get : function(){
			if(!this._mainMenu) return 0;
			return this._mainMenu.getLength();
		}
	});
	
	//:method--------------------------------------------
	
	addMethod(false,true,"show",function(event,iWidth,aCoordinate){
		if(this._mainMenu) this._mainMenu.show(event,iWidth,aCoordinate);
	});
	addMethod(false,true,"hide",function(){
		if(this._mainMenu) this._mainMenu.hide();
	});
	addMethod(false,true,"addItem",function(sTitle,vData,fnAction){	
		var Menu=this.getClass().Menu;
		var Item=this.getClass().Item;
		if(!this._mainMenu){
			this._mainMenu=new Menu(this);
		}
		var newItem=new Item(this._mainMenu,sTitle,vData,fnAction);
		this._mainMenu.addItem(newItem);
		return(newItem);
	});
	addMethod(false,true,"getItem",function(index){
		if(!this._mainMenu) return null;
		return this._mainMenu.getItem(index);
	});
	addMethod(false,true,"getItemById",function(id){
		if(!this._mainMenu) return null;
		return this._mainMenu.getItemById(id);
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
	addMethod(true,true,"fireEvent",function(sEvent,oEventObject){
		if(typeof(this[sEvent])!="function") return;
		try{
			return this[sEvent](oEventObject);
		}catch(e){
			throw new Error(1000,"Event '"+sEvent+"' of object '"+this.getName()+"' has been runned error!\nSource: "
				+e.description);
		}
	});
	
	//:event----------------------------------------------
	
	//2013.8.4
	addEventListener(true,false,"onFirstInstanced",function(oAppMenu){
		var thisObj=this;
		if(Global.Browser.Platform.ios){
			document.body.attachEvent("ontouchmove",function(event){
				thisObj.__isMoving=true;
			});		
			document.body.attachEvent("ontouchend",function(event){
				var data=event.result||event.returnValue;
				if(!thisObj.__isMoving) {
					if(typeof(data)=="object"&&data.activeApp==thisObj){
						return;
					}else{
						thisObj.fireEvent("_onAppMenuBlur");
					}
				}
				thisObj.__isMoving=false;
			});
		}else if(document.body.addEventListener){	//2013.8.4 for IE9+ and other
			document.body.addEventListener("onclick",function(event){
				event=event||window.event;
				var data=event.result||event.returnValue;
				if(typeof(data)=="object"&&data.activeApp==thisObj){
					return;
				}else{
					thisObj.fireEvent("_onAppMenuBlur");
				}
			});
		}else{	//for IE8-
			document.body.attachEvent("onclick",function(event){
				event=event||window.event;
				var data=event.result||event.returnValue;
				if(typeof(data)=="object"&&data.activeApp==thisObj){
					return;
				}else{
					thisObj.fireEvent("_onAppMenuBlur");
				}
			});
		}
	});
	addEventListener(true,false,"onAppInstanced",function(oAppMenu){
		if(this._isInstanced) return;
		this.fireEvent("_onFirstInstanced",oAppMenu);
	});
	addEventListener(true,false,"onAppMenuBeforeShow",function(oAppMenu){
		if(this._activeAppMenu) this._activeAppMenu.hide();
	});
	addEventListener(true,false,"onAppMenuShowed",function(oAppMenu){
		this._activeAppMenu=oAppMenu;
	});
	addEventListener(true,false,"onAppMenuHid",function(oAppMenu){
		this._activeAppMenu=null;
	});
	addEventListener(true,false,"onAppMenuBlur",function(){
		var lastAppMenu=this._activeAppMenu;
		if(this._activeAppMenu) this._activeAppMenu.hide();
		this.fireEvent("onAppMenuBlur",lastAppMenu);
	});
	addEventListener(false,false,"onMenuBeforeShow",function(oMenu){
		this.getClass().fireEvent("_onAppMenuBeforeShow",this);
	});
	addEventListener(false,false,"onMenuShowed",function(oMenu){
		this.getClass().fireEvent("_onAppMenuShowed",this);
	});
	addEventListener(false,false,"onMenuHid",function(oMenu){
		this.getClass().fireEvent("_onAppMenuHid",this);
	});
	addEventListener(false,false,"onDoAction",function(oMenu){
		this.fireEvent("onDoAction",oMenu.getLastDoneItem());
	});
}

//================================

/**
 * Menu Class of private
 * @created: 2011.7.29
 * @modified: 2011.7.29
 */
_$class.Menu=function(owner){
	this._id="";
	this._unid="";
	this._owner=null;
	this._parentApp=null;
	this._htmlElement=null;
	this._htmlContainer=null;
	this._items=[];
	this._useIcon=false;
	this._loaded=false;
	this._activeItem=null;
	this._lastDoneItem=null;
	this._Menu(owner);
}

with(_$class.Menu){
	$name="Menu";
	$extends(Object);

	//:constructor--------------------------------------------
	
	prototype._Menu=function(owner){
		this._owner=owner;
		this._parentApp=this._owner;
	}
	
	//:property--------------------------------------------
	
	/** 属性(保护)：获取菜单面板的左坐标
	 *
	**/
	prototype.getLeft=function(){
		return this._x;
	}
	/** 属性(保护)：获取菜单面板的顶坐标
	 *
	**/
	prototype.getTop=function(){
		return this._y;
	}
	/** 属性(保护)：获取菜单面板的右坐标
	 *
	**/
	prototype.getRight=function(){
		return this.getLeft()+this.getWidth()-1;
	}
	/** 属性(保护)：获取菜单面板的底坐标
	 *
	**/
	prototype.getBottom=function(){
		return this.getTop()+this.getHeight()-1;
	}
	/** 属性(保护)：获取菜单面板的宽度
	 *
	**/
	prototype.getWidth=function(){
		return this._htmlElement.offsetWidth;
	}
	/** 属性(保护)：获取菜单面板的高度
	 *
	**/
	prototype.getHeight=function(){
		return this._htmlElement.offsetHeight;
	}
	/** 属性(公共)：获取拥有菜单项的个数
	 *
	**/
	prototype.getLength=function(){
		return this._items.length;
	}
	/** 属性(保护)：获取顶级拥有者
	 *
	**/
	prototype.getParentApp=function(){
		return this._parentApp;
	}
	/** 属性(保护)：获取拥有者
	 *
	**/
	prototype.getOwner=function(){
		return this._owner;
	}
	/** 属性(保护)：判断本菜单是否已显示
	 *
	**/
	prototype.getDisplayed=function(){
		if(!this._htmlElement) return false;
		return this._htmlElement.style.display=="";
	}
	/** 属性(保护)：获取当前激活项
	 *
	**/
	prototype.getActiveItem=function(){
		return this._activeItem;
	}
	/**
	 * @created: 2011.8.22
	 */
	prototype.getLastDoneItem=function(){
		return this._lastDoneItem;
	}
	/** 属性(保护)：获取当前菜单是否是活动菜单
	 *
	**/
	prototype.getIsActive=function(){
		if(this.getParentApp()._activeMenu==this) return true;
		else return false;
	}
	prototype.getUseIcon=function(){
		return this._useIcon;
	}
	
	//:method--------------------------------------------

	/** 方法(保护)：增加菜单项
	 *
	**/
	prototype.addItem=function(newItem){
		this._items[this._items.length]=newItem;
		newItem._parentMenu=this;
		
		if(this._loaded){
			this.load(newItem);
		}
		
		return(newItem);
	}	
	prototype.getItem=function(index){
		if(index<0||index>=this._items.length) return null;
		return this._items[index];
	}
	prototype.getItemById=function(id){
		for(var i=0;i<this._items.length;i++){
			var item=this.getItem(i);
			if(item.getId()==id)
				return(item);
		}
		return(null);
	}
	prototype.getItemByTitle=function(title){
		for(var i=0;i<this.getLength();i++){
			var item=this.getItem(i);
			if(item.getTitle()==title)
				return(item);
		}
		return(null);
	}
	prototype.getFirstItem=function(){
		return(this.getItem(0));
	}
	prototype.getNextItem=function(item){
		for(var i=0;i<this.getLength();i++){
			if(this.getItem(i).getId()==item.getId()){
				if(i==this.getLength()-1){
					return(null);
				}else{
					return(this.getItem(i+1));
				}				
			}
		}
		throw("错误！\"PopupMenuLite.Menu.getNextItem(item)\"输入的菜单项不在本菜单中。");
		return(null);
	}
	prototype.getPrevItem=function(item){
		for(var i=0;i<this.getLength();i++){
			if(this.getItem(i).getId()==item.getId()){
				if(i==0){
					return(null);
				}else{
					return(this.getItem(i-1));
				}				
			}
		}
		throw("错误！\"PopupMenuLite.Menu.getPrevItem(item)\"输入的菜单项不在本菜单中。");
		return(null);
	}
	prototype.getLastItem=function(){
		return(this.getItem(this.getLength()-1));
	}
	prototype.getAllItems=function(){
		return this._items;
	}	
	prototype.show=function(event,iWidth,aCoordinate){
		var thisObj=this;
		var iLeft=0,iTop=0,iHeight=0;
		var aItems=this._getItemsToActualShow();
		this._lastDoneItem=null;
		
		event.returnValue=event.result={
			activeApp: this.getParentApp().getClass()
		}
		this.fireEvent("_onBeforeShow");
		if(this._items.length==0) return;
		if(!this._loaded) this._load();
		if(aCoordinate){
			iLeft=aCoordinate[0];
			iTop=aCoordinate[1];
		}else{
			switch(this.getParentApp().getMode()){
				case 0:		//context menu
					iLeft=event.pageX||(event.clientX + document.body.scrollLeft - document.body.clientLeft);
					iTop=event.pageY||(event.clientY + document.body.scrollTop - document.body.clientTop);
					iWidth=Math.max(this._getMinWidth(aItems),iWidth||0);
					break;
				case 1:		//dropdown menu
					iLeft=HTML.getLeftOnDoc(this.getParentApp()._owner_htmElem);
					iTop=HTML.getBottomOnDoc(this.getParentApp()._owner_htmElem)+1;
					iWidth=Math.max(this._getMinWidth(aItems),iWidth||this.getParentApp()._owner_htmElem.offsetWidth);
					break;
			}
			iLeft+=this._parentApp._offset;
			iWidth=Math.max(iWidth,this._parentApp._minWidth);
			iWidth+=this._parentApp._padWidth;			
		}
		iHeight=this._getMinHeight(aItems);
		this._htmlElement.style.left=iLeft+"px";
		this._htmlElement.style.top=iTop+"px";
		this._htmlElement.style.width=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?iWidth:(iWidth-2))+"px";
		this._htmlElement.style.height=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?iHeight:(iHeight-2))+"px";
		this._htmlElement.style.display="";
		this._htmlContainer.style.width=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?(iWidth-2):(iWidth-6))+"px";
		this._htmlContainer.style.height=(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?(iHeight-2):(iHeight-6))+"px";
		this._showSepLine();
		this.fireEvent("_onShow");
	}
	prototype._showSepLine=function(){
		for(var i=0,iLen=this._items.length-1;i<iLen;i++){
			if(this._items[i].getTitle()=="-"){
				this._items[i]._htmlElement.style.display="block";
			}
		}
		for(var i=Math.max(0,this._items.length-1);i<this._items.length;i++){
			if(this._items[i].getTitle()=="-"){
				this._items[i]._htmlElement.style.display="none";
			}
		}
	}
	prototype.hide=function(){
		if(!this.getDisplayed()) return;
		if(this._htmlElement) this._htmlElement.style.display ="none";
		this.fireEvent("_onHide");
	}
	addMethod(false,true,"getVisibleCount",function(){
		var count=0;
		for(var i=0;i<this._items.length;i++){
			if(!this._items[i].getIsHidden()){
				count++;
			}
		}
		return count;
	});
	/** 方法(私有)：生成用于显示的Web元素
	 *
	**/
	prototype._toHtmlElement=function(){
		var thisObj=this;
		if(this._htmlElement) return;
		this._htmlElement=document.body.appendChild(document.createElement("div"));
		with(this._htmlElement){
			className="OutsideBox PopupMenu";
			setAttribute("class","OutsideBox PopupMenu");
			with(this._htmlContainer=appendChild(document.createElement("div"))){
				className="InsideBox PopupMenuContent";
				setAttribute("class","InsideBox PopupMenuContent");
				id="content";
			}
			//2012.2.2
			if(Browser.Engine.trident&&Browser.Engine.version==3){	//for IE6
				appendChild(document.createElement("<iframe frameborder=0 scrolling=no src=\"about:blank\""
					+" style=\"width:100%;height:100%;z-index:-1;left:0;top:0;position:absolute;\""
					+" onload=\"this.contentWindow.document.body.style.backgroundColor="
					+" this.parentNode.currentStyle.backgroundColor!='transparent'?"
					+" this.parentNode.currentStyle.backgroundColor:this.parentNode.firstChild.currentStyle.backgroundColor;\"></iframe>"));
			}
			onselectstart=function(event){ return false; }
			oncontextmenu=function(event){ return false; }
			onmouseout=function(event){
				event=event||window.event;
				var toElement=event.toElement;
				if(HTML.contains(this,toElement)) return;
				thisObj.fireEvent("_onMouseLeave");
			}
			onclick=function(event){
				event=event||window.event;
				event.cancelBubble=true;
			}
		}
	}
	/** 方法(私有)：装载菜单
	 * 类型：
	 * 功能：装载菜单
	 * 描述：在第一次显示的时候，生成HTML元素,并且只能装载一次,用于动态菜单
	 * 返回：true,装载成功;false,装载失败
	 * 公私：私有
	**/
	prototype._load=function(item){ 
		if(!this._htmlElement) this._toHtmlElement();
		if(item==null){
			if(this._loaded) return;
			for(var i=0; i<this._items.length; i++){
				item=this._items[i];
				item._toHtmlElement();
				item.refresh();
			}
			this._loaded = true; 
		}else{
			item._toHtmlElement();
		} 
	}
	/**
	 * 获取要实际显示的菜单项
	 * @since: V1.5.0
	 * @created: 2011.8.17
	 */
	prototype._getItemsToActualShow=function(){
		var flagLastType=-1;	//-1: none; 0, normal item; 1, sep item;
		var items=[];
		for(var i=0,iLen=this._items.length;i<iLen;i++){
			var item=this._items[i];
			if(item.getIsHidden()) continue;
			if(item.getTitle()!="-"){
				flagLastType=0;
			}else if(i>0&&i<(iLen-1)&&flagLastType==0){
				flagLastType=1;
			}else{
				continue;
			}
			items[items.length]=item;
		}
		if(flagLastType==1) items.pop();
		return items;
	}
	prototype._getMinWidth=function(aItems){
		var width=0;
		for(var i=0;i<aItems.length;i++){
			var sTitle=Object(aItems[i].getTitle());
			var length=sTitle.getAsciiCount()+sTitle.getNonAsciiCount()*2;
			if(length>width) width=length;
		}
		width=3+14+2+width*6+2+12+3;
		
		return width;
	}
	prototype._getMinHeight=function(aItems){
		var height=6;
		for(var i=0;i<aItems.length;i++){
			if(aItems[i].getTitle()=="-") height+=6;
			else height+=18;
		}
		return height;
	}
	
	//:event--------------------------------
	
	addEventListener(false,false,"onBeforeShow",function(){
		this.getParentApp().fireEvent("_onMenuBeforeShow",this);
	});
	addEventListener(false,false,"onShow",function(){
		this.getParentApp().fireEvent("_onMenuShowed",this);
	});
	addEventListener(false,false,"onHide",function(){
		this.getParentApp().fireEvent("_onMenuHid",this);
	});
	addEventListener(false,false,"onMouseLeave",function(){
		if(this.getParentApp().getIsHideOnMouseLeave()){
			this.getParentApp().hide();
		}
	});
	addEventListener(false,false,"onDoAction",function(oItem){
		this._lastDoneItem=oItem;
		this._parentApp.fireEvent("_onDoAction",this);
	});
}

//==========================================================================================

/**
 * Item Class of public
 * @created: 2011.7.29
 * @modified: 2011.7.29
 */
_$class.Item=function(parentMenu,sTitle,vData,fnAction){
	this._id="";
	this._unid="";
	this._title="";
	this._action=new Function();
	this._enabled=true;
	this._isHidden=false;
	this._parentMenu=null;
	this._parentApp=null;
	this._subMenu=null;	
	this._data;
	this._htmlElement=null;	
	this._Item(parentMenu,sTitle,vData,fnAction);
}
with(_$class.Item){
	$name="Item";
	$extends(Object);
	
	//:constructor----------------------------------------
	
	prototype._Item=function(parentMenu,sTitle,vData,fnAction){
		this._parentMenu=parentMenu;
		this._parentApp=this._parentMenu.getParentApp();
		this._unid="I"+(++this._parentApp.__usedIdCount);
		this._title=sTitle;
		this._data=vData;
		if(typeof(fnAction)=="function"){
			this._action=fnAction;
		}
	}
	
	//:property--------------------------------------------

	prototype.getId=function(){
		return this._id||this._unid;
	}	
	prototype.setId=function(value){
		this._id=value;
	}
	prototype.getLeft=function(){
		return this.getParentMenu().getLeft()+3;
	}
	prototype.getTop=function(){
		var retValue=this.getParentMenu().getTop()+3;
		for(var i=0,index=this.getIndex();i<index;i++){
			retValue+=this.getParentMenu().getItem(i).getHeight();
		}
		return retValue;
	}
	prototype.getWidth=function(){
		return this._htmlElement.clientWidth;
	}
	prototype.getHeight=function(){
		return this._htmlElement.clientHeight;
	}
	prototype.getTitle=function(){
		return this._title;
	}
	prototype.getEnabled=function(){
		return this._enabled;
	}
	prototype.setEnabled=function(value){
		this._enabled=value;
	}
	prototype.getIsHidden=function(){
		return this._isHidden;
	}
	prototype.setIsHidden=function(value){
		this._isHidden=value;
	}
	prototype.getParent=function(){
		if(!this._parentMenu) return(null);	
		return(this._parentMenu.getOwner());
	}
	prototype.getParentMenu=function(){
		return this._parentMenu;
	}
	prototype.getParentApp=function(){
		return this._parentApp;
	}
	prototype.getIndex=function(){
		for(var i=0,length=this.getParentMenu().getLength();i<length;i++){
			var item=this.getParentMenu().getItem(i);
			if(this==item) return i;
		}
	}
	prototype.getPosition=function(){
		return (this.getIndex()+1+"");
	}
	prototype.getHasChildren=function(){
		if(this._subMenu==null) return false;
		if(this._subMenu.getLength()==0) return false;
		return true;
	}
	prototype.getData=function(){
		return this._data;
	}
	prototype.setData=function(value){
		this._data=value;
	}
	
	//:method--------------------------------------------	
	
	prototype.getNextSiblingItem=function(){
		return this.getParentMenu().getNextItem(this);
	}
	prototype.getPrevSiblingItem=function(){
		return this.getParentMenu().getPrevItem(this);
	}
	prototype.refresh=function(){
		if(!this._htmlElement) return;
		this._htmlElement.style.color=this._enabled?"":"gray";
		if(this.getParentMenu().getUseIcon()){
			this._htmlElement.all['icon'].style.width="16px";
		}
	}
	prototype.activate=function(){
		this._htmlElement.fireEvent("_onActivate");
	}
	prototype._toHtmlElement=function(){
		if(this._htmlElement) return;
		if(this._title!="-"){
			this._toHtmlElementForStd();
		}else{
			this._toHtmlElementForSep();
		}
	}
	prototype._toHtmlElementForStd=function(){
		var thisObj=this;
		if(this._isHidden) return;
		with(this._htmlElement=this.getParentMenu()._htmlContainer.appendChild(
			document.createElement("div"))){
			className="PopupMenuItem";
			setAttribute("class","PopupMenuItem");
			with(appendChild(document.createElement("span"))){
				id="icon";
				innerHTML=this.getParentApp().getClass()._icons["blank"];
			}
			with(appendChild(document.createElement("span"))){
				id="title";
				innerHTML="<span>"+this._title+"</span>";
			}
			with(appendChild(document.createElement("span"))){
				id="sub";
				innerHTML=this.getParentApp().getClass()._icons["blank"];
			}
			if(Global.Browser.Platform.ios){
				ontouchmove=function(event){
					thisObj.__isMoving=true;
				}
				ontouchend=function(){
					if(!thisObj.__isMoving) {
						this.onclick();
					}
					thisObj.__isMoving=false;
				}
			}else{
				onmouseover=function(event){
					event=event||window.event;
					try{
						if(document.selection){	//IE ,Opera
							if(document.selection.empty){
								document.selection.empty();	//IE
							}else{	//Opera
								document.selection = null;
							}
						}else if(window.getSelection){	//FF,Safari
							window.getSelection().removeAllRanges();
						}
					}catch(e){}
					thisObj.fireEvent("_onActivate",event);
				}
				onmouseout=function(event){
					event=event||window.event;
					thisObj.fireEvent("_onDeactivate",event);
				}
			}
			onclick=function(event){
				event=event||window.event;
				thisObj.fireEvent("_onDoAction");
			}
			ondblclick=function(){return false;}
			onselectstart=function(){return false;}
		}
	}
	prototype._toHtmlElementForSep=function(){
		with(this._htmlElement=this.getParentMenu()._htmlContainer.appendChild(
			document.createElement("div"))){
			className="PopupMenuSepLine";
			setAttribute("class","PopupMenuSepLine");
		}
	}
	
	//:event--------------------------------------------	
	
	prototype._onActivate=function(oEvent){
		with(this._htmlElement){
			className="PopupMenuItem ActivePopupMenuItem";
			setAttribute("class","PopupMenuItem ActivePopupMenuItem");
		}
		this.getParentMenu()._activeItem=this;
	}
	prototype._onDeactivate=function(oEvent){
		with(this._htmlElement){
			className="PopupMenuItem";
			setAttribute("class","PopupMenuItem");
		}
		this.getParentMenu()._activeItem=null;
	}
	prototype._onDoAction=function(oEvent){
		if(!this._enabled) return;
		if(this._title==""||this._title=="-") return;
		this.getParentApp()._mainMenu.hide();
		this._action(this.getParentApp().getOwner());
		this._parentMenu.fireEvent("_onDoAction",this);
	}
}

