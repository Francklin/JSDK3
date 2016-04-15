/**
 * @file HTMLTextField.class.js
 * @version 0.6.0
 * @since JSDK3 V1.9.0
 * @author Liu Denggao
 * @created 2012.5.29
 * @modified 2012.7.9-2013.5.29
 * @updated
		v0.5.2 -> v0.6.0
		2013.8.29 把本地化字符串集中化了，便于修改，也为下一步多语言化做准备
		v0.5.1 -> v0.5.2
		2013.5.29 修复了文本长度的验证问题
 */

$package("js.domx");
$import("js.domx.HTMLFormField");

js.domx.HTMLTextField=function(){
	this._dataType="Text";
	this._separator="";
	this._allowMultiple=false;
	this._allowKeywordSyno=false;
	this._allowNotInList=true;
	this._allowMultipleLine=false;
	this._optionalValues=null;
	this._minValue=undefined;
	this._maxValue=undefined;
	this._dataValue=undefined;
	this._dataField=undefined;	//original form input element
	this._isSelecting=false;
	this._isAutoHeight=false;
	this._minRows=0;
	this._maxRows=0;
};
var _$class=js.domx.HTMLTextField;

_$class.$name="HTMLTextField";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLFormField);
_$class._localeResource={
	"pleaseInput": "Please select or input \"{0}\"!",
	"canotLessItems": "The count of items you selected \"{0}\" cannot be less than {1}!",
	"canotGreaterItems": "The count of items you selected \"{0}\" cannot be greater than {1}!",
	"canotLessWords": "The count of characters you entered \"{0}\" cannot be less than {1}!",
	"canotGreaterWords": "The count of characters you entered \"{0}\" cannot be greater than {1}!",
	"itemsLimit": "Limit count of items: {0} - {1}",
	"wordsLimit": "Limit count of characters: {0} - {1}",
	"atLeastItems": "At least {0}!",
	"atMostItems": "Up to {0}!",
	"atLeastWords": "At least {0} characters!",
	"atMostWords": "Up to {0} characters!"
}
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getMinValue=function(){
	return this._minValue;
}
_$proto.setMinValue=function(value){
	if(value===this._minValue) return;
	this._minValue=value;
	this.fireEvent("_onPropertyChanged","minValue");
}
_$proto.getMaxValue=function(){
	return this._maxValue;
}
_$proto.setMaxValue=function(value){
	if(value===this._maxValue) return;
	this._maxValue=value;
	this.fireEvent("_onPropertyChanged","maxValue");
}
/**
 * @value 
 * 	1)_newline:	新行
 *	2)_blankline:	空行
 *	3)value:
 */
_$proto.getSeparator=function(){
	return this._separator;
}
_$proto.setSeparator=function(value){
	this._separator=value;
	switch(value.toLowerCase()){
		case "_newline":
			this._separator=Global.STR_NewLine;
			break;
		case "_blankline":
			this._separator=Global.STR_NewLine+Global.STR_NewLine;
			break;
		default:
			this._separator=value;
	}
}
_$proto.getAllowMultiple=function(){
	return this._allowMultiple;
}
_$proto.setAllowMultiple=function(value){
	this._allowMultiple=value;
}
/**
 * @value: 允许关键字同义，用于选项菜单中是否同时包含显示文本和实际值
 *	1)true:	用于选项菜单中的项有一个显示值和实际值
 *	2)false:	用于选项菜单中的项只有一个实际值
 */
_$proto.getAllowKeywordSyno=function(){
	return this._allowKeywordSyno;
}
_$proto.getAllowNotInList=function(){
	return this._allowNotInList;
}
_$proto.getIsAutoHeight=function(){
	return this._isAutoHeight;
}
_$proto.getIsReadOnly=function(){
	return this._isReadOnly;
}
_$proto.setIsReadOnly=function(value){
	if(this._isReadOnly===value) return;
	this._isReadOnly=value;
	this.fireEvent("_onPropertyChanged","isReadOnly");
}
/**
 * @value: 如果内容为数组，则单个元素的格式为："text|value"
 */
