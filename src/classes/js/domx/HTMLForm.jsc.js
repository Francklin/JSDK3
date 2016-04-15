/**
 * @file HTMLForm.class.js
 * @author Liu Denggao
 * @created 2012.5.29
 * @modified 2012.6.9
 * @version 0.3
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.HTMLElement");

js.domx.HTMLForm=function(){
	this._fields=[];
	//表单调整处理函数集，元素结构为：
	//(1)[fieldName,handle]; 
	//(2)[fieldObject,handle]; 
	//(3)[[fieldName1,fieldName2,...],handle]
	//(4)[[fieldObject1,fieldObject2,...],handle]
	this._adjustHandles=[];
};
var _$class=js.domx.HTMLForm;

_$class.$name="HTMLForm";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLElement);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
}
_$proto.getFields=function(index){
	return index==undefined?this._fields:this._fields[index];
}
_$proto.getFieldsCount=function(){
	return this._fields.length;
}

//:method-------

_$class.newInstanceFrom=function(original){
	if(original==null) return null;
	var obj=new this();
	obj.__original=original;
	return obj;
}
_$proto.addFieldFrom=function(vField,vOptions){
	var field;
	switch(vOptions&&vOptions.dataType){
		case "Text":
			//delete vOptions.dataType;
			var field=js.domx.HTMLTextField.newInstanceFrom(this,vField,vOptions);
			break;
		case "Select":
			//delete vOptions.dataType;
			var field=js.domx.HTMLSelectField.newInstanceFrom(this,vField,vOptions);
			break;
		case "Number":
			//delete vOptions.dataType;
			var field=js.domx.HTMLNumberField.newInstanceFrom(this,vField,vOptions);
			break;
		case "Date":
			//delete vOptions.dataType;
			var field=js.domx.HTMLDateField.newInstanceFrom(this,vField,vOptions);
			break;
		default:
			return null;
	}
	this._fields.push(field);
	return field;
}
/**
 * @para vFields: 
 *		(1)fieldName: String, field name. name属性优先于id属性
 *		(2)field: Object(HTMLFormField), field object. 
 *		(3)fields: Array,  
 * @para fnHandle: Function, fnHandle(field1,field2,field3,...). 处理函数
 */
_$proto.addAdjustHandle=function(vFields,fnHandle){
	this._adjustHandles.push([vFields,fnHandle]);
}
_$proto.getElementsByName=function(sName){
	return Global.dom("#"+sName+"#",this.__original);
}
_$proto.hasField=function(sName){
	return this._fields.some(function(field){
		return field.getName()==sName;
	});
}
_$proto.getFieldByName=function(sName){
	for(var i=0;i<this._fields.length;i++){
		if(this._fields[i].getName()==sName){
			return this._fields[i];
		}
	}
	return null;
}
/*
 * 日期：2012.5.31-2012.6.8
 * 参数：iOptions
 *	(1)0,所有可选项
 *	(2)1,所有未填写的可选项
 *   	(3)2,所有已填写的可选项
 */
_$proto.getAllRequiredFields=function(iOptions){
	return this._fields.select(function(field){
		switch(iOptions){
			case 0:
				return !field.getAllowEmpty();
			case 1:
				if(!field.getAllowEmpty()){
					return field.isEmpty();
				}
				break;
			case 2:
				if(!field.getAllowEmpty()){
					return !field.isEmpty();
				}
				break;
		}
		return false;
	});
}
/*
 * 日期：2012.5.31
 * 参数：iOptions
 *	(1)0,所有可选项
 *	(2)1,所有未填写的可选项
 *   	(3)2,所有已填写的可选项
 */
