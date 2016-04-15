/**
 * @file JSTemplate.js
 * @version 1.0
 * @author Liu Denggao
 * @created 2011.11.03
 * @modified 2011.11.03
 * @since JSDK3 V1.7.5
 */

$package("js.build");


js.build.JSTemplate=function(sCode){
	this._processor;
	this._subs=[];
	this._subData=[];
	this._srcPath="";
	this._JSTemplate(sCode);
};
var _$class=js.build.JSTemplate;
_$class.$name="JSTemplate";
_$class.$extends("Object");
var _$proto=_$class.prototype;

//:constructor----------------

_$class.newInstanceWithUrl=function(sUrl){
	var tpl=new this();
	tpl._JSTemplateFromUrl(sUrl);
	return tpl;
}
_$proto._JSTemplate=function(sCode){
	if(!sCode) return;
	this._JSTemplateFromCode(sCode);
}
_$proto._JSTemplateFromUrl=function(sUrl){
	this._srcPath=sUrl;
	this._JSTemplateFromCode(Global.get(sUrl,"",false,"","Text"));
}
_$proto._JSTemplateFromCode=function(sCode){
	var codes=[];
	var strs=Global.obj(sCode).xsplit("group",["<%#","%>","<%=","%>","<%","%>","<script>","</script>","<script ","></script>"]);
	var startOfScript = "\t__scripts.push(";
    var endOfScript = ");\n";
	for(var i=0,iLen=strs.length;i<iLen;i++){
		switch(strs[i][0]){
			case "<%#%>":
				//process comment
				break;
			case "<%=%>":
				//process variante
				codes.push(startOfScript,strs[i][1],endOfScript);
				break;
			case "<%%>":
				//process script
				codes.push(strs[i][1]);
				break;
			case "<script></script>":
				codes.push(startOfScript,Global.obj(strs[i][1]).serialize(),endOfScript);
				break;
			case "<script ></script>":		//路径为相对本模版的路径, 格式为："src="" type="script|template" data="${varname}""
				var attribs=strs[i][1].trim().match(/(src|type|data)=\"([^\"]+)\"/g);
				if(!attribs) break;
				attribs.forEach(function(item,index,array){
					var values=item.match(/^([^\"]+)=\"([^\"]+)\"$/)||[null,"",""];
					attribs[values[1]]=values[2];
				},attribs);
				if(attribs.src){
					try{
						var newFilePath=!this._srcPath?attribs.src:Global.getURIFullPath(this._srcPath.leftBack("/"),attribs.src,"/");
						if(attribs.type!="template"){
							codes.push(startOfScript,Global.get(newFilePath,"",false,"","Text").serialize(),endOfScript);
						}else{
							var tpl1=this.getClass().newInstanceWithUrl(newFilePath);
							if(!attribs.data){	//later parse
								this._subs.push(tpl1);
								codes.push(startOfScript,"this._subs[\""+(this._subs.length-1)+"\"].parse(json)",endOfScript);
							}else if(/\$\{[^\$\{\}]*\}/.test(attribs.data)){	//later parse
								this._subs.push(tpl1);
								codes.push(startOfScript,"this._subs[\""+(this._subs.length-1)
										+"\"].parse("+attrib.data.match(/^\$\{([^\$\{\}]*)\}$/).pop()+")",endOfScript);
							}else{	//implement parse
								try{
									var data=Global.get(!this._srcPath?attribs.data
											:Global.getURIFullPath(this._srcPath.leftBack("/"),attribs.data,"/"),"",false,"","JSON");
								}catch(e){
								}
								if(data) codes.push(startOfHTML,Global.obj(tpl1.parse(data)).serialize(),endOfHTML);
							}							
						}
						
						
					}catch(e){
					}
				}
				break;
		}
	}
	this._processor=new Function("json", "var __scripts = [];\n with(json){"+codes.join("") + '};return __scripts.join("");');
}

//:property-------------------------


//:method--------------------------

_$proto.parse=function(json){
	return sCode=this._processor(json||{});
}

