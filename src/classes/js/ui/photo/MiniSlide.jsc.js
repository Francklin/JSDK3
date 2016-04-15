/**
 * @file: MiniSlide.class.js
 * @version: V2.3 Beta
 * @since: JSDK3 V1.5.5
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.9.14
 * @modified: 2012.06.21
 * @mail: francklin.liu@gmail.com 
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.ui.photo");
$import("js.dom.HTML");

/**
 * MiniSlide Class of public
 */
js.ui.photo.MiniSlide=function(htmlContainer,vWidth,vHeight,iTabHeight){
	this._id="";
	this._width=0;
	this._height=0;
	this._clientWidth=0;
	this._ciientHeight=0;
	this._contentWidth=0;
	this._contentHeight=0;
	this._tabHeight=0;
	this._items=[];
	this._tabItems=[];
	this._htmlElement=null;
	this._tabBarElement=null;
	this._contentElement=null;
	this.__usedIdCount=0;
	this._isDisplayTabBar=true;
	this._isAloneDisplayTabBar=false;
	this._isStretchPhoto=true;
	this._isPlaying=false;
	this._isPaused=false;		
	this._interval=1000;		//milliseconds, max as 1 minutes
	this._isCircle=true;
	this._isPauseOnEntering=false;
	this._maxPlayTimeLimit=0;	//enable when prototype 'isCircle' is true, it's value can as:  0, no limit
	this._activeIndex=-1;
	this._timer;
	this._MiniSlide(htmlContainer,vWidth,vHeight,iTabHeight);
}

var _$class = js.ui.photo.MiniSlide;
var _$proto = _$class.prototype;

