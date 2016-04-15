/** 
 * TableDataEditor
 * @file TableDataEditor.class.js
 * @description 表格编辑器。可以添加行、插入行、移动行、删除行、排序列、只读列、隐藏列
 * @notice: 需要表单验证控制功能。
 * @version V0.9.2 beta
 * @since JSDK3 V1.8.9
 * @author Liu Denggao
 * @created 2012.4.28
 * @modified 2013.8.4-2013.9.10
 * @update
		v0.9.2 
		2013.12.18 修复了列对齐样式由于低优先级被覆盖的问题
		v0.9
		2013.9.8 修复了表格列绑定多个域时值域未绑定成功的问题
		v0.7.9 -> v0.8
		2013.8.31 集中化了本地化字符串，并修改了外部事件“onAddedRow”、“onInsertedRow”只在初始化完后再触发
 * @mail francklin.liu@gmail.com
 * @homepage http://www.tringsoft.com
 ************************************************************/

$package("js.ui.table");
$import("js.domx.HTMLForm");
$import("js.domx.HTMLFormField");
$import("js.domx.HTMLTextField");
$import("js.domx.HTMLSelectField");
$import("js.domx.HTMLNumberField");
$import("js.domx.HTMLDateField");

/**
 * @author liu denggao
 * @created 2012.4.28
 * @modified 2012.5.21
 */
js.ui.table.TableDataEditor=function(htmlContainer,vOptions,vWidth){
	this._id="";
	this._rows=[];
	this._columns=[];
	this.__columns={
		"No": {
			title: "",
			width: "",
			isHidden: true
		},
		"Select": {
			
		},
		"Action": {
			width: "",
			actions: ["add,insert,moveup,delete","moveup,delete"]
		}
	}
	//域调整处理函数集，元素结构为：
	//(1)[columName,handle];
	//(2)[[columnName1,columnName2,...],handle]
	this._fieldAdjustHandles=[];	//域调整处理函数集
	this._minRowsCount=0;			//可由用户定义的最小记录行数,最小不允许小于内部定义的最小记录行数
	this._maxRowsCount=100;			//可由用户定义的最大记录行数,最大不允许超过内部定义的最大记录行数
	this.__minRowsCount=0;			//内部定义的最小记录行数,这个属性一般不会变。
	this.__maxRowsCount=300;		//内部定义的最大记录行数，这是为了限制用户定义的最大记录行数。
	this._openMode=0;				//0,read mode; 1,edit mode
	this._isHidden=true;
	this._status=0;					//0,initinal; 1,loaded	
	this._width="";
	this._enabledNoCol=false;		//是否启用序号列
	this._enabledSelectCol=false;	//是否启用选择列
	this._enabledActionCol=true;	//是否启用操作列
	this.__noColIndex=-1;			//序号列索引
	this.__selColIndex=-1;	
	this.__startDataColIndex=0;		//起始数据列索引
	this._isImmdApply=true; 		//是否立即应用操作.只在初始化时设置。
	this._immdApplyMode=0;			//立即应用模式：0,监测行的添加、插入和删除操作; 只在初始化时设置。
	this._storeFields={};
	this._dataSeparator=";";
	this._htmlElement=null;
	this._htmlMain=null;
	this._htmlHead=null;
	this._htmlBody=null;
	this._parentForm=null;
	this._activeRow=null;
	this.__usedIDCount=0;
	this._TableDataEditor(htmlContainer,vOptions,vWidth);
}

