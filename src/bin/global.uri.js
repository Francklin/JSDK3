/**
 * global function for URI(Uniform Resource Identifier)
 * @file: function.js
 * @author: liu denggao
 * @created: 2011.7.27
 * @modified: 2011.11.16
 **************************/

/**
 * get full path of 'sUrlPath' on current path 'sCurPath'
 * @para sSep: can only as a char 
 * @created: 2011.7.27
 * @modified: 2011.11.16
 */
"getURIFullPath" : function(sCurPath,sUriPath,sSep){
	sCurPath=sCurPath.replace(new RegExp("\\"+sSep+"+$"),"");
	sSep=sSep?sSep:"/";
	var aValues=sUriPath.split(sSep);
	if(sUriPath==""){
		return sCurPath;
	}else if(aValues[0]==""){
		return sUriPath;
	}else if(aValues[0].indexOf(":")>=0){		//is full path
		return sUriPath;
	}else if(aValues[0]=="."){
		return arguments.callee(sCurPath,aValues.slice(1).join(sSep),sSep);
	}else if(aValues[0]==".."){
		if(sCurPath.indexOf(sSep)>=0){
			return arguments.callee(sCurPath.slice(0,sCurPath.lastIndexOf(sSep))
				,aValues.slice(1).join(sSep),sSep);
		}else{
			return arguments.callee(sCurPath,aValues.slice(1).join(sSep),sSep);
		}
	}else{
		return [sCurPath,sUriPath].join(sSep);
	}
},

/**
 * Get relative path
 * @description: not support cross query
 * @para sTargetPath: query by mode that is first up and down
 * @created 2011.7.27
 * @modified 2011.11.16
 */
"getURIRelPath" : function(sCurPath,sUriFullPath,sSep){
	sCurPath=sCurPath.replace(new RegExp("\\"+sSep+"+$"),"");
	sSep=sSep?sSep:"/";
	var aCurPaths=sCurPath.split(sSep);
	var aUriPaths=sUriFullPath.split(sSep);
	var iRelUpLevel=0,aRelUpPaths=[],aRelDownPaths=[];
	if(aCurPaths[0]==""){	//is absolute path
		iRelUpLevel=aCurPaths.length-1;
		aRelDownPaths=aUriPaths.slice(1);
	}else{
		for(var i=0;i<aCurPaths.length;i++){
			if(aCurPaths[i]=="."){
				aCurPaths.splice(i,1);
				i--;
			}
		}
		for(var i=0;i<aUriPaths.length;i++){
			if(aUriPaths[i]=="."){
				aUriPaths.splice(i,1);
				i--;
			}
		}
		if((aCurPaths[0]==".."||aUriPaths[0]=="..")&&(aCurPaths[0]!=aUriPaths[0])){
			return "";		//can not reach.
		}
		aCurPaths.unshift(".");
		aUriPaths.unshift(".");
	}
	for(var i=aCurPaths.length-1;i>=0;i--){
		if(aUriPaths.join(sSep).toLowerCase().indexOf(
			aCurPaths.slice(0,i+1).join(sSep).toLowerCase()+sSep)==0){
			iRelUpLevel=aCurPaths.length-1-i;
			aRelDownPaths=aUriPaths.slice(i+1);
			break;
		}
	}
	//up
	for(var i=0;i<iRelUpLevel;i++){
		aRelUpPaths[i]="..";
	}

	return [].concat(aRelUpPaths,aRelDownPaths).join(sSep);
},
/**
 * get parameter of url
 * @created: 2011.11.02
 * @modified: 2011.11.02
 */
"getURIPrmt" : function(sPrmts,sName){
	sPrmts=(sPrmts.toString().match(/^[^?]*[?]?([^?#]+)[#]?/)||[null,""]).pop();
	var items=sPrmts?sPrmts.split("&"):[];
	for(var i=0,j=0;i<items.length;i++){
		if(items[i]=="") continue;
		var sName1=decodeURIComponent(items[i].split("=")[0]);
		if(sName1.toLowerCase()==sName.toLowerCase()){
			return decodeURIComponent(items[i].right("=")); 
		}
	}
}

