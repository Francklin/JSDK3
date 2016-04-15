/**
 * global function for charset
 * @file: function.charset.js
 * @version: V0.1
 * @since: JSDK3 V1.5.4
 * @author: liu denggao
 * @created: 2011.9.7
 **************************/

/**
 * convert wide string of utf16 of type to byte string of utf8 of type.
 * @since: JSDK3 V1.5.4
 * @created: 2011.9.7
 */
"utf16to8" : function(str) {
	var out, i, len, c;

	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
},
/**
 * convert byte string of utf8 of type to wide string of utf16 of type.
 * @since: JSDK3 V1.5.4
 * @created: 2011.9.7
 */
"utf8to16" : function(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
		 c = str.charCodeAt(i++);
		 switch(c >> 4){ 
		   case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
		     // 0xxxxxxx
		     out += str.charAt(i-1);
		     break;
		   case 12: case 13:
		     // 110x xxxx   10xx xxxx
		     char2 = str.charCodeAt(i++);
		     out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
		     break;
		   case 14:
		     // 1110 xxxx  10xx xxxx  10xx xxxx
		     char2 = str.charCodeAt(i++);
		     char3 = str.charCodeAt(i++);
		     out += String.fromCharCode(((c & 0x0F) << 12) |
		        ((char2 & 0x3F) << 6) |
		        ((char3 & 0x3F) << 0));
		     break;
		 }
	}

    return out;
},
/**
 * convert binary to 'BSTR' type
 */
"bin2str" : function(bin){
	var hex_str=this.bin2hex(bin);
	var ret_str="";
	for(var i=0;i<hex_str.length;i+=2){
		ret_str+=String.fromCharCode(parseInt("0x"+hex_str.charAt(i)+hex_str.charAt(i+1)));
	}
	return ret_str;
},
/**
 * convert binary to hex string
 * only support for IE
 */
"bin2hex" : function(bin){
	var _xmlDom=Engine.getLoader().getXMLDOMDocument();
	var _xmlParser=Engine.getLoader().getXMLDOMParser();
	var xml=null;
	var node=null;
	if(_xmlDom){
		xml=_xmlDom;
	}else{
		xml=_xmlParser.parseFromString("","text/xml");
	}
	node=xml.createElement("root");
	node.dataType = "bin.hex";
	node.nodeTypedValue=bin;
	return node.text||node.textContent;
},
"str2hex" : function(s){
	var v,i, f = 0, a = [];  
	s += '';
	f = s.length;  

	for (i = 0; i<f; i++) {  
		a[i] = s.charCodeAt(i).toString(16).replace(/^([\da-f])$/,"0$1");  
	}  
	  
	return a.join('');
}

