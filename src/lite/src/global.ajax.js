/**
 * global function for ajax for lite edition
 * @file: function.ajax.js
 * @version: V2.3.1 beta
 * @support: IE6+, IE9+, Firefox3+, Chrome13+, Safari5+, Opera11+
 * @author: liu denggao
 * @created: 2011.7.26
 * @modified: 2013.4.12-2013.8.6
 ********************************/

/**
 *  ajax
 * @since: JSDK3 V1.7.7
 * @invoke: 
 *		(1)ajax(url[,settings])
 *		(2)ajax(settings)
 * @para settings:
 *		.type: default: 'GET'. Can is 'GET' or 'POST'
 *		.xhr: XMLHttpRequest
 *		.url:
 *		.data:
 *		.cache: default: true
 *		.async: default: true
 *		.contentType:	default: 'application/x-www-form-urlencoded'
 *		.mimeType: 
 *		.charset: charset of response
 *		.context: 
 *		.complete: callback function on success or error. usage:
 *			complete(xhr,textStatus)
 *		.success: callback function on success. usage: 
 *			success(data,textStatus,xhr)
 *		.error: callback functon on error. usage:
 *			error(xhr,textStatus,errorThrown)
 *		.convert: charset convert program. usage:
 *			convert(bstr)
 *		.dataType: bin,text,json,xml
 * @description: 
 * @author: liudenggao
 * @created: 2012.3.9
 * @modified: 2012.3.16-2013.8.6
 */
