/**
 * HTML Class
 * @file: HTML.class.js
 * @version: V0.10 alpha
 * @author: liu denggao 
 * @modified: 2013.3.21-2013.5.30
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 *******************************************/

$package("js.dom");

js.dom.HTML={}
var _$class=js.dom.HTML;

_$class._resPath=Engine.runtimeEnvironment.getResPath("js.dom");
_$class.getScreenLeft=function(elObj){
	var left=window.screenLeft;
	for(var node=elObj;node&&typeof(node.offsetLeft)!="undefined";node=node.offsetParent){			
		left+=node.offsetLeft;
	}
	//减去滚动距离
	left-=document.body.scrollLeft;
	return left+2;
}
_$class.getScreenTop=function(elObj){
	var top=window.screenTop;
	var offset=0;
	for(var oWindow=window;;oWindow=oWindow.parent){
		if(oWindow.frameElement&&oWindow.frameElement.nodeName=="IFRAME"){
			offset+=this.getTopOnWindow(oWindow.frameElement);
		}
		if(oWindow==oWindow.parent) break;
	}	
	top-=offset;		//IE取screenTop的BUG,用此修正.
	for(var node=elObj;node&&typeof(node.offsetTop)!="undefined";node=node.offsetParent){			
		top+=node.offsetTop;
	}
	//减去滚动距离
	top-=document.body.scrollTop;
	return top+2;
}
_$class.getScreenRight=function(elObj){
	return this.getScreenLeft(elObj)+this.getWindowWidth(elObj)-1;
}
_$class.getScreenBottom=function(elObj){
	return this.getScreenTop(elObj)+this.getWindowHeight(elObj)-1;
}
_$class.getWindowWidth=function(elObj){
	var width=elObj.offsetWidth;
	return width;
}
_$class.getWindowHeight=function(elObj){
	var height=elObj.offsetHeight;
	return height;
}
/**
 * 获取页面的内容高度或最小内容高度(包括所有边距)
 * @description: 可用于外框架的自动高度调整
 */
_$class.getDocHeight=function(doc){
	if(Global.Browser.Engine.trident){
		if(doc.compatMode!="CSS1Compat"){
			return doc.body.scrollHeight;
		}else{
			//可支持IE6、IE7, 对于IE8+，必须压缩窗口使之出现滚动条才能正常获取
			return doc.documentElement.scrollHeight;
		}
	}else{
		//可完全支持Firefox 11+、Opea 11.61+
		//对于Chrome 19 支持标准模式，兼容模式下必须压缩窗口才能正常获取
		return doc.documentElement.offsetHeight;
	}
}
_$class.getLeftOnDoc=function(elObj){
	var retValue=0;
	for(;elObj;elObj=elObj.offsetParent){
		retValue+=elObj.offsetLeft;
	}
	return retValue;
}
_$class.getTopOnDoc=function(elObj){
	var retValue=0;
	for(;elObj;elObj=elObj.offsetParent){
		retValue+=elObj.offsetTop;
	}
	return retValue;
}
_$class.getRightOnDoc=function(elObj){
	return this.getLeftOnDoc(elObj)+this.getWindowWidth(elObj)-1;
}
_$class.getBottomOnDoc=function(elObj){
	return this.getTopOnDoc(elObj)+this.getWindowHeight(elObj)-1;
}
_$class.contains=function(elWrap,elChild){
	while(elChild && typeof(elChild.parentNode) != "undefined"){
		if(elWrap == elChild) return true;
		elChild = elChild.parentNode;
	}
	return false;
};

/**
 * set class name of style of html element
 * @param: 
 *	(1)elObj
 *	(2)iOptions: 0,添加；1,删除；2,更新；3,替换
 *	(3)className:
 *	(4)className1: 如果选项为"替换"，则必选
 * @update: 2009.11.11-2009.12.18
 */
_$class.setStyleClass=function(elObj,iOptions,className,className1){
	var aClasses=elObj.getAttribute("class").split(" ").trim();
	var index=aClasses.findElement(className,true);
	switch(iOptions){
		case undefined:
		case 0:		//add
			if(index>=0){
				return;
			}else{
				aClasses.addElement(className);
				elObj.className=aClasses.join(" ");
			}
			break;
		case 1:		//delete
			if(index>=0) { 
				aClasses.removeElement(index);
				elObj.className=aClasses.join(" ");
			}
			break;
		case 2:		//update
			if(index>=0) { 
				aClasses[index]=className;
				elObj.className=aClasses.join(" ");
			}else{
				aClasses.addElement(className);
				elObj.className=aClasses.join(" ");
			}
			break;
		case 3:		//replace
			if(index>=0){
				aClasses[index]=className1;
				elObj.className=aClasses.join(" ");
			}else if(aClasses.findElement(className1,true)<0){
				aClasses.addElement(className1);
				elObj.className=aClasses.join(" ");
			}
			break;
	}
}
/**
 * @created: 2011.9.13
 */
