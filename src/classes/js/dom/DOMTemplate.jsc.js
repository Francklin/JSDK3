/**
 * @file DOMTemplate.js
 * @version 3.0
 * @apply JSDK3 V1.9.0
 * @since JSDK3 V1.5.4
 * @author Liu Denggao
 * @created 2011.9.3
 * @modified 2013.3.28
 * @update 
 *		2014.01.21 给子模版增加了获取父模版传过来的参数变量，使在模版下面可使用$json,$para两个参变量
 *		2013.03.28 增加了引入子模版时的para属性，作为url的查询参数，可动态取父模版中的变量值
 *		2013.02.21 修复了无限循环嵌套子模版的问题，可以设定最大允许层级数
 *		2013.02.20 重新修复了parse方法不能设置输出容器为空的情况
 *		2013.02.19 扩展了嵌入子模版时的属性"src"格式，增加了按模版ID进行获取
 *		2013.02.19 修复了解析子模版时的一个问题
 *		2013.02.18 修复了parse方法不能设置输出容器为空的情况
 *		2012.12.21 给解析后的初始化函数增加了一个JSON参数，使初始化函数也能取到该JSON数据
 *		2012.09.29 修复了初始化事件时传入的输出容器参数的不正确性
 *		2012.09.07 修复了标签式解析功能对json类型的data属性执行没有返回值的问题。
 * @issue
 *		2013.02.21 仍然没有解决内嵌模版的maxLevels属性在循环被调用时依次递减的问题
 */

$package("js.dom");


js.dom.DOMTemplate=function(sCode){
	this._id="";
	this._type=0;		//0,main template; 1,sub template
	this._global=Global;
	this._processor;
	this._subs=[];
	this._subData=[];
	this._srcPath="";
	this._source;
	this._target;
	this._isOnsiteOutput=false;
	this._DOMTemplate(sCode);
};
var _$class=js.dom.DOMTemplate;
_$class.$name="DOMTemplate";
_$class.$extends("Object");
var _$proto=_$class.prototype;

//:constructor----------------

