/**
 * Outline Class
 * @file: Outline.class.js
 * @description: 
 * @origVersion: Alone V2.0
 * @version: V1.4.4
 * @since: JSDK3 V1.7.6
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @origCreated: 2005.12
 * @origModified: 2008.10.21
 * @created: 2012.2.8
 * @modified: 2013.10.12-2014.4.14
 * @update: 
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 * @copyright: (C) 2005-2014 Tringsoft Studio.
 **********************************************/

$package("js.ui.menu");

var _$path=Engine.runtimeEnvironment.getResPath("js.ui.menu")+"/Outline";

/**
 * Outline Class of public
 * @modified: 2012.2.8
 */
js.ui.menu.Outline=function(htmlContainer,width,height){
	this._parent=null;
	this._id="O"+Math.round(Math.random()*1000);
	this.style={
		outline		: {
			width			: "100%",
			height			: "100%"
		}
	};
	this._icon={}
	this._level=0;
	this._pathSeparator="\\";
	this._target="_self";
	this._useCheckbox=false;
	this._useIcon=false;
	this._useScroll=false;
	this._isIgnoreError=false;			//是否忽略一般错误
	this._isAllowTitleNonunique=true;	//是否允许标题不唯一(同菜单下)
	this._isAutoCreateItem=false;		//是否自动创建大纲项(在没有此大纲菜单项时自动创建)
	this._isSelectMode=false;			//是否选择模式
	this._isLoadChildrenFromOutside=false;
	this._htmlElement=null;
	this._mainmenu=null;
	this._activeItem=null;	
	this._lastActiveItem=null;
	this._timer=0;						//激活大纲项后延时500毫秒打开链接或执行函数
	this._delayDoInterval=350;			//当通过上下方向键激活大纲项时延时500毫秒执行
	this.__usedIDCount=0;
	this.__styleNamePrefix="jk";		//样式类名的前缀，应该继承从当前JS框架的浏览器模式的配置环境，建议为JSDK3的缩写"jk"
	this._Outline(htmlContainer,width,height);
}
var _$class = js.ui.menu.Outline;
var _$proto = _$class.prototype;