"ajax": function(){
	//var loader=Engine.getLoader();
	var global=this;
	var _xmlHttp=loader.getXMLHttpRequest();
	var _xmlDom=loader.getXMLDOMDocument();
	var _xmlParser=loader.getXMLDOMParser();
	function get(settings,xmlHttp,url,data){
		url=url.replace(/^\/[^/\:]+\:\//,"/");	//for local file for IE
		if(data){
			if(typeof(data)=="object"){
				data=serialize(data,"PRMT");
			}
			url+=(url.match(/\?/) ? "&" : "?") + data;
		}
		xmlHttp.open("GET", url, settings.async);
		if(xmlHttp.overrideMimeType) { //Firefox
			xmlHttp.overrideMimeType(settings.mimeType+(settings.charset?("; charset="+settings.charset):"")); 
		}
		if(data){
			xmlHttp.setRequestHeader("Content-Type", settings.contentType);
			data=null;
		}
		if(!settings.cache){
			xmlHttp.setRequestHeader("Pragma","no-cache");
			xmlHttp.setRequestHeader("If-Modified-Since","0");
		}
		if(settings.async){
			xmlHttp.onreadystatechange=function(){
				onReadyStateChange(settings,xmlHttp);
			};
			xmlHttp.send(null);
		}else{
			xmlHttp.send(null);
			return onReadyStateChange(settings,xmlHttp);
		}
	}
	function post(settings,xmlHttp,url,data){
		if(data){
			if(typeof(data)=="object"){
				data=serialize(data,"PRMT");
			}
		}
		xmlHttp.open("POST", url, settings.async);
		if(xmlHttp.overrideMimeType) { //Firefox
			xmlHttp.overrideMimeType(settings.mimeType+(settings.charset?("; charset="+settings.charset):"")); 
		}
		xmlHttp.setRequestHeader("Content-Type", settings.contentType);
		if(settings.async){
			xmlHttp.onreadystatechange=function(){
				onReadyStateChange(settings,xmlHttp);
			};
			xmlHttp.send(data);
		}else{
			xmlHttp.send(data);
			return onReadyStateChange(settings,xmlHttp);
		}
	}
	function onReadyStateChange(settings,xmlHttp){
		var content="";
		if(xmlHttp.readyState == 4) {	//data receive completed
		   //200 return OK of request status
		   if(xmlHttp.status == 200) {
				try{
					content=getOnReady(xmlHttp,settings.dataType,settings.charset,settings.convert);
					settings.complete.call(settings.context,xmlHttp,"");
					settings.success.call(settings.context,content,"",xmlHttp);
					return content;
				}catch(e){
				}
		   }else if(xmlHttp.status == 0
				&&!xmlHttp.getAllResponseHeaders()){
				try{
					content=getOnReady(xmlHttp,settings.dataType,settings.charset,settings.convert);
					settings.complete.call(settings.context,xmlHttp,"");
					settings.success.call(settings.context,content,"",xmlHttp);
					return content;
				}catch(e){
				}
		   }else{
				return settings.error(xmlHttp,"","get resource error !");
		   }
		}
	}
	function getOnReady(xmlHttp,sFormat,sCharset,fpConvert){
		var contentType=xmlHttp.getResponseHeader("Content-Type").split(";")[0];
		switch(sFormat.toLowerCase()){
			case "text":
				return getTextOnReady(xmlHttp,sCharset,fpConvert);
			case "xml":
				var xml;
				try{
					var _xmlDom=loader.getXMLDOMDocument();
					if(contentType=="text/xml"||contentType=="application/xml"||xmlHttp.overrideMimeType){
						if(_xmlParser){
							xml=_xmlParser.parseFromString(xmlHttp.responseText,"text/xml");
						}else{
							xml=xmlHttp.responseXML;
						}
					}else if(contentType==""||contentType=="application/octet_stream"){
						if(_xmlParser){
							xml=_xmlParser.parseFromString(xmlHttp.responseText,"text/xml");
						}else if(_xmlDom){
							_xmlDom.loadXML(getTextOnReady(xmlHttp,sCharset,fpConvert)
									.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
							xml=_xmlDom;
						}
					}else if(contentType.split("/")[0]=="text"){
						if(_xmlParser){
							xml=_xmlParser.parseFromString(xmlHttp.responseText,"text/xml");
						}else if(_xmlDom){
							_xmlDom.loadXML(getTextOnReady(xmlHttp,sCharset,fpConvert)
									.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
							xml=_xmlDom;
						}
					}
					if(xml&&xml.documentElement
						&&xml.documentElement.nodeName.toLowerCase()!="parsererror") 
						return xml;
				}catch(e){
				}
				return null;
			case "json":
				try{
					var func=new Function("return("+getTextOnReady(xmlHttp,sCharset,fpConvert)+");");
				}catch(e){
				}
				return !!func?func():func;
			default:
				return xmlHttp.responseBody;
		}
	}
	function getTextOnReady(xmlHttp,sCharset,fpConvert){
		var origCharset=(""+xmlHttp.getResponseHeader("Content-Type")).right(";").right("charset=").valueOf();
		if(!xmlHttp.overrideMimeType&&!origCharset&&sCharset
			&&typeof(fpConvert)=="function"){
			return fpConvert(global.bin2str(xmlHttp.responseBody));
		}
		return xmlHttp.responseText;
	}
	function serialize(obj,dataType){
		dataType=dataType||"JSON";
		switch(dataType.toUpperCase()){
			case "JSON":
				//to do...
				break;
			case "PRMT":
				var values=[];
				for(var key in obj){
					if(obj.hasOwnProperty(key))
						values[values.length]=encodeURIComponent(key)+"="+encodeURIComponent(obj[key].toString());
				}
				return values.join("&");
		}
	}
	return function(arg1,arg2){
		//if(!global) global=Engine.getApp();
		var settings={
			type: "GET",
			xhr: _xmlHttp,
			url: "",
			data: "",
			cache: true,
			async: true,
			charset: "",
			mimeType: "",
			contentType: 'application/x-www-form-urlencoded',
			context: null,
			complete: function(xhr,textStatus){
			
			},
			success: function(data,textStatus,xhr){
			
			},
			error: function(xhr, textStatus, errorThrown){
			
			},
			convert: null,
			dataType: "bin"
		};	
		var settings1;
		if(arg1&&!(arg1 instanceof String)){
			settings1=arg1;
		}else if(arg2){
			settings1=arg2;
		}
		for(var key in settings1){
			if(settings1.hasOwnProperty(key)){
				settings[key]=settings1[key];
			}
		}
		if(arg1 instanceof String){
			settings.url=arg1;
		}
		if(settings.async){
			settings.xhr=loader.getXMLHttpRequest();
		}
		if(!settings.mimeType){
			switch(settings.dataType.toLowerCase()){
				case "bin":
					settings.mimeType="application/octet_stream";break;
				case "text":
					settings.mimeType="text/plain";break;
				case "json":
					settings.mimeType="text/plain";break;
				case "xml":
					settings.mimeType="text/xml";break;
				default:
					settings.mimeType="application/octet_stream";break;
			}
		}
		settings.context=settings;
		if(settings.type=="GET"){
			return get(settings,settings.xhr,settings.url,settings.data);
		}else if(settings.type=="POST"){
			return post(settings,settings.xhr,settings.url,settings.data);
		}
	}
}(),

/**
 * get
 * @since: JSDK3 V1.2.4
 * @author: liudenggao
 * @created: 2011.6.23
 * @modified: 2012.03.16
 * @log: solve an problem caused by multiple asynchronous operations.
 */
"get": function(sUrl,vData,isCache,fpCallBack,sDataType,sCharset,fpConvert){
	var settings={
		type: "GET",
		url: sUrl,
		data: vData,
		cache: isCache,
		async: !!fpCallBack,
		charset: sCharset
	};
	if(typeof(fpCallBack)=="function"){
		settings.success=fpCallBack;
	}
	if(sDataType){
		settings.dataType=sDataType;
	}
	if(typeof(fpConvert)=="function"){
		settings.convert=fpConvert;
	}
	return this.ajax(settings);
},

/**
 *  post
 * @since: JSDK3 V1.7.7
 * @author: liudenggao
 * @created: 2012.3.9
 * @modified: 2012.3.9
 */
"post": function(sUrl,vData,fpCallBack,sDataType){
	var settings={
		type: "POST",
		url: sUrl,
		data: vData,
		async: !!fpCallBack
	};
	if(typeof(fpCallBack)=="function"){
		settings.success=fpCallBack;
	}
	if(sDataType){
		settings.dataType=sDataType;
	}
	return this.ajax(settings);
},

/**
 * get image size
 * @source:
	 * -------------
	 * 图片头数据加载就绪事件 - 更快获取图片尺寸
	 * @version	2011.05.27
	 * @author	TangBin
	 * @see		http://www.planeart.cn/?p=1121
	 * @param	{String}	图片路径
	 * @param	{Function}	尺寸就绪
	 * @param	{Function}	加载完毕 (可选)
	 * @param	{Function}	加载错误 (可选)
	 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
			alert('size ready: width=' + this.width + '; height=' + this.height);
		});
	 * -------------
 * @modifier: liudenggao
 * @created: 2013.4.12
 */
"getImage": (function () {
	var list = [], intervalId = null,

	// 用来执行队列
	tick = function () {
		var i = 0;
		for (; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i]();
		};
		!list.length && stop();
	},

	// 停止所有定时器队列
	stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, load, error) {
		var onready, width, height, newWidth, newHeight,
			img = new Image();
		
		img.src = url;

		// 如果图片被缓存，则直接返回缓存数据
		if (img.complete) {
			ready.call(img);
			load && load.call(img);
			return;
		};
		
		width = img.width;
		height = img.height;
		
		// 加载错误后的事件
		img.onerror = function () {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};
		
		// 图片尺寸就绪
		onready = function () {
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height ||
				// 如果图片已经在其他地方加载可使用面积检测
				newWidth * newHeight > 1024
			) {
				ready.call(img);
				onready.end = true;
			};
		};
		onready();
		
		// 完全加载完毕的事件
		img.onload = function () {
			// onload在定时器时间差范围内可能比onready快
			// 这里进行检查并保证onready优先执行
			!onready.end && onready();
		
			load && load.call(img);
			
			// IE gif动画会循环执行onload，置空onload即可
			img = img.onload = img.onerror = null;
		};

		// 加入队列中定期执行
		if (!onready.end) {
			list.push(onready);
			// 无论何时只允许出现一个定时器，减少浏览器性能损耗
			if (intervalId === null) intervalId = setInterval(tick, 40);
		};
	};
})()

