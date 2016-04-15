/**
 * Array of base
 * @file: base.Array.js
 * @version: V0.9
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2013.3.25-2013.5.13
 **************************/

/**
 * @return: array
 * @created: 2012.5.21
 * @modified: 2012.6.21
 */
Array.from=function(item){
	if(item==null){
		return [];
	}else if(!(item instanceof Object)
		&&item.constructor&&(item.constructor instanceof Object)){
		return [item];
	}else if(item instanceof this){
		return item;
	}else if(Object.prototype.toString.apply(item) === '[object Array]'){
		return item;
	}else{
		try{
			return this.prototype.slice.call(item);
		}catch(e){}
		try{
			var values=[];
			for(var i=0;i<item.length;i++){
				values[i]=item[i];
			}
			return values;
		}catch(e){}
		return [item];
	}
}
/**
 * @return: The original array including the new values.
 * @created: 2012.3.28
 */
Array.prototype.append=function(){
	var array=this.concat.apply([],arguments);
	for(var i=0;i<array.length;i++){
		this[this.length]=array[i];
	}
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.include=function(item,toLast){
	var index=-1;
	for(var i=0;i<this.length;i++){
		if(this[i]===item){
			index=i;break;
		}
	}
	if(index<0){
		this[this.length]=item;
	}else if(toLast){
		this.splice(index,1);
		this[this.length]=item;
	}	
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.combine=function(otherArray){
	for(var i=0;i<otherArray.length;i++){
		var flag=0;
		for(var j=0;j<this.length;j++){
			if(otherArray[i]===this[j]){
				flag=1;break;
			}
		}
		if(!flag) this[this.length]=otherArray[i];
	}
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.interlace=function(otherArray,align){
	var array=[];
	align=align||"left";
	switch(align.toLowerCase()){
		case "left":
			for(var i=0,k=0;i<this.length;i++){
				array[k++]=this[i];
				array[k++]=otherArray[Math.min(i,this.length-1,otherArray.length-1)];
			}
			break;
		case "right":
			for(var i=0,k=0;i<this.length;i++){
				array[k++]=otherArray[Math.min(i,this.length-1,otherArray.length-1)];
				array[k++]=this[i];
			}
			break;
	}
	for(var i=0;i<array.length;i++){
		this[i]=array[i];
	}
	return this;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.insert=function(item,index){
	index=index==undefined?-1:index;
	if(index>=this.length){
		index=this.length;
	}else if(index<=-this.length-1){
		index=0;
	}else if(index<0){
		index=this.length+1+index;
	}
	var array1=this.slice(index);
	this[index]=item;
	for(var i=0;i<array1.length;i++){
		this[index+1+i]=array1[i];
	}
	return this;
}
/**
 * fill array with one value
 * @para vValue
 * @para isAutoExpand
 * @para iStartIndex
 * @para iLength
 * @created 2010.05.08
 */
Array.prototype.fill=function(vValue,iLen,iStart,isAutoExpand){
	isAutoExpand=isAutoExpand==undefined?true:isAutoExpand;
	iStart=iStart==undefined?0:iStart;
	iLen=iLen==undefined?this.length:iLen;
	if(!isAutoExpand){
		if(iStart<0||iStart>=this.length||iLen<0) return this;
		var iEnd=Math.min(this.length,iStart+iLen)-1;
	}else{
		var iEnd=iStart+iLen-1;
	}
	for(var i=iStart;i<=iEnd;i++){
		this[i]=vValue;
	}
	return this;
}
/**
 * @function：清理垃圾
 * @description：清空内容为空的数组元素,规则为: 
 *			(1)undefined
 *			(2)null
 *			(3)""
 * @created：2009.07.18
 * @modified: 2012.3.28
 */	
Array.prototype.trim=function(){
	var array=[];
	for(var i=0,j=0;i<this.length;i++){
		if(this[i]===undefined||this[i]===null||this[i]==="") continue;
		array[j++]=this[i];
	}
	this.splice(0,this.length);
	for(var i=0;i<array.length;i++){
		this[i]=array[i];
	}
	return this;
}
/**
 * @created: 2009.4.16
 * @modified: 2012.3.28
 */
Array.prototype.unique=function(){
	var array=[];
	for(var i=this.length-1;i>=0;i--){
		var item=this[i];
		var flag=0;
		for(var j=i-1;j>=0;j--){
			if(item===this[j]){
				flag=1;
				break;
			}
		}
		if(!flag) array[array.length]=item;
	}
	if(array.length==this.length) return this;
	this.splice(0,this.length);
	for(var i=array.length-1,j=0;i>=0;i--){
		this[j++]=array[i];
	}
	return this;
}
/**
 * remove element of array by index
 * @return element
 * @modified 2010.11.09
 */
Array.prototype.removeAt=function(index){
	return this.splice(index,1);
}
/**
 * @description: Removes all occurrences of an item from the array.
 * @return: This array with all occurrences of the item removed.
 * @created: 2012.3.28
 */
Array.prototype.erase=function(item){
	for(var i=this.length-1;i>=0;i--){
		if(this[i]===item) {
			this.splice(i,1);
		}
	}
	return this;
}
/**
 * clear empty array
 * @return array
 */
Array.prototype.clear=function(){
	this.splice(0,this.length);
	return this;
}
/**
 * @created: 2013.5.13
 * @modified: 2013.5.13
 */
Array.getFirst=function(arr,fn,bind){
	if(!fn){
		return arr.length>0?arr[0]:undefined;
	}else{
		for(var i=0,len=arr.length;i<len;i++){
			if(!bind&&fn(arr[i],i,arr)){
				return arr[i];
			}else if(bind&&fn.call(bind,arr[i],i,arr)){
				return arr[i];
			}
		}
	}
}
/**
 * @created: 2012.3.28
 * @modified: 2013.3.25
 */
Array.prototype.getFirst=function(fn,bind){
	if(!fn){
		return this.slice(0,1).pop();
	}else{
		for(var i=0,len=this.length;i<len;i++){
			if(!bind&&fn(this[i],i,this)){
				return this[i];
			}else if(bind&&fn.call(bind,this[i],i,this)){
				return this[i];
			}
		}
	}
}
/**
 * @created: 2013.5.13
 * @modified: 2013.5.13
 */
Array.getLast=function(arr,fn,bind){
	if(!fn){
		return arr.length>0?arr[arr.length-1]:undefined;
	}else{
		for(var i=arr.length-1;i>=0;i--){
			if(!bind&&fn(arr[i],i,arr)){
				return arr[i];
			}else if(bind&&fn.call(bind,arr[i],i,arr)){
				return arr[i];
			}
		}
	}
}
/**
 * @created: 2012.3.28
 * @modified: 2013.3.25
 */
Array.prototype.getLast=function(fn,bind){
	if(!fn){
		return this.slice(-1).pop();
	}else{
		for(var i=this.length-1;i>=0;i--){
			if(!bind&&fn(this[i],i,this)){
				return this[i];
			}else if(bind&&fn.call(bind,this[i],i,this)){
				return this[i];
			}
		}
	}
}
/**
 * @created: 2012.3.28
 */
Array.prototype.find=function(vKey,isNoCase,isContains){
	var typeName=typeof(vKey);
	if(typeName!="string"){
		return this.indexOf(vKey);
	}else if(isNoCase&&isContains){
		vKey=vKey.toLowerCase();
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))
				&&this[i].toLowerCase().contains(vKey)){
				return i;
			}
		}
	}else if(isNoCase){
		vKey=vKey.toLowerCase();
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].toLowerCase()==vKey)){
				return i;
			}
		}
	}else if(isContains){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].indexOf(vKey)>=0)){
				return i;
			}
		}	
	}else{
		return this.indexOf(vKey);
	}
	return -1;
}
/**
 * @created: 2012.3.28
 */
