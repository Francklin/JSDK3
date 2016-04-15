/**
 * Defines the String type.
 * @modified: 2013.8.29
 */
{
	"define": function(value) {
		this._value=(value||"").toString();
		this.length=this._value.length;
	},
	"extend": "Object",
	/**
	 * encapsulate(class|className,mode,instanceName[,staticMembers[,instanceMembers])
	 * @para mode: 0, direct, 1, indirect
	 */	
	"base": ["String",0,"_value",["fromCharCode"],[
		'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'replace', 'search',
		'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
	]],
	"toString" : function(){
		return this._value;
	},
	"valueOf" : function(){
		return this._value;
	},
	"trim" : function(){
		return Object(this.replace(/^\s+|\s+$/g, ''));
	},
	"ltrim" : function(sChars){
		return Object(this.replace(/^\s+/g, ''));
	},
	"rtrim" : function(sChars){
		return Object(this.replace(/\s+$/g, ''));
	},	
	"clean" : function(){
		return Object(this.replace(/\s+/g, ' ').trim());
	},
	"left" : function(subString){
		switch(typeof(subString)){
			case "string":
				var intAt=this.indexOf(subString);
				if(intAt<=0) return Object("");
				return Object(this.slice(0,intAt));
			case "number":
				var iLen=subString;
				return Object(this.slice(0,iLen));
			default:
				return Object("");
		}
	},
	"leftBack" : function(subString){
		var intAt=this.lastIndexOf(subString);
		if(intAt<=0) return Object("");
		return Object(this.slice(0,intAt));
	},
	"middle" : function(startStr,endStr,vOptions){
		vOptions=vOptions==undefined?0:vOptions;
		switch(vOptions){
			case 0:	//left
			case "left":
				var startIndex=this.indexOf(startStr);
				var endIndex=this.indexOf(endStr,startIndex+1);
				break;
			case 1: //max
			case "max":
				var startIndex=this.indexOf(startStr);
				var endIndex=this.lastIndexOf(endStr);
				break;
			case 2:	//right
			case "right":
				var endIndex=this.lastIndexOf(endStr);
				var startIndex=this.lastIndexOf(startStr,endIndex-1);
				break;
		}
		if(startIndex<0||endIndex<0) return Object("");
		if(startIndex>=endIndex) return Object("");
		return Object(this.slice(startIndex+startStr.length,endIndex));
	},	
	"right" : function(subString){
		switch(typeof(subString)){
			case "string":
				var intAt=this.indexOf(subString);
				if(intAt<0) return Object("");
				return Object(this.slice(intAt+subString.length));
			case "number":
				var iLen=subString;
				return Object(this.slice(this.length-iLen));
			default:
				return Object("");
		}
	},
	"rightBack" : function(subString){
		var intAt=this.lastIndexOf(subString);
		if(intAt<0) return Object("");
		return Object(this.slice(intAt+subString.length));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"reverse" : function(){	
		return Object(this.split("").reverse().join(""));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */	
	"repeat" : function(iCount){
		var values=[],str=this.toString();
		if(iCount==undefined||isNaN(iCount)) return Object(str);
		while(iCount--){values[values.length]=str};

		return Object(values.join(""));
	},
	/**
	 * @created: 2011.8.19
	 * @modified: 2012.9.28-2013.11.21
	 */
	"truncate" : function(iMaxLen,iOptions,paddingStr){
		var str=this.toString(),str1=[];
		iOptions=iOptions==undefined?1:iOptions;
		paddingStr=paddingStr||"";
		if(paddingStr.length>=iMaxLen) return Object(str);
		switch(iOptions){
			case 0: 	//by ascii count
				var count=this.getAsciiCount()+this.getNonAsciiCount()*2;
				if(count>iMaxLen){
					for(var i=0,j=iMaxLen-paddingStr.length;j>0;i++,j--){
						if(str.charCodeAt(i)<=0xFF){
							str1[str1.length]=str.charAt(i);
						}else if(j>1){
							str1[str1.length]=str.charAt(i);
							j--;
						}
					}
					str=str1.join("")+paddingStr;
				}
				break;
			case 1: 	//by char count
				if(str.length>iMaxLen){
					str=str.slice(0,iMaxLen-paddingStr.length)+paddingStr;
				}
				break;
		}
		return Object(str);
	},
	/**
	 * static method format
	 * @example 
	 *		format('{0}, {2}, {1}', 'abc', 'def', 'ghi');
	 * 		return "abc, ghi, def".
	 * @origCreated: 2010.06.28
	 * @created: 2013.8.29	 
	 */
	"format": function(){
		var str=this.toString();
		var argn=arguments.length;
		var strn=str.length;
		if(argn==0) return this;

		var aOutput=[],i=0;
		for(i=0;i<strn-1;){
			if(str.charAt(i)=='{'&&str.charAt(i+1)!='{'){
				var index = 0, indexStart = i+1, j=0;
				//check number
				for(j=indexStart;j<=strn-2;j++){
					var ch = str.charAt(j);
					if(ch<'0'||ch>'9') break;
				}
				if(j>indexStart){	//has number
					if(str.charAt(j)=='}'){ //priority process struct with transferred meaning.
						for(var k=j-1;k>=indexStart;k--){
							index += (str.charCodeAt(k)-48)*Math.pow(10, j-1-k);
						}
						if(argn>index){	//has target data
							aOutput[aOutput.length]=arguments[index];
							i+=j-indexStart+2;
						}else{	//no target data
							aOutput[aOutput.length]=str.slice(i,j);
							i+=j-indexStart+1;
						}
						continue;
					}
				}
				aOutput[aOutput.length]=str.charAt(i++);
			}else if(str.charAt(i)=='{'&&str.charAt(i+1)=='{'){
				i++;
				aOutput[aOutput.length]=str.charAt(i++);
			}else if(str.charAt(i)=='}'&&str.charAt(i+1)=='}'){
				i++;
				aOutput[aOutput.length]=str.charAt(i++);
			}else{
				aOutput[aOutput.length]=str.charAt(i++);
			}
		}
		aOutput[aOutput.length]=str.substr(i);
		return Object(aOutput.join(""));
	 },
	/**
	 * @created: 2011.9.3
	 * @since: JSDK3 V1.5.4
	 */
	"xsplit" : function(vOptions,vSepStr){
		var sSepStr="";

		if(!(vSepStr instanceof Array)){
			return this.split(vSepStr);
		}
		var values=[];
		switch(vOptions){
			case "":
			case "first":
				for(var i=0,iLen=vSepStr.length;i<iLen;i++){
					if(this.indexOf(vSepStr[i])>=0){
						sSepStr=vSepStr[i];
						break;
					}
				}
				values=this.split(sSepStr);
				break;
			case "any":
				var nearStrIndex, arrayIndex;
				var sTemp=this.toString();
				while(sTemp.length){
					nearStrIndex=sTemp.length;
					arrayIndex=-1;
					for(var i=0,iStrIndex=0,iLen=vSepStr.length;i<iLen;i++){
						iStrIndex=sTemp.indexOf(vSepStr[i]);
						if(iStrIndex>=0&&iStrIndex<nearStrIndex){
							nearStrIndex=iStrIndex;
							arrayIndex=i;
						}
					}
					if(arrayIndex>=0){
						values[values.length]=sTemp.slice(0,nearStrIndex);
						sTemp=sTemp.slice(nearStrIndex+vSepStr[arrayIndex].length);
					}else{
						values[values.length]=sTemp;
						sTemp="";
					}
				}
				break;
			case "group":	//must contain an even number of elements
				if(!vSepStr.length||vSepStr.length%2!=0){
					throw "Parameter 'vSepStr' of method 'xsplit' of class 'String' must contain an even number of elements.";
				}
				var nearStrIndex,curGroupIndex;
				var sLeft="",sRight="";
				var isLeft=true;
				var sTemp=this.toString();
				while(sTemp.length){
					nearStrIndex=sTemp.length;
					if(isLeft){
						curGroupIndex=-1;
						for(var i=0,iStrIndex=0,iLen=vSepStr.length;i<iLen;i+=2){
							iStrIndex=sTemp.indexOf(vSepStr[i]);
							if(iStrIndex>=0&&iStrIndex<nearStrIndex){
								nearStrIndex=iStrIndex;
								curGroupIndex=i;
							}
						}
						if(curGroupIndex>=0){
							sLeft=vSepStr[curGroupIndex];
							sRight=vSepStr[curGroupIndex+1];
							values.push(["",sTemp.slice(0,nearStrIndex)]);
							sTemp = sTemp.slice(nearStrIndex+sLeft.length);
						}else{
							values.push(["",sTemp]);
							break;
						}
					}else{
						nearStrIndex = sTemp.indexOf(sRight);
						if(nearStrIndex>=0){
							values.push([sLeft+sRight,sTemp.slice(0,nearStrIndex)]);
							sTemp = sTemp.slice(nearStrIndex+sRight.length);
						}else{
							throw "Missing closing delimiter \""+sRight+"\"";
						}
					}
					isLeft = !isLeft;
				}
				if(!isLeft&&sTemp==""){
					throw "Missing closing delimiter \""+sRight+"\"";
				}
				break;
			case "complex":
				break;
		}
		return values;
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */	
	"padLeft" : function(totalWidth,paddingChar){
		if(this.length>=totalWidth) return this;
		else return Object(Object(paddingChar).repeat(totalWidth-this.length)+this.valueOf());
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */	
	"padRight" : function(totalWidth,paddingChar){
		if(this.length>=totalWidth) return this;
		else return Object(this.valueOf()+Object(paddingChar).repeat(totalWidth-this.length));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"hasAscii" : function(){
		var reg=/[\x00-\xff]+/gi;
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"hasNonAscii" : function(){
		var reg=/[^\x00-\xff]+/gi;
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"getAsciiCount" : function(){
		return this.replace(/[^\x00-\xff]*/g,"").length;
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"getNonAsciiCount" : function(){
		return this.replace(/[\x00-\xff]*/g,"").length;
	},
	/**
	 * @since: JSDK3 V1.6.0
	 * @created: 2011.9.22
	 */
	"encodeNonAscii" : function(){
		return (this.toString().replace(/([^\x00-\xff])/g,function($1){
				return "\\u"+($1).charCodeAt(0).toString(16).slice(-4);
			}));
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"isAllAscii" : function(){
		var reg=/^[\x00-\xff]*$/gi;
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"isAllLetter" : function(iOptions){
		iOptions=iOptions==undefined?0:iOptions;
		switch(iOptions){
			case 0:
				var reg=/^[a-z]*$/gi;
				break;
			case 1:
				var reg=/^[a-z]*$/g;
				break;
			case 2:
				var reg=/^[A-Z]*$/g;
				break;
		}
		return reg.test(this);
	},
	/**
	 * @created: 2011.08.01
	 * @since: JSDK3 V1.3.0
	 */
	"isAllNumber" : function(){
		var reg=/^[0-9]*$/gi;
		return reg.test(this);
	},
	"equal" : function(vStrings,isNoCase){
		if(!arguments.length) return false;
		isNoCase=isNoCase==null?false:isNoCase;
		if(vStrings instanceof Array){
			for(var i=0;i<vStrings.length;i++){
				if(isNoCase&&(this.toLowerCase()==vStrings[i].toLowerCase())) {
					return true;
				}else if(!isNoCase&&(this.toString()==vStrings[i])) {
					return true;
				}
			}
		}else{
			return this.toLowerCase()==vStrings.toLowerCase();
		}
		return false;
	},
	/**
	 * @created: 2011.8.19
	 * @modified: 2011.8.22
	 */
	"serialize" : function(){
		return ("\""+this.toString().replace(/\\/g,"\\\\").replace(/\"/g,"\\\"")
			.replace(/\n/g,"\\n").replace(/\r/g,"\\r")
			.replace(/([^\x00-\xff])/g,function($1){
				return "\\u"+($1).charCodeAt(0).toString(16).slice(-4);
			})+"\"");
	}
}
