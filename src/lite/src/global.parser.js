/**
 * global function for parser
 * @file: function.parser.js
 * @version: V1.2
 * @author: liu denggao
 * @created: 2011.8.20
 * @modified: 2012.9.10-2013.8.3
 **************************/

/**
 * @created: 2011.8.20
 */
"parseJSON": function(data){
	try{
		var func=new Function("return("+data+");");
	}catch(e){
	}
	return !!func?func():func;
},
/**
 * @adapt: JSDK3 v1.8.10
 * @created: 2011.8.20
 * @modified: 2013.8.3
 */
"parseXML": function(data){
	if(this._xmlParser){
		return this._xmlParser.parseFromString(data,"text/xml");
	}else if(this._xmlDom){
		this._xmlDom.loadXML(data.replace(/^[\s\r\n]*/g, '').replace(/<![^<|>]*>/g,""));
		return this._xmlDom;
	}
},
/**
 * @para xml: xml data
 * @para tmpl: json tmplater
 * @created: 2011.9.8
 * @modified: 2012.9.10
 * @since: JSDK3 v1.8.7
 */
"xml2json" : function(xml,tmpl) {
 
	// Create the return object
	var obj = {};
 
	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@"+attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}
 
	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes[i];
			var nodeName = item.nodeName;
			var tmplValue=tmpl&&tmpl[nodeName];
			if (typeof(obj[nodeName]) == "undefined") {
				if(!tmpl){
					obj[nodeName] = this.xml2json(item);
				}else if(tmplValue instanceof Array){
					obj[nodeName] = [this.xml2json(item,tmplValue.getLast())];
				}else{
					obj[nodeName] = this.xml2json(item,tmplValue);
				}
			} else {
				if (!(obj[nodeName] instanceof Array)) {
					obj[nodeName] = [obj[nodeName]];
				}
				if(!tmpl){
					obj[nodeName].push(this.xml2json(item));
				}else if(tmplValue instanceof Array){
					obj[nodeName].push(this.xml2json(item,tmplValue.getLast()));
				}else{
					obj[nodeName].push(this.xml2json(item,tmplValue));
				}
			}
		}
	}
	return obj;
},
/**
 * @created: 2011.9.8
 * @description: not commend
 */
"xml2json_old" : function(xml) {
 
	// Create the return object
	var obj = {};
 
	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}
 
	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes[i];
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = this.xml2json_old(item);
			} else {
				if (!(obj[nodeName] instanceof Array)) {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(this.xml2json_old(item));
			}
		}
	}
	return obj;
}