with(_$class){
	$name="Outline";
	$extends("Object");
	_$class._version="1.4.4";
	_$class.KeyValue={
		UP		:38,
		DOWN	:40,
		LEFT	:37,
		RIGHT	:39,
		PAGEUP	:33,
		PAGEDOWN:34,
		INSERT	:45,
		DELETE	:46,
		ENTER	:13,
		SPACE	:32,
		F1		:112,
		F2		:113,
		PLUS	:107,
		MINUS	:109
	}
	_$class._icon= {
		expand		: "<img align=absmiddle src=\""+_$path+"/icons/plus.gif\">",
		collapse	: "<img align=absmiddle src=\""+_$path+"/icons/minus.gif\">",
		leaf		: "<img align=absmiddle src=\""+_$path+"/icons/blank.gif\">",
		unchecked	: "<img align=absmiddle src=\""+_$path+"/icons/select1.gif\">",
		partChecked	: "<img align=absmiddle src=\""+_$path+"/icons/select2.gif\">",
		checked		: "<img align=absmiddle src=\""+_$path+"/icons/select3.gif\">",
		folder		: "<img align=absmiddle src=\""+_$path+"/icons/folder.gif\">",
		openedFolder: "<img align=absmiddle src=\""+_$path+"/icons/folderopen.gif\">",
		file		: "<img align=absmiddle src=\""+_$path+"/icons/file.gif\">"
	};	
	_$class._cache={iconCache:{}};
	_$class._styleLib={
		"std" : _$path+"/"+(!Browser.Engine.trident?"Outline.css":
					(document.compatMode=="CSS1Compat"?"Outline.css":
						(Browser.Engine.version==3?"Outline.IE6.css":"Outline.IE.css")))
	}
	_$class._styleSkin="";
	_$class._defaultStyleSkin="std";
	_$class._styleElement=null;
	_$class._isInstanced=false;
	
	//:constructor--------------------------------------
	
	prototype._Outline=function(htmlContainer,width,height){
		this.getClass().fireEvent("_onBeforeInstance",this);
		if(htmlContainer==null){
			this._htmlElement=document.createElement("div");
		}else if(htmlContainer==""){
			var scripts=document.getElementsByTagName("script");
			var elScript=scripts[scripts.length-1];
			this._htmlElement=elScript.insertAdjacentElement("beforeBegin",document.createElement("div"));
		}else{
			this._htmlElement=htmlContainer.appendChild(document.createElement("div"));
		}
		this.style.outline.width=width==null?"100%":width;
		this.style.outline.height=height==null?"":height;
		this._toHtmlElement();
		this.getClass().fireEvent("_onAppInstanced",this);
	}
	
	//:property-------------------------------------------
	
	addProperty(false,true,"id",{
		"get": function(){
			return this._id;
		}
	});
	addProperty(false,true,"parent",{
		"get": function(){
			return this._parent;
		}
	});
	addProperty(false,true,"level",{
		"get": function(){
			return this._level;
		}
	});
	addProperty(false,true,"pathSeparator",{
		"get": function(){
			return this._pathSeparator;
		},
		"set": function(value){
			this._pathSeparator=value;
		}
	});
	addProperty(false,true,"target",{
		"get": function(){
			return this._target;
		},
		"set": function(value){
			this._target=value;
		}
	});
	addProperty(false,true,"hasChildren",{
		"get": function(){
			return (this._mainmenu&&this._mainmenu._items.length);
		}
	});
	addProperty(false,true,"length",{
		"get": function(){
			if(!this.getHasChildren()) return(0);
			var length=0;
			for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
				length+=1+this._mainmenu.getItem(i).getLength();
			}
			return(length);
		}
	});
	addProperty(false,true,"application",{
		"get": function(){
			return this;
		}
	});
	addProperty(false,true,"activeItem",{
		"get": function(){
			return(this._activeItem);
		}
	});
	addProperty(false,true,"useCheckbox",{
		"get": function(){
			return this._useCheckbox;
		},
		"set": function(value){
			this._useCheckbox=value;
		}
	});
	addProperty(false,true,"useIcon",{
		"get": function(){
			return this._useIcon;
		},
		"set": function(value){
			this._useIcon=value;
		}
	});
	addProperty(false,true,"useScroll",{
		"get": function(){
			return this._useScroll;
		},
		"set": function(value){
			this._useScroll=value;
			this._htmlElement.style.overflow=value?"auto":"";
		}
	});	
	addProperty(false,true,"isIgnoreError",{
		"get": function(){
			return this._isIgnoreError;
		},
		"set": function(value){
			this._isIgnoreError=value;
		}
	});
	addProperty(false,true,"children",{
		"get": function(){
			if(!this.getHasChildren()) return null;
			return this._mainmenu;
		}
	});
	/**
	 * 是否允许标题重复(同菜单下)(注释：非常影响速度)
	 */
	addProperty(false,true,"isAllowTitleNonunique",{
		"get": function(){
			return this._isAllowTitleNonunique;
		},
		"set": function(value){
			this._isAllowTitleNonunique=value;
		}	
	});
	addProperty(false,true,"isAutoCreateItem",{
		"get": function(){
			return this._isAutoCreateItem;
		},
		"set": function(value){
			this._isAutoCreateItem=value;
		}	
	});
	addProperty(false,true,"isSelectMode",{
		"get": function(){
			return this._isSelectMode;
		},
		"set": function(value){
			this._isSelectMode=value;
		}
	});
	addProperty(false,true,"width",{
		"get": function(){
			return this._htmlElement.style.pixelWidth;
		}
	});
	addProperty(false,true,"height",{
		"get": function(){
			return this._htmlElement.style.pixelHeight;
		}
	});
	addProperty(false,true,"contentWidth",{
		"get": function(){
			return this._htmlElement.scrollWidth;
		}
	});
	addProperty(false,true,"contentHeight",{
		"get": function(){
			return this._htmlElement.scrollHeight;
		}
	});
	addProperty(false,true,"htmlElement",{
		"get": function(){
			return this._htmlElement;
		}
	});

	//:method-------------------------------------------

	addMethod(true,true,"getIcon",function(iconName){
		var icon=this._icon[iconName];
		if(typeof(icon)=="object"){
			return icon.cloneNode(true);
		}else{
			var span=document.createElement("SPAN");
			span.innerHTML=icon;
			icon=span.$firstChild||span.firstChild;
			this._icon[iconName]=icon;
			return icon.cloneNode(true);
		}
	});
	addMethod(true,true,"setIcon",function(iconName,src,isInnerIcon){
		var _path=Engine.runtimeEnvironment.getResPath("js.ui.menu")+"/Outline";
		this._icon[iconName]="<img align=absmiddle src=\""+(isInnerIcon?(_path+"/icons/"):"")+src+"\">";
	});	
	prototype.getIcon=function(iconName){
		var icon=this._icon[iconName];
		if(typeof(icon)=="object"){
			return icon.cloneNode(true);
		}else if(typeof(icon)=="undefined"){
			this._icon[iconName]=icon=this.getClass().getIcon(iconName);
			return icon.cloneNode(true);
		}else {
			var span=document.createElement("span");
			span.innerHTML=icon;
			icon=span.$firstChild||span.firstChild;
			this._icon[iconName]=icon;
			return icon.cloneNode(true);			
		}
	}
	prototype.setIcon=function(iconName,src,isInnerIcon){
		var _path=Engine.runtimeEnvironment.getResPath("js.ui.menu")+"/Outline";
		this._icon[iconName]="<img align=absmiddle src=\""+(isInnerIcon?(_path+"/icons/"):"")+src+"\">";
	}
	prototype.about=function(){
		alert("Outline for JSDK3 V1.4.2 build 20131012\n\n"
			+"作者：刘登高 \n"
			+"邮箱：francklin.liu@gmail.com \n"
			+"主页：http://www.tringsoft.com \n"
			+"浏览器支持：IE6+/IE9+/Firefox5+/Chrome14+/Safari5+/Opera11+");
	}
	prototype.addItem=function(fullPath,value,icon,openedIcon,url,target,funGetChildrenData){
		var iPos=fullPath.indexOf(this.getPathSeparator());	
		var OutlineItem=this.getClass().OutlineItem;
		var OutlineItemsMenu=this.getClass().OutlineItemsMenu;
		if(iPos<0){
			var sTitle=fullPath;
			var newItem=new OutlineItem(this,sTitle,value,icon,openedIcon,url,target,funGetChildrenData);
			if(this._mainmenu){
				this._mainmenu.addItem(newItem);
			}else{
				this._mainmenu=new OutlineItemsMenu(this,true);
				this._htmlElement.appendChild(this._mainmenu.toHtmlElement());
				this._mainmenu.addItem(newItem);
			}
			return(newItem);
		}else{
			var sTitle=fullPath.slice(0,iPos);
			var item=this.getItemByPath(sTitle); 
			if(!item){
				if(this._isAutoCreateItem){
					item=this.addItem(sTitle);
					if(!item) return(null);
				}else{
					return(null);
				}
			}
			var newPath=fullPath.slice(iPos+this.getPathSeparator().length);
			return(item.addItem(newPath,value,icon,openedIcon,url,target,funGetChildrenData)); 
		}	
		return(null);
	}
	prototype.getItem=function(index){
		if(!this.getHasChildren()) return(null);
		if(index<0) return(null);
		for(var item=this.getFirstItem(),i=0;item;item=this.getNextItem(item),i++){
			if(i==index) return(item);
		}
		return(null);		
	}
	/********** 方法(公共)：获取大纲项(通过ID) **********************\
	| 功能：获取大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getItemById=function(id){
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i);
			if(item.getId()==id) return(item);
			else if(item=item.getItemById(id)){
				return(item);
			}		
		}
		return(null);
	
	}
	/********** 方法(公共)：获取大纲项(通过路径) ********************\
	| 功能：获取大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getItemByPath=function(fullPath){
		if(!this.getHasChildren()) return(null);
		var titles=fullPath.split(this.getPathSeparator());
		var item=this.getChildren().getItemByTitle(titles[0]);
		if(titles.length==1) return(item);
		var newPath=titles.slice(1).join(this.getPathSeparator());
		return(item.getItemByPath(newPath));
	}
	/********** 方法(公共)：获取大纲项(通过位置编号) ********************\
	| 功能：获取大纲项
	| 描述：位置编号的形式为“X.X.(...).X.(...).X”这样的字符串,例如：“1.4.3.2”
	| 公私属性：公有
	\********************************************************************/ 
	prototype.getItemByPosition=function(strPosition){
	
	}
	/********** 方法(公共)：获取所有大纲项 **********************\
	| 功能：获取所有大纲项
	| 公私属性：公有
	\*************************************************/
	prototype.getAllItems=function(){
		var items=[];
		if(!this.getHasChildren()) return(items);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i);
			items=items.concat(item,item.getAllItems());
		}
		return items;
	}	
	/********** 方法(公共)：获取第一个大纲项 ************************\
	| 功能：获取第一个大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getFirstItem=function(){
		if(!this.getHasChildren()) return(null);
		return(this._mainmenu.getFirstItem()); 
	}
	/********** 方法(公共)：获取下一个大纲项 ************************\
	| 功能：获取下一个大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getNextItem=function(prevItem){
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i); 
			if(item.getId()==prevItem.getId()){
				if(item.getHasChildren()) return(item.getFirstItem());
				else return(this._mainmenu.getItem(i+1)); 
			}else if(item.contains(prevItem)){
				item=item.getNextItem(prevItem); 
				if(item) return(item);
				else return(this._mainmenu.getItem(i+1)); 
			} 
		}
		return(null);
	}
	/********** 方法(公共)：获取上一个大纲项 ************************\
	| 功能：获取上一个大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getPrevItem=function(nextItem){
		if(!this.hasChildren) return(null);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i); 
			if(item.getId()==nextItem.getId()){
				item=this._mainmenu.getItem(i-1);
				if(!item) return(null);
				else if(!item.getHasChildren()) return(item);
				else return(item.getLastItem());
			}else if(item.contains(nextItem)){
				item=item.getPrevItem(nextItem); 
				if(item) return(item);
				else return(this._mainmenu.getItem(i-1));
			} 
		}
		return(null); 
	}
	/********** 方法(公共)：获取最后一个大纲项 **********************\
	| 功能：获取最后一个大纲项
	| 公私属性：公有
	\*************************************************/
	prototype.getLastItem=function(){
		if(!this.getHasChildren()) return(null);
		var item=this._mainmenu.getLastItem();
		if(!item.getHasChildren()) return(item);
		else return(item.getLastItem());
	}	
 	prototype.getAllListedItem=function(){
		var items=[];
		if(!this.getHasChildren()) return(items);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i);
			items=items.concat(item,item.getAllListedItems());
		}
		return items;	
	}
	prototype.getFirstListedItem=function(){
		if(!this.getHasChildren()) return(null);
		return(this._mainmenu.getFirstItem());
	}
	prototype.getNextListedItem=function(curListedItem){
		if(!curListedItem) curListedItem=this._activeItem;
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i);	
			if(item.getId()==curListedItem.getId()){
				if(item.getExpanded()) return(item.getFirstItem());
				else return(this._mainmenu.getItem(i+1)); 
			}else if(item.getExpanded()&&item.contains(curListedItem)){
				item=item.getNextListedItem(curListedItem);		
				if(item) return item;
				else return(this._mainmenu.getItem(i+1));
			} 
		}
		return(null); 
	}
	prototype.getPrevListedItem=function(curListedItem){
		if(!curListedItem) curListedItem=this._activeItem;
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			var item=this._mainmenu.getItem(i); 
			if(item.getId()==curListedItem.getId()){
				item=this._mainmenu.getItem(i-1);
				if(!item) return(null);
				else if(item.getExpanded()) return(item.getLastListedItem());
				else return(item);
			}else if(item.getExpanded()&&item.contains(curListedItem)){
				var tmpItem=item.getPrevListedItem(curListedItem); 
				if(tmpItem) return tmpItem;
				else return(item);
			} 
		}
		return(null);	
	}
	prototype.getLastListedItem=function(){
		if(!this.getHasChildren()) return(null);
		var item=this._mainmenu.getLastItem();
		if(!item.getExpanded()) return(item);
		else{
			return(item.getLastListedItem());
		}
	}
	prototype.getAllVisibleItems=function(){
	
	}
	/********** 方法(公共)：获取可见区第一个大纲项 **********************\
	| 功能：获取可见区第一个大纲项
	| 公私属性：公有
	\*************************************************/
	prototype.getFirstVisibleItem=function(){
		if(!this.getHasChildren()) return(null);
		for(var item=this.getFirstListedItem();item;item=this.getNextListedItem(item)){
			if(item.getVisible()) return(item);
		}
		return null;
	}
	/********** 方法(公共)：获取可见区下一个大纲项 **********************\
	| 功能：获取可见区下一个大纲项
	| 公私属性：公有
	\*************************************************/	
	prototype.getNextVisibleItem=function(curVisibleItem){
		if(!this.getHasChildren()) return(null);
		for(var item=curVisibleItem;item=this.getNextListedItem(item);){
			if(item.getVisible()) return(item);
		}
		return null;
	}
	/********** 方法(公共)：获取可见区上一个大纲项 **********************\
	| 功能：获取可见区上一个大纲项
	| 公私属性：公有
	\*************************************************/		
	prototype.getPrevVisibleItem=function(curVisibleItem){
		if(!this.getHasChildren()) return(null);
		for(var item=curVisibleItem;item=this.getPrevListedItem(item);){
			if(item.getVisible()) return(item);
		}
		return null;
	}
	/********** 方法(公共)：获取可见区最后一个大纲项 **********************\
	| 功能：获取可见区最后一个大纲项
	| 公私属性：公有
	\*************************************************/	
	prototype.getLastVisibleItem=function(){
		if(!this.getHasChildren()) return(null);
		for(var item=this.getLastListedItem();item;item=this.getPrevListedItem(item)){
			if(item.getVisible()) return(item);
		}
		return null;
	}
	/********** 方法(公共)：激活大纲项 ******************************\
	| 功能：激活大纲项
	| 调用形式：
	| 	（1）activateItem(item)
	| 	（2）activateItem(id)
	\*************************************************/
	prototype.getFullPath=function(){
		return "";
	}
	prototype.activateItem=function(id){
	  var item=this.getItemById(id);
	  if(!item) return;
	  //if(this._activeItem) this._activeItem.activate(false);
	  //this._activeItem=item;
	  //this._activeItem.activate(true);
	  item.activate();
	  return(item);
	}
	prototype.expandItem=function(id,isExpand,isAll){	
		if(!this.getHasChildren()) return(false); 
		var item;
		if(!id){
		  for(var i=0,iLength=this._mainmenu.getLength();i<iLength;i++){
			this._mainmenu.getItem(i).expand(isExpand,isAll); 
		  }
		}else{ 
		  item=this.getItemById(id); 
		  if(!item) return(false); 
		  item.expand(isExpand,isAll);
		}
	}	
	prototype.expandAll=function(isExpand){
		if(isExpand==null)
			this.expandItem("",false,true); 
		else if(isExpand==true)
			this.expandItem("",true,true); 
		else if(isExpand==false)
			this.expandItem("",false,true); 
	}
	prototype.removeAll=function(){
		this._htmlElement.innerHTML="";
		this._items=[];
		this._activeItem=null;
		this._mainmenu=null;
	}
	prototype.searchItem=function(keyWord){
	
	}
	prototype.refresh=function(){ 
		if(!this._htmlElement) return; 
		this._htmlElement.style.color=this.style.color;
		this._htmlElement.style.backgroundColor=this.style.backgroundColor;
		if(!this.getHasChildren()) return;
		for(var i=0,length=this.getChildren().getLength();i<length;i++){ 
			this.getChildren().getItem(i).refresh();
		}
	}
	prototype._toHtmlElement=function(){
		with(this._htmlElement){
			id=this._id;
			className=this.__styleNamePrefix+"-outline";
			style.width=this.style.outline.width;
			style.height=this.style.outline.height;
			//设置事件------------------
			onactivate=function(){			
				if(this._activeItem&&document.activeElement.id!="link"){ 
					//this.activateItem(this._activeItem.getId()); 
				} 
			}
			ondeactivate=function(){  
				if(this._activeItem){ 
					//this._activeItem.setColor(1); 
				}
			}
			onkeydown=function(){ 
				this.srcObject._onKeyDown(event);
				return false;
			}
			oncontextmenu=function(){ return(false); }
			onselectstart=function(){ return(false); }
		}
		this._htmlElement.setAttribute("srcObject",this);		//for IE
		this._htmlElement.srcObject=this;						//for Firefox
	}
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
	
	//:event-------------------------------------------
	
	addEventListener(true,false,"onReady",function(){
		if(!this._styleSkin) this.setStyleSkin(this._defaultStyleSkin);
		this._isInstanced=true;
	});
	addEventListener(true,false,"onBeforeInstance",function(){
		if(this._isInstanced) return;
		this.fireEvent("_onReady");
	});	
	addEventListener(true,false,"onAppInstanced",function(){
		
	});
	addEventListener(false,false,"onKeyDown",function(event){
		with(this.getClass().KeyValue){
			switch(event.keyCode){
				case UP:	//激活上一大纲项，并滚动到可见区
					if(!this.getLength()) return;
					if(!this.getActiveItem()) return;
					var item=this.getPrevListedItem()||this.getLastListedItem();
					item.setActive();
					item.fireEvent("_onDoAction",this._delayDoInterval);
					break;
				case DOWN:	//激活下一大纲项，并滚动到可见区
					if(!this.getLength()) return;
					if(!this.getActiveItem()) return;
					var item=this.getNextListedItem()||this.getFirstListedItem();
					item.setActive();
					item.fireEvent("_onDoAction",this._delayDoInterval);
					break;
				case LEFT:	//向左拖动滚动条
					this.getHtmlElement().scrollLeft-=16;
					break;
				case RIGHT:	//向右拖动滚动条
					this.getHtmlElement().scrollLeft+=16;
					break;
				case PAGEUP:	//向上翻页
					this.pageUp();
					break;
				case PAGEDOWN:	//向下翻页
					this.pageDown();
					break;
				case INSERT	:	//在当前激活项前插入新大纲项
					if(!this.getActiveItem()) return;
					if(event.shiftKey){	//在当前激活项后插入新大纲项
						window.status="insertAfter";return;
						this.insertItem(this.getActiveItem(),1);
					}else{		//在当前激活项前插入新大纲项
						window.status="insert";return;
						this.insertItem();
					}
					break;
				case DELETE	:	//删除当前激活项
					if(!this.getActiveItem()) return;
					//this.removeItem();
					break;
				case ENTER	:
					if(!this.getActiveItem()) return;
					this.getActiveItem().enter();
					break;
				case SPACE	:	//对当前激活项进行复选
					if(!this.getActiveItem()) return;
					if(this.getUseCheckbox()){
						this.getActiveItem().select();
					}
					break;
				case F1		:	//获取帮助
					//待续
					break;
				case F2		:	//重命名当前激活项
					if(!this.getActiveItem()) return;
					//待续
					break;
				case PLUS:		//展开当前激活项
					if(!this.getActiveItem()) return;
					if(!this.getActiveItem().getExpanded()){
						this.getActiveItem().expand();
					}
					break;
				case MINUS:		//折叠当前激活项
					if(!this.getActiveItem()) return;
					if(this.getActiveItem().getExpanded()){
						this.getActiveItem().expand(false);
					}
					break; 
			}
		}
	});
	addEventListener(false,false,"onActivatedItem",function(oItem){
		this.fireEvent("onActivatedItem",oItem);
	});
	addEventListener(false,false,"onRemovedChildItem",function(oItem){
		if(this._mainmenu) this._mainmenu.removeItem(oItem);
	});
}