Array.prototype.contains=function(item){
	for(var i=0;i<this.length;i++){
		if(this[i]===item){
			return true;
		}
	}
	return false;
}
/**
 * is equal
 * @modified: 2010.11.7
 */
Array.prototype.equal=function(otherArray){
	if(this.length!=otherArray.length) return false;
	for(var i=0;i<this.length;i++){
		if(this[i]!==otherArray[i]) return false;
	}
	return true;
}
/**
 * is equal
 * @created: 2012.12.17
 * @modified: 2012.12.17
 */
Array.prototype.equalWith=function(otherArray,ignoreSeq,ignoreCase){
	if(this.length!=otherArray.length) return false;
	if(!ignoreSeq){
		for(var i=0;i<this.length;i++){
			if(!ignoreCase){
				if(this[i]!==otherArray[i]) return false;
			}else if(typeof(this[i])=="string"&&typeof(otherArray[i])=="string"){
				if(this[i].toLowerCase()!==otherArray[i].toLowerCase()) return false;
			}else{
				if(this[i]!==otherArray[i]) return false;
			}
		}
	}else{
		var otherArray1=otherArray.concat();
		for(var i=0;i<this.length;i++){
			var j=0;
			for(;j<otherArray1.length;j++){
				if(!ignoreCase){
					if(this[i]===otherArray1[j]) break;
				}else if(typeof(this[i])=="string"&&typeof(otherArray1[j])=="string"){
					if(this[i].toLowerCase()===otherArray1[j].toLowerCase()) break;
				}else{
					if(this[i]===otherArray[i]) break;
				}
			}
			if(j<otherArray1.length){	//found
				otherArray1.splice(j,1);
			}else{		//no found
				return false;
			}
		}
	}

	return true;
}
/**
 * whether this array belong to another array.
 * @created: 2012.12.17
 * @modified: 2012.12.17
 */
