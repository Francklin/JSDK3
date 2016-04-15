(function(){

var elScript;
function getTagAttribs(incAttribs){
	var oAttribs={};
	for(var scripts=document.getElementsByTagName("SCRIPT"),i=scripts.length-1;i>=0;i--){
		if(scripts[i].src.search(/\bparse\.js$/i)>=0) {
			elScript=scripts[i]; break;
		}
	}
	if(!elScript) return null;
	for(var i=0;i<incAttribs.length;i++){
		oAttribs[incAttribs[i]]=elScript.getAttribute(incAttribs[i]);
	}
	oAttribs.text=elScript.text;
	return oAttribs;
}

var para=getTagAttribs(["template","target","data","dataType"]);
if(!para.template||!para.data) return;
if(para.template.slice(0,1)=="#"){
	var tmpl=jsdk.DOMTemplate.newInstanceWithId(para.template.slice(1));
}else{
	var tmpl=jsdk.DOMTemplate.newInstanceWithUrl(para.template);
}
if(!para.target){
	tmpl.setIsOnsiteOutput(true);
	if(para.template.slice(0,1)!="#") tmpl.setTarget(elScript);
}else if(para.target.slice(0,1)=="#"){
	tmpl.setIsOnsiteOutput(true);
	tmpl.setTarget(jsdk.dom(para.target).getFirst());
} 
eval("var func="+(para.text||"''"));
if(para.data.slice(0,1)=="$"){
	var data=eval(para.data.middle("${","}",1)); 
	data=para.dataType=="xml"&&jsdk.xml2json(data)||data;
	tmpl.parse(data,"",func);
}else{
	jsdk.get(para.data,"",false,function(data1){
		data1=para.dataType=="xml"&&jsdk.xml2json(data1)||data1;
		tmpl.parse(data1,"",func);
	},para.dataType||"json");
}

})();