/**
 * OutlineItem Class of private
 * @invoke: OutlineItem(outline[,title[,url[,target]]])
 * 　（1）OutlineItem(outline);
 * 　（2）OutlineItem(outline,title);
 * 　（3）OutlineItem(outline,title,value);
 * 　（4）OutlineItem(outline,title,value,icon);
 * 　（5）OutlineItem(outline,title,value,icon,openedIcon);
 * 　（6）OutlineItem(outline,title,value,icon,openedIcon,url);
 * 　（7）OutlineItem(outline,title,value,icon,openedIcon,url,target);
 * 　（8）OutlineItem(outline,title,value,icon,url);
 * 　（9）OutlineItem(outline,title,value,icon,url,target);
 * 　（10）OutlineItem(outline,title,icon);
 * 　（11）OutlineItem(outline,title,icon,url);
 * @para:
 *   (1)outline：
 *   (2)title：
 *   (3)url：
 *     ·空：表示单击标题仅仅是激活此项，并不打开链接　
 *     ·""：表示单击标题展开折叠(如果是菜单的话)(此大纲项没有链接)
 *     ·字符串：单击标题打开链接.
 *     ·"JavaScript:[脚本代码]"：单击标题运行脚本程序
 *     ·FUNCTION：函数执行块引用
 *   (4)target：
 *   (5)funGetChildrenData：动态获取子项数据的方法(调用形式为：funGetChildrenData(retPath)) 
 * @modified: 2012.2.8
 */