Array.prototype.belongTo=function(otherArray,ignoreSeq,ignoreCase){
	if(this.length>otherArray.length) return false;
	if(!ignoreSeq){
		for(var i=0,iLen=otherArray.length-this.length+1;i<iLen;i++){
			var j=0;
			if(!ignoreCase){
				if(this[j]!==otherArray[i]) continue;
			}else if(typeof(this[j])=="string"&&typeof(otherArray[i])=="string"){
				if(this[j].toLowerCase()!==otherArray[i].toLowerCase()) continue;
			}else{
				if(this[j]!==otherArray[i]) continue;
			}
			for(;j<this.length;j++){
				if(!ignoreCase){
					if(this[j]!==otherArray[i+j]) break;
				}else if(typeof(this[j])=="string"&&typeof(otherArray[i+j])=="string"){
					if(this[j].toLowerCase()!==otherArray[i+j].toLowerCase()) break;
				}else{
					if(this[j]!==otherArray[i+j]) break;
				}
			}
			if(j>=this.length) return true;
		}
		return false;
	}else{
		var otherArray1=otherArray.concat();
		for(var i=0;i<this.length;i++){
			var j=0;
			for(;j<otherArray1.length;j++){
				if(!ignoreCase){
					if(this[i]===otherArray1[j]) break;
				}else if(typeof(this[i])=="string"&&typeof(otherArray1[j])=="string"){
					if(this[i].toLowerCase()===otherArray1[j].toLowerCase()) break;
				}else{
					if(this[i]===otherArray[i]) break;
				}
			}
			if(j<otherArray1.length){	//found
				otherArray1.splice(j,1);
			}else{		//no found
				return false;
			}
		}
		return true;
	}
}
/**
 * @created: 2010.11.6
 */
Array.prototype.indexOf=function(item,startIndex) { 
	var n=this.length;
	var i=startIndex==undefined?0:(startIndex<0?Math.max(0,n+startIndex):startIndex); 
	for(; i < n; i++){
		if(i in this && this[i] === item) return i; 
	}
	return -1;
}
/**
 * @created: 2010.11.6
 */
Array.prototype.lastIndexOf=function(item,startIndex){ 
	var n=this.length;
	var i=startIndex==undefined?(n-1):startIndex;
	if(startIndex<0){
		i=Math.max(0,n-1+startIndex);
	}else if(startIndex>n-1){
		i=n-1;
	}
	for(;i>=0;i--){
		if(i in this && this[i] === item) return i; 
	}
	return -1;
}
/**
 * @function: forEach
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2010.11.7
 * @modified: 2012.3.28
 */
Array.prototype.forEach=function(fn,bind){
	for(var i=0,len=this.length;i<len;i++){
		if(bind) fn.call(bind, this[i], i, this);
		else fn(this[i], i, this);
	}
}
/**
 * @function: map
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @return: The new mapped array.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.map=function(fn,bind){
	var array=[];
	if(!fn) return this.concat(); 
	for(var i=0,len=this.length;i<len;i++){
		if(bind) array[i]=fn.call(bind, this[i], i, this);
		else array[i]=fn(this[i], i, this);
	}
	return array;
}
/**
 * @function: every
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.every=function(fn,bind){
	var array=[];
	for(var i=0,len=this.length;i<len;i++){
		if(!bind&&!fn(this[i],i,this)){
			return false;
		}else if(bind&&!fn.call(bind,this[i],i,this)){
			return false;
		}
	}
	return true;
}
/**
 * @function: every
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.some=function(fn,bind){
	var array=[];
	for(var i=0,len=this.length;i<len;i++){
		if(!bind&&fn(this[i],i,this)){
			return true;
		}else if(bind&&fn.call(bind,this[i],i,this)){
			return true;
		}
	}
	return false;
}
/**
 * select elements
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @created: 2010.11.7
 * @modified: 2012.3.28
 */
