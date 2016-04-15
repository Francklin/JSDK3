/**
 * global function for document
 * @file: function.dom.js
 * @version: V2.5
 * @author: liu denggao
 * @created: 2011.07.01
 * @modified: 2012.12.19
 **************************/

"dom": function(value,obj){
	var element=null;
	var elements=[];
	var className="";
	obj=obj||document;
	function getNodesByClassNames(aNodes,aClassNames){
		return aNodes.select(function(element){
			if(element.nodeName.charAt(0)=="#") return false;
			var className1=(element.getAttribute("class")||element.getAttribute("className")||"").trim();
			var classNames1=className1=""?[]:className1.split(" ");
			return aClassNames.belongTo(classNames1,true,true);
		});
	}
	function getChildNodesByClassNames(node,sTagName,aClassNames,sId){
		var nodes=(node||document).getElementsByTagName(sTagName||"*");
		var nodes1=[];
		for(var i=0;i<nodes.length;i++){
			var node1=nodes[i];
			if(node1.nodeName.charAt(0)=="#") continue;
			if(sId&&node1.getAttribute("id")!=sId) continue;
			var className1=(node1.getAttribute("class")||node1.getAttribute("className")||"").trim();
			var classNames1=className1==""?[]:className1.split(" ");
			if(aClassNames.belongTo(classNames1,true,true)){
				nodes1[nodes1.length]=node1;
			}
		}
		return nodes1;
	}
	function getChildNodesById(node,sId){
		var nodes=(node||document).getElementsByTagName("*");
		var nodes1=[];
		for(var i=0;i<nodes.length;i++){
			var node1=nodes[i];
			if(node1.nodeName.charAt(0)=="#") continue;
			if((node1.getAttribute("id")||"")==sId){
				nodes1[nodes1.length]=node1;
				break;
			}
		}
		return nodes1;
	}
	function getChildNodesByName(node,sName){
		var nodes=(node||document).getElementsByTagName("*");
		var nodes1=[],nodes2=[];
		var sName1=sName.toLowerCase();
		for(var i=0;i<nodes.length;i++){
			var node1=nodes[i];
			if(node1.nodeName.charAt(0)=="#") continue;
			if((node1.getAttribute("name")||"").toLowerCase()==sName1){
				nodes1[nodes1.length]=node1;
			}
			if(!nodes2.length&&node1.getAttribute("id")==sName){
				nodes2=[node1];
			}
		}
		return nodes1.length?nodes1:nodes2;
	}
	switch(typeof(value)){
		case "undefined":
			break;
		case "string":
			var selector=value;
			//syntax format of element selector: [tag][.class1[.class2[...]]][#id[#]]
			var regElementSel=/^([^\*\.\#\[\]\s]*)((?:\s*\.[^\*\.\#\[\]\s]+)*)(\s*#[^\*\.\#\[\]]+[\#]?)*$/;
			//syntax format of element selector: [tag][name='value']
			var regAttribSel=/^([^\*\.\#\[\]]*)\[([^\*\.\#\!\*\^\$\[\]\=]+)(([\!|\^|\$]?\=)\'([^\*\'\"\[\]]+)\')?\]$/;
			var matchs=null;
			if(selector==""){
				return null;
			}else if(selector=="*"){
				return Array.from(obj.getElementsByTagName("*"));
			}else if(matchs=selector.match(regElementSel)){
				if(!matchs[1]&&!matchs[2]&&matchs[3]&&obj==document){
					if(matchs[3].slice(-1)=="#"){
						elements=document.getElementsByName(matchs[3].slice(1,-1));
						if(elements.length) return Array.from(elements);
					}
					element=document.getElementById(matchs[3].slice(1));
					return element?[element]:[];
				}else{
					if(!matchs[1]){
						elements=[obj];
					}else{
						elements=obj.getElementsByTagName(matchs[1]);
					}
					if(matchs[2]){
						var elements1=[];
						var aClassNames=matchs[2].split(".").map(function(item){
							return item.trim();
						}).trim();
						for(var i=0;i<aClassNames.length;i++){
							for(var j=0,jLen=elements.length;j<jLen;j++){
								elements1.append(getChildNodesByClassNames(elements[j],"",[aClassNames[i]],""));
							}
							elements=elements1.unique();
							elements1=[];
						}
					}
					if(matchs[3]){
						var isFindAll=matchs[3].slice(-1)=="#";
						var id=matchs[3].match(/\s*\#([^#]+)\#?/)[1].trim();
						var elements1=[];
						if(!isFindAll){
							for(var j=0,jLen=elements.length;j<jLen;j++){
								elements1.append(getChildNodesById(elements[j],id));
								if(elements1.length) break;
							}
							elements=elements1;
							elements1=[];
						}else{
							for(var j=0,jLen=elements.length;j<jLen;j++){
								elements1.append(getChildNodesByName(elements[j],id));
							}
							elements=elements.length>1?elements1.unique():elements1;
							elements1=[];
						}
					}
					return Array.from(elements);
				}
			}else if(matchs=selector.match(regAttribSel)){
				var tagName=matchs[1];
				var attrName=matchs[2];
				var operate=matchs[4];
				var attrValue=matchs[5];
				var attrValue1;
				var atIndex;
				var elements1=[];
				elements=obj.getElementsByTagName(tagName||"*");
				if(!attrName){
					return Array.from(elements);
				}if(!attrValue){
					for(var i=0,iLen=elements.length;i<iLen;i++){
						element=elements[i];
						if(element.nodeName.charAt(0)=="#") continue;
						if(element.getAttribute("name")!=null){
							elements1[elements1.length]=element;
						}
					}
					return elements1;
				}else{
					for(var i=0,iLen=elements.length;i<iLen;i++){
						element=elements[i];
						if(element.nodeName.charAt(0)=="#") continue;						
						if(element.getAttribute(attrName)!=null){
							attrValue1=element.getAttribute(attrName).toString();
							switch(operate){
								case "=":
									if(attrValue1==attrValue){
										elements1[elements1.length]=element;
									}
									break;
								case "!=":
									if(attrValue1!=attrValue){
										elements1[elements1.length]=element;
									}
									break;
								case "*=":
									if(attrValue1.indexOf(attrValue)>=0){
										elements1[elements1.length]=element;
									}
									break;
								case "^=":
									if(attrValue1.indexOf(attrValue)==0){
										elements1[elements1.length]=element;
									}
									break;
								case "$=":
									atIndex=attrValue1.lastIndexOf(attrValue);
									if(atIndex>=0&&attrValue1.slice(atIndex)==attrValue){
										elements1[elements1.length]=element;
									}
									break;
							}
							
						}
					}
					return elements1;
				}
			}
			break;
	}
	return [];
}