_$class.setInnerHTML=function(el,htmlCode){
	if(Browser.Engine.name=="trident") {  
		htmlCode = '<div style="display:none">for IE</div>' + htmlCode;  
		htmlCode = htmlCode.replace(/<script([^>]*)>/gi,'<script$1 defer>');  
		el.innerHTML = '';  
		el.innerHTML = htmlCode;  
		el.removeChild(el.firstChild);  
	} else {  
		var el_next = el.nextSibling;  
		var el_parent = el.parentNode;  
		el_parent.removeChild(el);  
		el.innerHTML = htmlCode;  
		if (el_next) {  
			el_parent.insertBefore(el, el_next);
		} else {  
		    el_parent.appendChild(el);  
		}  
	}
}
/**
 * @since: v0.9
 * @description: 回车换行不管存储1个还是2个字符都算做一个显示字符
 * @created: 2013.3.21
 * @modified: 2013.3.21
 */
_$class.getTextCursorPosition=function(el,isRichText){
	try{ el.focus(); }catch(e){}
	if(!isRichText){
		if(document.selection){
			/* //没有解决换行的问题，在换行后的新行开始的位置获取不对
			var len = isRichText? el.innerText.length:el.value.length;
			var rngSel = document.selection.createRange();	//建立选择域
			var rngTxt = el.createTextRange();	//建立文本域
			var flag = rngSel.getBookmark();	//用选择域建立书签
			rngTxt.collapse();			//瓦解文本域到开始位,以便使标志位移动
			rngTxt.moveToBookmark(flag);		//使文本域移动到书签位
			rngTxt.moveStart('character',-len);		//获得文本域左侧文本
			return rngTxt.text.replace(/\r\n/g,'\n').length;
			*/
			var rngSel = document.selection.createRange();	//建立选择域
			if(rngSel.parentElement()!=el) return;
			var rngTxt = document.body.createTextRange();	//建立文本域
			rngTxt.moveToElementText(el);
			var start=-1;
			for(start=0;rngTxt.compareEndPoints("StartToStart",rngSel)<0;start++){
				rngTxt.moveStart('character',1);
			}
			return start;
		}else if(typeof(el.selectionStart)=="number"){
			return el.selectionStart;
		}
	}else{
		if(document.selection){
			var rngSel = document.selection.createRange();	//建立选择域
			var rngTxt = document.body.createTextRange();	//建立文本域
			rngTxt.moveToElementText(el);
			var start=-1;
			for(start=0;rngTxt.compareEndPoints("StartToStart",rngSel)<0;start++){
				rngTxt.moveStart('character',1);
			}
			return start;
		}else if(window.getSelection){
			//var rng=getSelection().getRangeAt(0).startContainer;
			//todo...
		}
	}
	return -1;
}
/**
 * @suport: IE6+, Firefox, Chrome, Safari, Opera
 * @since: v0.9
 * @created: 2013.3.21
 * @modified: 2013.3.21
 */