Array.prototype.select=function(fn,bind){
	var array=[];
	for(var i=0,j=0,len=this.length;i<len;i++){
		if(!bind&&fn(this[i],i,this)){
			array[j++]=this[i];
		}else if(bind&&fn.call(bind,this[i],i,this)){
			array[j++]=this[i];
		}
	}
	return array;
}
/**
 * filter elements
 * @description: same with select method.
 * @para fn: fnProcess(item,index,array)
 * @para bind: (object, optional) The object to use as 'this' within the function.
 * @return:  The new filtered array.
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.filter=function(fn,bind){
	var array=[];
	for(var i=0,j=0,len=this.length;i<len;i++){
		if(!bind&&fn(this[i],i,this)){
			array[j++]=this[i];
		}else if(bind&&fn.call(bind,this[i],i,this)){
			array[j++]=this[i];
		}
	}
	return array;
}
/**
 * @invoke: eval(fn(x,y));
 * @created: 2012.3.28
 */
Array.prototype.eval=function(fn,bind){
	var value=this.length>0?this[0]:"";
	for(var i=1;i<this.length;i++){
		if(bind) value=fn.call(bind,value,this[i]);
		else value=fn(value,this[i]);
	}
	return value;
}
/**
 *
 * @description:  Creates an object with key-value pairs based on the array of keywords passed in and the current content of the array.
 * @created: 2012.3.28
 */
Array.prototype.associate=function(otherArray){
	var obj={};
	for(var i=0;i<this.length;i++){
		obj[this[i].toString()]=otherArray.length>i?otherArray[i]:null;
	}
	return obj;
}
/**
 * @created: 2012.3.28
 * @modified: 2012.3.28
 */
Array.prototype.isSameValues=function(){
	var vValue=this.length==0?"":this[0];
	for(var i=0;i<this.length;i++){
		if(vValue!==this[i]) return false;
	}
	return true;
}
/**
 * @created: 2013.4.2
 * @modified: 2013.4.2
 */
Array.prototype.isUniqueValues=function(){
	for(var i=this.length-1;i>=0;i--){
		var item=this[i];
		var flag=0;
		for(var j=i-1;j>=0;j--){
			if(item===this[j]){
				return false;
			}
		}
	}
	return true;
}


//old----------
 
/**
 * 功能：增加单个元素
 * 描述：
 * 参数：
 *  (1)vValue
 *  (2)isKeepOnly: 可选，是否保持唯一性，默认为否
 *		1)true:   在增加该元素前，先判断该元素是否已存在于该数组中，如果是则不用添加，否则则添加。
 *		2)false:  在增加该元素时，不用判断该元素是否已存在于该数组中
 *  (3)isNoCase:  是否不区分大小写,默认为否
 * 日期：2009.07.18
 * @modified: 2010.11.10
 */
Array.prototype.addElement=function(vValue,isKeepOnly,isNoCase){
	var index=this.findElement(vValue,isNoCase);
	if(isKeepOnly&&index>=0) return;
	else this[this.length]=vValue;
	return vValue;
}
/**
 * 功能：增加单个元素
 * 描述：
 * 参数：
 *  (1)vValue
 *  (2)iOptions: 可选，是否保持唯一性，默认为否
 *		1)0: 在增加该元素时，不用判断该元素是否已存在于该数组中
 *		2)1: 在增加该元素前，先判断该元素是否已存在于该数组中，如果是则不用添加，否则则添加。
 *		3)2: 在增加该元素前，先判断该元素是否已存在于该数组中，如果是则先删除旧元素再添加新元素，否则则直接添加新元素。
 *  (3)isNoCase:  是否不区分大小写,默认为否
 * 创建日期：2010.04.25
 * @modified 2010.11.10
 */
Array.prototype.addElementX=function(vValue,iOptions,isNoCase){
	switch(iOptions){
		case 0:
			break;
		case 1:
			var index=this.findElement(vValue,isNoCase);
			if(index>=0) return;
			break;
		case 2:
			var index=this.findElement(vValue,isNoCase);
			if(index>=0) this.removeElement(index);
			break;
	}
	this[this.length]=vValue;
	return vValue;
}
/**
 * 增加任意多个元素
 * @return: return the array
 * @created: 2010.01.04
 */