_$proto.getOptionalValues=function(){
	return this._optionalValues;
}
_$proto.setOptionalValues=function(value){
	this._optionalValues=value;
}
_$proto.getDataText=function(){
	return this._allowMultiple?this.__original.value.split(this._separator||";"):this.__original.value;
}
_$proto.getDataValue=function(){
	if(!this._allowKeywordSyno){
		var field=this.__original;
		if(!this._allowMultiple){
			return field.value;
		}else if(!field.value){
			return [];
		}else{
			return field.value.split(this._separator||";");
		}		
	}else if(this._dataField){
		var field=this._dataField;
		if(!this._allowMultiple){
			return field.value;
		}else if(!field.value){
			return [];
		}else{
			return field.value.split(this._separator||";");
		}		
	}else if(this._dataValue){
		return this._dataValue;
	}else{
		return this._allowMultiple?[]:"";
	}
}
_$proto.setDataValue=function(vValue){
	var element=this.__original;
	if(this._allowKeywordSyno) vValue=this._setDataValue(vValue);
	vValue=Global.isArray(vValue)?vValue:[vValue];
	if(!this._allowKeywordSyno){
		var sValue=vValue.join(this._separator||";");
	}else if(!this._optionalValues||!this._optionalValues.length){
		var sValue=vValue.join(this._separator||";");
	}else{
		var sValue=this._optionalValues.select(function(item){
			return vValue.contains(item.getLast());
		}).map(function(item){
			return item.getFirst();
		}).join(this._separator||";");
	}
	if(element.value!=sValue) element.value=sValue;
	this.fireEvent("_onValueChanged");
}
_$proto._setDataValue=function(vValue){
	if(Global.isArray(vValue)){
		if(this._dataField){
			this._dataField.value=vValue.join(this._separator||";");
		}else{
			this._dataValue=vValue.join(this._separator||";");
		}
	}else{ 
		if(this._dataField){
			this._dataField.value=vValue;
		}else{
			this._dataValue=vValue;
		}
	}
	return this.getDataValue();
}

//:method-------

/**
 *
 * @invoke: newInstanceFrom(parentForm,vField[,vOptions])
 * @para parentForm: 封装的表单
 * @para vField: 域名称或域对象
 * @para vOptions: 参数属性
 */
