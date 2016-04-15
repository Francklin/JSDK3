{
	"package": "js.dom",
	"import": [],
	"name": "DOMTemplate",
	"version": "v2.10",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "DOMTemplate",
			"extends": "Object",
			"constructor": [
				[
					"sCode: String"
				]
			],
			"const": [
				{
					name: "defaultMaxLevels",
					value: "10"
				},
				{
					name: "AllowSettingMaxLevels",
					value: "100"
				}
			],
			"property": [
				["public","","String","id",["get","set"]],
				["public","","String","url",["get"]],
				["public","","String","target",["get","set"]],
				["public","","String","isOnsiteOutput",["get","set"]]
			],
			"method": [
				["public","static","void","newInstanceFromId","sId"],
				["public","static","void","newInstanceFromUrl","sUrl"],
				["public","static","void","parse","tmpl,json,[vOutput],[fnInit],[iMaxLevels]"],
				["public","static","void","parse","htmlBlock"],
				["public","static","void","parse","htmlBlocks"],
				["public","static","void","parse","tmplsParas"],
				["public","","void","parse","json,[vOutput],[fnInit],[iMaxLevels]"],
				["private","","any","parseTmpl","tmpl,json,[vOutput],[fnInit],[maxLevels]"],
				["private","","void","parseTmpls","tmplsParas"],
				["private","","void","parseBlock","tagBlock"],
				["private","","void","parseBlocks","tagBlocks"]
			]
		}
	]
}