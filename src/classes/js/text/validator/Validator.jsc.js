/**
 * text validator
 * @file Validator.class.js
 * @description 
 * @version 1.0
 * @author liudenggao
 * @created 2012.2.7
 * @modified 2012.2.7
 */

$package("js.text.validator");

js.text.validator.Validator=function(){
	this._rules={};
	this._defaultRule="";
}
var _$class=js.text.validator.Validator;

with(_$class){
	$name="Validator";
	$extends("Object");
	
	_$class._drivers={
		"FileExtName": function(sFileName,vExtNames){
			sFileName=sFileName.toLowerCase();
			var aExtNames=Global.isArray(vExtNames)?vExtNames:vExtNames.split(";");
			if(!aExtNames.length) return true;
			for(var i=0;i<aExtNames.length;i++){
				if(sFileName.slice(-aExtNames[i].length)==aExtNames[i].toLowerCase()){
					return true;
				}
			}
			return false;
		}
	}
	addProperty(false,true,"defaultRule",{
		"get": function(){
			return this._defaultRule;
		},
		"set": function(value){
			this._defaultRule=value;
		}
	});
	addMethod(true,true,"addDriver",function(sDriverName,vFunc){
		this._drivers[sDriverName]=vFunc;
	});
	addMethod(true,false,"getDriver",function(sName){
		return this._drivers[sName];
	});
	addMethod(false,true,"addRule",function(sRuleName,sDriver,vRuleData,sPrompt){
		this._rules[sRuleName]={
			name: sRuleName,
			driver: sDriver,
			data: vRuleData,
			prompt: sPrompt
		}
	});
	addMethod(false,true,"validate",function(){
		var argsLen=arguments.length;
		if(argsLen==1){
			return this._validate(this._defaultRule,arguments[0]);
		}else if(argsLen==2){
			return this._validate(arguments[0],arguments[1]);
		}
		return [false,"Parameter input error!"];
	});
	addMethod(false,false,"validate",function(sRuleName,vData){
		var rule=this._rules[sRuleName];
		var bResult=this.getClass()._getDriver(rule.driver)(vData,rule.data);
		return [bResult,rule.prompt];
	});

}