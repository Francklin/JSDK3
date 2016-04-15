/**
 * @file HTMLSelectField.class.js
 * @author Liu Denggao
 * @created 2012.5.29
 * @modified 2012.5.30
 * @version 0.1
 * @since JSDK3 V1.9.0
 */

$package("js.domx");
$import("js.domx.HTMLFormField");

js.domx.HTMLSelectField=function(){
	this._dataType="Select";
	this._separator="";
	this._allowMultiple=false;
	this._allowKeywordSyno=false;
	this._optionalValues=null;
};
var _$class=js.domx.HTMLSelectField;

_$class.$name="HTMLSelectField";
_$class.$context=js.domx.HTML;
_$class.$extends(js.domx.HTMLFormField);
var _$proto=_$class.prototype;

//:property-------------------------

_$class.getContext=function(){
	return this.$context;
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
 * @value: 如果内容为数组，则单个元素的格式为："text|value"
 */
_$proto.getOptionalValues=function(){
	return this._optionalValues;
}
_$proto.setOptionalValues=function(value){
	this._optionalValues=value;
}
_$proto.getDataValue=function(){
	if(this._allowKeywordSyno){
		if(this._dataField){
			return this._allowMultiple?this._dataField.value.split(this._separator||";"):this._dataField.value;
		}else if(this._dataValue){
			return this._allowMultiple?this._dataValue.split(this._separator||";"):this._dataValue;
		}else{
			this._allowMultiple?[]:"";
		}
	}else{
		return this._allowMultiple?this._original.value.split(this._separator||";"):this._original.value;
	}
}
_$proto.setDataValue=function(vValue){

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
	this._parentForm=parentForm;
	if(typeof(vField)=="string"){
		obj.__original=parentForm.getElementsByName(vField);
	}else{
		obj.__original=vField;
	}
	//parse tag...
	if(vOptions){
		obj._separator=vOptions.separator||"";
		obj._label=vOptions.label||"";
		if(vOptions.allowEmpty!=undefined) obj._allowEmpty=vOptions.allowEmpty;
	}
	return obj;
}
_$proto.validate=function(iOptions){

}