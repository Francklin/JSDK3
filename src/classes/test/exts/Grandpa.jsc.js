/**
 * @file Grandpa.js
 * @modifier Liu Denggao
 * @created 2010.6.19
 * @version 0.1
 * @since JSDK2 V2.5.1
 */

$package("test.exts");

test.exts.Grandpa=function(name, familyName) {
	this._name = "";
	this._familyName = ""; 

	if(arguments.caller&&arguments.caller.callee==this.getClass().$extends){	//子类继承初始化
		//---
	}else if(this.constructor==arguments.callee){	//构造
		//在本类中初始化父类变量
		//none---------
		//调用构造函数
		this._Grandpa(name, familyName);
	}else{	//作为子类的方法执行
		//在子类中初始化本类变量
		//none----------
	}
}

var _$class = test.exts.Grandpa;

_$class.$name="Grandpa";
_$class.$extends("Object");

var _$proto = _$class.prototype;

_$proto._Grandpa=function(name, familyName){
	this._name = name;
	this._familyName = familyName; 
}
_$proto.getName = function(){
	return "grandpa's name: " + this._name;
}
_$proto.getFamilyName = function(){
	return "grandpa's family name: " + this._familyName;
}

