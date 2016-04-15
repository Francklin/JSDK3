/**
 * @file HTMLNumberField.class.js
 * @version 0.7.1
 * @since JSDK3 V1.9.0
 * @author Liu Denggao
 * @created 2012.5.31
 * @modified 2013.5.29-2013.8.29-2014.06.03
 * @updated
		2014.06.03 v0.7.1 修复了属性“dataValue”获取的问题
		v0.6.3 -> v0.7.0 
		2013.8.29 把本地化字符串集中化了，便于修改，也为下一步多语言化做准备
		v0.6.2 -> v0.6.3
		2013.5.29 修复了文本长度的验证问题
 */

$package("js.domx");
$import("js.domx.HTMLFormField");

js.domx.HTMLNumberField=function(){
	this._dataType="Number";
	this._minValue=undefined;
	this._minValueBy="";
	this._maxValue=undefined;
	this._maxValueBy="";
	this._decimalOptions=0;		//小数点位置选项：-1,任意; 0,整数；n,小数位数
	this._isFocusing=false;		/*	当在“onchange”事件里对该域值进行校验失败而
								需要聚焦域时需要“onblur”事件和本属性的辅助才能正确实现 */
	this._pageSize=undefined;
};
var _$class=js.domx.HTMLNumberField;

_$class.$name="HTMLNumberField";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLFormField);
_$class._localeResource={
	"pleaseInput": "请选择或输入\"{0}\"!",
	"validScope": "有效范围",
	"isnotNumber": "您输入的\"{0}\"不是数字！",
	"maxDecimalBits": "请最多输入{0}位小数!",
	"canotLess": "您输入的\"{0}\"不能小于{1}!",
	"canotGreater": "您输入的\"{0}\"不能大于{1}!"
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
_$proto.getDecimalOptions=function(){
	return this._decimalOptions;
}
_$proto.setDecimalOptions=function(value){
	this._decimalOptions=value;
}
_$proto.getDataText=function(){
	return this.__original.value;
}
_$proto.getDataValue=function(){
	var value=this.__original.value;
	return value&&parseFloat(value)||undefined;	//2014.6.3
}
_$proto.setDataValue=function(vValue){
	if(!this.isValidValueFor(vValue)) return;
	this.__original.value=""+vValue;
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
		obj._label=vOptions.label||"";
		if(vOptions.allowEmpty!=undefined) obj._allowEmpty=vOptions.allowEmpty;
		if(vOptions.isReadOnly!=undefined) obj._isReadOnly=vOptions.isReadOnly;
		if(vOptions.unfilledPrompt!=undefined) obj._unfilledPrompt=vOptions.unfilledPrompt;
		if(vOptions.unmatchedPrompt!=undefined) obj._unmatchedPrompt=vOptions.unmatchedPrompt;
		if(vOptions.decimalOptions!=undefined) obj._decimalOptions=vOptions.decimalOptions;
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
			["onValidate","onReadStateChanged","onValueChanged"].forEach(function(sEvent){
				var func=vOptions.onEvents[sEvent];
				if(func) obj.addEventListener(sEvent,func);
			});
		}
	}
	obj.__original.attachEvent("onmouseover",function(){
		obj.fireEvent("_onTips");
	});	
	obj.__original.attachEvent("onchange",function(event){
		var flag=![0,1,2].some(function(mode){
			return !obj.validate(mode);
		});	
		if(!flag) obj._isFocusing=true;
		obj.fireEvent("_onValueChanged",event);
	});
	obj.__original.attachEvent("onblur",function(){
		return obj.fireEvent("_onBlur");
	});
	obj.fireEvent("_onPropertyChanged","minValue");
	obj.fireEvent("_onPropertyChanged","maxValue");
	obj.fireEvent("_onPropertyChanged","isReadOnly");
	return obj;
}
_$proto.isValidValueFor=function(value){
	if(typeof(value)!="number") return false;
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
			if(isNaN(field.value)) {
				alert(this._getLocale("isnotNumber",this._label));
				field.value="";
				try{field.focus();}catch(e){}
				return false;
			}else if(field.value!="0"&&field.value.slice(0,1)=="0"){
				this.__original.value=parseFloat(field.value);
			}
			break;
		case 1:
			if(!field.value&&this._allowEmpty) break;
			var minValue=this.getMinValue();
			var maxValue=this.getMaxValue();
			var iValue=parseFloat(field.value||0);	//2014.6.3
			//检查大小范围
			if(maxValue!=undefined){
				if(Global.isNumber(maxValue)&&iValue>maxValue){
					if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
					else alert(this._getLocale("canotGreater",this._label,maxValue));
					field.value="";
					try{field.focus();}catch(e){}
					return false;
				}
			}
			if(minValue!=undefined){
				if(Global.isNumber(minValue)&&iValue<minValue){
					if(this._unmatchedPrompt) alert(this._unmatchedPrompt);
					else alert(this._getLocale("canotLess",this._label,minValue));
					field.value="";
					try{field.focus();}catch(e){}
					return false;
				}
			}
			if(field.value.slice(-1)=="."){
				field.value+=this._decimalOptions<=0?"00":Global.obj("0").repeat(this._decimalOptions).valueOf();
			}
			if(this._decimalOptions==0&&field.value.indexOf(".")>0){
				field.value=field.value.word(".",0);
			}else if(this._decimalOptions>0&&field.value.indexOf(".")>0){
				var bits=field.value.length-field.value.indexOf(".")-1;
				if(bits>this._decimalOptions){
					alert(this._getLocale("maxDecimalBits",this._decimalOptions));
					field.value=field.value.slice(0,field.value.indexOf(".")+this._decimalOptions+1);
					field.focus();
					return false;
				}
			}
			break;
		case 2:
			return this.fireEvent("_onValidate",isSubmiting);
	}
	return true;
}

