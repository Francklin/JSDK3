{
	"package": "js.dom",
	"import": [],
	"name": "HTMLForm",
	"version": "v2.4",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "HTMLForm",
			"extends": "Object",
			"constructor": [
				[]
			],
			"property": [

			],
			"method": [
				["public","","boolean","checkForm",""],
				["public","","boolean","checkItem","sName,enableExpValid"],
				["public","","boolean","checkElements","elements,enableExpValid"],
				["public","","void","setAllItems","values"],
				["public","","void","setItems","values"],
				["public","","array","getAllItems","iOptions,isContainsHidden"],
				["public","","array","getAllElements",""],
				["public","","HTMLElement","getElement","sName"],
				["public","","array","getElements","sName"],
				["public","","HTMLElement","getElementById","sId"],
				["public","","HTMLElement","getElementByName","sName"],
				["public","","array","getElementsByName","sName"],
				["public","","object","getItem","sName"],
				["public","","boolean","hasItem","sName"],
				["public","","array","getAllRequiredItems","iOptions,maxResults"],
				["public","","array","getAllOptionalItems","iOptions"],
				["public","","any","getItemValue","sName"],
				["public","","any","getItemDefaultValue","sName"],
				["public","","void","setItemValue","iOptions,sName,vValue"],
				["public","","void","selectItemAllValue","sName,isSelect"],
				["public","","void","clearItemValue","sName"]
			],
			"event": [
				["public","","void","onItemValueChange","oEvent"]
			]
		}
	]
}