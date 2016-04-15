/**
 * @file Charset.class.js
 * @version 1.0
 * @created 2011.5.15
 * @modified 2011.5.15
 */

$package("js.text.charset");

js.text.charset.Charset=function(){}
var _$class=js.text.charset.Charset;

//描述：在JavaScript中获得的中文字符是用UTF16进行编码的,和我们统一的页面标准格式UTF-8不一样，所以需要先进行转化,然后再进行Base64的编码.
_$class.utf16to8=function(str) {
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
}
//描述：通过base64Decode()得到是UTF-8格式的字符串，需要转换为JavaScript能显示的UTF-16格式
_$class.utf8to16=function(str) {
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
}
/*
 * @only support IE
 */
_$class.gb2312utf16=function(bstr){
	var wstr=bstr.replace(/([^\x00-\x7f])(.)/g,function($0,$1,$2){
		return String.fromCharCode(($1.charCodeAt(0)<<8)+$2.charCodeAt(0));
	});
	var enc=[];
	window.execScript("dim charCode", "VBScript");
	for(var i=0,iLen=wstr.length;i<iLen;i++){
		charCode=wstr.charCodeAt(i);
		window.execScript("charCode = Chr(charCode)", "VBScript"); 
		enc.push(charCode);
	}
	return enc.join("");
}