Array.prototype.addElements=function(){
	for(var i=0,l=arguments.length;i<l;i++){
		this[this.length]=arguments[i];
	}
	return this;
}
/**
 * 连接元素跟Array.concat()方法差不多，只不过是不以新数组出现
 * @return: return the array
 * @created: 2010.11.10
 */
Array.prototype.appendElements=function(){
	var aValues=[].concat.apply(this,arguments);
	for(var i=0;i<aValues.length;i++){
		this[this.length]=aValues[i];
	}
	return this;
}
/**
 * 连接元素跟Array.concat()方法差不多，只不过是不以新数组出现
 * @return: return the array
 * @modified: 2010.11.10
 */
Array.prototype.concatElements=function(){
	var aValues=[].concat.apply(this,arguments);
	for(var i=0;i<aValues.length;i++){
		this[this.length]=aValues[i];
	}
	return this;
}
/**
 * insert new element to specified position of array
 */
Array.prototype.insertElement=function(newElement,tarIndex){
	if(tarIndex==null) return this[this.length]=newElement;
	if(tarIndex<0||tarIndex>this.length) return newElement;
	var aSplitter1=this.slice(tarIndex);
	this[tarIndex]=newElement;
	for(var i=0;i<aSplitter1.length;i++){
		this[tarIndex+1+i]=aSplitter1[i];
	}
	return newElement;
}
/**
 * 移动元素到指定的目标位置(根据偏移量)
 * @return 
 * @modified 2010.11.10
 */
Array.prototype.moveElement=function(srcIndex,iOffset){
	if(srcIndex<0) return;
	if(srcIndex>this.length) return;
	if((srcIndex+iOffset)<0) return;
	if((srcIndex+iOffset)>=this.length) return;
	//****
	for(var i=0;i<Math.abs(iOffset);i++){
		this.swapElement(srcIndex+(iOffset>0?i:-i),srcIndex+(iOffset>0?i+1:-i-1));
	}
	return this[srcIndex];
}
/**
 * 移动元素到指定的目标位置(根据目标索引)
 * @return 
 * @modified 2010.11.10
 */
Array.prototype.moveElementTo=function(srcIndex,tarIndex){
	return this.moveElement(srcIndex,tarIndex-srcIndex);
}
/**
 * 交换元素
 * @modified 2010.11.09
 */
Array.prototype.swapElement=function(srcIndex,tarIndex){
	if(srcIndex==tarIndex) return;
	if(srcIndex<0||srcIndex>=this.length) return;
	if(tarIndex<0||tarIndex>=this.length) return;
	var element=this[tarIndex];
	this[tarIndex]=this[srcIndex];
	this[srcIndex]=element;
	
	return this;
}
/**
 * @function: find element in array
 * @description: thought search speed
 * @para vKey: search key
 * @para isNoCase:	if no differentiate character case. optional, default as false
 * @para isContains: if search element that contains the key. optional, default as false
 * @created: 2009.03.29
 * @modified: 2009.07.22
 */
Array.prototype.findElement=function(vKey,isNoCase,isContains){
	var typeName=typeof(vKey);
	if(typeName!="string"){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i]==vKey)){
				return i;
			}
		}
	}else if(isNoCase&&isContains){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].toLowerCase().indexOf(vKey.toLowerCase())>=0)){
				return i;
			}
		}
	}else if(isNoCase){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].toLowerCase()==vKey.toLowerCase())){
				return i;
			}
		}
	}else if(isContains){
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i].indexOf(vKey)>=0)){
				return i;
			}
		}	
	}else{
		for(var i=0;i<this.length;i++){
			if((typeof(this[i])==typeof(vKey))&&(this[i]==vKey)){
				return i;
			}
		}
	}
	return -1;
}
/**
 * remove element of array by index
 * @return element
 * @modified 2010.11.09
 */
Array.prototype.removeElement=function(index){
	return this.splice(index,1);
}
/**
 * @function: is contains specified element
 * @modified: 2010.11.09
 */
Array.prototype.isContains=function(item){
	for(var i=0;i<this.length;i++){
		if(this[i]===item){
			return true;
		}
	}
	return false;
}
/**
 * @function: isSingleType
 * @notice: 注意,如果类型为object,则可能不能准确判断
 * @para isCaseBase: 是否区分基本类型的值和对象,默认不区分,例如：”"123"”和“new String("123")”
 * @para isCaseObject: 是否区分对象类型，默认区分
 * @author: liu denggao
 * @created: 2009.12.08
 */