_$class._version="2.10";
_$class.newInstanceFromId=function(sId){
	var tpl=new this();
	tpl._DOMTemplateFromId(sId);
	return tpl;
}
//for sub template
_$class._newInstanceFromId=function(sId){
	var tpl=new this();
	tpl._type=1;
	tpl._DOMTemplateFromId(sId);
	return tpl;
}
_$class.newInstanceFromUrl=function(sUrl,isCache){
	var tpl=new this();
	tpl._DOMTemplateFromUrl(sUrl,isCache);
	return tpl;
}
//for sub template
_$class._newInstanceFromUrl=function(sUrl,isCache){
	var tpl=new this();
	tpl._type=1;
	tpl._DOMTemplateFromUrl(sUrl,isCache);
	return tpl;
}
//old,ready to abandon
_$class.newInstanceWithId=function(sId){
	var tpl=new this();
	tpl._DOMTemplateFromId(sId);
	return tpl;
}
//old, ready to abandon
_$class.newInstanceWithUrl=function(sUrl,isCache){
	var tpl=new this();
	tpl._DOMTemplateFromUrl(sUrl,isCache);
	return tpl;
}
_$proto._DOMTemplate=function(sCode){
	if(!sCode) return;
	this._DOMTemplateFromCode(sCode);
}
_$proto._DOMTemplateFromId=function(sId){
	var jsre=Engine.runtimeEnvironment;
	this._id=sId;
	var els=Global.dom("#"+sId);
	if(!els.length) throw "Element '"+sId+"' not found.";
	this._source=els[0];
	this._srcPath=els[0].getAttribute("src")?Global.getURIFullPath(jsre.getAppFullPath(),els[0].getAttribute("src"),"/"):"";
	this._DOMTemplateFromCode(els[0].text||els[0].value
		||(this._srcPath&&Global.get(this._srcPath,"",false,"","Text"))||"");
}
_$proto._DOMTemplateFromUrl=function(sUrl,isCache){
	var jsre=Engine.runtimeEnvironment;
	this._srcPath=Global.getURIFullPath(jsre.getAppFullPath(),sUrl,"/");
	this._DOMTemplateFromCode(Global.get(
		(jsre._isLocal&&this._srcPath.charAt(0)=="/"?"file://":"")
		+this._srcPath,"",isCache||(isCache==undefined),"","Text"));
}
_$proto._DOMTemplateFromCode=function(sCode){
	var codes=[];
	var jsre=Engine.runtimeEnvironment;
	var strs=Global.obj(sCode).xsplit("group",["<%#","%>","<%=","%>","<%","%>","${","}","<!--#include","-->"]);
	var startOfHTML = "\t__views.push(";
    var endOfHTML = ");\n";
	for(var i=0,iLen=strs.length;i<iLen;i++){
		switch(strs[i][0]){
			case "":
				codes.push(startOfHTML,Global.obj(strs[i][1]).serialize(),endOfHTML);
				break;
			case "<%#%>":
				//process comment
				break;
			case "<%=%>":
				//process variante
				codes.push(startOfHTML,strs[i][1],endOfHTML);
				break;
			case "<%%>":
				//process script
				codes.push(strs[i][1]);
				break;
			case "${}":
				codes.push(startOfHTML,strs[i][1],endOfHTML);
				break;
			case "<!--#include-->":		//路径为相对本模版的路径
				jsre.logger.log("parsing sub template...");
				var attribs=strs[i][1].trim().match(/(src|data|para|maxLevels)=\"([^\"]+)\"/g);
				if(!attribs) break;
				attribs.forEach(function(item,index,array){
					var values=item.match(/^([^\"]+)=\"([^\"]+)\"$/)||[null,"",""];
					attribs[values[1]]=values[2];
				},attribs);
				var maxLevels=parseInt("0"+attribs.maxLevels,10);
				try{
					if(!attribs.src){	//嵌套自己，自循环
						if(this._type==1){
							var tpl1=this;
						}else if(this._id){
							var tpl1=this.getClass()._newInstanceFromId(this._id);
						}else{
							var tpl1=this.getClass()._newInstanceFromUrl(this._srcPath);
						}
					}else if(attribs.src.charAt(0)=="#"){
						if(this._type==1&&attribs.src.slice(1)==this._id){
							var tpl1=this;
						}else{
							var tpl1=this.getClass()._newInstanceFromId(attribs.src.slice(1));
						}
					}else{
						var srcTpl1=Global.getURIFullPath(!this._srcPath?jsre.getAppFullPath()
								:this._srcPath.leftBack("/"),attribs.src,"/");
						if(this._type==1&&srcTpl1.toLowerCase()==this._srcPath.toLowerCase()){
							jsre.logger.log("find same sub template.");
							var tpl1=this;
						}else{
							var tpl1=this.getClass()._newInstanceFromUrl(srcTpl1,true);
						}
					}
					if(!attribs.data){	//later parse
						this._subs.push(tpl1);
						codes.push(startOfHTML,"this._subs[\""
							+(this._subs.length-1)+"\"].parse(json,'','',"
							+(maxLevels?("Math.min(_$maxLevels-1,"+maxLevels+")"):"_$maxLevels-1")
							+")",endOfHTML);
					}else if(/\$\{[^\$\{\}]*\}/.test(attribs.data)){	//later parse
						this._subs.push(tpl1);
						codes.push(startOfHTML,"this._subs[\""+(this._subs.length-1)
								+"\"].parse("+attribs.data.match(/^\$\{([^\$\{\}]*)\}$/).pop()+",'','',"
								+(maxLevels?("Math.min(_$maxLevels-1,"+maxLevels+")"):"_$maxLevels-1")
								+")",endOfHTML);
					}else if(attribs.para&&/\$\{[^\$\{\}]*\}/.test(attribs.para)){	//later parse
						var para=attribs.para.match(/^\$\{([^\$\{\}]*)\}$/).pop();
						var url=!this._srcPath?attribs.data:Global.getURIFullPath(
									this._srcPath.leftBack("/")||jsre.getAppFullPath(),attribs.data,"/");
						this._subs.push(tpl1);
						codes.push(startOfHTML,"this._subs[\""+(this._subs.length-1)
								+"\"].parse(this._global.get('"+url+"',"+para+",false,'','json'),'','',"
								+(maxLevels?("Math.min(_$maxLevels-1,"+maxLevels+")"):"_$maxLevels-1")
								+","+para+")",endOfHTML);
					}else{	//implement parse
						try{
							var para=attrib.para?({data: attribs.para}):"";
							var data=Global.get(!this._srcPath?attribs.data:Global.getURIFullPath(
									this._srcPath.leftBack("/")||jsre.getAppFullPath(),attribs.data,"/"),para,false,"","json");
						}catch(e){}
						if(data) codes.push(startOfHTML,Global.obj(
									tpl1.parse(data,'','',maxLevels?Math.min(9,maxLevels):9,attribs.para)
								).serialize(),endOfHTML);
					}
				}catch(e){
					jsre.logger.log("DOM Temlate '"+(this._id||this._srcPath||"(noname)")
						+"' has been created fail!\n\t Error: "+(e.message || e),true);
				}
				break;
		}
	}
	this._processor=new Function("$json","$para","_$maxLevels", "var __views = [];\n with($json){"+codes.join("") + '};return __views.join("");');
}

//:property-------------------------

_$class.defaultMaxLevels=10;
_$class.AllowSettingMaxLevels=100;
_$proto.getId=function(){
	return this._id;
}
_$proto.setId=function(value){
	this._id=value;
}
_$proto.getUrl=function(){
	return this._srcPath;
}
_$proto.getTarget=function(){
	return this._target;
}
_$proto.setTarget=function(value){
	this._target=value;
}
_$proto.getIsOnsiteOutput=function(){
	return this._isOnsiteOutput;
}
_$proto.setIsOnsiteOutput=function(value){
	this._isOnsiteOutput=value;
}

//:method--------------------------

/**
 * @invoke:
 *	(2)parse(tmpl,json[,vOutput[,fnInit]])
 *	(3)parse(htmlBlock)
 *	(4)parse(htmlBlocks)
 *		1)htmlBlocks: [htmlBlock,htmlBlock,...]
 *	(5)parse(tmplsParas) 
 *		1)tmplsParas: [[tmpl,json,vOutput,fnInit],[tmpl,json,vOutput,fnInit],...]
 * @since: v2.7
 * @created: 2012.4.19
 * @modified: 2013.2.20
 */
_$class.parse=function(){
	var argLen=arguments.length;
	if(argLen==1){
		if(Global.isArray(arguments[0])){
			if(Global.isArray(arguments[0].getFirst())){
				this._parseTmpls(arguments[0]);
			}else{
				this._parseBlocks(arguments[0]);
			}
		}else if(typeof(arguments[0])=="object"){
			this._parseBlock(arguments[0]);
		}
	}else if(argLen>1){
		this._parseTmpl.apply(this,arguments);
	}
}
_$class._parseTmpl=function(tmpl,json,vOutput,fnInit,maxLevels){
	if(typeof(tmpl)!="string"){
		//is obj
	}else if(tmpl.slice(0,1)=="#"){
		tmpl=this.newInstanceFromId(tmpl);
	}else{
		tmpl=this.newInstanceFromUrl(tmpl);
	}
	return tmpl.parse(json,vOutput,fnInit,maxLevels);
}
_$class._parseTmpls=function(tmplsParas){
	for(var i=0,iLen=tmplsParas.length;i<iLen;i++){
		this.parse.apply(this,tmplsParas[i]);
	}
}
/**
 * @para tagBlock: html data block for output, tag attributes: template,target,data,dataType
 * @modified: 2013.2.20
 */
_$class._parseBlock=function(tagBlock){
	var attribs=["template","target","data","dataType","maxLevels"];
	var para=attribs.associate(attribs.map(function(attribName){
		return tagBlock.getAttribute(attribName);
	}));
	para.text=tagBlock.text;
	if(!para.template||!para.data) return;
	if(para.template.slice(0,1)=="#"){
		var tmpl=this.newInstanceFromId(para.template.slice(1));
	}else{
		var tmpl=this.newInstanceFromUrl(para.template);
	}
	if(!para.target){
		tmpl.setIsOnsiteOutput(true);
		tmpl.setTarget(tagBlock);
	}else if(para.target.slice(0,1)=="#"){
		tmpl.setIsOnsiteOutput(true);
		tmpl.setTarget(Global.dom(para.target).getFirst());
	} 
	var func=para.text?Global.globalEval("(function(){return function(container,json){"+para.text+"};})()",null,true):"";
	if(para.data.slice(0,1)=="$"){
		var data=Global.globalEval(para.data.middle("${","}",1),null,true); 
		data=para.dataType=="xml"&&Global.xml2json(data)||data;
		tmpl.parse(data,"",func,para.maxLevels?parseInt(para.maxLevels,10):undefined);
	}else{
		Global.get(para.data,"",false,function(data1){
			data1=para.dataType=="xml"&&Global.xml2json(data1)||data1;
			tmpl.parse(data1,"",func,para.maxLevels?parseInt(para.maxLevels,this.defaultMaxLevels):undefined);
		},para.dataType||"json");
	}
}
_$class._parseBlocks=function(tagBlocks){
	for(var i=0,iLen=tagBlocks.length;i<iLen;i++){
		this._parseBlock(tagBlocks[i]);
	}
}
/**
 * parse template by json data
 * @para json: requied
 * @para vOutput: optional
 * @para fnInit: optional, fnInit(container,json)
 * @para iMaxLevels: optional, allow max levels number, default is 10.
 * @para para:
 * @modified: 2013.2.18-2014.1.21
 */
_$proto.parse=function(json,vOutput,fnInit,iMaxLevels,para){
	var jsre=Engine.runtimeEnvironment;
	iMaxLevels=Math.min(iMaxLevels==undefined?
		this.getClass().defaultMaxLevels:iMaxLevels,this.getClass().AllowSettingMaxLevels);
	try{
		if(iMaxLevels<=0) return;
		var sCode=this._processor(json||{},para,iMaxLevels);
		var oOutput;
		if(vOutput){
			if(typeof(vOutput)=="string"){
				oOutput=Global.dom("#"+vOutput)[0];
			}else{
				oOutput=vOutput;
			}
		}else if(this._target){
			oOutput=this._target;
		}else if(this._isOnsiteOutput){
			oOutput=this._source;
		}
		if(!oOutput){
			return sCode;
		}else if(this._isOnsiteOutput){
			var parser=document.createElement("div");
			var fragment = document.createDocumentFragment();
			parser.innerHTML=sCode;
			while (parser.firstChild) {
				fragment.appendChild(parser.firstChild);
			}
			var nodes=fragment.$childNodes||fragment.childNodes;
			var container=nodes.length>1?nodes:(nodes.length==1?nodes[0]:null);
			oOutput.parentNode.replaceChild(fragment, oOutput);
			oOutput=container;
		}else{
			oOutput.innerHTML=sCode;
		}
		if(typeof(fnInit)=="function"){
			try{
				fnInit(oOutput,json);
			}catch(e){ 
				jsre.logger.log("DOM Temlate '"+(this._id||this._srcPath||"(noname)")
					+"' has initialized fail in parsing!\n\t Error: "+(e.message || e),true);
			}
		}
	}catch(e){
		jsre.logger.log("DOM Temlate '"+(this._id||this._srcPath||"(noname)")
			+"' has parsed fail!\n\t Error: "+(e.message || e),true);
	}
	return sCode;
}
