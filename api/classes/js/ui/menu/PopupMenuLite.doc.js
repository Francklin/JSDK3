{
	"package": "js.ui.menu",
	"import": ["js.dom.HTML"],
	"name": "PopupMenuLite",
	"version": "v1.7.6",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "PopupMenuLite",
			"extends": "Object",
			"constructor": [
				["owner,mode,options"]
			],
			"property": [
				["public","static","object","activeAppMenu",["get"]],
				["public","","object","owner",["get"]],
				["public","","object","ownerHtmlElement",["get"]],
				["public","","number","mode",["get","set"]],
				["public","","boolean","isHideOnMouseLeave",["get","set"]],
				["public","","object","mainMenu",["get"]],
				["public","","object","activeMenu",["get"]],
				["public","","string","version",["get"]],
				["public","","number","allCount",["get"]]
			],
			"method": [
				["public","","void","show","event,iWidth,aCoordinate"],
				["public","","void","hide",""],
				["public","","void","addItem","sTitle,vData,fnAction"],
				["public","","void","getItem","index"],
				["public","","void","getItemById","id"],
				["public","static","void","addStyleSkin","sName,sPath"],
				["public","static","void","setStyleSkin","sName"],
				["public","static","void","fireEvent","sEvent,oEventObject"]
			],
			"event":[
				["public","static","void","onAppMenuBlur","lastAppMenu"],
				["public","","void","onDoAction","lastDoneItem"]
			]
		},
		{ 
			"name": "PopupMenuLite.Item",
			"extends": "Object",
			"constructor": [
				["parentMenu,sTitle,vData,fnAction"]
			],
			"property": [
				["public","","string","id",["get","set"]],
				["public","","number","left",["get"]],
				["public","","number","top",["get"]],
				["public","","number","width",["get"]],
				["public","","number","height",["get"]],
				["public","","string","title",["get"]],
				["public","","boolean","enabled",["get","set"]],
				["public","","boolean","isHidden",["get","set"]],
				["public","","object","parent",["get"]],
				["public","","object","parentMenu",["get"]],
				["public","","object","parentApp",["get"]],
				["public","","number","index",["get"]],
				["public","","string","position",["get"]],
				["public","","boolean","hasChildren",["get"]],
				["public","","variant","data",["get","set"]]
			],
			"method": [
				["public","","Item","getNextSiblingItem",""],
				["public","","Item","getPrevSiblingItem",""],
				["public","","void","refresh",""],
				["public","","void","activate",""]
			]
		}
	]
}