_$class.OutlineItem=function(parent,title,value,icon,openedIcon,url,target,funGetChildrenData){
	this._parentOutline=parent._parent?parent._parentOutline:parent;
	this._parent=parent;
	this._id=++this._parentOutline.__usedIDCount;
	this._title=title;  
	this._value=value;
	this._url="";		//空,"",".","value"
	this._target="";	
	this._selectStatus=0;
	this._icon=icon?icon:"";
	this._openedIcon=openedIcon?openedIcon:"";
	this._submenu=null;
	this._isLoadChildrenFromOutside=false;
	this._isLoadedChildren=false;  
	this._getChildrenData=new Function();
	this._pathOfLoadChildrenData="";
	this.onClick=null;			//单击事件
	
	if(!this._parentOutline._isSelectMode){
		if(url instanceof Function){
			this._url=".";
			this.onClick=url;
		}else{
			this._url=url;
		}
		if(url!=null&&target!=null) this._target=target;
	}else{
		this._url=undefined;
	}
	this._isLoadChildrenFromOutside=(funGetChildrenData instanceof Function)?true:parent._isLoadChildrenFromOutside;	
	if(funGetChildrenData instanceof Function){
		this._getChildrenData=funGetChildrenData;
	}else if(this._isLoadChildrenFromOutside){
		this._getChildrenData=this._parent._getChildrenData;
		this._pathOfLoadChildrenData=parent._pathOfLoadChildrenData==""?this._title:
			parent._pathOfLoadChildrenData+this._parentOutline.getPathSeparator()+this._title;
	} 
}
with(_$class.OutlineItem){
	$name="OutlineItem";
	$extends("Object");
	
	//:property-------------------------------------------
		
	/*************************************\
	//类型：属性(读)
	//描述：包含此大纲项的大纲(只读)
	//公私：公共
	//*************************************/
	prototype.getParentOutline=function(){
		return(this._parentOutline);
	}
	prototype.getApplication=function(){
		return this._parentOutline;
	}
	/*************************************\
	//类型：属性(读)
	//描述：大纲或父大纲项(只读)
	//公私：公共
	//*************************************/
	prototype.getParent=function(){
		return this._parent;
	}
	/*************************************\
	//类型：属性(读)
	//描述：根大纲项(只读)
	//公私：公共
	//*************************************/
	prototype.getRoot=function(){
		for(var obj=this;;obj=obj._parent){
			if(!obj._parent._parent) return obj;			
		}
		return null;
	}
	/*************************************
	//类型：属性(读)
	//描述：大纲项ID(只读)
	//公私：公共
	//*************************************/
	prototype.getId=function(){
		return(this._id);
	}
	/*************************************
	//类型：属性(读)
	//描述：大纲项级别(只读)
	//说明：级别从1开始
	//公私：公共
	//*************************************/
	prototype.getLevel=function(){
		return this._parent._parent?(this._parent.getLevel()+1):1;
	}
	/*************************************
	//类型：属性(读)
	//属性：大纲项在母菜单中的索引(只读)
	//说明：索引从0开始
	//公私：公共
	//*************************************/	
	prototype.getIndex=function(){
		return this._index;
	}
	/**************************************\
	//类型：属性(读)
	//属性：大纲项在整个大纲中的位置(只读)
	//说明：位置从1开始,级别之间用"."隔开，例如：1、1.1、1.2.5
	//公私：公共
	//*************************************/ 
	prototype.getPosition=function(){
		if(this.getIsRoot()) return(1);		
		return(this._parent.getPosition()+"."+this._index);
	}
	prototype.getFullPath=function(){
		if(this.getIsRoot()) return(this._title);
		return(this._parent.getFullPath()+this._parentOutline.getPathSeparator()+this._title); 
	}
	/*************************************
	//类型：属性(读)
	//描述：标题
	//公私：公共
	//*************************************/
	prototype.getTitle=function(){
		return(this._title);
	}
	/*************************************
	//类型：属性(写)
	//描述：标题
	//公私：公共
	//*************************************/
	prototype.setTitle=function(newTitle){
		if(!newTitle){
			if(!this._parentOutline.getIsIgnoreError()) throw("Error! Title is not inputted!");	//错误！没有输入标题.
			return;
		}
		this._title=newTitle; 
	}
	/*************************************
	//类型：属性(读)
	//描述：大纲项值
	//公私：公共
	//*************************************/
	prototype.getValue=function(){
		return this._value;
	}
	/*************************************
	//类型：属性(写)
	//描述：大纲项值
	//公私：公共
	//*************************************/
	prototype.setValue=function(value){
		this._value=value;
	}
	prototype.getUrl=function(){
		if(this._url==null||this._url==""||this._url==".") return "";
		return(this._url);
	}
	prototype.setUrl=function(newUrl){
		
		if(newUrl==null){
			this._url="javascript:void(0)";
		}else if(newUrl.constructor==String){
			if(newUrl==""){		
				this._url="javascript:__JSDK_Namespace__.Outline.all['"+this.getParentOutline().getId()+"'].expandItem('"+this._id+"')";			
			}else{
				this._url=newUrl;	
			}
		}else if(newUrl.constructor==Function){
			this.OnClick=newUrl;
			this._url="javascript:__JSDK_Namespace__.Outline.all['"+this.getParentOutline().getId()+"'].getItemById('"+this._id+"').OnClick()";
		}
	}
	prototype.getTarget=function(){
		if(this._target==""){
			return this._parentOutline.getTarget();
		}
		return(this._target);
	}
	prototype.setTarget=function(value){
		this._target=value;
		if(this._htmlElement){
			Global.dom("#link",this._htmlElement.$firstChild||this._htmlElement.firstChild)[0].target=this.getTarget();
		}
	} 
	prototype.getIsRoot=function(){
		return this._parent._parent?false:true;
	}
	/*************************************
	//类型：属性(读)
	//描述：是否含有子大纲项(只读)
	//公私：公共
	//*************************************/
	prototype.getHasChildren=function(){
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren) return true;
		return (this._submenu&&this._submenu._items.length)?true:false;
	}
	/**************************************\
	//类型：属性(读)
	//属性：大纲项下所有子项的长度(只读)
	//公私：公共
	//*************************************/	
	prototype.getLength=function(){
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();			
		}
		if(!this.getHasChildren()) return(0);
		var length=this._submenu.getLength();
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			length+=this._submenu.getItem(i).getLength(); 
		}
		return(length);
	}
	/********** 属性(公共,读)：是否已展开 **************************
	//属性：是否已展开(只读)
	//描述：是否展开了子菜单(只读).
	//公私：公共
	//返回：
	//（1）没有子项：返回 False
	//（2）有子项但没展开：返回 False
	//（3）有子项且已展开：返回 True	
	//*************************************/
	prototype.getExpanded=function(){
		if(!this.getHasChildren()){
			return(false);
		}else{
			return this._submenu?this._submenu.getDisplayed():false;
		}
	}
	/**************************************\
	//类型：属性(读)
	//属性：大纲项的子项集(只读)
	//说明：
	//公私：公共
	//*************************************/	
	prototype.getChildren=function(){
		return(this._submenu);	
	}
	/********** 属性(公共,读)：是否可见 ***************************\
	| 功能：是否可见
	| 描述：相对该大纲的可见区而言,并且不算水平位移,只要此行在可见区就行。
	| 公私属性：公有
	\*************************************************/	
	prototype.getVisible=function(){ 
		if(!this.isListedForOutline()) return false;
		if(this._htmlElement.offsetTop-this.getParentOutline().getHtmlElement().scrollTop
			>=this.getParentOutline().getHtmlElement().clientHeight){	//在窗口下面，全部不可见
			return false;
		}else if(this._htmlElement.offsetTop+(this._htmlElement.$firstChild||this._htmlElement.firstChild).offsetHeight
			-this.getParentOutline().getHtmlElement().scrollTop<0){	//在窗口上面，全部不可见
			return false;
		}else {
			return true;
		}
	}
	/********** 属性(公共,读)：可见范围 ***************************\
	| 功能：可见范围
	| 描述：相对该大纲的可见区而言,并且不算水平位移.
	| 公私：公有
	| 返回：返回整数
	| 　（1）-1: 该大纲项还没有被列出
	| 　（2）0 : 在窗口上部，全部不可见
	| 　（3）1 : 在窗口上部，下半部分可见
	| 　（4）2 : 在窗口中部，全部可见或中间部分可见(这种情况很少，表示窗口高度很小，而该大纲项高度很大)
	| 　（5）3 : 在窗口下部，上部分可见
	| 　（6）4 : 在窗口下部，全部不可见
	\*************************************************/	
	prototype.getVisibleArea=function(){
		if(!this._htmlElement) return false;
		//return this._htmlElement.offsetParent==this.getParentOutline().getHtmlElement();
		//return this._htmlElement.offsetTop+"/"+this.getParentOutline().getHtmlElement().scrollTop+"/">=this.getParentOutline().getHtmlElement().clientHeight
	
	}
	prototype.getSelectStatus=function(){
		return this._selectStatus;	
	}
	
	//:method-------------------------------------------
	
	/********** 方法(公共)：增加大纲项 *****************************\
	| 功能：增加大纲项
	| 公私属性：公有
	\*************************************************/
	prototype.addItem=function(relPath,value,icon,openedIcon,url,target,funGetChildrenData){
		var pathSeparator=this._parentOutline.getPathSeparator();
		var iPos=relPath.indexOf(pathSeparator);
		var OutlineItem=this.getClass();
		var OutlineItemsMenu=this.getParentOutline().getClass().OutlineItemsMenu;
		if(iPos<0){
			var sTitle=relPath;
			var newItem=new OutlineItem(this,sTitle,value,icon,openedIcon,url,target,funGetChildrenData);
			if(this._submenu){
				this._submenu.addItem(newItem);
			}else{				
				this._submenu=new OutlineItemsMenu(this,false,16);
				this._submenu.addItem(newItem); 
				if(this._htmlElement) this._applyProperty("hasChildren");
			} 
			return(newItem);
		}else{
			var sTitle=relPath.slice(0,iPos);
			var item=this.getItemByPath(sTitle);
			if(!item){
				if(this._parentOutline._isAutoCreateItem){
					item=this.addItem(sTitle);
				}else{
					return(null);
				}
			}
			var newPath=relPath.slice(iPos+pathSeparator.length);
			return(item.addItem(newPath,value,icon,openedIcon,url,target,funGetChildrenData)); 
		}
	}
	/********** 方法(公共)：获取大纲项(通过索引) ********************\
	| 功能：获取大纲项
	| 公私属性：公有
	\*************************************************/		
	prototype.getItem=function(index){
		if(index<0) return(null);
		if(!this.getHasChildren()) return(null);
		for(var item=this.getFirstItem(),i=0;item;item=this.getNextItem(item),i++){
			if(i==index) return(item);
		}
		return(null); 
	}
	/********** 方法(公共)：获取大纲项(通过ID) **********************\
	| 功能：获取大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getItemById=function(id){		
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();
		}
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i);
			if(item.getId()==id) return(item);
			else if(item=item.getItemById(id)){
				return(item);
			} 
		}
		return(null);
	}
	/********** 方法(公共)：获取大纲项(通过路径) ********************\
	| 功能：获取大纲项
	| 公私属性：公有
	\*************************************************/		
	prototype.getItemByPath=function(relPath){
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();
		}
		if(!this.getHasChildren()) return(null);
		var titles=relPath.split(this._parentOutline.getPathSeparator());
		var item=this._submenu.getItemByTitle(titles[0]);
		if(titles.length==1) return(item);
		var newPath=titles.slice(1).join(this._parentOutline.getPathSeparator());
		return(item.getItemByPath(newPath));
	}
	/********** 方法(公共)：获取第一个大纲项 ************************\
	| 功能：获取第一个大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getFirstItem=function(){
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();
		}
		if(!this.getHasChildren()) return(null);
		return(this._submenu.getItem(0));
	}	
	/********** 方法(公共)：获取下一个大纲项 ************************\
	| 功能：获取下一个大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getNextItem=function(prevItem){
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();
		}
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i); 
			if(item.getId()==prevItem.getId()){
				if(item.getHasChildren()) return(item.getFirstItem());
				else return(this._submenu.getItem(i+1)); 
			}else if(item.contains(prevItem)){
				item=item.getNextItem(prevItem); 
				if(item) return(item);
				else return(this._submenu.getItem(i+1)); 
			} 
		}
		return(null);
	}
	/********** 方法(公共)：获取上一个大纲项 ************************\
	| 功能：获取上一个大纲项
	| 公私属性：公有
	\*************************************************/ 
	prototype.getPrevItem=function(nextItem){
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();
		}
		if(!this.getHasChildren()) return(null);
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i); 
			if(item.getId()==nextItem.getId()){
				item=this._submenu.getItem(i-1);
				if(!item) return(null);
				else if(!item.getHasChildren()) return(item);
				else return(item.getLastItem());
			}else if(item.contains(nextItem)){
				item=item.getPrevItem(nextItem); 
				if(item) return(item);
				else return(this._submenu.getItem(i-1));
			} 
		}
		return(null);	
	}
	/********** 方法(公共)：获取最后一个大纲项 **********************\
	| 功能：获取最后一个大纲项
	| 公私属性：公有
	\*************************************************/
	prototype.getLastItem=function(){		
		if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
			this._loadChildren();
		}
		if(!this.getHasChildren()) return(null);
		var item=this._submenu.getLastItem();
		if(!item.getHasChildren()) return(item);
		else return(item.getLastItem());
	}
	/********** 方法(公共)：获取所有子大纲项 ************************\
	| 功能：获取所有子大纲项(包括所有次级子大纲项)
	| 公私属性：公有
	\*************************************************/
	prototype.getAllItems=function(){
		var items=[];
		if(!this.getHasChildren()) return(items);
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i);			
			items=items.concat(item,item.getAllItems());
		}
		return(items);	
	}
	/********** 方法(公共)：获取第一个被列出的子大纲项 ************************\
	| 功能：获取第一个被列出的子大纲项(相对于此大纲项)
	| 公私属性：公有
	\*************************************************/
	prototype.getFirstListedItem=function(){
		if(!this.getExpanded()) return null;
		return(this._submenu.getFirstItem());
	}
	/********** 方法(公共)：获取下一个被列出的子大纲项 ************************\
	| 功能：获取下一个被列出的子大纲项(相对于此大纲项)
	| 公私属性：公有
	\*************************************************/	
	prototype.getNextListedItem=function(curListedItem){
		if(!this.getExpanded()) return null;
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i); 
			if(item.getId()==curListedItem.getId()){
				if(item.getExpanded()) return(item.getFirstItem());
				else return(this._submenu.getItem(i+1)); 
			}else if(item.getExpanded()&&item.contains(curListedItem)){
				item=item.getNextListedItem(curListedItem); 
				if(item) return item;
				else return(this._submenu.getItem(i+1));
			} 
		}
		return(null);	
	}
	/********** 方法(公共)：获取上一个被列出的子大纲项 ************************\
	| 功能：获取上一个被列出的子大纲项(相对于此大纲项)
	| 公私属性：公有
	\*************************************************/	
	prototype.getPrevListedItem=function(curListedItem){
		if(!this.getExpanded()) return(null);
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i); 
			if(item.getId()==curListedItem.getId()){
				item=this._submenu.getItem(i-1);
				if(!item) return(null);
				else if(item.getExpanded()) return(item.getLastListedItem());
				else return(item);
			}else if(item.getExpanded()&&item.contains(curListedItem)){
				var tmpItem=item.getPrevListedItem(curListedItem); 
				if(tmpItem) return tmpItem;
				else return(item);
			} 
		}
		return(null); 
	}
	/********** 方法(公共)：获取最后一个被列出的子大纲项 ************************\
	| 功能：获取最后一个被列出的子大纲项(相对于此大纲项)
	| 公私属性：公有
	\*************************************************/	
	prototype.getLastListedItem=function(){
		if(!this.getExpanded()) return(null);
		var item=this._submenu.getLastItem();
		if(!item.getExpanded()) return(item);
		else{
			return(item.getLastListedItem());
		}
	}
	/********** 方法(公共)：获取所有被列出的子大纲项 ************************\
	| 功能：获取所有被列出的子大纲项(相对于此大纲项)
	| 公私属性：公有
	\*************************************************/	
	prototype.getAllListedItem=function(){
		var items=[];
		if(!this.getHasChildren()) return(items);
		for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
			var item=this._submenu.getItem(i);
			items=items.concat(item,item.getAllListedItems());
		}
		return items;
	}
	prototype.remove=function(){
		this._parent.fireEvent("_onRemovedChildItem",this);
	}
	/********** 方法(公共)：是否被列出 ***************************\
	| 功能：是否被列出
	| 描述：是否被直接上级列出,也就是直接上级是否已展开
	| 公私：公有
	\*************************************************/	
	prototype.isListed=function(){
		if(this.getLevel()>1){
			return this.getParent().getExpanded();
		}else{	//根项
			return true;
		}
	}
	/********** 方法(公共)：是否被列出(相对于指定的上级) ***************************\
	| 功能：是否被列出
	| 描述：是否被上级列出,也就是上级是否已展开
	| 公私：公有
	| 参数：
	| 　（1）parentLevel: 相对于此大纲项的上级层次,如直接上级为1,再上级为2
	| 　　1)-X: 相对于级别为X的母大纲项
	| 　　2)-2: 相对于级别为2的母大纲项
	| 　　3)-1: 相对于级别为1的母大纲项
	| 　　4)0 : 相对于大纲
	| 　　5)1 : 相对于直接母大纲项
	| 　　6)X :
	| 返回：
	\*************************************************/	
	prototype.isListedFor=function(parentLevel){ 
		if(this.getLevel()==1){
			return true;
		}else if(parentLevel<=0){
			return this.isListedFor(this.getLevel()+parentLevel);
		}else if(parentLevel==1){ 
			return this.isListed();
		}else if(!this.isListed()){
			return false;
		}else{
			return this.getParent().isListedFor(parentLevel-1);
		}
	}
	/********** 方法(公共)：是否被列出(相对于大纲) ***************************\
	| 功能：是否被列出
	| 描述：
	| 公私：公有
	\*************************************************/	
	prototype.isListedForOutline=function(){
		return this.isListedFor(0);
	}	
	/********** 方法(公共)：滚动此大纲项到可见区 ************************/	
	prototype.scrollIntoView=function(){
		if(!this.getListed()) return;
		this._htmlElement.scrollIntoView();
	}
	/********** 方法(公共)：滚动此大纲项到可见区窗口顶部 ************************/
	prototype.scrollToViewTop=function(){
		if(!this.getListed()) return;
		if(this._htmlElement.offsetParent!=this.getParentOutline().getHtmlElement()) return;
	}
	/********** 方法(公共)：滚动此大纲项到可见区窗口底部 ************************/
	prototype.scrollToViewBottom=function(){
	
	}
	/**
	 * @modified: 2013.10.12
	 */
	prototype.activate=function(){
		//var Obj=Global.dom("#link",this._htmlElement.$firstChild||this._htmlElement.firstChild)[0];
		//Obj.setActive();
		for(var item=this;item.getParent().getLevel()>0;){
			item=item.getParent();
			if(!item.getExpanded()) item.expand();
		}		
		if(this.getParentOutline().getActiveItem()){
			this.getParentOutline().getActiveItem().fireEvent("_onDeactivate");
		}
		this.fireEvent("_onActivate");
	}
	/**
	 * @created: 2013.7.30
	 * @modified: 2014.4.14
	 */
	prototype.setActive=function(){
		if(this.getParentOutline().getActiveItem()){
			this.getParentOutline().getActiveItem().fireEvent("_onDeactivate");
		}
		this.fireEvent("_onActivate",false);
	}
	/********** 方法(公共)：选择此大纲项 ******************************\
	| 功能：选择大纲项
	| 公私属性：公有
	| 调用形式：select([status])
	| 参数：
	| 　（1）status:
	| 　　　1)0，没有选择
	| 　　　2)1，部分选择
	| 　　　3)2，全部选择
	\*************************************************/		
	prototype.select=function(status,isSelectAll){ 
		if(arguments.length==0){ 
			switch(this._selectStatus){ 
				case 0:
					status=2;
					break;
				case 1:
					status=2;
					break;
				case 2:
					status=0;
					break;
			}	
			isSelectAll=true;
		}
		this._selectStatus=status;
		var parentMenu=this.getIsRoot()?this._parent._mainmenu:this._parent._submenu;
		if(parentMenu&&parentMenu._loaded){
			this._applyProperty("selectStatus");
		}
		//选择母项----
		if(arguments.length<=1&&this.getLevel()>1){
			var item=this.getParent();
			for(var i=0,item2,flag=-1,iLength=item.getChildren().getLength();i<iLength;i++){ 
				item2=item.getChildren().getItem(i);     
				if(flag!=-1&&item2._selectStatus!=flag){ 
					flag=1;break; 
				}
				flag=item2._selectStatus;
			}
			item.select(flag);	
		}
		//选择子项----
		if(isSelectAll&&this.getHasChildren()) {
			for(var i=0,iLength=this.getChildren().getLength();i<iLength;i++){ 
				var item=this.getChildren().getItem(i);   
				item.select(this._selectStatus,true);
			}  
		}	
	}
	/**
	 * 展开大纲项
	 * @invoke: expand([isExpand[,isAll]])
	 * @memo: 无参数时，根据它的展开状态判断是否展开
			有一个参数时，强制它是否展开
			有全部参数时，强制它是否全部展开
	 * @modified: 2014.4.3
	 */
	prototype.expand=function(isExpand,isAll){	
		if(!this.getHasChildren()) return(false); 
		if(!this.getExpanded()&&(isExpand==null||isExpand==true)){	//展开 
			if(!this.isListedFor(1)) this.getParent().expand(true);
			if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
				this._loadChildren();
				if(!this.getHasChildren()) return(null);
			}
			if(!this._submenu._loaded) this._htmlElement.appendChild(this._submenu.toHtmlElement());
			this._submenu.display(isExpand);
		}else if(!this._submenu._loaded){	//折叠：如果没有装载子菜单，则返回
			return;
		}else{	//折叠
			this._submenu.display(isExpand);
		}
		this._applyProperty("expanded");
		if(isExpand!=null&isAll==true){
			for(var i=0,iLength=this._submenu.getLength();i<iLength;i++){
				this._submenu.getItem(i).expand(isExpand,true);
			}
		}	
	}
	prototype.enter=function(){
		if(!this._htmlElement) return;
		if(this._url==""){
			//
		}else if(this._url=="-"){
			this.expand();
		}else if(this._url=="."){
			this._onClick();
		}else{
			window.open(Global.dom("#link",this._htmlElement.$firstChild||this._htmlElement.firstChild)[0].href,this.getTarget());
		}
	}
	/********** 方法(公共)：是否包含指定的大纲项 ***********************\
	| 功能：关于
	| 公私属性：公有
	\*************************************************/		
	prototype.contains=function(item){		
		return(this.getItemById(item.getId())?true:false);	
	}
	/********** 方法(公共)：刷新 **************************************\
	| 功能：关于
	| 公私属性：公有
	\*************************************************/		
	prototype.refresh=function(){
		if(!this._htmlElement) return(false); 	
		var thisElement=this._htmlElement.$firstChild||this._htmlElement.firstChild;
		var oLink=Global.dom("#link",thisElement)[0];
		//title
		oLink.innerText=this._title;			
		//url
		if(this.getUrl()) oLink.href=this._url;
		//target
		oLink.target=this.getTarget();
		//hasChildren
		{ 	
			var elButton=Global.dom("#button",thisElement)[0];
			elButton.innerText="";
			if(!this.getHasChildren()){				
				elButton.appendChild(this._parentOutline.getIcon("leaf"));
			}else{
				elButton.appendChild(this._parentOutline.getIcon(this.getExpanded()?"collapse":"expand"));
			}
			if(this._parentOutline._useIcon){	
				//icon
				{ 
					var elIcon=Global.dom("#icon",thisElement)[0];
					if(this._icon==""){						
						elIcon.innerText="";
						if(!this.getHasChildren()){
							elIcon.appendChild(this._parentOutline.getIcon("file"));
						}else if(!this.getExpanded()){
							elIcon.appendChild(this._parentOutline.getIcon("folder"));
						}else{
							elIcon.appendChild(this._parentOutline.getIcon("openedFolder"));
						}
					}else{
						if(!this.getHasChildren()){
							elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
						}else if(!this.getExpanded()){
							elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
						}else{
							if(this._openedIcon==""){
								elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
							}else{
								elIcon.innerHTML="<img align=absmiddle src=\""+this._openedIcon+"\">";
							}
						}
					}
				}
			}
		}
		//selectStatus
		if(this._parentOutline._useCheckbox){
			var elCheckBox=Global.dom("#checkbox",thisElement)[0];
			elCheckBox.innerText="";
			switch(this._selectStatus){ 
				case 0:
					elCheckBox.appendChild(this._parentOutline.getIcon("unchecked"));
					break;
				case 1:
					elCheckBox.appendChild(this._parentOutline.getIcon("partChecked"));
					break;
				case 2:
					elCheckBox.appendChild(this._parentOutline.getIcon("checked"));
					break;
			} 
		}
	}

	/**
	 * 生成用于显示的html元素
	 * @modified: 2013.7.30
	 */
	prototype.toHtmlElement=function(){
		if(this._htmlElement) return(this._htmlElement);
		var htmlElement=this.getParentOutline().getClass()._cache['_OutlineItem_htmlElement'];
		var _prefix=this._parentOutline.__styleNamePrefix;
		if(!htmlElement){			
			with(htmlElement=document.createElement("div")){
				className=_prefix+"-outlineitem-outer";
				innerHTML=[
					'<div class="'+_prefix+'-outlineitem" nowrap>',
					'<span id=button onmousedown="this.parentNode.parentNode.srcObject.expand()"></span>',
					'<span id=checkbox onmousedown="this.parentNode.parentNode.srcObject.select()"></span>',
					'<span id=icon></span>',
					'<a id=link href="javascript:void(0)" target=""',
						(Browser.Engine.trident&&Browser.Engine.version==3?"":" hidefocus=\"true\""),
						(!Browser.Engine.trident?' onmousedown':' onmousedown')+'="this.parentNode.parentNode.srcObject.setActive()"',
						' onmouseover="this.parentNode.parentNode.srcObject.fireEvent(\'_onMouseOver\')"',
						' onmouseout="this.parentNode.parentNode.srcObject.fireEvent(\'_onMouseOut\')"',
						' ondeactivate3="this.parentNode.parentNode.srcObject.fireEvent(\'_onDeactivate\')"',
						' onclick="return this.parentNode.parentNode.srcObject.fireEvent(\'_onClick\')"',
						' ondblclick="this.parentNode.parentNode.srcObject.fireEvent(\'_onDblClick\')"',
						'>',
						'</a>',
					'</div>'].join("");
			}
			this.getParentOutline().getClass()._cache['_OutlineItem_htmlElement']=htmlElement;
		}		
		this._htmlElement=htmlElement.cloneNode(true);
		this._htmlElement.setAttribute("srcObject",this);		//for IE
		this._htmlElement.srcObject=this;						//for Firefox
		return this._htmlElement;
	}
	prototype.applyHtmlElement=function(){
		//this.fireEvent("_onPropertyChange",{propertyName:"title"});
		//this.fireEvent("_onPropertyChange",{propertyName:"url"});
		//this.fireEvent("_onPropertyChange",{propertyName:"target"});
		//this.fireEvent("_onPropertyChange",{propertyName:"expanded"});
		//this.fireEvent("_onPropertyChange",{propertyName:"title"});
	}
	prototype._applyProperty=function(propertyName){
		if(!this._htmlElement) return;
		var thisElement=this._htmlElement.$firstChild||this._htmlElement.firstChild;
		switch(propertyName){
			case "icon":
				var elIcon=thisElement.all['icon'];
				if(this._icon==""){
					elIcon.innerText="";
					if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
						elIcon.appendChild(this._parentOutline.getIcon("folder"));
					}else if(!this.getHasChildren()){
						elIcon.appendChild(this._parentOutline.getIcon("file"));
					}else if(!this.getExpanded()){
						elIcon.appendChild(this._parentOutline.getIcon("folder"));
					}else{
						elIcon.appendChild(this._parentOutline.getIcon("openedFolder"));
					}
				}else{
					if(this._isLoadChildrenFromOutside&&!this._isLoadedChildren){
						elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
					}else if(!this.getHasChildren()){
						elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
					}else if(!this.getExpanded()){
						elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
					}else{
						if(this._openedIcon==""){
							elIcon.innerHTML="<img align=absmiddle src=\""+this._icon+"\">";
						}else{
							elIcon.innerHTML="<img align=absmiddle src=\""+this._openedIcon+"\">";
						}
					}
				}
				break;
			case "title":
				thisElement.all['link'].innerText=this._title;	
				break;
			case "url":
				if(this.getUrl()) thisElement.all['link'].href=this._url;			
				break;
			case "target":
				thisElement.all['link'].target=this.getTarget();
				break;
			case "hasChildren":
				var elButton=thisElement.all['button'];
				elButton.innerText="";
				if(!this.getHasChildren()){				
					elButton.appendChild(this._parentOutline.getIcon("leaf"));
				}else{
					elButton.appendChild(this._parentOutline.getIcon("expand"));
				}
				if(this._parentOutline._useIcon){	
					this._applyProperty("icon");
				}
				break;
			case "expanded":
				var elButton=thisElement.all['button'];
				elButton.innerText="";
				if(!this.getExpanded()){
					elButton.appendChild(this._parentOutline.getIcon("expand"));
				}else{
					elButton.appendChild(this._parentOutline.getIcon("collapse"));
				}
				if(this._parentOutline._useIcon){	
					this._applyProperty("icon");
				}
				break;
			case "selectStatus":
				var elCheckBox=thisElement.all['checkbox'];
				elCheckBox.innerText="";
				switch(this._selectStatus){ 
					case 0:
						elCheckBox.appendChild(this._parentOutline.getIcon("unchecked"));
						break;
					case 1:
						elCheckBox.appendChild(this._parentOutline.getIcon("partChecked"));
						break;
					case 2:
						elCheckBox.appendChild(this._parentOutline.getIcon("checked"));
						break;
				} 
		}

	}
	prototype._loadChildren=function(){
		if(this._isLoadedChildren) return;
		var children=this._getChildrenData(this._pathOfLoadChildrenData);
		for(var i=0;i<children.length;i++){
			this.addItem.apply(this,children[i]);
		}
		this._isLoadedChildren=true;
		if(!this.getHasChildren()){ 
			this._applyProperty("hasChildren");
		}
	}
	
	//:event-------------------------------------------
	
	/**
	 * @modified: 2013.7.30-2014.4.14
	 */
	prototype._onActivate=function(isDoAction,isFocus){
		var _prefix=this._parentOutline.__styleNamePrefix;
		this._htmlElement.firstChild.className=_prefix+"-outlineitem "+_prefix+"--active";
		this.getParentOutline()._activeItem=this;
		if(isDoAction||isDoAction==undefined) {
			if(Browser.Engine.trident) Global.dom("#link",this._htmlElement)[0].focus();
			this.fireEvent("_onDoAction",1);
		}
	}
	/**
	 * @created: 2013.7.30
	 */
	prototype._onDoAction=function(iTime){
		var _this=this;
		clearTimeout(this._parentOutline._timer);
		this._parentOutline._timer=setTimeout(function(){
			if(iTime){
				if(_this.onClick) _this.onClick();
				else if(_this._url.length>1){
					window.open(_this._url,_this.getTarget());
				}
			}
			_this.getParentOutline().fireEvent("_onActivatedItem",_this);
			if(_this._target=="_blank"&&_this.getParentOutline()._lastActiveItem) 
				_this.getParentOutline()._lastActiveItem.setActive();
		},iTime||0);
	}
	prototype._onMouseOver=function(){
		var _prefix=this._parentOutline.__styleNamePrefix;
		var node=this._htmlElement.firstChild;
		node.className=node.className.split(" ").include(_prefix+"--hover").join(" ");
	}
	prototype._onMouseOut=function(){
		var _prefix=this._parentOutline.__styleNamePrefix;
		var node=this._htmlElement.firstChild;
		node.className=node.className.split(" ").erase(_prefix+"--hover").join(" ");
	}
	prototype._onDeactivate=function(){
		var _prefix=this._parentOutline.__styleNamePrefix;
		this._htmlElement.firstChild.className=_prefix+"-outlineitem";
		this.getParentOutline()._lastActiveItem=this;
	}
	prototype._onSelect=function(){
	
	}
	prototype._onExpandCollapse=function(){
		
	}
	prototype._onExpand=function(){
	
	}
	prototype._onCollapse=function(){
	
	}
	prototype._onPropertyChange=function(oEvent){
		switch(oEvent.propertyName){
			case "title":
				this._htmlElement.all['link'].innerText=this._title;	
				break;
			case "length":
				
			
		}
	}
	prototype._onClick=function(){
		var ret;
		switch(this._url){
			case undefined:
				ret=false;
				break;
			case "":
				this.expand();
				ret=false;
				break;
			case ".":
				this.onClick();
				break;
			default:
		}
		this.fireEvent("_onDoAction");
		return ret;
	}
	prototype._onDblClick=function(){
		if(this._parentOutline._isSelectMode) return;
		this.expand();
	}
	prototype._onRemovedChildItem=function(oItem){
		if(this._submenu) this._submenu.removeItem(oItem);
	}
}

