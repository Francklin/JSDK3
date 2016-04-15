/**
 * @file DOMWindow.js
 * @description: 
 * @version 2.2
 * @since JSDK3
 * @invoke: 
 *   (1)DOMWindow.applyInstance(window)
 *   (2)new DOMWindow(window) : temprary has not implement
 * @modifier Liu Denggao
 * @date 2010.01.04-2010.01.06
 * @modified 2011.6.21-2013.6.12
 * @update
 *		v2.1->v2.2
 *		2013.6.12 fixed issue for ipad2
 */

$package("js.dom");

js.dom.DOMWindow=function(){};
var _$class=js.dom.DOMWindow;
//_$class.$extends("Object");
var _$proto=_$class.prototype;

_$class.$name="DOMWindow";

//:property-------------------------

_$class.getName = function() {
	return this.$name;
}

_$proto.getContentWidth=function(){
	return Math.max(this.document.body.clientWidth,this.document.documentElement.clientWidth);
}
_$proto.getContentHeight=function(){
	return Math.max(this.document.body.clientHeight,this.document.documentElement.clientHeight);
}

//:method--------------------------

/**
 * @support: IE6+, Firefox3.6+, Chrome 13+, Safari 5+, Opera 11+
 * @para fnCallBack: fnCallBack(wDialog,vReturnValue)
 * @modified: 2011.9.21
 */
_$proto.showModalDialog=function(sURL,vArguments,sFeatures,fnCallBack){
	var window=this;
	var retVal;
	switch(typeof(this.__showModalDialog__)){
		case "object":
			if(this.__showModalDialog__.apply)
				retVal=this.__showModalDialog__.apply(this,arguments);
			else 
				retVal=this.__showModalDialog__(sURL,vArguments,sFeatures);
			if(typeof(fnCallBack)=="function"){
				try{
					fnCallBack(null,retVal);
				}catch(e){
				}
			}
			break;
		case "function":
			retVal=this.__showModalDialog__.apply(this,arguments);
			if(typeof(fnCallBack)=="function"){
				try{
					fnCallBack(null,retVal);
				}catch(e){
				}
			}
			break;
		default:
			if(!this.__$activeDialog){
				this.__$activeDialogParameter={
					dialogMode: 1,		//0,normal;1,modal;2,modeless
					opener: window,
					arguments: vArguments,
					//2013.6.12 fixed issue for ipad2
					onCompleted: function(){
						var wDialog=this.opener.__$activeDialog;
						var vReturnValue=wDialog.returnValue;
						this.opener.__$activeDialog=null;
						if(typeof(fnCallBack)=="function"){
							setTimeout(function(){
								try{
									fnCallBack(wDialog,vReturnValue);
								}catch(e){
								}
							},0);
						}
					}
				}
				this.__$activeDialog=this.open(sURL,"ModalDialog"
					,sFeatures.replace(/dialog/g,"").replace(/\;/g,",").toLowerCase(),true);
			}else{
				this.__$activeDialog.focus();
			}			
	}
	return retVal;
}

/**
 * @support: IE6+, Firefox3.6+, Chrome 13+, Safari 5+, Opera 11+
 * @para fnCallBack: fnCallBack(wDialog,vReturnValue)
 * @created: 2011.9.21
 * @modified: 2011.9.21
 */
_$proto.$showModalDialog=function(sURL,vArguments,sFeatures,fnCallBack){
	var window=this;
	var retVal;
	switch(typeof(this.__showModalDialog__)){
		case "object":
			if(this.__showModalDialog__.apply)
				retVal=this.__showModalDialog__.apply(this,arguments);
			else 
				retVal=this.__showModalDialog__(sURL,vArguments,sFeatures);
			if(typeof(fnCallBack)=="function"){
				try{
					fnCallBack(null,retVal);
				}catch(e){
				}
			}
			break;
		case "function":
			retVal=this.__showModalDialog__.apply(this,arguments);
			if(typeof(fnCallBack)=="function"){
				try{
					fnCallBack(null,retVal);
				}catch(e){
				}
			}
			break;
		default:
			if(!this.__$activeDialog){
				this.__$activeDialogParameter={
					dialogMode: 1,		//0,normal;1,modal;2,modeless
					opener: window,
					arguments: vArguments,
					//2013.6.12 fixed issue for ipad2
					onCompleted: function(){
						var wDialog=this.opener.__$activeDialog;
						var vReturnValue=wDialog.returnValue;
						this.opener.__$activeDialog=null;
						if(typeof(fnCallBack)=="function"){
							setTimeout(function(){
								try{
									fnCallBack(wDialog,vReturnValue);
								}catch(e){
								}
							},0);
						}
					}
				}
				this.__$activeDialog=this.open(sURL,"ModalDialog"
					,sFeatures.replace(/dialog/g,"").replace(/\;/g,",").toLowerCase(),true);
			}else{
				this.__$activeDialog.focus();
			}			
	}
	return retVal;
}
/**
 * @support: IE6+, Firefox3.6+, Chrome 13+, Safari 5+, Opera 11+
 * @para fnCallBack: fnCallBack(wDialog,vReturnValue)
 * @created: 2013.7.7
 * @modified: 2013.7.8
 */
_$proto.$$showModalDialog=function(sURL,vArguments,sFeatures,fnCallBack){
	var window=this;
	var retVal;
	if(!this.__$activeDialog){
		this.__$activeDialogParameter={
			dialogMode: 1,		//0,normal;1,modal;2,modeless
			opener: window,
			arguments: vArguments,
			//2013.6.12 fixed issue for ipad2
			onCompleted: function(){
				var wDialog=this.opener.__$activeDialog;
				var vReturnValue=wDialog.returnValue;
				this.opener.__$activeDialog=null;
				if(typeof(fnCallBack)=="function"){
					setTimeout(function(){
						try{
							fnCallBack(wDialog,vReturnValue);
						}catch(e){
						}
					},0);
				}
			}
		}
		this.__$activeDialog=this.open(sURL,"ModalDialog"
			,sFeatures.replace(/dialog/g,"").replace(/\;/g,",").toLowerCase(),true);
	}else{
		this.__$activeDialog.focus();
	}	
	return retVal;
}
/**
 * @support: IE6+, Firefox3.6+, Chrome 13+, Safari 5+, Opera 11.11+
 * @created: 2011.6.13
 * @modified: 2011.6.13-2013.6.12
 * 
 */
_$proto.close=function(){
	if(this.opener&&this.opener.__$activeDialog==this&&this.opener.__$activeDialogParameter
		&&this.opener.__$activeDialogParameter.dialogMode==1){	
		this.opener.__$activeDialogParameter.onCompleted();
	}
	this.__close__();
}
/**
 * @support: IE6+, Firefox3.6+, Chrome 13+, Safari 5+, Opera 11.11+
 * @created: 2011.9.21
 * @modified: 2011.9.21-2013.6.12
 */
_$proto.$close=function(){
	if(this.opener&&this.opener.__$activeDialog==this&&this.opener.__$activeDialogParameter
		&&this.opener.__$activeDialogParameter.dialogMode==1){
		this.opener.__$activeDialogParameter.onCompleted();		//fixed issue for ipad2
	}
	if(this.__close__) this.__close__();
	else this.close();
}