var _$class=js.ui.table.TableDataEditor;
var _$proto=_$class.prototype;
with(_$class){
	$name="TableDataEditor";
	$extends("Object");
	_$class._version="0.9.1";
	_$class._localeResource={
		"tipsOfAddButton": "添加",
		"tipsOfInsertButton": "插入",
		"tipsOfDeleteButton": "刪除",
		"tipsOfMoveUpButton": "向上移動",
		"tipsOfMoveDownButton": "向下移動",
		"canotAddRowInLimitCount": "已達到最大記錄條數限制，不能再添加了！",
		"canotDeleteRowInLimitCount": "已達到最小記錄條數限制，不能再刪除了！"	
	}
	_$class.OpenModeEnum={
		"Read": 0,
		"Edit": 1
	}
	_$class.ColumnAlignEnum={
		"Left": 0,
		"Center": 1,
		"Right": 2
	}
	_$class.ColumnTypeEnum={
		"Text": "Text",
		"Number": "Number",
		"Date": "Date"
	}	
	_$class._resPath=Engine.runtimeEnvironment.getResPath("js.ui.table")+"/TableDataEditor";
	_$class._styleLib={
		"default" : _$class._resPath+"/"+(Browser.Engine.trident&&document.compatMode!="CSS1Compat"
				?"TableDataEditor.IE.css":"TableDataEditor.css")
	}
	_$class._styleSkin="";
	_$class._defaultStyleSkin="default";
	_$class._styleElement=null;
	_$class._isInstanced=false;
	_$class._actions={
		"add": {
			title: _$class._localeResource["tipsOfAddButton"],
			icon: "add.gif",
			doAction1: function(_this){
				_this.addRow();
			}
		},
		"insert": {
			title: _$class._localeResource["tipsOfInsertButton"],
			icon: "insert.gif",
			doAction1: function(_this){
				_this.insertRow(_this.getActiveRow()?_this.getActiveRow().getIndex():-1);
			}
		},
		"moveup": {
			title: _$class._localeResource["tipsOfMoveUpButton"],
			icon: "up.gif",
			doAction1: function(_this){
				var rows=_this.getSelectedRows();
				rows=rows.length?rows:[].concat(_this.getActiveRow()||[]);
				if(!rows.length||rows[0].getIndex()<=0) return;
				rows.forEach(function(row){
					row.moveUp();
				});
			},
			doAction2: function(_this){
				_this.moveUp();
			}
		},
		"movedown": {
			title: _$class._localeResource["tipsOfMoveDownButton"],
			icon: "down.gif",
			doAction1: function(_this){
				var rows=_this.getSelectedRows();
				rows=rows.length?rows:[].concat(_this.getActiveRow()||[]);
				if(!rows.length||rows.getLast().getIndex()>=_this.getRowsCount()-1) return;
				for(var i=rows.length-1;i>=0;i--){
					rows[i].moveDown();
				}
			},
			doAction2: function(_this){
				_this.moveDown();
			}
		},
		"delete": {
			title: _$class._localeResource["tipsOfDeleteButton"],
			icon: "delete.gif",
			doAction1: function(_this){
				var rows=_this.getSelectedRows();
				if(rows.length>0){
					rows.forEach(function(row){
						row.remove();
					});
				}else if(_this.getActiveRow()){
					_this.getActiveRow().remove();
				}
			},
			doAction2: function(_this,event){
				event=event||window.event;
				event.cancelBubble=true;
				_this.remove();
				return false;
			}
		}
	}
	
	//:constructor
	
	prototype._TableDataEditor=function(htmlContainer,vOptions,vWidth){
		this.getClass().fireEvent("_onBeforeInstance",this);
		if(htmlContainer==null){
			this._htmlElement=document.createElement("div");
		}else if(htmlContainer==""){
			var elScript=document.scripts[document.scripts.length-1];
			this._htmlElement=elScript.insertAdjacentElement("beforeBegin",document.createElement("div"));
		}else{
			this._htmlElement=htmlContainer.appendChild(document.createElement("div"));
		}
		this._id="JKTE"+Global.newId();
		this._openMode=vOptions.openMode;
		this._parentForm=vOptions.parentForm||document.forms[0];
		if(!(this._parentForm instanceof js.domx.HTMLForm)){
			this._parentForm=js.domx.HTMLForm.newInstanceFrom(this._parentForm);
		}
		this._dataSeparator=vOptions.dataSeparator||";";
		this._enabledNoCol=vOptions.enabledNoCol||false;
		this._enabledSelectCol=this._openMode==0?false:(vOptions.enabledSelectCol||false);
		this._enabledActionCol=this._openMode==0?false:(vOptions.enabledActionCol||(vOptions.enabledActionCol==undefined));
		this.__selColIndex=!this._enabledSelectCol?-1:0;
		this.__noColIndex=!this._enabledNoCol?-1:(!this._enabledSelectCol?0:1);
		this.__startDataColIndex=this.__selColIndex+1+this.__noColIndex+1;
		this._minRowsCount=Math.max(this.__minRowsCount,Math.min(vOptions.minRowsCount,this._maxRowsCount));
		this._maxRowsCount=Math.min(Math.max(this._minRowsCount,vOptions.maxRowsCount),this.__maxRowsCount);
		if(vOptions.encodeText){
			this.encodeText=vOptions.encodeText;
		}
		if(vOptions.decodeText){
			this.decodeText=vOptions.decodeText;
		}
		for(var colName in vOptions.columns){
			this._setColumn(colName,vOptions.columns[colName]);
		}
		this._width=vWidth;
		with(this._htmlElement){
			className=["TableDataReader","TableDataEditor"][this._openMode];
			style.display=this._isHidden?"none":"";
			style.width=this._width;
			with(this._htmlMain=appendChild(window.document.createElement("table"))){
				cellSpacing="0";
				cellPadding="3";
				with(createTHead()){
					with(this._htmlHead=insertRow(-1)){
						className="TableTitle";
						if(this._openMode==1&&this._enabledSelectCol){
							with(insertCell(-1)){
								className="col-select";
								appendChild(this._createSelectColumn());
							}
						}
						if((this._openMode==1||(!this.__columns["No"].isHidden))&&this._enabledNoCol){
							with(insertCell(-1)){
								className="col-no";
								style.width=this.__columns["No"].width;
								style.textAlign=["left","center","right"][this._openMode==1?2:this.__columns["No"].headerAlign];
								innerHTML=this.__columns["No"].title;
							}
						}
						if(this._openMode==1&&this._enabledActionCol){
							with(insertCell(-1)){
								className="col-action";
								style.width=this.__columns["Action"].width;
								appendChild(this._createActionColumn());
							}
						}
					}
				}
				with(this._htmlBody=tBodies.length?tBodies[0]:appendChild(window.document.createElement("tbody"))){
					className="TableBody";
				}
			}
		}
		this.getClass().fireEvent("_onAppInstanced",this);
	}
	
	//:property---------------------
	
	addProperty(true,true,"resPath",{
		get: function(){
			return this._resPath;
		}
	});
	prototype.getStatus=function(){
		return this._status;
	}
	prototype.getRowsCount=function(){
		return this._rows.length;
	}
	prototype.getColumnsCount=function(){
		return this._columns.length;
	}
	prototype.getMinRowsCount=function(){
		return this._minRowsCount;
	}
	prototype.setMinRowsCount=function(value){
		this._minRowsCount=Math.max(this.__minRowsCount,Math.min(value,this._maxRowsCount));
	}
	prototype.getMaxRowsCount=function(){
		return this._maxRowsCount;
	}	
	prototype.setMaxRowsCount=function(value){
		this._maxRowsCount=Math.min(Math.max(this._minRowsCount,value),this.__maxRowsCount);
	}
	prototype.getOpenMode=function(){
		return this._openMode;
	}
	prototype.setOpenMode=function(value){
		if(this._status!=0) return;
		if(this._openMode==value) return;
		this._openMode=value;
	}
	prototype.getEnabledSelectCol=function(){
		return this._enabledSelectCol;
	}
	prototype.getEnabledNoCol=function(){
		return this._enabledNoCol;
	}
	prototype.getEnabledActionCol=function(){
		return this._enabledActionCol;
	}
	prototype.getIsImmdApply=function(){
		return this._isImmdApply;
	}
	prototype.setIsImmdApply=function(value){
		if(this._status!=0) return;
		if(this._isImmdApply==value) return;
		this._isImmdApply=value;
	}
	prototype.getImmdApplyMode=function(){
		return this._immdApplyMode;
	}
	prototype.getParentForm=function(){
		return this._parentForm;
	}
	prototype.getDataSeparator=function(){
		return this._dataSeparator;
	}
	prototype.getActiveRow=function(){
		return this._activeRow;
	}
	prototype.getHtmlElement=function(){
		return this._htmlElement;
	}
	
	//:method-------------------
	
	prototype.show=function(){
		this._htmlElement.style.display="";
	}
	prototype.hide=function(){
		this._htmlElement.style.display="none";
	}
	prototype.addRow=function(){
		if(this._status==0) {
			alert("Has no initial yet!");
			return null;
		}
		if(this._rows.length>=this._maxRowsCount){
			alert(this._getLocale("canotAddRowInLimitCount"));
			return null;
		}
		return this._addRow();
	}
	prototype._addRow=function(){
		var Row=this.getClass().Row;
		return new Row(this);
	}
	prototype.insertRow=function(index){
		if(this._status==0) {
			alert("No initial yet!");
			return null;
		}
		if(this._rows.length>=this._maxRowsCount){
			alert(this._getLocale("canotAddRowInLimitCount"));
			return null;
		}
		return this._insertRow(index);
	}
	prototype._insertRow=function(index){
		var Row=this.getClass().Row;
		return new Row(this,index);
	}
	/**
	 * @function addColumn
	 * @para sTitle:
	 * @para sName:
	 * @para sType: Text; Number; SerialNumber; DateTime
	 * @para vWidth:
	 * @para iAlign:
	 * @created 2010.11.10
	 * @modified 2010.11.25
	 */
	prototype.addColumn=function(sTitle,sName,sType,vWidth,iHeaderAlign,iAlign){
		if(this._status!=0){
			alert("Has loaded table data, can not add column again!");
			return null;
		}		
		var Column=this.getClass().Column;
		return new Column(this,sTitle,sName,sType,vWidth,iHeaderAlign,iAlign);
	}
	prototype._setColumn=function(sName,vOptions){
		if(this._status!=0) return;
		var col=this.__columns[sName];
		switch(sName){
			case "No":
				this.__columns[sName]={
					title: vOptions.title||col.title,
					width: vOptions.width||col.width,
					headerAlign: vOptions.headerAlign||2,
					align: vOptions.align||vOptions.headerAlign||0,
					isHidden: vOptions.isHidden||vOptions.isHidden==undefined
				}
				break;
			case "Select":
				break;
			case "Action":
				this.__columns[sName]={
					width: vOptions.width||col.width,
					actions: vOptions.actions||col.actions
				}
				break;
		}
	}
	/**
	 * @para vColNames: String or Array of type.
	 * @para fnHandle: fnHandle(oRow,colField1,colField2,...)
	 * @created: 2012.6.20
	 */
	prototype.addFieldAdjustHandle=function(vColNames,fnHandle){
		this._fieldAdjustHandles.push([vColNames,fnHandle]);
	}
	prototype.getRow=function(index){
		return this._rows[index];
	}
	prototype.getRowById=function(id){
		for(var i=0;i<this._rows.length;i++){
			if(this._rows[i].getId()==id) return this._rows[i];
		}
		return null;
	}
	prototype.getRowByEl=function(el){
		for(var i=0;i<this._rows.length;i++){
			if(this._rows[i].getHtmlElement()==el) return this._rows[i];
		}
		return null;
	}
	prototype.getColumn=function(index){
		return this._columns[index];
	}
	prototype.getColumnByName=function(sName){
		for(var i=0;i<this._columns.length;i++){
			if(this._columns[i].getName()==sName) 
				return this._columns[i];
		}
		return null;
	}
	prototype.getSelectedRows=function(){
		return this._rows.select(function(row){
			return row.getChecked();
		});
	}
	prototype.swapRow=function(row1,row2){
		this._rows[row1.getIndex()]=row2;
		this._rows[row2.getIndex()]=row1;
		if(row1.getIndex()<row2.getIndex()){
			this._htmlBody.insertBefore(row2.getHtmlElement(),row1.getHtmlElement());
			if(row2.getIndex()<this._rows.length-1){
				this._htmlBody.insertBefore(row1.getHtmlElement(),this._rows[row2.getIndex()+1].getHtmlElement());
			}else{
				this._htmlBody.appendChild(row1.getHtmlElement());
			}
		}else{
			this._htmlBody.insertBefore(row1.getHtmlElement(),row2.getHtmlElement());
			if(row1.getIndex()<this._rows.length-1){
				this._htmlBody.insertBefore(row2.getHtmlElement(),this._rows[row1.getIndex()+1].getHtmlElement());
			}else{
				this._htmlBody.appendChild(row2.getHtmlElement());
			}
		}
		this.fireEvent("_onSwapRow",[row1,row2]);
	}
	prototype.moveUpRows=function(rows){
		if(!rows.length||rows[0].getIndex()<=0) return;
		rows.forEach(function(row){
			row.moveUp();
		});
	}
	prototype.moveDownRows=function(rows){
		if(!rows.length||rows[0].getIndex()>=this._rows.length-1) return;
		rows.forEach(function(row){
			row.moveDown();
		});
	}
	prototype.setRowsCountLimit=function(iMin,iMax){
		this._minRowsCount=Math.max(this.__minRowsCount,Math.min(iMin,iMax));
		this._maxRowsCount=Math.min(Math.max(iMin,iMax),this.__maxRowsCount);
	}
	prototype.setIsAllRequiredFill=function(){
		for(var i=0,iLen=this._columns.length;i<iLen;i++){
			this._columns[i].setAllowEmpty(false);
		}
	}
	prototype.setIsAllOptionalFill=function(){
		for(var i=0,iLen=this._columns.length;i<iLen;i++){
			this._columns[i].setAllowEmpty(true);
		}
	}
	prototype.setStoreFieldFor=function(sProName,elField){
		switch(sProName){
			case "AllCount":
				this._storeFields[sProName]=elField;
				break;
		}
	}
	prototype.load=function(){ 
		if(this._status!=0) return false;
		var allCount=parseInt("0"+this._storeFields["AllCount"].value,10);
		//初始载入行
		for(var i=0;i<allCount;i++){
			this._addRow();
		}
		this._fixStoreRecordsCount();
		this._status=1;
		this.fireEvent("_onLoaded");
		if(this._minRowsCount>allCount){
			for(var i=0,iLen=this._minRowsCount-allCount;i<iLen;i++){
				this.addRow();
			}
		}
	}
	prototype.reload=function(){
		for(var i=0,iLen=this._rows.length;i<iLen;i++){
			this._rows[i].reload();
		}
	}
	prototype.reset=function(){
		for(var i=0;i<this._rows.length;i++){
			this._rows[i].reload();
		}
	}
	prototype.validate=function(){
		return !this._rows.some(function(row){
			return !row.validate();
		},this);
	}
	prototype.trim=function(){
		if(this._openMode!=1) return;
		for(var i=this._rows.length-1;i>=0;i--){
			if(this._rows[i].isEmpty()){
				if(this._rows.length>this._minRowsCount) this._rows[i].remove();
			}
		}
	}
	prototype.selectAll=function(isSelect){
		if(!this._enabledSelectCol) return;
		var oCell=this._htmlHead.cells[this.__selColIndex];
		var el=Global.dom("input",oCell).getFirst();
		isSelect=isSelect==undefined?!el.checked:isSelect;
		this._rows.forEach(function(row){
			row.setChecked(isSelect);
		});
		el.checked=isSelect;
	}
	prototype.clearEmpty=function(){
		if(this._openMode!=1) return;
		for(var i=0;i<this._rows.length;i++){
			this._rows[i].clearEmpty();
		}
	}
	prototype.removeAll=function(){
		if(this._openMode!=1) return;
		for(;this._rows.length>this._minRowsCount;){
			this._rows[this._rows.length-1].remove();
		}
	}
	prototype._removeAll=function(){
		for(;this._rows.length>0;){
			this._rows[this._rows.length-1].remove();
		}
	}
	prototype.save=function(){
		if(this.getOpenMode()==0) return;
		if(this._status==0) return;
		for(var i=0;i<this._columns.length;i++){
			var oColumn=this._columns[i];
			var vValue=[],vText=[];
			if(!oColumn.getInputOptions("allowKeywordSyno")){
				for(var j=0;j<this._rows.length;j++){
					var vColumnValue=this._rows[j].getColumnField(i).getStoreValues(0);
					vValue[j]=this.encodeText(vColumnValue,this._dataSeparator);
				}
				oColumn.getDataFields()[0].value=vValue.join(this._dataSeparator);
			}else{
				for(var j=0;j<this._rows.length;j++){
					var vColumnText=this._rows[j].getColumnField(i).getStoreValues(0);
					var vColumnValue=this._rows[j].getColumnField(i).getStoreValues().pop();
					vText[j]=this.encodeText(vColumnText,this._dataSeparator);
					vValue[j]=this.encodeText(vColumnValue,this._dataSeparator);
				}
				oColumn.getDataFields(0).value=vText.join(this._dataSeparator);
				oColumn.getDataFields(1).value=vValue.join(this._dataSeparator);	
			}
		}
		var oField=this._storeFields["AllCount"];
		if(oField) oField.value=this._rows.length;
	}
	//分隔符不能为百分号“%”
	prototype.encodeText=function(text,separator){
		return text.replace(/%/g,encodeURIComponent("%"))
			.replace(new RegExp(separator,"ig"),encodeURIComponent(separator))
			.replace(new RegExp("\r","ig"),"")	//去掉回车符，保持所有浏览器的换行符存储的唯一性
			.replace(new RegExp("\n","ig"),encodeURIComponent("\n"));
	}
	prototype.decodeText=function(text,separator){
		return decodeURIComponent(text);
	}
	/**
	 * 修正存储的记录条数，使标志的记录条数和存储的记录数据的条数相一致
	 */
	prototype._fixStoreRecordsCount=function(){
		var allRowsCount=parseInt("0"+this._storeFields["AllCount"].value,10);
		for(var i=0,iLen=this._columns.length;i<iLen;i++){
			var oColumn=this._columns[i];
			var aDataFields=oColumn.getDataFields();
			for(var j=0,jLen=oColumn.getInputOptions("allowKeywordSyno")?2:1;j<jLen;j++){
				var aValues=aDataFields[j].value==""?[]:aDataFields[j].value.split(";");
				aValues.fill("",allRowsCount-aValues.length,aValues.length).slice(0,allRowsCount);
				aDataFields[j].value=aValues.join(this._dataSeparator);
			}
			
		}
	}
	prototype._createSelectColumn=function(){
		var _this=this;
		var _htmlElement=document.createElement("input");
		with(_htmlElement){
			type="checkbox";
			onclick=function(){
				_this.selectAll(this.checked);
			}
		}
		return _htmlElement;
	}
	/**
	 * @modified: 2013.8.4
	 */
	prototype._createActionColumn=function(){
		var _this=this;
		var _htmlElement=document.createElement("div");
		var column=this.__columns["Action"];
		for(var i=0,names=column.actions[0].split(",");i<names.length;i++){
			var _action=this.getClass()._actions[names[i]];
			with(_htmlElement){
				with(appendChild(window.document.createElement("img"))){
					className="ActionButton";
					title=_action.title;
					src=this.getClass().getResPath()+"/"+_action.icon;
					onclick=function(){
						var _action1=_action;
						return function(event){
							return _action1.doAction1(_this,event);
						}
					}();
				}
			}
		}
		return _htmlElement;
	}
	prototype.attachEvent=function(sEvent, fpNotify){
		switch(sEvent){
			case "onReady":
			case "onLoaded":
				this[sEvent]=fpNotify;
				break;
			default:
		}
	}
	prototype._getLocale=function(key,value){
		var strObj=Global.Object(this.getClass()._localeResource[key]);
		return strObj.format.apply(strObj,Global.js.lang.natives.Array.from(arguments).slice(1)).valueOf();
	}	
	addMethod(true,true,"fireEvent",function(sEvent,oEventObject){
		if(typeof(this[sEvent])!="function") return;
		try{
			return this[sEvent](oEventObject);
		}catch(e){
			throw new Error(1000,"Event '"+sEvent+"' of object '"+this.getName()+"' has been runned error!\nSource: "
				+e.description);
		}
	});
	addMethod(true,true,"addStyleSkin",function(sName,sPath){
		this._styleLib[sName]=sPath;
	});
	addMethod(true,true,"setStyleSkin",function(sName){
		this._styleSkin=sName;
		if(!this._styleElement){
			var style = this._styleElement = document.createElement("link"); 
			style.type = "text/css";
			style.rel = "stylesheet";
			style.href = this._styleLib[sName];
			document.getElementsByTagName("HEAD")[0].appendChild(style);
		}else{
			this._styleElement.style.href = this._styleLib[sName];
		}
	});
	
	//:event--------------------

	addEventListener(true,false,"onReady",function(){
		if(!this._styleSkin) this.setStyleSkin(this._defaultStyleSkin);
		this._isInstanced=true;
	});
	addEventListener(true,false,"onBeforeInstance",function(){
		if(this._isInstanced) return;
		this.fireEvent("_onReady");
	});	
	addEventListener(true,false,"onAppInstanced",function(){
		
	});
	prototype._onAddedColumn=function(oColumn){
		this._columns[this._columns.length]=oColumn;
	}
	prototype._onRemovedColumn=function(oColumn){
		this._columns.erase(oColumn);
	}
	prototype._onAddedRow=function(oRow){
		this._rows[this._rows.length]=oRow;
		if(this._status==1&&this._isImmdApply&&this._immdApplyMode==0){
			var oField=this._storeFields["AllCount"];
			if(oField) {
				oField.value=this._rows.length;
				this._fixStoreRecordsCount();
			}
			var allRowsCount=this._rows.length;
			for(var i=0,iLen=this._columns.length;i<iLen;i++){
				var oColumn=this._columns[i];
				var aDataFields=oColumn.getDataFields();
				for(var j=0,jLen=oColumn.getInputOptions("allowKeywordSyno")?2:1;j<jLen;j++){
					var aValues=!aDataFields[j].value?[]:aDataFields[j].value.split(this._dataSeparator);
					aValues.append("");
					aValues.fill("",allRowsCount-aValues.length,aValues.length).slice(0,allRowsCount);
					aDataFields[j].value=aValues.join(this._dataSeparator);
				}
			}
		}
		if(this._status==1) {
			this.fireEvent("_onRowsPositionChange");
			oRow.activate();
			this.fireEvent("onAddedRow",oRow);
		}
	}
	prototype._onInsertedRow=function(oRow){
		this._rows.insert(oRow,oRow.getIndex());
		if(this._status==1&&this._isImmdApply&&this._immdApplyMode==0){
			var oField=this._storeFields["AllCount"];
			if(oField) {
				oField.value=this._rows.length;
				this._fixStoreRecordsCount();
			}
			var allRowsCount=this._rows.length;
			for(var i=0,iLen=this._columns.length;i<iLen;i++){
				var oColumn=this._columns[i];
				var aDataFields=oColumn.getDataFields();
				for(var j=0,jLen=oColumn.getInputOptions("allowKeywordSyno")?2:1;j<jLen;j++){
					var aValues=!aDataFields[j].value?[]:aDataFields[j].value.split(this._dataSeparator);
					aValues.insert("",oRow.getIndex());
					aValues.fill("",allRowsCount-aValues.length,aValues.length).slice(0,allRowsCount);
					aDataFields[j].value=aValues.join(this._dataSeparator);
				}
			}
		}
		if(this._status==1) {
			this.fireEvent("_onRowsPositionChange");
			oRow.activate();
			this.fireEvent("onInsertedRow",oRow);
		}
	}
	prototype._onLoadedRow=function(oRow){
	
	}
	prototype._onRemovedRow=function(oRow){
		var iRowIndex=this._rows.find(oRow);
		var isActiveRow=this._activeRow==oRow;
		this._rows.removeAt(iRowIndex);
		if(isActiveRow) this._activeRow=null;
		if(this._status==1&&this._isImmdApply&&this._immdApplyMode==0){
			var oField=this._storeFields["AllCount"];
			if(oField) oField.value=this._rows.length;
			var allRowsCount=this._rows.length;
			for(var i=0,iLen=this._columns.length;i<iLen;i++){
				var oColumn=this._columns[i];
				var aDataFields=oColumn.getDataFields();
				for(var j=0,jLen=oColumn.getInputOptions("allowKeywordSyno")?2:1;j<jLen;j++){
					var aValues=!aDataFields[j].value?[]:aDataFields[j].value.split(this._dataSeparator);
					aValues.removeAt(iRowIndex);
					aValues.fill("",allRowsCount-aValues.length,aValues.length).slice(0,allRowsCount);
					aDataFields[j].value=aValues.join(this._dataSeparator);
				}
			}
		}
		this.fireEvent("_onRowsPositionChange");
		this.fireEvent("onRemovedRow",oRow);
		if(!isActiveRow||!this._rows.length){
			return;
		}else if(iRowIndex<this._rows.length){
			this._rows[iRowIndex].activate();
		}else{
			this._rows[iRowIndex-1].activate();
		}
	}
	prototype._onSwapRow=function(rows){
		var index1=rows[0].getIndex();
		var index2=rows[1].getIndex();
		if(this._status==1&&this._isImmdApply&&this._immdApplyMode==0){
			var oField=this._storeFields["AllCount"];
			if(oField) {
				oField.value=this._rows.length;
				this._fixStoreRecordsCount();
			}
			var allRowsCount=this._rows.length;
			for(var i=0,iLen=this._columns.length;i<iLen;i++){
				var oColumn=this._columns[i];
				var aDataFields=oColumn.getDataFields();
				for(var j=0,jLen=oColumn.getInputOptions("allowKeywordSyno")?2:1;j<jLen;j++){
					var aValues=!aDataFields[j].value?[]:aDataFields[j].value.split(this._dataSeparator);
					aValues.swapElement(index1,index2);
					aValues.fill("",allRowsCount-aValues.length,aValues.length).slice(0,allRowsCount);
					aDataFields[j].value=aValues.join(this._dataSeparator);
				}
			}
		}		
		rows[0].fireEvent("_onPositionChange",index2);
		rows[1].fireEvent("_onPositionChange",index1);
		this.fireEvent("onSwapRow",rows);
	}
	prototype._onReady=function(){
		this.fireEvent("onReady");
		this.load();
	}
	prototype._onLoaded=function(){
		this.fireEvent("onLoaded");
		if(this._rows.length) this._rows[0].activate();
	}
	prototype._onRowsPositionChange=function(){
		for(var i=0;i<this._rows.length;i++){
			this._rows[i].fireEvent("_onPositionChange",i);
		}
	}
	prototype._onRowValueChanged=function(oRow){
		this.fireEvent("onRowValueChanged");
	}
}