//:event-----------

/**
 * @event onReadStateChanged: onReadStateChanged(isReadOnly)
 */
_$proto._onPropertyChanged=function(sName){
	switch(sName){
		case "isReadOnly":
			this.__original.readOnly=this._isReadOnly;
			this.fireEvent("onReadStateChanged",this._isReadOnly);
			break;
		case "minValue":
		case "maxValue":
			var minValue=this.getMinValue();
			var maxValue=this.getMaxValue();
			if(minValue!=undefined&&maxValue!=undefined){
				this.__original.title=this._getLocale("validScope")+": "+minValue+" - "+maxValue;
			}else if(minValue!=undefined){
				this.__original.title=this._getLocale("validScope")+": "+minValue+" - ~";
			}else if(maxValue!=undefined){
				this.__original.title=this._getLocale("validScope")+": ~ - "+maxValue;
			}
			break;
	}
}
_$proto._onValueChanged=function(event){
	var flag=this.fireEvent("onValueChanged",this.getDataValue());
	if(flag||flag==undefined) this._parentForm.fireEvent("_onFieldValueChanged",this);
}
_$proto._onKeyDown=function(event){
	var field=this.__original;
	var intValue=field.value==""?-1:parseFloat(field.value||0);	//2014.6.3
	var at=field.value.indexOf(".");
	var precision=at<0?0:(field.value.length-at-1);
	field.style.imeMode="disabled";
	switch(event.keyCode){
		case Global.KEY_Up:
			var value=this.getDataValue().adjust(1);
			if(this._minValue!=undefined&&value<this._minValue){
				field.value=this._minValue;
			}else if(this._maxValue!=undefined&&value>this._maxValue){
				field.value=this._maxValue;
			}else{
				field.value=value;
			}
			break;
		case Global.KEY_Down:
			var value=this.getDataValue().adjust(-1);
			if(this._minValue!=undefined&&value<this._minValue){
				field.value=this._minValue;
			}else if(this._maxValue!=undefined&&value>this._maxValue){
				field.value=this._maxValue;
			}else{
				field.value=value<0?0:value;
			}
			break;
		case Global.KEY_Left:
			break;
		case Global.KEY_Right:
			break;
		case Global.KEY_Home:
			break;
		case Global.KEY_End:
			break;
		case Global.KEY_PageUp:
			if(this._pageSize){
				var value=this.getDataValue().adjust(this._pageSize);
				if(this._minValue!=undefined&&value<this._minValue){
					field.value=this._minValue;
				}else if(this._maxValue!=undefined&&value>this._maxValue){
					field.value=this._maxValue;
				}else{
					field.value=value;
				}
			}
			return event.returnValue=false;
			break;
		case Global.KEY_PageDown:
			if(this._pageSize){
				var value=this.getDataValue().adjust(-this._pageSize);
				if(this._minValue!=undefined&&value<this._minValue){
					field.value=this._minValue;
				}else if(this._maxValue!=undefined&&value>this._maxValue){
					field.value=this._maxValue;
				}else{
					field.value=value;
				}
			}
			return event.returnValue=false;
			break;
		case Global.KEY_Enter:
			field.blur();
			break;
		case Global.KEY_Backspace:
			break;
		case Global.KEY_Delete:
			break;
		default :
			if(event.keyCode>=Global.KEY_NUM_Min&&event.keyCode<=Global.KEY_NUM_Max){
				if(intValue==0&&at<0) return event.returnValue=false;						
				if(this._maxValue!=undefined){
					//if(Number(this.value+(event.keyCode-KEY_Min))>maxValue) return event.returnValue=false;
				}
				if(this._decimalOptions>0&&field.value.indexOf(".")>0){
					var bits=field.value.length-field.value.indexOf(".")-1;
					//if(bits>_decimalOptions) return event.returnValue=false;
				}
			}else if(event.keyCode>=Global.KEY_MIN_Min&&event.keyCode<=Global.KEY_MIN_Max){
				if(intValue==0&&at<0) return event.returnValue=false;					
				if(this._maxValue!=undefined){
					//if(Number(this.value+(event.keyCode-KEY_NumMin))>maxValue) return event.returnValue=false;
				}
				if(this._decimalOptions>0&&field.value.indexOf(".")>0){
					var bits=field.value.length-field.value.indexOf(".")-1;
					//if(bits>_decimalOptions) return event.returnValue=false;
				}
			}else if(event.keyCode==190||event.keyCode==110){
				if(this._decimalOptions==0) return event.returnValue=false;
				if(field.value=="") return event.returnValue=false;
				if(field.value.indexOf(".")>=0) return event.returnValue=false;
			}else{
				return event.returnValue=false;
			}		
	}
}
_$proto._onTips=function(){
	if(!this._minValueBy&&!this._maxValueBy) return;
	var minValue=this.getMinValue();
	var maxValue=this.getMaxValue();
	if(minValue!=undefined&&maxValue!=undefined){
		this.__original.title=this._getLocale("validScope")+": "+minValue+" - "+maxValue;
	}else if(minValue!=undefined){
		this.__original.title=this._getLocale("validScope")+": "+minValue+" - ~";
	}else if(maxValue!=undefined){
		this.__original.title=this._getLocale("validScope")+": ~ - "+maxValue;
	}
}
_$proto._onBlur=function(){ 
	var _this=this;
	if(this._isFocusing){		
		this._isFocusing=false;
		//兼容IE、Firefox、Chrome(只有高亮但没有光标)、Opera
		try{window.setTimeout(function(){_this.__original.focus();},2);}catch(e){}
		return false;
	}
	/*
	var value=this.__original.value;
	var flag=![0,1,2].some(function(mode){
		return !this.validate(mode);
	},this);
	var value=this.__original.value;
	if(flag){
		if(value!="0"&&value.slice(0,1)=="0"){
			this.__original.value=parseFloat(value);
		}
	}
	return flag;
	*/
}