with(_$class){
	$name="MiniSlide";
	$extends("Object");
	_$class._styleLib={
		"classic" : {
			"url": Engine.runtimeEnvironment.getResPath("js.ui.photo")
					+"/MiniSlide/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?"Classic.IE.css":"Classic.css"),
			".MiniSlide .box": {
				borderWidth: 1
			},
			".MiniSlideTabBar img": {
				url: Engine.runtimeEnvironment.getResPath("js.ui.photo")+"/MiniSlide/images/bckgrd_gray.jpg"
			}
		}
	}
	_$class._styleSkin="classic";
	_$class._styleElement=null;
	
	//:constructor--------------------------------------------

	prototype._MiniSlide=function(htmlContainer,vWidth,vHeight,iTabHeight){
		if(htmlContainer==null){
			this._htmlElement=document.createElement("div");
		}else if(htmlContainer==""){
			var elScript=document.scripts[document.scripts.length-1];
			this._htmlElement=elScript.insertAdjacentElement("beforeBegin",document.createElement("div"));
		}else{
			this._htmlElement=htmlContainer.appendChild(document.createElement("div"));
		}
		var thisObj=this;
		this._width=typeof(vWidth)=="number"?vWidth:0;
		this._height=typeof(vHeight)=="number"?vHeight:0;
		this._tabHeight=iTabHeight||16;
		with(this._htmlElement){
			className="MiniSlide";
			setAttribute("class","MiniSlide");
			style.width=vWidth+(typeof(vWidth)=="number"?"px":"");
			style.height=vHeight+(typeof(vHeight)=="number"?"px":"");
			with(appendChild(document.createElement("div"))){
				className="box";
				setAttribute("class","box");
				with(this._contentElement=appendChild(document.createElement("div"))){
					className="MiniSlideContent";
					setAttribute("class","MiniSlideContent");
				}
				with(this._tabBarElement=appendChild(document.createElement("div"))){
					className="MiniSlideTabBar";
					setAttribute("class","MiniSlideTabBar");
					style.height=this._tabHeight+"px";
					if(this.getCurrStyleSkin()[".MiniSlideTabBar img"]){
						innerHTML="<img src=\""+this.getCurrStyleSkin()[".MiniSlideTabBar img"].url+"\">";
					}
				}
			}
			onmouseover=function(event){
				event=event||window.event;
				var fromElement=event.fromElement;
				if(HTML.contains(this,fromElement)) return;
				thisObj.fireEvent("_onMouseEnter");
			}
			onmouseout=function(event){
				event=event||window.event;
				var toElement=event.toElement;
				if(HTML.contains(this,toElement)) return;
				thisObj.fireEvent("_onMouseLeave");
			}
		}
		this._width=this._width||this._htmlElement.offsetWidth;
		this._height=this._height||this._htmlElement.offsetHeight;
		this._contentWidth=this._width-this.getCurrStyleSkin()[".MiniSlide .box"].borderWidth*2;
		this._contentHeight=this._height-this.getCurrStyleSkin()[".MiniSlide .box"].borderWidth*2;
		//修复IE兼容模式下容易造成box元素自动计算错误的问题。
		if(Browser.Engine.trident&&document.compatMode!="CSS1Compat"){
			if(typeof(vWidth)=="number"){
				this._htmlElement.firstChild.style.width=vWidth+"px";
			}
			if(typeof(vHeight)=="number"){
				this._htmlElement.firstChild.style.height=vHeight+"px";
			}
		}
		this.setIsAloneDisplayTabBar(true);
	}

	//:property--------------------------------------------
	
	prototype.getIsDisplayTabBar=function(){
		return this._isDisplayTabBar;
	}
	prototype.setIsDisplayTabBar=function(value){
		this._isDisplayTabBar=value;
	}
	prototype.getIsAloneDisplayTabBar=function(){
		return this._isAloneDisplayTabBar;
	}
	prototype.setIsAloneDisplayTabBar=function(value){
		if(this._isAloneDisplayTabBar==value) return;
		this._isAloneDisplayTabBar=value;
		if(this._isAloneDisplayTabBar){
			this._contentHeight-=this._tabHeight;
			if(Browser.Engine.trident&&document.compatMode!="CSS1Compat"){
				this._htmlElement.firstChild.style.paddingBottom=this._tabHeight;
			}else{
				this._contentElement.style.marginBottom=this._tabHeight+"px";
			}
		}else{
			this._contentHeight+=this._tabHeight;
			this._htmlElement.firstChild.style.paddingBottom="0px";
			this._contentElement.style.marginBottom="0px";
		}
	}
	prototype.getIsPlaying=function(){
		return this._isPlaying;
	}
	prototype.getIsStretchPhoto=function(){
		return this._isStretchPhoto;
	}
	prototype.setIsStretchPhoto=function(value){
		this._isStretchPhoto=value;
	}
	prototype.getInterval=function(){
		return this._interval;
	}
	prototype.setInterval=function(value){
		this._interval=Math.min(60*1000,value);
	}
	prototype.getMaxPlayTimeLimit=function(){
		return this._maxPlayTimeLimit;
	}
	prototype.setMaxPlayTimeLimit=function(value){
		this._maxPlayTimeLimit=value;
	}
	prototype.getIsCircle=function(){
		return this._isCircle;
	}
	prototype.setIsCircle=function(value){
		this._isCircle=value;
	}
	prototype.getIsPauseOnEntering=function(){
		return this._isPauseOnEntering;
	}
	prototype.setIsPauseOnEntering=function(value){
		this._isPauseOnEntering=value;
	}
	prototype.getHtmlElement=function(){
		return this._htmlElement;
	}
	
	//:method--------------------------------------------
	
	addMethod(true,true,"addStyleSkin",function(sName,oStyle){
		this._styleLib[sName]=oStyle;
	});
	addMethod(true,true,"setStyleSkin",function(sName){
		this._styleSkin=sName;
		if(!this._styleElement){
			var style = this._styleElement = document.createElement("link"); 
			style.type = "text/css";
			style.rel = "stylesheet";
			style.href = this._styleLib[sName].url;
			document.getElementsByTagName("HEAD")[0].appendChild(style);
		}else{
			this._styleElement.style.href = this._styleLib[sName].url;
		}
	});
	addMethod(false,true,"getCurrStyleSkin",function(){
		return this.getClass()._styleLib[this.getClass()._styleSkin];
	});
	prototype.addPhoto=function(id,title,src,url,target){
		var thisObj=this;
		var index=this._items.length;
		var tabItemElement=this._tabBarElement.appendChild(document.createElement("a"));
		with(tabItemElement){
			className="MiniSlideTabItem";
			setAttribute("class","MiniSlideTabItem");
			innerHTML=this._items.length+1;
			onclick=function(){
				thisObj.pausePlay();
				thisObj.gotoPhoto(index);
				thisObj.continuePlay();
			}
		}
		this._tabItems.push({
			_htmlElement: tabItemElement
		});			
		var htmlElement=this._contentElement.appendChild(document.createElement("div"));
		with(htmlElement){
			className="loading MiniSlidePhoto";
			setAttribute("class","loading MiniSlidePhoto");
		}
		var img=new Image();
		this._items.push({
			_htmlElement: htmlElement,
			_image: img,
			id: id||("I"+(++this.__usedIdCount)),
			title: title,
			index: index,
			src: src,
			size: [0,0],
			url: url,
			target: target||"_blank"
		});
		img.onload=function(){
			thisObj.fireEvent("_onPhotoReady",index);
		}
		img.src=src;	
		if(index==0) this.fireEvent("_onFirstAdd",this);
	}
	prototype.gotoPhoto=function(index){
		if(this._activeIndex>=0){
			this._items[this._activeIndex]._htmlElement.style.display="none";
			with(this._tabItems[this._activeIndex]._htmlElement){
				className="MiniSlideTabItem";
				setAttribute("class","MiniSlideTabItem");
			}
		}
		this._items[index]._htmlElement.style.display="block";
		with(this._tabItems[index]._htmlElement){
			className="MiniSlideTabItem ActiveMiniSlideTabItem";
			setAttribute("class","MiniSlideTabItem ActiveMiniSlideTabItem");
		}
		this._activeIndex=index;
	}
	prototype.startPlay=function(){
		if(this._isPlaying||this._items.length<=1) return;
		this.gotoPhoto(0);
		var thisObj=this;
		this._timer=setTimeout(function(){
			if(thisObj._activeIndex<thisObj._items.length-1){
				thisObj.gotoPhoto(thisObj._activeIndex+1);
				thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
			}else{
				thisObj.gotoPhoto(0);
				if(thisObj._isCircle) {
					thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
				}else{
					thisObj.stopPlay();
				}
			}
		},this._interval);
		this._isPlaying=true;
		this._isPaused=false;
	}
	prototype.restartPlay=function(){
		if(this._items.length<=1) return;
		this.gotoPhoto(0);
		var thisObj=this;
		if(this._timer) clearTimeout(this._timer);
		this._timer=setTimeout(function(){
			if(thisObj._activeIndex<thisObj._items.length-1){
				thisObj.gotoPhoto(thisObj._activeIndex+1);
				thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
			}else{
				thisObj.gotoPhoto(0);
				if(thisObj._isCircle) {
					thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
				}else{
					thisObj.stopPlay();
				}
			}
		},this._interval);
		this._isPlaying=true;
		this._isPaused=false;
	}
	/**
	 * 只从播放状态下暂停
	 */
	prototype.pausePlay=function(){
		if(this._items.length<=1) return;
		if(!this._isPlaying) return;
		if(this._timer) clearTimeout(this._timer);
		this._isPlaying=false;
		this._isPaused=true;
	}
	prototype.continuePlay=function(){
		if(this._items.length<=1) return;
		if(this._isPlaying||!this._isPaused) return;
		var thisObj=this;
		this._timer=setTimeout(function(){
			if(thisObj._activeIndex<thisObj._items.length-1){
				thisObj.gotoPhoto(thisObj._activeIndex+1);
				thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
			}else{
				thisObj.gotoPhoto(0);
				if(thisObj._isCircle) {
					thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
				}else{
					thisObj.stopPlay();
				}
			}
		},this._interval);
		this._isPlaying=true;
		this._isPaused=false;
	}
	/**
	 * 从当前停止状态或暂停状态开始播放
	 */
	prototype.play=function(){
		if(this._items.length<=1) return;
		if(this._isPlaying) return;
		var thisObj=this;
		this._timer=setTimeout(function(){
			if(thisObj._activeIndex<thisObj._items.length-1){
				thisObj.gotoPhoto(thisObj._activeIndex+1);
				thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
			}else{
				thisObj.gotoPhoto(0);
				if(thisObj._isCircle) {
					thisObj._timer=setTimeout(arguments.callee,thisObj._interval);
				}
			}
		},this._interval);
		this._isPlaying=true;
		this._isPaused=false;
	}
	prototype.stopPlay=function(){
		if(this._items.length<=1) return;
		if(!(this._isPlaying||this._isPaused)) return;
		if(this._timer) clearTimeout(this._timer);
		this.gotoPhoto(0);
		this._isPlaying=false;
		this._isPaused=false;
	}
	prototype.gotoPlay=function(index){
		if(this._items.length<=1) return;
		this.pausePlay();
		this.gotoPhoto(index);
		this.play();
	}
	prototype.refresh=function(){
		with(this._contentElement){
			style.height=this._contentHeight+"px";
		}
	}
	
	//:event-----------------
	
	addEventListener(false,false,"onFirstAdd",function(item){
		this._items[0]._htmlElement.style.display="block";
	});
	addEventListener(false,false,"onPhotoReady",function(index){
		var item=this._items[index];
		item.size=[item._image.width,item._image.height];
		with(item._htmlElement){
			className="MiniSlidePhoto";
			setAttribute("class","MiniSlidePhoto");
		}
		var code="";
		if(this._isStretchPhoto){
			code="<img src=\""+item.src+"\" style=\"width:100%;height:100%\" border=0>";
		}else if(item.size[0]==0||item.size[1]==0) {
			code="<img src=\""+item.src+"\" style=\"width:100%;height:100%\" border=0>";
		}else if((this._contentWidth/this._contentHeight)<(item.size[0]/item.size[1])){
			code="<img src=\""+item.src+"\" style=\"width:100%\" border=0>";
		}else{
			code="<img src=\""+item.src+"\" style=\"height:100%\" border=0>";
		}
		if(item.url){
			item._htmlElement.innerHTML="<a href=\""+item.url+"\" target=\""+item.target+"\">"+code+"</a>";
		}else{
			item._htmlElement.innerHTML=code;
		}
	});
	addEventListener(false,false,"onMouseEnter",function(){
		if(this._isPauseOnEntering&&this._isPlaying){
			this.pausePlay();
		}
	});
	addEventListener(false,false,"onMouseLeave",function(){
		if(this._isPauseOnEntering&&this._isPaused){
			this.continuePlay();
		}
	});
}

