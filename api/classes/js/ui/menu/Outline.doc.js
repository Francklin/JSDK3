{
	"package": "js.ui.menu",
	"import": [],
	"name": "Outline",
	"version": "v1.4.2",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "Outline",
			"extends": "Object",
			"constructor": [
				["htmlContainer,width,height"]
			],
			"property": [
				["public","","string","id",["get","set"]],
				["public","","object","parent",["get"]],
				["public","","number","level",["get"]],
				["public","","string","pathSeparator",["get","set"]],
				["public","","string","target",["get","set"]],
				["public","","boolean","hasChildren",["get"]],
				["public","","number","length",["get"]],
				["public","","object","application",["get"]],
				["public","","object","activeItem",["get"]],
				["public","","boolean","useCheckbox",["get","set"]],
				["public","","boolean","useIcon",["get","set"]],
				["public","","boolean","useScroll",["get","set"]],
				["public","","boolean","isIgnoreError",["get","set"]],
				["public","","object","children",["get"]],
				["public","","boolean","isAllowTitleNonunique",["get","set"]],
				["public","","boolean","isAutoCreateItem",["get","set"]],
				["public","","boolean","isSelectMode",["get"]],
				["public","","HTMLElement","htmlElement",["get"]]
			],
			"method": [
				["public","static","HTMLElement","getIcon","iconName"],
				["public","static","void","setIcon","src,isInnerIcon"],
				["public","","HTMLElement","getIcon","iconName"],
				["public","","void","setIcon","src,isInnerIcon"],
				["public","","void","about",""],
				["public","","OutlineItem","addItem","fullPath,value,icon,openedIcon,url,target,funGetChildrenData"],
				["public","","OutlineItem","getItem","index"],
				["public","","OutlineItem","getItemById","id"],
				["public","","OutlineItem","getItemByPath","fullPath"],
				["public","","OutlineItem","getItemByPosition","strPosition"],
				["public","","Array","getAllItems",""],
				["public","","OutlineItem","getFirstItem",""],
				["public","","OutlineItem","getNextItem","prevItem"],
				["public","","OutlineItem","getPrevItem","nextItem"],
				["public","","OutlineItem","getLastItem",""],
				["public","","string","getFullPath",""],
				["public","","void","activateItem","id"],
				["public","","void","expandItem","id,[isExpand],[isAll]"],
				["public","","void","expandAll","[isExpand]"],
				["public","","void","removeAll",""],
				["public","","void","refresh",""],
				["public","static","void","addStyleSkin","sName,sPath"],
				["public","static","void","setStyleSkin","sName"],
				["public","static","void","fireEvent","sEvent,oEventObject"]
			],
			"event":[
				["public","","void","onActivatedItem","oItem"]
			]
		},
		{ 
			"name": "OutlineItem",
			"extends": "Object",
			"constructor": [
				["parent,title,value,icon,openedIcon,url,target,funGetChildrenData"]
			],
			"property": [
				["public","","object","parentOutline",["get"]],
				["public","","object","application",["get"]],
				["public","","object","parent",["get"]],
				["public","","object","root",["get"]],
				["public","","string","id",["get"]],
				["public","","number","level",["get"]],
				["public","","number","index",["get"]],
				["public","","string","position",["get"]],
				["public","","string","fullPath",["get"]],
				["public","","string","title",["get","set"]],
				["public","","variant","value",["get","set"]],
				["public","","string","url",["get","set"]],
				["public","","string","target",["get","set"]],
				["public","","boolean","isRoot",["get"]],
				["public","","boolean","hasChildren",["get"]],
				["public","","number","length",["get"]],
				["public","","boolean","expanded",["get"]],
				["public","","object","children",["get"]],
				["public","","number","selectStatus",["get"]]
			],
			"method": [
				["public","","OutlineItem","addItem","relPath,value,icon,openedIcon,url,target,funGetChildrenData"],
				["public","","OutlineItem","getItem","index"],
				["public","","OutlineItem","getItemById","id"],
				["public","","OutlineItem","getItemByPath","relPath"],
				["public","","OutlineItem","getFirstItem",""],
				["public","","OutlineItem","getNextItem","prevItem"],
				["public","","OutlineItem","getPrevItem","nextItem"],
				["public","","OutlineItem","getLastItem",""],
				["public","","Array","getAllItems",""],
				["public","","OutlineItem","getFirstListedItem",""],
				["public","","OutlineItem","getNextListedItem","curListedItem"],
				["public","","OutlineItem","getPrevListedItem","curListedItem"],
				["public","","OutlineItem","getLastListedItem",""],
				["public","","Array","getAllListedItem",""],
				["public","","void","remove",""],
				["public","","boolean","isListed",""],
				["public","","boolean","isListedFor","parentLevel"],
				["public","","boolean","isListedForOutline",""],
				["public","","void","select","status,[isSelectAll]"],
				["public","","void","expand","[isExpand],[isAll]"],
				["public","","void","enter",""],
				["public","","void","contains","item"],
				["public","","void","refresh",""],
				["public","","void","toHtmlElement",""]
			]
		}
	]
}