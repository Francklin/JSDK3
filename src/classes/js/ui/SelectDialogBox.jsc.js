/**
 * @file: SelectDialogBox.class.js
 * @version: V8.0 beta
 * @description: 搜索语法中可含有关键字“|”和“(空格)”，分别表示“或”和“与”，且或的优先级大于与。中间通过空格分开。
 * @since: JSDK3 V1.6.0
 * @adapt: JSDK3 V1.8.9
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2011.10.12
 * @modified: 2013.6.19-2013.8.31
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.ui");

/**
 * SelectDialogBox Class of public
 * @created: 2011.10.12
 * @modified: 2011.10.12
 */
js.ui.SelectDialogBox=function(){}

var _$class = js.ui.SelectDialogBox;

with(_$class){
	$name="SelectDialogBox";
	$extends("Object");
	_$class._styleLib={
		"std" : Engine.runtimeEnvironment.getResPath("js.ui")
					+"/SelectDialogBox/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"?"std.IE.css":"std.css")
	}
	_$class._styleSkin="std";
	_$class._localeLang=Engine.runtimeEnvironment.getLocaleLanguage();
	
	//:preperty-------------------
	
	addProperty(true,true,"localeLang",{
		"get": function(){
			return this._localeLang;
		}
	});
	
	//:method--------------------------------------------
	
	/**
	 * method show(sURL,vArguments,oOptions,oFeatures,fnCallBack)
	 * @para oDspTexts:
		{
			title:
			tips:
			category:
			view:
			data:
			result:
			memo: 
			button: {
				OK: optional
				Cancel: optional
			},
			buttonTips: {
				add: 
				addAll:
				remove:
				clear:
				moveTop:
				moveUp:
				moveDown:
				moveBottom:
			},
			status: {
				"loadingData":
			}
		}
	 * @para oPara:
		{
			opener: Object. current window object.
			icon: Object. name and image url.
			isMultiple: Boolean, is allow multiple value. default is false.
			hasCategory: Boolean, view data if has category. default is false.
			hasChildItem: Boolean, view data list item if has child item. The property added since version 3.0. default is false.
			hasChildData: Boolean,view data list item if has child data. default is false.
			defaultCategory: String, default category item.
			pathSeparator: path separator. use when has child item.
			cateDspMode: Number, default is 0. Display mode of category: 0, collapse; 1, tile
			viewDspMode: Number, default is 0. Display mode of view: 0, tile; 1, tree
			dspData: Boolean, is display data area.
			dspResult: Boolean, is display result area.
			pageSize: Number, default is 0.
			width: Number, default is 650
			height: Number, default is 450
		}
	 * @para oViewData: OptionValues
	 * @para vValues: 
	 * @para fnGetItemData: fnGetItemData(category,path,item,index)
		(1)when: hasChildItem=true
			return: array=[vData,aChildren]. eg. "["",["abc","def"]]", "[["andy","rain"],{text: abc, value: a}]"
				1)vData: item data. Maybe is array or string.
				2)aChildren: array or other.
		(2)when: hasChildItem=false
			return: array or other, as item data. eg. "["liu","zhang|z","li"]", ""liudenggao|ldg""
	 * @para fnCallBack: fnCallBack(wDialog,vReturnValue)
	 */
	addMethod(true,true,"show",function(oDspTexts,oPara,oViewData,vValues,fnGetItemData,fnCallBack){
		var _this=this;
		var _minCellWidth=100;
		var _minHeight=50;
		var pageName=(Global.Browser.Platform.ios?"index_for_ipad.htm":"index.htm")
							+"?seq="+(new js.lang.natives.Date()).getMilliseconds();
		oPara.opener=window;
		if(!oPara.icon){
			oPara.icon={}
		}
		if(oPara.cateDspMode==undefined){
			oPara.cateDspMode=0;
		}
		if(oPara.viewDspMode==undefined){
			oPara.viewDspMode=0;
		}
		oPara.width=oPara.width||650;
		oPara.height=oPara.height||450;
		//-----------
		if(Global.Browser.Platform.ios){
			pageName="index_for_ipad.htm";
		}else if(oPara.viewDspMode==0){
			if(Global.Browser.Engine.trident&&Global.Browser.Engine.version<=3){
				pageName="index_for_IE.htm";
			}else{
				pageName="index.htm";
			}
		}else {
			if(Global.Browser.Engine.trident&&Global.Browser.Engine.version<=3){
				pageName="index_tree_for_IE.htm";
			}else{
				pageName="index_tree.htm";
			}
		}
		//pageName+="?seq="+(new js.lang.natives.Date()).getMilliseconds();
		var ret=window.$showModalDialog(
				Engine.runtimeEnvironment.getResPath("js.ui")+"/SelectDialogBox/"+pageName
				,{
					engineDir: Engine.runtimeEnvironment.getRootPath(),
					opener: window,
					oDspTexts: function(){
						if(!oDspTexts.button){
							switch(_this._localeLang){
								case "":
								case "zh-CN":
									oDspTexts.button={
										OK: "确定",
										Cancel: "取消"
									}
									break;
								case "zh-HK":
									oDspTexts.button={
										OK: "確定",
										Cancel: "取消"
									}
									break;
								case "en":
									oDspTexts.button={
										OK: "OK",
										Cancel: "Cancel"
									}
									break;
							}
						}
						if(!oDspTexts.buttonTips){
							switch(_this._localeLang){
								case "":
								case "zh-CN":
									oDspTexts.buttonTips={
										add: "添加",
										addAll: "添加所有",
										remove: "删除",
										clear: "清空",
										moveTop: "置顶",
										moveUp: "向上移动",
										moveDown: "向下移动",
										moveBottom: "置底"
									}								
									break;
								case "zh-HK":
									oDspTexts.buttonTips={
										add: "添加",
										addAll: "添加所有",
										remove: "刪除",
										clear: "清空",
										moveTop: "置頂",
										moveUp: "向上移動",
										moveDown: "向下移動",
										moveBottom: "置底"
									}									
									break;
								case "en":
									oDspTexts.buttonTips={
										add: "Add",
										addAll: "Add All",
										remove: "Remove",
										clear: "Clear Empty",
										moveTop: "Move to Top",
										moveUp: "Move Up",
										moveDown: "Move Down",
										moveBottom: "Move to Bottom"
									}								
									break;
							}
						}
						switch(_this._localeLang){
							case "":
							case "zh-CN":
								oDspTexts.status={
									loadingData: "正在加载数据"
								}
								break;
							case "zh-HK":
								oDspTexts.status={
									loadingData: "正在加載數據"
								}
								break;
							case "en":
								oDspTexts.status={
									loadingData: "Loading data"
								}
								break;
						}
						return oDspTexts;
					}(),
					oPara: oPara,
					oViewData: oViewData,
					vValues: vValues,
					fnGetItemData: fnGetItemData
				},"dialogWidth="+oPara.width+"px;dialogHeight="+oPara.height+"px;status:no",
			fnCallBack);
		return ret;
	});
	addMethod(true,true,"addStyleSkin",function(sName,sPath){
		this._styleLib[sName]=sPath;
	});	
}

