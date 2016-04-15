{
	"package": "js.ui",
	"import": [],
	"name": "WebReminderDialogBox",
	"version": "v1.0",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "WebReminderDialogBox",
			"extends": "Object",
			"constructor": [
				["sURL,vArguments,oOptions,oFeatures,fnCallBack"]
			],
			"property": [
				["public","","number","width",["get"]],
				["public","","number","height",["get"]],
				["public","","number","mode",["get"]]
			],
			"method": [
				["public","static","void","show","oDspTexts,oPara,oViewData,vValues,fnGetItemData,fnCallBack"],
				["public","static","void","addStyleSkin","sName,sPath"],
				["public","static","void","setStyleSkin","sName"],
				["public","","void","close",""],
				["public","static","void","fireEvent","sEvent,oEventObject"]
			],
			"event":[
			
			]
		}
	]
}