_$class.newInstanceFrom=function(parentForm,vField,vOptions){
	if(!vField) return null;
	var obj=new this();
	obj._parentForm=parentForm;
	if(typeof(vField)=="string"){
		obj.__original=parentForm.getElementsByName(vField).getFirst();
	}else{
		obj.__original=vField;
	}
	obj._name=obj.__original.name||obj.__original.id||"";
	//parse tag...
	if(vOptions){
		obj._separator=vOptions.separator||"";
		obj._label=vOptions.label||"";
		if(vOptions.allowEmpty!=undefined) obj._allowEmpty=vOptions.allowEmpty;
		if(vOptions.unfilledPrompt!=undefined) obj._unfilledPrompt=vOptions.unfilledPrompt;
		if(vOptions.unmatchedPrompt!=undefined) obj._unmatchedPrompt=vOptions.unmatchedPrompt;		
		if(vOptions.allowMultiple!=undefined) obj._allowMultiple=vOptions.allowMultiple;
		if(vOptions.allowKeywordSyno!=undefined) obj._allowKeywordSyno=vOptions.allowKeywordSyno;
		if(vOptions.allowNotInList!=undefined) obj._allowNotInList=vOptions.allowNotInList;
		if(vOptions.isReadOnly!=undefined) obj._isReadOnly=vOptions.isReadOnly;
		obj._allowMultipleLine=obj.__original.tagName=="TEXTAREA";
		if(obj._allowMultipleLine){
			obj._isAutoHeight=vOptions.isAutoHeight||false;
			obj._minRows=vOptions.minRows||obj.__original.rows||2;
			obj._maxRows=vOptions.maxRows||0;
			obj._maxRows=obj._maxRows>0?Math.max(obj._minRows,obj._maxRows):0;
		}
		if(vOptions.dataField!=undefined){
			if(typeof(vOptions.dataField)!="string"){
				obj._dataField=vOptions.dataField;
			}else{
				obj._dataField=parentForm.getElementsByName(vOptions.dataField).getFirst();
			}
		}
		if(vOptions.optionalValues!=undefined) {
			if(typeof(vOptions.optionalValues)!="string"){
				obj._optionalValues=vOptions.optionalValues;
			}else if(vOptions.optionalValues.indexOf("->#")==0){
				obj._optionalValues=parentForm.getElementsByName(vOptions.optionalValues.right("->#"))
						.getFirst().value.split(obj._separator||";");
			}else{
				obj._optionalValues=vOptions.optionalValues.split(obj._separator||";");
			}
			for(var i=0;i<obj._optionalValues.length;i++){
				var vValue=obj._optionalValues[i];
				if(Global.isArray(vValue)){
					//no do any------
				}else if(typeof(vValue)=="string"){
					if(!obj._allowKeywordSyno){
						obj._optionalValues[i]=[vValue];
					}else{
						obj._optionalValues[i]=[vValue.split("|")[0],vValue.split("|").pop()];
					}
				}else{
					obj._optionalValues[i]=obj._allowKeywordSyno?[vValue.text,vValue.value]:[vValue.text];
				}
			}
		}
		if(vOptions.minValue!=undefined) {
			if(typeof(vOptions.minValue)!="string"){
				obj._minValue=vOptions.minValue;
			}else{
				obj._minValue=parseFloat(vOptions.minValue);
			}
		}
		if(vOptions.maxValue!=undefined) {
			if(typeof(vOptions.maxValue)!="string"){
				obj._maxValue=vOptions.maxValue;
			}else{
				obj._maxValue=parseFloat(vOptions.maxValue);
			}
		}		
		if(vOptions.onEvents){
			["onValidate","onSelect","onReadStateChanged","onValueChanged"].forEach(function(sEvent){
				var func=vOptions.onEvents[sEvent];
				if(func) obj.addEventListener(sEvent,func);
			});
		}
	}
	if(obj.__original.type!="file"){
		obj.__original.attachEvent("onchange",function(event){
			obj.fireEvent("_onValueChanged",event);
		});
		obj.__original.attachEvent("onblur",function(event){
			obj.fireEvent("_onBlur",event);
		});
	}else{
		obj.__original.attachEvent("onchange",function(event){
			obj.fireEvent("_onValueChanged",event);
			obj.fireEvent("_onBlur",event);
		});
	}
	obj.fireEvent("_onPropertyChanged","allowKeywordSyno");
	obj.fireEvent("_onPropertyChanged","allowNotInList");
	obj.fireEvent("_onPropertyChanged","minValue");
	obj.fireEvent("_onPropertyChanged","maxValue");
	obj.fireEvent("_onPropertyChanged","isAutoHeight");
	obj.fireEvent("_onPropertyChanged","minRows");
	obj.adjustHeight();
	obj.fireEvent("_onPropertyChanged","isReadOnly");
	return obj;
}
_$proto.selectValues=function(event){
	this.fireEvent("_onSelect",event);
}
_$proto.clearEmpty=function(){
	this.__original.value="";
	if(this._dataValue) this._dataValue="";
	if(this._dataField) this._dataField.value="";
}
_$proto.validate=function(iOptions,isSubmiting){
	var field=this.__original;
	switch(iOptions){
		case 0:
			//必填检查
			if(!field.value){
				if(!this._allowEmpty&&isSubmiting){
					if(this._unfilledPrompt) alert(this._unfilledPrompt);
					else alert(this._getLocale("pleaseInput",this._label));
					try{field.focus();}catch(e){}
					
				}
				return this._allowEmpty;
			}
			break;
		case 1:
			if(!field.value&&this._allowEmpty) break;
			var minValue=this.getMinValue();
			var maxValue=this.getMaxValue();
			
			//检查大小范围
			if(this._allowMultiple){
				var length=this.getDataValue().length;
				if(maxValue!=undefined){
					if(length>maxValue){
						if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
						else alert(this._getLocale("canotGreaterItems",this._label,maxValue));
						//field.value="";
						try{field.focus();}catch(e){}
						return false;
					}
				}
				if(minValue!=undefined){
					if(length<minValue){
						if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
						else alert(this._getLocale("canotLessItems",this._label,minValue));
						//field.value="";
						try{field.focus();}catch(e){}
						return false;
					}
				}
			}else if(this._allowNotInList){
				var length=field.value.length;
				if(maxValue!=undefined){
					if(length>maxValue){
						if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
						else alert(this._getLocale("canotGreaterWords",this._label,maxValue));
						//field.value="";
						try{field.focus();}catch(e){}
						return false;
					}
				}
				if(minValue!=undefined){
					if(length<minValue){
						if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
						else alert(this._getLocale("canotLessWords",this._label,minValue));
						//field.value="";
						try{field.focus();}catch(e){}
						return false;
					}
				}
			}
			break;
		case 2:
			return this.fireEvent("_onValidate",isSubmiting);
	}
	return true;
}
//调整域高度
_$proto.adjustHeight=function(){
	var field=this.__original;
	if(this._isAutoHeight){
		if(Global.Browser.Engine.trident){
			if(document.compatMode!="CSS1Compat") return;
			while(field.scrollHeight<=field.clientHeight){
				if (field.rows > this._minRows)
					field.rows--;
				else
					break;
				if (this._maxRows==0 || field.rows < this._maxRows)
					field.style.overflowY = "hidden";
				if (field.scrollHeight>field.clientHeight){
					field.rows++;
					break;
				}
			}
			while(field.scrollHeight>field.clientHeight){
				if (this._maxRows==0 || field.rows < this._maxRows){
					field.rows++;
				}else{
					field.style.overflowY = "auto";
					break;
				}
			}
		}else{
			if (field.scrollTop == 0) field.scrollTop=1;
			while (field.scrollTop == 0){
				if (field.rows > this._minRows)
					field.rows--;
				else
					break;
				field.scrollTop = 1;
				if (this._maxRows==0 || field.rows < this._maxRows)
					field.style.overflowY = "hidden";
				if (field.scrollTop > 0){
					field.rows++;
					break;
				}
			}
			while(field.scrollTop > 0){
				if (this._maxRows==0 || field.rows < this._maxRows){
					field.rows++;
					if (field.scrollTop == 0) field.scrollTop=1;
				}else{
					field.style.overflowY = "auto";
					break;
				}
			}
		}
		
		
	}
}

