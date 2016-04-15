/**
 * @file Father.js
 * @modifier Liu Denggao
 * @created 2010.6.19
 * @version 0.1
 * @since JSDK2 V2.5.1
 */

$package("test.exts");
$import("test.exts.Grandpa");

test.exts.Father=function(name, familyName) {

	if(arguments.caller&&arguments.caller.callee==this.getClass().$extends){	//子类继承初始化
		//---
	}else if(this.constructor==arguments.callee){	//构造
		//在本类中初始化父类变量
		this.getClass().getSuperclass().call(this, name, familyName);
		//调用构造函数
		this._Father(name, familyName);
	}else{	//作为子类的方法执行
		//在子类中初始化本类变量
		this.getClass().getSuperclass().getSuperclass().call(this, name, familyName);
	}
}

var _$class = test.exts.Father;

_$class.$name="Father";
_$class.$extends(test.exts.Grandpa);

var _$proto = _$class.prototype;

_$proto._Father=function(name, familyName){
	//调用父类的构造函数
	arguments.callee.$upcall(this,name,familyName);
}
_$proto.getName=function(){
	return arguments.callee.$upcall(this) + "\r\nfather's name: " + this._name;
}