/**
 * OutlineItemsMenu Class of private
 * @modified: 2012.2.8
 */
_$class.OutlineItemsMenu=function(owner,isDisplay,indentation){  
	this._ownerOutline=owner._parent?owner._parentOutline:owner;
	this._owner=owner;
	this._loaded=false;
	this._displayed=false;
	this._indentation=indentation?indentation:0;
	this._htmlElement=null;
	this._items=[];
	
	if(isDisplay) this.display(true);
}
with(_$class.OutlineItemsMenu){
	$name="OutlineItemsMenu";
	$extends("Object");

	//:property-----------------------------------------

	prototype.getOwnerOutline=function(){
		return this._ownerOutline;
	}
	/********** 属性：本菜单的拥有者 **********\
	| 类型：属性(读)
	| 描述：本菜单的拥有者(只读)
	| 公私：公共
	\*****************************************/
	prototype.getOwner=function(){
		return(this._owner);
	}
	/********** 属性：本菜单是否已经显示 **********\
	| 类型：属性(读)
	| 描述：本菜单是否已经显示(只读)
	| 公私：公共
	\*********************************************/
	prototype.getDisplayed=function(){
		return(this._displayed);
	}
	/********** 属性：大纲项数 **********\
	| 类型：属性(读)
	| 描述：菜单所拥有的大纲项数(只读)
	| 公私：公共
	\***********************************/
	prototype.getLength=function(){
		return(this._items.length);
	}

	//:method-----------------------------------------

	prototype.addItem=function(newItem){
		//不允许标题重复
		if(!this._ownerOutline._isAllowTitleNonunique){
			if(this.getItemByTitle(newItem.getTitle())){
				if(!this._ownerOutline._isIgnoreError()){
					//throw("错误！该菜单下已经存在标题为"+newItem.getTitle()+"的大纲项。请保持标题唯一！");
					throw new Error("Error! Menu item titled '"+newItem.getTitle()+"' already exists in current menu, please keep the title of menu item is unique!");
				}
				return(null);
			}
		}		
		this._items[this._items.length]=newItem;
		newItem._index=this._items.length-1;
		if(this._loaded) this.load(newItem);
		
		return(newItem);
	}
	prototype.getItem=function(index){
		if(index<0) return(null);
		else if(index>this.getLength()-1){
			return(null);
		}else{
			return(this._items[index]);
		}
	}
	prototype.getItemById=function(id){
		for(var i=0;i<this.getLength();i++){
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
		for(var i=0,len=this.getLength()-1;i<len;i++){
			if(this.getItem(i).getId()==item.getId()){
				return this.getItem(i+1);
			}
		}
		return null;
	}
	prototype.getPrevItem=function(item){
		for(var i=1,len=this.getLength();i<len;i++){
			if(this.getItem(i).getId()==item.getId()){
				return this.getItem(i-1);
			}
		}
		return null;
	}
	prototype.getLastItem=function(){
		return(this.getItem(this.getLength()-1));
	}
	prototype.getAllItems=function(){
		return this._items;
	}
	prototype.removeItem=function(item){
		for(var i=0;i<this.getLength();i++){
			var oItem=this.getItem(i);
			if(oItem.getId()==item.getId()){
				if(this._htmlElement&&item._htmlElement){
					this._htmlElement.removeChild(item._htmlElement);
				}
				this._items.removeElement(i);
				break;
			}
		}
		return this;
	}
	prototype.toHtmlElement=function(){
		if(this._htmlElement) return(this._htmlElement);
		var _prefix=this._ownerOutline.__styleNamePrefix;
		this._htmlElement=document.createElement("div");
		with(this._htmlElement){
			className=_prefix+"-outlineitemsmenu";
			style.display="none"; 
			style.marginLeft=this._indentation+"px";
		}
		return(this._htmlElement);
	}
	
	/**
	 * @function: 装载菜单
	 * @description: 在第一次显示的时候，生成HTML元素,并且只能装载一次,用于动态菜单
	 * @return: true, load successfully ;false, load fail
	 */
	prototype.load=function(item){ 
		if(!this._htmlElement) this.toHtmlElement();
		if(!item){
			if(this._loaded) return(false);
			for(var i=0; i<this._items.length; i++){
				item=this._items[i];
				this._htmlElement.appendChild(item.toHtmlElement());
				item.refresh();
			}
			this._loaded = true; 
		}else{
			this._htmlElement.appendChild(item.toHtmlElement());
			item.refresh();
		}
	}
	/**
	 * 显示或隐藏菜单
	 * @para isDisplay: Boolean,optional
	 */
	prototype.display=function(isDisplay){
		if(isDisplay==null){
			this._displayed=!this._displayed;
		}else if(isDisplay==true){
			this._displayed=isDisplay;
		}else if(isDisplay==false){
			this._displayed=isDisplay;
		}else{
			//throw("\"OutlineItemsMenu.display(isDisplay)\"函数调用错误！");
			return(false);
		} 
	
		//如果是第一次显示，则装载菜单
		if(this._displayed&&!this._loaded){
			this.load();
		}
 
		//应用改变
		if(this._htmlElement){ 
			this._htmlElement.style.display=this._displayed?"":"none";
		} 
	}
	prototype.refresh=function(){
	
	
	}
}

/**
 * OutlineItemsCollection Class of private
 * @modified: 2012.2.8
 */
js.ui.menu.Outline.OutlineItemsCollection=function(vItems){
	this._items=[];	
	this._point=0;
	if(vItems instanceof Array){
		this._items=vItems;
		this._loadFinished=true;
	}else if(vItems instanceof Function){
		this._fNextItem=vItems;
		this._loadFinished=false;
	}
}
with(_$class.OutlineItemsCollection){
	$name="OutlineItemsCollection";
	$extends("Object");
	
	prototype.getLength=function(){
		if(this._loadFinished){
			return this._items.length;
		}else{
			for(var item,i=0;;i++){
				item=this._fNextItem();
				if(!item){
					this._loadFinished=true;
					return i;
				}
				this._items[i]=item;
			}
		}
	}
	prototype.getItem=function(index){
		if(index<0) return(null);
		else if(index>this._items.length-1){
			return(null);
		}else{
			return(this._items[index]);
		}
	}
	prototype.getNextItem=function(){
		if(this._loadFinished){
			if(this._point<this._items.length) return this._items[this._point++];
			else return null;
		}else{
			var item=this._fNextItem();
			if(!item){
				this._loadFinished=true;
				return null;
			}else{
				this._items[this._items.length]=item;
				this._point++;
				return item;
			}
		}
	}
}

