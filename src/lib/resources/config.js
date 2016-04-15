/* @created: Wed Dec 11 10:57:27 UTC+0800 2013*/
_$JSDK3Loader$_&&_$JSDK3Loader$_.loadResource({
manifest : {
"name" : "config","file" : "config.js","version" : "1.0","description" : "","author" : "liu denggao","created" : "2013.12.11","modified" : "2013.12.11"
},
entity : {
"config.json" : {
	"@version": "0.1",
	"cache": {
		"@important": false,
		"@value": true
	},
	"debug": {
		"@important": false,
		"@value": false
	},
	"develop": {
		"@important": false,
		"@value": false
	},
	"appName": {
		"@important": false,
		"@value": "JSDK"
	},
	"include": {

	},
	"file-extension": {
		"class": {
			"source": ".jsc.js",
			"compile": ".jsc"
		},
		"class-api-doc": ".doc.js",
		"lib": ".json"
	},
	"extension-patch":{
		"@enabled": false,
		"file": "user.js"
	},
	"log": {
		"@enabled": false,
		"@enabledSend": false,
		"send": {
			url: "http://www.tringsoft.com/log/product/jsdk3.asp",
			field: "body"
		}
	}
}
}
});