//==============================================

/**
 * @class: Column
 * @para parentTable:
 * @para sTitle:
 * @para sName:
 * @para sType: Text,Number,Date
 * @para vWidth:
 * @para iAlign:
 * @created: 2012.5.18
 * @modified: 2012.5.18
 */
_$class.Column=function(parentTable,sTitle,sName,sType,vWidth,iHeaderAlign,iAlign){
	this._parent=null;
	this._title="";
	this._name="";
	this._type="";
	this._index=-1;
	this._width="";
	this._headerAlign=0;	//0,left; 1,center; 2,right;
	this._align=0;			//0,left; 1,center; 2,right;
	this._isHidden=false;
	this._isReadOnly=false;
	this._allowEmpty=true;
	this._inputOptions={};
	this._dataFields=[];
	this._htmlElement=null;
	this._Column(parentTable,sTitle,sName,sType,vWidth,iHeaderAlign,iAlign);
}
with(_$class.Column){
	$name="Column";
	$extends("Object");
	prototype._Column=function(parentTable,sTitle,sName,sType,vWidth,iHeaderAlign,iAlign){
		this._parent=parentTable;
		this._title=sTitle;
		this._name=sName||Global.newId();
		this._type=sType||"Text";
		this._index=this._parent.getColumnsCount();
		this._width=vWidth||"";
		this._headerAlign=iHeaderAlign||0;
		this._align=iAlign||(iAlign==undefined?this._headerAlign:iAlign);
		this._htmlElement=this._parent._htmlHead.insertCell(this._parent._htmlHead.cells.length
				-(!this._parent.getOpenMode()?0:(!this._parent.getEnabledActionCol()?0:1)));
		with(this._htmlElement){
			className="TableDataCell";
			width=this._width;
			align=["left","center","right"][this._headerAlign];
			style.textAlign=["left","center","right"][this._headerAlign];	//2013.12.18
			innerText=this._title;
		}
		this._parent.fireEvent("_onAddedColumn",this);
	}
	
	//:property-------------------------
	
	prototype.getTitle=function(){
		return this._title;
	}
	prototype.getName=function(){
		return this._name;
	}
	prototype.getType=function(){
		return this._type;
	}
	prototype.getWidth=function(){
		return this._width;
	}
	prototype.setWidth=function(value){
		this._width=value;
		this._htmlElement.width=this._width;
	}
	prototype.getHeaderAlign=function(){
		return this._headerAlign;
	}
	prototype.getAlign=function(){
		return this._align;
	}
	prototype.setAlign=function(value){
		this._align=value;
		this._htmlElement.align=["left","center","right"][this._align];
	}
	prototype.getIndex=function(){
		return this._index;
	}
	prototype.getIsHidden=function(){
		return this._isHidden;
	}
	prototype.setIsHidden=function(value){
		this._isHidden=value;
		this._htmlElement.style.display=this._isHidden?"none":"";
	}
	prototype.getAllowEmpty=function(){
		return this._allowEmpty;
	}
	prototype.setAllowEmpty=function(value){
		if(this._allowEmpty==value) return;
		this._allowEmpty=value;
		if(this._inputOptions.hasOwnProperty("allowEmpty")){
			value=this.getInputOptions("allowEmpty");
			if(this._allowEmpty!=value){
				this._inputOptions["allowEmpty"]=this._allowEmpty;
			}
		}
		this.fireEvent("_onPropertyChanged","allowEmpty");
	}
	prototype.getIsReadOnly=function(){
		return this._isReadOnly;
	}
	prototype.getInputOptions=function(sName){
		var value;
		switch(sName){
			case undefined:
				return this._inputOptions;
			case "allowEmpty":
			case "allowMultiple":
			case "allowKeywordSyno":
			case "allowNotInList":
				if(this._inputOptions.hasOwnProperty(sName)){
					value=this._inputOptions[sName];
					value=typeof(value)!="boolean"?Boolean(eval(value)):value;
				}else{
					value=false;
				}
				break;
			case "separator":
			default:
				value=this._inputOptions[sName];
		}
		return value;
	}
	/**
	 * @property: inputOptions
	 * @description: 对象，数据输入选项。形如：“{para1: value1, para2: value2, paran: valuen}”
	 *		具体选项值根据列的数据类型的不同而不同，可参考表单项的不同数据类型的行为扩展。具体
	 *		可参见表单的行为扩展的文件目录“widgets/form”
	 * @created: 2010.11.25
	 * @modified: 2012.6.8
	 */
	prototype.setInputOptions=function(oValue){
		var value;
		this._inputOptions.label=this._title;
		this._inputOptions.dataType=this._type;		
		for(var key in oValue){
			if(oValue.hasOwnProperty(key)){
				this._inputOptions[key]=oValue[key];
			}
		}
		if(oValue.hasOwnProperty("allowEmpty")){
			value=this.getInputOptions("allowEmpty");
			if(this._allowEmpty!=value){
				this._allowEmpty=value;
				this.fireEvent("_onPropertyChanged","allowEmpty");
			}
		}
	}
	prototype.getDataFields=function(index){
		return index==undefined?this._dataFields:this._dataFields[index];
	}
	
	//:method-----------------
	
	/**
	 * @function: bindDataFields
	 * @para elTextField: required,表单项“input”元素, 存放本列的所有值，可使用分隔符“;”、“,”、“ ”、“\r”、“\n”、“|”、“:”，或者其组合。
	 * @para elValueField: optional,表单项“input”元素,存放本列的所有值，可使用分隔符“;”、“,”、“ ”、“\r”、“\n”、“|”、“:”，或者其组合。
	 * @description: 注意，要绑定的数据域必须为多值。所以建议域设置以下属性：
	 *			“<input type=hidden separator="; " allowMultiple="true">”
	 *			并且，在保存数据到此域时，必须先编码元数据(使用encodeText())再放入。
	 *			从中去数据时，先取得元素数据，再进行解码。
	 * @created: 2010.11.25
	 * @modified: 2010.11.27
	 */
	prototype.bindDataFields=function(elTextField,elValueField){
		var _this=this;
		this._dataFields=Array.prototype.slice.call(arguments,0);
	}

	//:event------------------
	
	prototype._onPropertyChanged=function(sName){
		var iColumnIndex=this.getIndex();
		switch(sName){
			case "allowEmpty":
				if(this._parent.getOpenMode()==1){
					if(this._allowEmpty){
						var elAwakeFlag=Global.dom("#awakeFlag",this._htmlElement)[0];
						if(elAwakeFlag) elAwakeFlag.parentNode.removeChild(elAwakeFlag);
					}else{
						with(this._htmlElement.appendChild(document.createElement("span"))){
							id="awakeFlag";
							className="AwakeFlag";
							innerHTML="*";
						}
					}
					for(var i=0,iLen=this._parent.getRowsCount();i<iLen;i++){
						var field=this._parent.getRow(i).getColumnField(iColumnIndex);
						if(field){
							field.setAllowEmpty(this.getInputOptions("allowEmpty"));
						}
					}
				}
				break;
		}
	}
}