_$proto.getAllOptionalFields=function(iOptions){
	return this._fields.select(function(field){
		switch(iOptions){
			case 0:
				return field.getAllowEmpty();
			case 1:
				if(field.getAllowEmpty()){
					return field.isEmpty();
				}
				break;
			case 2:
				if(field.getAllowEmpty()){
					return !field.isEmpty();
				}
				break;
		}
		return false;
	});
}
_$proto.getFieldDataText=function(sName){
	var field=this.getFieldByName(sName);
	if(field) return field.getDataText();
}
_$proto.getFieldDataValue=function(sName){
	var field=this.getFieldByName(sName);
	if(field) return field.getDataValue();
}
_$proto.setFieldDataValue=function(sName,vValue){
	var field=this.getFieldByName(sName);
	if(field) field.setDataValue(vValue);
}
_$proto.removeField=function(oField){
	var origFields=oField.valueOf();
	if(Global.isArray(origFields)){
		for(var i=0;i<origFields.length;i++){
			try{
				origFields[i].parentNode.removeChild(origFields[i]);
			}catch(e){
			}
		}
	}else{
		try{
			origFields.parentNode.removeChild(origFields);
		}catch(e){
		}
	}
	this._fields.earse(oField);
}
/**
 * 调整表单
 * @description: 按表单元素之间的变化规则来调整表单。调用之前必须先添加调整处理的规则。
 *			使用addAdjustHandleByField()。通常，本方法只在表单初始化时调用一次就行了。
 * @author: liudenggao
 * @created: 2012.6.18
 * @modified: 2012.6.19
 */
_$proto.adjust=function(){
	var handles=[],paras=[];
	for(var i=0;i<this._adjustHandles.length;i++){
		var vHandle=this._adjustHandles[i];
		var vFields=vHandle[0];
		var aFields=[];
		
		if(!Global.isArray(vFields)) vFields=[vFields];
		for(var j=0;j<vFields.length;j++){
			var vField=vFields[j];
			if(typeof(vField)=="string"){
				aFields.push(this.getFieldByName(vField));
			}else{
				aFields.push(vField);
			}
		}
		handles.push(vHandle[1]);
		paras.push(aFields);
	}
	handles.forEach(function(handle,index){
		try{
			handle.apply(this,paras[index]);
		}catch(e){
		}
	});
}
/**
 * @para vField: String, field name; Object, field
 */
_$proto.adjustByField=function(vField){
	var handles=[],paras=[];
	for(var i=0;i<this._adjustHandles.length;i++){
		var vHandle=this._adjustHandles[i];
		var vFields1=vHandle[0];
		var aFields1=[];
		var flag=false;
		
		if(!Global.isArray(vFields1)){
			vFields1=[vFields1];
		}
		for(var j=0;j<vFields1.length;j++){
			var vField1=vFields1[j];
			if(typeof(vField)==typeof(vField1)
				&& typeof(vField)=="string"){
				if(vField.toLowerCase()==vField1.toLowerCase()){
					flag=true;
					break;
				}
			}else if(vField instanceof Global.js.domx.HTMLFormField
				&& vField1 instanceof Global.js.domx.HTMLFormField){
				if(vField.getOriginal()==vField1.getOriginal()){
					flag=true;
					break;
				}
			}else if(typeof(vField)=="string"){
				if(vField1.getName()==vField){
					flag=true;
					break;
				}
			}else if(typeof(vField1)=="string"){
				if(vField.getName()==vField1){
					flag=true;
					break;
				}
			}
		}
		if(!flag) continue;
		for(var j=0;j<vFields1.length;j++){
			var vField=vFields1[j];
			if(typeof(vField)=="string"){
				aFields1.push(this.getFieldByName(vField));
			}else{
				aFields1.push(vField);
			}
		}		
		handles.push(vHandle[1]);
		paras.push(aFields1);
	}
	handles.forEach(function(handle,index){
		try{
			handle.apply(this,paras[index]);
		}catch(e){
		}
	});
}
_$proto.validate=function(){
	return ![0,1,2].some(function(mode){
		return this._fields.some(function(field){
			return !this.validateField(field,mode);
		},this);
	},this);
}
/**
 * @para iOptions: 0, is filled and is right for data type; 1, scope of value; 2, validate function
 */
_$proto.validateField=function(vField,iOptions){
	var oField;
	if(!vField){
		return true;
	}else if(typeof(vField)=="string"){
		oField=this.getFieldByName(vField);
	}else{
		oField=vField;
	}
	return oField.validate(iOptions,true);
}
_$proto.submit=function(){
	this.__original.submit();
}

//:event------------

_$proto._onFieldValueChanged=function(oField){
	this.fireEvent("onFieldValueChanged",oField);
	this.adjustByField(oField);
}