var outline;
function addItems(parentItem,parentItemData){
	if(!jsdk.is(parentItemData,"Object")||!parentItemData.childs) return;
	for(var i=0;i<parentItemData.childs.length;i++){
		var itemData=parentItemData.childs[i];
		if(jsdk.isArray(itemData)){
			var item=parentItem.addItem(itemData[0],""
					,itemData[0].charAt(0)=="."?(jsdk_path+"/res/icons/api/class.gif"):"",""
					,itemData.length>=2?itemData[1]:""
					,itemData.length>=3?itemData[2]:"");
		}else{ 
			var item=parentItem.addItem(itemData.title,""
					,itemData.title.charAt(0)=="."?(jsdk_path+"/res/icons/api/class.gif"):"",""
					,itemData.url||"",itemData.target||"");
		}
		addItems(item,itemData);
	}
}
jsdk(function(container,callback){
	jsdk.get("menu.json","",true,callback(function(json){
		var menudata=json.items;
		outline=new jsdk.Outline(container.parentNode,"auto");
		outline.setUseIcon(true);
		outline.setTarget("main");
		for(var i=0;i<menudata.length;i++){
			var itemdata=menudata[i];
			var item=outline.addItem(itemdata.title,"","","","","");
			addItems(item,itemdata);
		}
	}),"json");
});