//==============================================

_$class.Row=function(parentTable,index){
	this._id="";
	this._index=0;
	this._parent=parentTable;
	this._colFields=[];
	this._htmlElement=null;
	this._checked=false;
	this._Row(parentTable,index);
}
with(_$class.Row){
	$name="Row";
	$extends("Object");
	prototype._Row=function(parentTable,index){
		var _this=this;
		this._parent=parentTable;
		this._id="R"+(++this._parent.__usedIDCount);
		this._index=index==undefined?this._parent.getRowsCount():index;
		this._htmlElement=parentTable._htmlBody.insertRow(this._index);
		with(this._htmlElement){
			className="TableDataEntry";	
		}
		if(this._parent.getOpenMode()==0){	//只读模式
			with(this._htmlElement){
				if(this._parent.getEnabledNoCol()){
					with(insertCell(-1)){
						className="col-no";
						style.width=this._parent.__columns["No"].width;
						style.textAlign=["left","center","right"][this._parent.__columns["No"].align];
						innerHTML=this._index+1;
					}
				}			
				for(var i=0,iLen=this._parent.getColumnsCount();i<iLen;i++){
					var oColumn=this._parent.getColumn(i);
					with(insertCell(-1)){
						className="TableDataCell";
						width=oColumn.getWidth();
						align=["left","center","right"][oColumn.getAlign()];
						style.textAlign=["left","center","right"][oColumn.getAlign()];
					}
				}
			}
			this.load();
		}else{	//编辑模式
			with(this._htmlElement){
				//2013.9.10
				onmousedown=function(){
					_this.activate();
				}
				if(this._parent.getEnabledSelectCol()){
					with(insertCell(-1)){
						className="col-select";
						style.width=this._parent.__columns["No"].width;
						appendChild(this._createSelectColumn());
					}
				}
				if(this._parent.getEnabledNoCol()){
					with(insertCell(-1)){
						className="col-no";
						innerHTML=this._index+1;
					}
				}
				for(var i=0,iLen=this._parent.getColumnsCount();i<iLen;i++){
					var oColumn=this._parent.getColumn(i);
					with(insertCell(-1)){
						className="TableDataCell";
						width=oColumn.getWidth();
						align=["left","center","right"][oColumn.getAlign()];
						style.textAlign=["left","center","right"][oColumn.getAlign()];	//2013.12.18
						appendChild(this._createColumnField(i));
					}
				}
				if(this._parent.getEnabledActionCol()){
					with(insertCell(-1)){
						className="col-action";
						appendChild(this._createActionColumn());
					}
				}
			}
		}
		this._parent.fireEvent(index==undefined?"_onAddedRow":"_onInsertedRow",this);
		if(this._parent.getStatus()==0) {
			this.load();
			this.fireEvent("_onLoaded");
		}
	}
	
	//:property------------------
	
	prototype.getParent=function(){
		return this._parent;
	}
	prototype.getId=function(){
		return this._id;
	}
	prototype.getIndex=function(){
		return this._index;
	}
	prototype.getChecked=function(){
		return this._checked;
	}
	prototype.setChecked=function(value){
		if(this._checked==value) return;
		this._checked=value;
		this.fireEvent("_onPropertyChanged","checked");
	}
	prototype.getHtmlElement=function(){
		return this._htmlElement;
	}
	
	//:method----------------------
	
	prototype.getColumnField=function(iColumn){
		return this._colFields[iColumn];
	}
	prototype.getColumnFieldByColName=function(colName){
		return this._colFields[this._parent.getColumnByName(colName).getIndex()];
	}
	prototype.getColumnText=function(iColumn){
		if(this._parent.getOpenMode()==0){
			var sTexts=this._parent.getColumn(iColumn).getDataFields(0).value;
			var aTexts=sTexts==""?[]:sTexts.split(this._parent._dataSeparator);
			var sText="";
			if(aTexts.length-1>=this._index){
				sText=this._parent.decodeText(aTexts[this._index]);
			}
			return sText;
		}else{
			return this._colFields[iColumn].getDataText();
		}
	}
	prototype.getColumnValue=function(iColumn){
		if(this._parent.getOpenMode()=0){
			var sTexts=this._parent.getColumn(iColumn).getDataFields().getLast().value;
			var aTexts=sTexts==""?[]:sTexts.split(this._parent._dataSeparator);
			var sText="";
			if(aTexts.length-1>=this._index){
				sText=this._parent.decodeText(aTexts[this._index]);
			}
			return sText;
		}else{
			return this._colFields[iColumn].getDataValue();
		}
	}
	prototype.setColumnValue=function(iColumn,vValue){
		if(this._parent.getOpenMode()==0) return;
		this._colFields[iColumn].setDataValue(vValue);
	}
	/**
	 * @since: v0.7.6
	 * @created: 2013.5.14
	 * @modified: 2013.5.14
	 */
	prototype.adjust=function(){
		var handles=[],paras=[];
		for(var i=0,vHandles=this._parent._fieldAdjustHandles;i<vHandles.length;i++){
			var vHandle=vHandles[i];
			var aColNames1=!Global.isArray(vHandle[0])?[vHandle[0]]:vHandle[0];
			var aFields1=[];
			for(var j=0;j<aColNames1.length;j++){
				var sColName1=aColNames1[j];
				aFields1.push(this.getColumnFieldByColName(sColName1));
			}
			handles.push(vHandle[1]);
			paras.push(aFields1);
		}
		handles.forEach(function(handle,index){
			try{
				handle.apply(this._parent,[this].concat(paras[index]));
			}catch(e){
			}
		},this);
	}
	prototype.adjustByColField=function(sColName){
		var handles=[],paras=[];
		for(var i=0,vHandles=this._parent._fieldAdjustHandles;i<vHandles.length;i++){
			var vHandle=vHandles[i];
			var aColNames1=!Global.isArray(vHandle[0])?[vHandle[0]]:vHandle[0];
			var aFields1=[];
			var flag=false;
			
			for(var j=0;j<aColNames1.length;j++){
				var sColName1=aColNames1[j];
				if(sColName.toLowerCase()==sColName1.toLowerCase()){
					flag=true;
					break;
				}
			}
			if(!flag) continue;
			for(var j=0;j<aColNames1.length;j++){
				var sColName1=aColNames1[j];
				aFields1.push(this.getColumnFieldByColName(sColName1));
			}
			handles.push(vHandle[1]);
			paras.push(aFields1);
		}
		handles.forEach(function(handle,index){
			try{
				handle.apply(this._parent,[this].concat(paras[index]));
			}catch(e){
			}
		},this);
	}
	prototype.moveUp=function(){
		if(this._index<=0) return;
		this._parent.swapRow(this,this._parent.getRow(this._index-1));
	}
	prototype.moveDown=function(){
		if(this._index>=this._parent.getRowsCount()-1) return;
		this._parent.swapRow(this,this._parent.getRow(this._index+1));
	}
	prototype.isEmpty=function(){
		return this._colFields.every(function(field){
			return field?field.isEmpty():true;
		});
	}
	prototype.clearEmpty=function(){
		this._colFields.forEach(function(field){
			if(field) field.clearEmpty();
		});
		return this;
	}
	
	/**
	 * @description: 载入初始数据, 不一定是打开页面时的初始数据，因为中间可能保存过数据。
	 * @created: 2012.6.1
	 * @modified: 2013.5.14
	 */
	prototype.load=function(){
		var iRowIndex=this._index;
		for(var i=0,iLen=this._parent.getColumnsCount();i<iLen;i++){
			var oColumn=this._parent.getColumn(i);
			var oOptions=oColumn.getInputOptions();
			var field=this._colFields[i];
			var aColumnValues,aColumnTexts,vValue,vValue1;
			var sColumnValues,sColumnTexts;
			if(!field){	//只读模式
				sColumnValues=oColumn.getDataFields(0).value;
				aColumnValues=sColumnValues==""?[]:sColumnValues.split(this._parent._dataSeparator);
				if(aColumnValues.length-1>=iRowIndex){
					vValue=this._parent.decodeText(aColumnValues[iRowIndex]);
				}else{
					vValue="";
				}
				if(vValue==""){
					this._htmlElement.cells[this._parent.__startDataColIndex+i].innerHTML="<span style=\"height:1em\"></span>";
				}else{
					//this._htmlElement.cells[this._parent.__startDataColIndex+i].innerHTML=Global.HTMLEncoder.encodeNodeData(vValue);
					with(this._htmlElement.cells[this._parent.__startDataColIndex+i]){
						innerText=vValue;
						innerHTML=innerHTML.replace(/\r/g,"").replace(/\n/g,"<br>");	//only for Firefox
					}
				} 
			}else{	//编辑模式
				if(!field.getDataField()){
					sColumnValues=oColumn.getDataFields(0).value;
					aColumnValues=sColumnValues==""?[]:sColumnValues.split(this._parent._dataSeparator);
					if(aColumnValues.length-1<iRowIndex){ 
						vValue="";
					}else{
						vValue=this._parent.decodeText(aColumnValues[iRowIndex]);
					}
					field.setStoreValues(vValue);
				}else{
					sColumnTexts=oColumn.getDataFields(0).value;
					aColumnTexts=sColumnTexts==""?[]:sColumnTexts.split(this._parent._dataSeparator);
					sColumnValues=oColumn.getDataFields(1).value;
					aColumnValues=sColumnValues==""?[]:sColumnValues.split(this._parent._dataSeparator);
					
					if(aColumnValues.length-1<iRowIndex){
						vValue="",vValue1="";
					}else{
						vValue=this._parent.decodeText(aColumnTexts[iRowIndex]);
						vValue1=this._parent.decodeText(aColumnValues[iRowIndex]);
					}
					field.setStoreValues(vValue,vValue1);
				}
				if(field.getDataType()=="Text") field.adjustHeight();
			}
		}
		if(this._parent.getOpenMode()==1) this.adjust();
		this.fireEvent("_onLoaded");
	}
	prototype.reload=function(){
		this.load();
	}
	prototype.activate=function(){
		var row=this._parent.getActiveRow();
		if(row) row.fireEvent("_onDeactivate");
		this.fireEvent("_onActivate");
	}
	prototype.validate=function(){
		return ![0,1,2].some(function(mode){
			return this._colFields.some(function(field){
				return !field.validate(mode,true);
			},this);
		},this);		
	}
	prototype.save=function(){
		if(this._parent.getOpenMode()==0) return;
		this._parent.save();
	}
	prototype.remove=function(){
		if(this._parent.getOpenMode()==0) return;
		if(this._parent.getRowsCount()<=this._parent.getMinRowsCount()){
			alert(this._parent._getLocale("canotDeleteRowInLimitCount"));
			return;
		}
		this._htmlElement.parentNode.removeChild(this._htmlElement);
		this._parent.fireEvent("_onRemovedRow",this);
	}
	prototype._createSelectColumn=function(){
		var _this=this;
		var _htmlElement=document.createElement("input");
		with(_htmlElement){
			setAttribute("type","checkbox");
			onclick=function(){
				_this.setChecked(this.checked);
			}
		}
		return _htmlElement;
	}
	prototype._createActionColumn=function(){
		var _this=this;
		var _htmlElement=document.createElement("div");
		var column=this._parent.__columns["Action"];
		for(var i=0,names=column.actions[1].split(",");i<names.length;i++){
			var _action=this.getParent().getClass()._actions[names[i]];
			with(_htmlElement){
				with(appendChild(window.document.createElement("img"))){
					className="ActionButton";
					title=_action.title;
					src=this.getParent().getClass().getResPath()+"/"+_action.icon;
					onclick=function(){
						var _action1=_action;
						return function(event){
							return _action1.doAction2(_this,event);
						}
					}();
				}
			}
		}
		return _htmlElement;
	}
	prototype._createColumnField=function(iColumn){
		var _this=this;
		var oColumn=this._parent.getColumn(iColumn);
		var oOptions=oColumn.getInputOptions();
		var oOptions1=Global.extend({},oOptions);	//2013.9.8
		var elDspField=null,elValueField=null;
		var _htmlElement,_field;
		if(oColumn.getInputOptions("optionalValues")
			||oColumn.getType()=="Date"){
			_htmlElement=document.createElement("table");
			with(_htmlElement){
				width="100%";
				cellSpacing=0;
				cellPadding=0;
				with(insertRow(-1)){
					vAlign="bottom";
					with(insertCell(-1)){
						if(oColumn.getInputOptions("allowKeywordSyno")){
							if(!oColumn.getInputOptions("allowMultipleLine")){
								with(elValueField=appendChild(window.document.createElement("input"))){
									type="text";
								}
							}else{
								elValueField=appendChild(window.document.createElement("textarea"));
							}
						}
						if(!oColumn.getInputOptions("allowMultipleLine")){
							with(elDspField=appendChild(window.document.createElement("input"))){
								type="text";
							}
						}else{
							with(elDspField=appendChild(window.document.createElement("textarea"))){
								rows=1;
							}
						}
					}
					with(insertCell(-1)){
						width="16";
						with(appendChild(window.document.createElement("a"))){
							className="FieldSelectButton";
							href="javascript:void(0)";
							innerHTML="<img border=0 src=\""
								+this._parent.getClass().getResPath()+"/btn_select.gif"+"\">";
							onclick=function(event){
								//_this.activate();	//2013.9.10
								if(!_field.getIsReadOnly()) _field.selectValues(event);
							}
						}
					}
				}
			}
		}else{
			_htmlElement=document.createElement("div");
			with(_htmlElement){
				if(oColumn.getInputOptions("allowKeywordSyno")){
					if(!oColumn.getInputOptions("allowMultipleLine")){
						with(elValueField=appendChild(window.document.createElement("input"))){
							type="text";
						}
					}else{
						elValueField=appendChild(window.document.createElement("textarea"));
					}
				}
				if(!oColumn.getInputOptions("allowMultipleLine")){
					with(elDspField=appendChild(window.document.createElement("input"))){
						type="text";
					}
				}else{
					with(elDspField=appendChild(window.document.createElement("textarea"))){
						rows=1;
					}
				}
			}
		}
		if(elValueField){
			with(elValueField){
				className="Field ValueField";
			}
			oOptions1.dataField=elValueField;	//2013.9.8
		}
		with(elDspField){
			className="Field DisplayField";
			for(var key in oOptions){
				if(oOptions.hasOwnProperty(key)){
					if(key.indexOf("on")!=0) setAttribute(key,oOptions[key]);
				}
			}
		}
		_field=this._parent._parentForm.addFieldFrom(elDspField,oOptions1);
		_field.addEventListener("onValueChanged",function(){
			_this.fireEvent("_onValueChanged", oColumn.getName());
			return false;	//不向上冒泡到表单事件上
		});
		_field.addEventListener("onReadStateChanged",function(isReadOnly){
			var img=Global.dom("img",_htmlElement).getFirst();
			if(img){
				img.src=img.src.leftBack("/")+(isReadOnly?"/btn_select1.gif":"/btn_select.gif");
			}
			elDspField.className=isReadOnly?"Field ReadField DisplayField":"Field DisplayField";
		});
		_field.fireEvent("onReadStateChanged",_field.getIsReadOnly());
		this._colFields.push(_field);
		return _htmlElement;
	}
	
	//:event------------------------
	
	prototype._onLoaded=function(){
		this._parent.fireEvent("_onLoadedRow",this);
	}
	prototype._onActivate=function(){
		if(this._parent.__noColIndex>=0){
			var oCell=this._htmlElement.cells[this._parent.__noColIndex];
			oCell.innerHTML="<div class=\"current-point\"></div>"+(this._index+1);
		}
		this._htmlElement.className="TableDataEntry ActiveTableDataEntry";
		this._parent._activeRow=this;
	}
	prototype._onDeactivate=function(){
		if(this._parent.__noColIndex>=0){
			var oCell=this._htmlElement.cells[this._parent.__noColIndex];
			oCell.innerHTML=this._index+1;
		}
		this._htmlElement.className="TableDataEntry";
		this._parent._activeRow=null;
	}
	prototype._onPositionChange=function(newIndex){
		if(this._index==newIndex) return;
		this._index=newIndex;
		if(this._parent.__noColIndex>=0){
			this._htmlElement.cells[this._parent.__noColIndex].innerHTML=
				(this._parent.getActiveRow()==this?"<div class=\"current-point\"></div>":"")+(newIndex+1);
		}
		if(this._parent.__selColIndex>=0){
			var oCell=this._htmlElement.cells[this._parent.__selColIndex];
			var el=Global.dom("input",oCell).getFirst();
			if(el&&el.checked!=this._checked) el.checked=this._checked;
		}
	}
	prototype._onPropertyChanged=function(sName){
		switch(sName){
			case "checked":
				if(this._parent.__selColIndex>=0){
					var oCell=this._htmlElement.cells[this._parent.__selColIndex];
					var el=Global.dom("input",oCell).getFirst();
					if(el) el.checked=this._checked;
				}
				break;
		}
	}
	prototype._onValueChanged=function(columnName){
		this.adjustByColField(columnName);
		this._parent.fireEvent("_onRowValueChanged",this);
	}
}