_$class.setTextCursorPosition=function(el,isRichText,pos){
	if(!isRichText){
		if(el.setSelectionRange){
			el.focus(); 
			el.setSelectionRange(pos,pos);
		}else if(el.createTextRange){
			var range = el.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}else{
		if(document.selection){
			var range = document.body.createTextRange();
			range.moveToElementText(el);
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}else{
			//for other browser
			//todo...
		}
	}
}
/**
 * @since: v0.9
 * @created: 2013.3.21
 * @modified: 2013.3.21
 */
_$class.getSelectionPositions=function(el,isRichText){
	try{ el.focus(); }catch(e){}
	if(document.selection){	
		var rngSel = document.selection.createRange();	//建立选择域
		//if(rngSel.parentElement()!=el) return;
		var rngTxt = document.body.createTextRange();	//建立文本域
		rngTxt.moveToElementText(el);
		var start=-1;
		for(start=0;rngTxt.compareEndPoints("StartToStart",rngSel)<0;start++){
			rngTxt.moveStart('character',1);
		}
		var rngTxt = document.body.createTextRange();	//建立文本域
		rngTxt.moveToElementText(el);	
		var end=-1;
		for(end=0;rngTxt.compareEndPoints('StartToEnd',rngSel)<0;end++){
			rngTxt.moveStart('character',1);
		}
		return [start,end];
	}else if(typeof(el.selectionStart)=="number"){
		return [el.selectionStart,el.selectionEnd];
	}else{
		//for other browser
		//to do...
	}
}
/**
 * @suport: IE6+, Firefox, Chrome, Safari, Opera
 * @since: v0.9
 * @created: 2013.3.21
 * @modified: 2013.3.21
 */
_$class.insertText=function(el,text,pos){
	if(pos!=undefined) this.setTextCursorPosition(el,false,pos);
	try{ el.focus(); }catch(e){}
	if(document.selection){
		var tR=document.selection.createRange(); 	// 获取该焦点的对象
		tR.text=text; 	// 在光标处执行粘贴
	}else if(typeof(el.selectionStart)=="number"){
		pos=pos!=undefined?pos:el.selectionStart;
		var pre=el.value.substr(0,el.selectionStart);
		var post=el.value.substr(el.selectionEnd);
		el.value=pre+text+post;
		this.setTextCursorPosition(el,false,pos+text.length);
	}
}
/**
 * @suport: IE6+, Firefox, Chrome, Safari, Opera
 * @since: v0.9
 * @created: 2013.3.21
 * @modified: 2013.3.21
 */
_$class.insertHTML=function(el,html,pos){
	if(pos!=undefined) this.setTextCursorPosition(pos,true,pos);
	try{ el.focus(); }catch(e){}
	if(document.selection){
		var tR=document.selection.createRange(); 	// 获取该焦点的对象
		tR.pasteHTML(html); 	// 在光标处执行粘贴
	}else{
		document.execCommand("insertHTML",false,html);
	}
}
/**
 * @suport: IE6+, Firefox, Chrome, Safari, Opera
 * @since: v0.1
 * @para text
 * @created: 2013.5.30
 * @modified: 2013.5.30
 */
_$class.copyToClipboard=function(text){
	if(window.clipboardData) {	//for IE
        window.clipboardData.clearData();
        clipboardData.setData("Text", text);
	}else if(navigator.userAgent.indexOf("Opera") != -1) {
        window.location = text;
    }else if(window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if(!clip) return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if(!trans) return;
        trans.addDataFlavor("text/unicode");
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = text;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip) return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
    }
}
/**
 * @suport: IE6+, Firefox, Chrome, Safari, Opera
 * @since: v0.10
 * @para callback(newData,oldData)
 * @created: 2013.5.30
 * @modified: 2013.5.30
 */
_$class.pasteText=function(event,fnText,callback){
	var _this=this;
	if(window.clipboardData){	//for IE
		event.returnValue=false;
		try{
			var data=window.clipboardData.getData("Text");
			var data1=!!fnText?(fnText(data)||""):data;
			this.insertText(event.srcElement,data1);
			if(callback) callback(data1,data);
		}catch(e){}
	}else if(event.clipboardData){	//for web-kit
		event.returnValue=false;
		try{
			var data=event.clipboardData.getData("text/plain");	//有问题，还要判断原始拷贝是否为富文本模式，否则会把html纯文本进行解析
			var data1=!!fnText?(fnText(data)||""):data;
			this.insertHTML(event.srcElement,data1);
			if(callback) callback(data1,data);
		}catch(e){}
	}else{		//for firefox 不支持在纯文本框或文本区内
		var div=document.body.appendChild(document.createElement("div"));
		div.style.width="1px";
		div.style.height="1px";
		div.style.overflow="hidden";
		div.style.position="absolute";
		div.style.top="-1000px";
		div.contentEditable="true";div.style.backgroundColor='red';
		div.innerHTML="";
		div.focus();
		var srcElement=event.srcElement;
		window.setTimeout(function(){
			try{
				var data=div.textContent;
				var data1=!!fnText?(fnText(data)||""):data;
				document.body.removeChild(div);
				_this.insertHTML(srcElement,data1);
				if(callback) callback(data1,data);
			}catch(e){}
		},0);
	}

}
/**
 * @suport: IE6+, Firefox, Chrome, Safari, Opera
 * @since: v0.10
 * @created: 2013.5.30
 * @modified: 2013.5.30
 */
_$class.pasteHTML=function(event,fnHtml,callback){

}