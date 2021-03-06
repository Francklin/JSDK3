/**
 * @file HTMLDateField.class.js
 * @author Liu Denggao
 * @created 2012.5.29
 * @modified 2012.6.28-2013.8.29
 * @version 0.7.0
 * @since JSDK3 V1.8.9
 * @updated
		v0.6.1 -> v0.7.0
		2013.8.29 把本地化字符串集中化了，便于修改，也为下一步多语言化做准备
 */

$package("js.domx");
$import("js.domx.HTMLFormField");

js.domx.HTMLDateField=function(){
	this._dataType="Date";
	this._allowKeyInput=true;
	this._minValue=undefined;
	this._minValueBy="";
	this._maxValue=undefined;
	this._maxValueBy="";
	this._pageSize=undefined;
	this._dateOptions="date";
	this._isSelecting=false;
};
var _$class=js.domx.HTMLDateField;

_$class.$name="HTMLDateField";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLFormField);
_$class._localeResource={
	"dateFormat": "Date Format: YYYY-MM-DD \n Example: 2012-05-30",
	"timeFormat": "Time Format: HH:MM:SS \n Example: 23:59:59",
	"datetimeFormat": "Date Format: YYYY-MM-DD HH:MM:SS \nExample: 2012-05-30 23:59:59",
	"pleaseInput": "Please select or input \"{0}\"!",
	"isnotDate": "The \"{0}\" you entered is not date! Please notice format: \n\n{1}",
	"mustLess": "The \"{0}\" you entered must be less or equal than \"{1}\"!",
	"mustGreater": "The \"{0}\" you entered must be greater or equal than \"{1}\"!"
}
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.setIsReadOnly=function(value){
	if(this._isReadOnly===value) return;
	this._isReadOnly=value;
	this.fireEvent("_onPropertyChanged","isReadOnly");
}
_$proto.getAllowKeyInput=function(){
	return this._allowKeyInput;
}
_$proto.getMinValue=function(){
	if(!this._minValueBy){
		return this._minValue;
	}else if(typeof(this._minValueBy)!="string"){
		return this._minValueBy.getDataValue();
	}else{
		var field=this._parentForm.getFieldByName(this._minValueBy);
		if(field){
			this._minValueBy=field;
			return field.getDataValue();
		}
	}
}
_$proto.setMinValue=function(value){
	if(value===this._minValue) return;
	this._minValue=value;
	this._minValueBy="";
	//this.fireEvent("_onPropertyChanged","minValue");
}
_$proto.getMaxValue=function(){
	if(!this._maxValueBy){
		return this._maxValue;
	}else if(typeof(this._maxValueBy)!="string"){
		return this._maxValueBy.getDataValue();
	}else{
		var field=this._parentForm.getFieldByName(this._maxValueBy);
		if(field){
			this._maxValueBy=field;
			return field.getDataValue();
		}
	}
}
_$proto.setMaxValue=function(value){
	if(value===this._maxValue) return;
	this._maxValue=value;
	this._maxValueBy="";
	//this.fireEvent("_onPropertyChanged","maxValue");
}
_$proto.getPageSize=function(){
	return this._pageSize;
}
_$proto.setPageSize=function(value){
	this._pageSize=value;
}
_$proto.getDateOptions=function(){
	return this._dateOptions;
}
_$proto.setDateOptions=function(value){
	if(value===this._dateOptions) return;
	this._dateOptions=value;	
	this.fireEvent("_onPropertyChanged","dateOptions");
}
_$proto.getDataText=function(){
	return this.__original.value;
}
_$proto.getDataValue=function(){
	return this._convertToDate(this.__original.value);
}
_$proto.setDataValue=function(vDate){
	var field=this.__original;
	if(!Global.is(vDate,"Date")){
		vDate=this._convertToDate(vDate);
	}
	field.value=vDate.toSTDString(this._dateOptions);
	this.fireEvent("_onValueChanged");
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
		if(vOptions.allowKeyInput!=undefined) obj._allowKeyInput=vOptions.allowKeyInput;
		if(vOptions.isReadOnly!=undefined) obj._isReadOnly=vOptions.isReadOnly;
		if(vOptions.unfilledPrompt!=undefined) obj._unfilledPrompt=vOptions.unfilledPrompt;
		if(vOptions.unmatchedPrompt!=undefined) obj._unmatchedPrompt=vOptions.unmatchedPrompt;
		if(vOptions.dateOptions!=undefined) obj._dateOptions=vOptions.dateOptions;
		if(vOptions.pageSize!=undefined) obj._pageSize=vOptions.pageSize;
		if(vOptions.minValue!=undefined) {
			if(typeof(vOptions.minValue)!="string"){
				obj._minValue=vOptions.minValue;
			}else if(vOptions.minValue.indexOf("->#")==0){
				obj._minValueBy=vOptions.minValue.right("->#");
			}else{
				obj._minValue=parseFloat(vOptions.minValue);
			}
		}
		if(vOptions.maxValue!=undefined) {
			if(typeof(vOptions.maxValue)!="string"){
				obj._maxValue=vOptions.maxValue;
			}else if(vOptions.maxValue.indexOf("->#")==0){
				obj._maxValueBy=vOptions.maxValue.right("->#");
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
	obj.__original.attachEvent("ondblclick",function(event){
		obj.selectValues(event);
	});	
	obj.__original.attachEvent("onchange",function(event){
		obj.fireEvent("_onValueChanged",event);
	});	
	obj.__original.attachEvent("onblur",function(event){
		obj.fireEvent("_onBlur",event);
	});		
	obj.fireEvent("_onPropertyChanged","allowKeyInput");
	obj.fireEvent("_onPropertyChanged","isReadOnly");
	return obj;
}
_$proto.selectValues=function(event){
	this.fireEvent("_onSelect",event);
}
_$proto.isValidValueFor=function(date){
	if(!Global.is(date,"Date")) return false;
	var minValue=this.getMinValue();
	var maxValue=this.getMaxValue();
	if(minValue!=undefined&&value<minValue){
		return false;
	}else if(maxValue!=undefined&&value>maxValue){
		return false;
	}else{
		return true;
	}
}
_$proto._convertToDate=function(vValue){
	if(!vValue) return;
	else if(Global.is(vValue,"Date")) return vValue;
	vValue=vValue.replace(/-|\./g,"/");
	switch(this._dateOptions){
		case "date":
			var date=new js.lang.natives.Date(vValue);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			return date;
		case "time":
			return new js.lang.natives.Date("1900/1/1 "+vValue);
		case "datetime":
			return new js.lang.natives.Date(vValue);
	}
}
_$proto._getHelpInfo=function(){
	switch(this._dateOptions){
		case "date":
			return this._getLocale("dateFormat");
		case "time":
			return this._getLocale("timeFormat");
		case "datetime":
			return this._getLocale("datetimeFormat");
	}
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
			//类型检查
			if(!this._validateDataType(field.value)) {
				alert(this._getLocale("isnotDate",this._label,this._getHelpInfo()));
				field.value="";
				try{field.focus();}catch(e){}
				return false;
			}
			break;
		case 1:
			var minValue=this.getMinValue();
			var maxValue=this.getMaxValue();
			var dtValue=this._convertToDate(field.value);	
			//检查大小范围
			if(maxValue!=undefined){
				if(Global.isDate(maxValue)&&dtValue>maxValue){
					if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
					else alert(this._getLocale("mustLess",this._label,maxValue.toSTDString(this._dateOptions)));
					//field.value="";
					try{field.focus();}catch(e){}
					return false;
				}
			}
			if(minValue!=undefined){
				if(Global.isDate(minValue)&&dtValue<minValue){
					if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
					else alert(this._getLocale("mustGreater",this._label,minValue.toSTDString(this._dateOptions)));
					//field.value="";
					try{field.focus();}catch(e){}
					return false;
				}
			}
			break;
		case 2:
			return this.fireEvent("_onValidate",isSubmiting);
	}
	return true;
}
_$proto._validateDataType=function(sValue){
	switch(this._dateOptions){
		case "date":
			return /^[0-9]{4}([.\/-])[0-9]{1,2}\1[0-9]{1,2}$/.test(sValue.trim());
		case "time":
			return /^[0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2})?$/.test(sValue.trim());
		case "datetime":
			return /^[0-9]{4}([.\/-])[0-9]{1,2}\1[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(sValue.trim());
	}
}

//:event------------------

/**
 * @event onReadStateChanged: onReadStateChanged(isReadOnly)
 */
_$proto._onPropertyChanged=function(sName){
	switch(sName){
		case "isReadOnly":
			if(this._isReadOnly){
				this.__original.readOnly=this._isReadOnly;
			}else{
				this.__original.readOnly=!this._allowKeyInput;
			}
			this.fireEvent("onReadStateChanged",this._isReadOnly);
			break;
		case "allowKeyInput":
			this.__original.readOnly=!this._allowKeyInput;
			break;
	}
}
/**
 * @event onSelect: onSelect(event,dateOptions)
 */
_$proto._onSelect=function(event){
	var _this=this;
	if(this.hasEvent("onSelect")){
		this._isSelecting=true;
		this.fireEvent("onSelect",event,this._dateOptions,function(action,value){
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
_$proto._onBlur=function(event){
	if(this._isSelecting) return;
	var value=this.__original.value;
	var flag=![0,1,2].some(function(mode){
		return !this.validate(mode);
	},this);
	if(flag){
		if(value.trim()!=value){
			this.__original.value=value.trim();
		}
	}
	if(!flag&&this.__original.value) this.selectValues(event);
}