Array.prototype.isSingleType=function(isCaseBase,isCaseObject){
	isCaseBase=isCaseBase==undefined?false:isCaseBase;
	isCaseObject=isCaseObject==undefined?true:isCaseObject;
	
	var sType="";
	if(isCaseObject){
		if(!this.length){
			sType="";
		}else if(!isCaseBase){
			sType=this[0].constructor||typeof(this[0]);
		}else if(typeof(this[0])=="object"){
			sType=this[0].constructor||typeof(this[0]);
		}else{
			sType=typeof(this[0]);
		}
		for(var i=1;i<this.length;i++){
			var sType1="";
			if(!isCaseBase){
				sType1=this[i].constructor||typeof(this[i]);
			}else if(typeof(this[i])=="object"){
				sType1=this[i].constructor||typeof(this[i]);
			}else{
				sType1=typeof(this[i]);
			}
			if(sType!=sType1) return false;
		}
	}else{
		if(!this.length){
			sType="";
		}else if(!isCaseBase){
			sType=Object.prototype.toString.apply(this[0]);
		}else if(typeof(this[0])=="object"){
			sType=Object.prototype.toString.apply(this[0]);
		}else{
			sType=typeof(this[0]);
		}
		for(var i=1;i<this.length;i++){
			var sType1="";
			if(!isCaseBase){
				sType1=Object.prototype.toString.apply(this[i]);
			}else if(typeof(this[i])=="object"){
				sType1=Object.prototype.toString.apply(this[i]);
			}else{
				sType1=typeof(this[i]);
			}
			if(sType!=sType1) return false;
		}
	}
	return true;
}
/**
 * @created: 2009.12.2
 * @modified: 2010.11.09
 */
Array.prototype.isSingleValue=function(){
	var vValue=!this.length?"":this[0];
	for(var i=0;i<this.length;i++){
		if(vValue!==this[i]) return false;
	}
	return true;
}

/**
 * @function: join all elements  of array as a string by separator
 * @description: 用分隔符连接数组为单一字符串，当分隔符为数组时，分别填补到对应的位置。
 * 			例如：[22,52,48,999].joinAsStr(["时","分","秒","毫秒"]) -> "22时52分48秒999毫秒"
 *			、[22,52,48,999].joinAsStr(["时","分","秒","毫秒"],1) -> "时22分52秒48毫秒999"
 *			、[0,52,48,0].joinAsStr(["时","分","秒","毫秒"],0,[0]) -> "52分48秒"
 
 * @para vSeparator:
 * @para iAlign: 0, this on left, separator on right; 1, this on right, separator on left
 * @para vTrims: any value or array.本数组的首尾元素符合这个值的将被删除。
 * @author: liu denggao
 * @created: 2009.12.03
 * @modified: 2010.11.12
 */	
Array.prototype.joinAsStr=function(vSeparator,iAlign,vTrims){
	iAlign=iAlign==undefined?0:iAlign;	
	var aTrims=[];
	if(Object.prototype.toString.apply(vTrims) === '[object Array]'){
		aTrims=vTrims;
	}else{
		aTrims=[vTrims];
	}
	if(Object.prototype.toString.apply(vSeparator) !== '[object Array]'){
		return this.join(vSeparator);
	}else{
		var aValues=[];
		if(iAlign==0){
			for(var i=0,k=0;i<this.length;i++){
				if(!aTrims.isContains(this[i])){
					aValues[k++]=this[i];
					aValues[k++]=vSeparator[Math.min(i,this.length-1,vSeparator.length-1)];
				}
			}
		}else{
			for(var i=0,k=0;i<this.length;i++){
				if(!aTrims.isContains(this[i])){
					aValues[k++]=vSeparator[Math.min(i,this.length-1,vSeparator.length-1)];
					aValues[k++]=this[i];
				}
			}
		}
		return aValues.join("");	
	}
}

/**
 * @para fn:  fnProcess(item,index,array)
 * @created: 2011.10.28
 */
Array.prototype.toNewArray=function(fn){
	var array=[];
	for(var i=0;i<this.length;i++){
		if(typeof(fn)=="function"){
			array[array.length]=fn(this[i],i,this);
		}else{
			array[array.length]=this[i];
		}
	}
	return array;
}