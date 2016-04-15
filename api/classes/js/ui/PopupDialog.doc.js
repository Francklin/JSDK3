{
	"package": "js.ui",
	"import": ["js.dom.HTML","js.dom.DOMTemplate"],
	"name": "PopupDialog",
	"version": "v1.9.4",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "PopupDialog",
			"extends": "Object",
			"constructor": [
				[]
			],
			"const": [
				{
					name: "DISPLAY_MODE_CONTEXT",
					value: "0"
				},
				{
					name: "DISPLAY_MODE_DROPDOWN",
					value: "1"
				},
				{
					name: "DISPLAY_MODE_POSITION",
					value: "2"
				},
				{
					name: "DISPLAY_ALIGN_LEFT",
					value: "0"
				},
				{
					name: "DISPLAY_ALIGN_CENTER",
					value: "1"
				},
				{
					name: "DISPLAY_ALIGN_RIGHT",
					value: "2"
				},
				{
					name: "DISPLAY_ALIGN_UP",
					value: "3"
				},
				{
					name: "DISPLAY_ALIGN_MIDDLE",
					value: "4"
				},
				{
					name: "DISPLAY_ALIGN_BOTTOM",
					value: "5"
				}
			],
			"property": [
				["public","static","HTMLElement","htmlElement",["get"]],
				["public","static","boolean","isHidden",["get"]]
			],
			"method": [
				["public","static","void","show","sURL,vArguments,oOptions,oFeatures,fnCallBack"],
				["public","static","void","hide",""],
				["public","static","void","addStyleSkin","sName,sPath"],
				["public","static","void","setStyleSkin","sName"],
				["public","static","void","setBodyStyle","sPath"]
			]
		}
	]
}