//:event--------

/**
 * @event onReadStateChanged: onReadStateChanged(isReadOnly)
 */
_$proto._onPropertyChanged=function(sName){
	var _this=this;
	var field=this.__original;
	switch(sName){
		case "isAutoHeight": 
			if(!this._allowMultipleLine){
				return;
			}else if(this._isAutoHeight){
				if(Global.Browser.Engine.trident){
					if(document.compatMode!="CSS1Compat"){
						field.style.overflowY="visible";
					}else{
						field.style.overflowY="hidden";
						/*
						field.attachEvent("onpropertychange",function(event){
							event=event||window.event;
							if(event.propertyName!="value") return;
							if(!_this._isReadOnly) _this.adjustHeight();
						});*/
						field.attachEvent("onkeyup",function(event){
							event=event||window.event;
							if(!_this._isReadOnly) _this.adjustHeight();
						});
					}
				}else{
					field.style.overflowY="hidden";
					field.attachEvent("oninput",function(event){
						event=event||window.event;
						if(!_this._isReadOnly) _this.adjustHeight();
					});		
				}
			}else{
				this.__original.style.overflowY="auto";
			}
			break;
		case "minRows":
			if(this._allowMultipleLine){
				if(field.rows<this._minRows) field.rows=this._minRows;
			}
			break;			
		case "isReadOnly":
			if(this._isReadOnly){
				this.__original.readOnly=this._isReadOnly;
			}else{
				this.__original.readOnly=!this._allowNotInList;
			}
			this.fireEvent("onReadStateChanged",this._isReadOnly);
			break;
		case "allowKeywordSyno":
		case "allowNotInList":
			if(this._allowKeywordSyno){
				this._allowNotInList=false;
			}
			if(this._allowKeywordSyno){
				this.__original.readOnly=true;
			}else if(this._allowNotInList){
				this.__original.readOnly=false;
			}else{
				this.__original.readOnly=true;
			}	
			break;
		case "minValue":
		case "maxValue":
			var minValue=this.getMinValue();
			var maxValue=this.getMaxValue();
			if(this._allowMultiple){
				if(minValue!=undefined&&maxValue!=undefined){
					this.__original.title=this._getLocale("itemsLimit",minValue,maxValue);
				}else if(minValue!=undefined){
					this.__original.title=this._getLocale("atLeastItems",minValue);
				}else if(maxValue!=undefined){
					this.__original.title=this._getLocale("atMostItems",maxValue);
				}
			}else {
				if(minValue!=undefined&&maxValue!=undefined){
					this.__original.title=this._getLocale("wordsLimit",minValue,maxValue);
				}else if(minValue!=undefined){
					this.__original.title=this._getLocale("atLeastWords",minValue);
				}else if(maxValue!=undefined){
					this.__original.title=this._getLocale("atMostWords",maxValue);
				}
			}
			break;
	}
}
_$proto._onSelect=function(event){
	var _this=this;
	if(this.hasEvent("onSelect")){
		this._isSelecting=true;
		this.fireEvent("onSelect",event,this._optionalValues,function(action,value){
			switch(action){
				case 1:
					_this.fireEvent("_onSelectingOK",value);
					break;
				case 0:
					_this.fireEvent("_onSelectingCancel",value);
					break;
			}
		});
	}
}
_$proto._onSelectingOK=function(value){
	this.fireEvent("_onSelectingFinished");
	this.setDataValue(value);
}
_$proto._onSelectingCancel=function(){
	this.fireEvent("_onSelectingFinished");
}
_$proto._onSelectingFinished=function(){
	this._isSelecting=false;
}
//重载父方法
_$proto._onValueChanged=function(event){
	this.adjustHeight();
	var flag=this.fireEvent("onValueChanged",this.getDataValue());
	if(flag||flag==undefined) this._parentForm.fireEvent("_onFieldValueChanged",this);
}
_$proto._onBlur=function(event){
	var value=this.__original.value;
	var flag=![0,1,2].some(function(mode){
		return !this.validate(mode);
	},this);
	return flag;
}

