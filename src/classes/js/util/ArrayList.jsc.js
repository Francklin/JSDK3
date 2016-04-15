/**
 * @file ArrayList.js
 * @author Liu Denggao
 * @date 2008.11.16-2008.12.03-2010.03.13
 * @modified 2011.11.03
 * @version 0.5
 * @since JSDK3 V0.1
 * @for JSDK3 V1.7.5
 */

$package("js.util");

/**
 * Create a new ArrayList instance.
 * Inherit from Cloneable
 * @author	Wan Changhua
 * @version	2.01, 10/23/05
 * @extends Cloneable
 * @class This is the array class.
 * @constructor
 */
js.util.ArrayList=function() {

	/**
	 * @private
	 */
	this.__array = [];
}

var _$class = js.util.ArrayList;
var _$proto = js.util.ArrayList.prototype;

/**
 * Returns an array containing all of the elements in this list
 * in the correct order.
 * @return an array containing all of the elements in this list
 * 	       in the correct order.
 * @type Array
 */
_$proto.toArray = function() {
	return this.__array.concat([]);
}

/**
 * Searches for the first occurence of the given argument, testing 
 * for equality using the <tt>equals</tt> method. 
 *
 * @param   o   an object.
 * @return  the index of the first occurrence of the argument in this
 *          list; returns <tt>-1</tt> if the object is not found.
 * @type int
 */
_$proto.indexOf = function(o) {
	var l = this.__array.length;
	for (var i = 0; i < l; i++) {
		if (this.__array[i] == o) {
			return i;
		}
	}
	return -1;
}

/**
 * Returns the index of the last occurrence of the specified object in
 * this list.
 *
 * @param   o   the desired element.
 * @return  the index of the last occurrence of the specified object in
 *          this list; returns -1 if the object is not found.
 * @type int
 */
_$proto.lastIndexOf = function(o) {
	var l = this.__array.length - 1;
	for (var i = l; i >= 0; i--) {
		if (this.__array[i] == o) {
			return i;
		}
	}
	return -1;
}

/**
 * Appends the specified element to the end of this list.
 *
 * @param arg1 index at which the specified element is to be inserted.
 * @param arg2 element to be appended to this list.
 */
_$proto.add = function(arg1, arg2) {
	if (arguments.length == 1) {
		this.__array.push(arg1);
	} else {
		var l1 = this.__array.length;
		var a1 = this.__array.slice(0, arg1);
		var a2 = this.__array.slice(arg1, l1);
		var l2 = a1.length;
		a1[l2] = arg2;
		this.__array = a1.concat(a2);
	}
}

 /**
  * Appends all of the elements in the specified Collection to the end of
  * this list, in the order that they are returned by the
  * specified Collection's Iterator.  The behavior of this operation is
  * undefined if the specified Collection is modified while the operation
  * is in progress.  (This implies that the behavior of this call is
  * undefined if the specified Collection is this list, and this
  * list is nonempty.)
  *
  * @param c the elements to be inserted into this list.
  * @return <tt>true</tt> if this list changed as a result of the call.
  * @throws  ArgumentException if the specified collection is not an Array instance.
  */
_$proto.addAll = function(a) {
	if (a instanceof Array) {
		this.__array = this.__array.concat(a);
	} else if (typeof(a.toArray) == "function"
		&& ((a = a.toArray()) instanceof Array)) {
		this.__array = this.__array.concat(a);
	} else {
		throw new Error(0,this.getClass().getName()
			+ ".addAll(): arguments error.");
	}
}


/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).
 *
 * @param i the index of the element to removed.
 * @return the element that was removed from the list.
 */
_$proto.removeAt = function(i) {
	var l = this.__array.length;
	if (i < 0 || i >= l) {
		return null;
	}
	var o = this.__array[i];
	this.__array = this.__array.slice(0, i).concat(
		this.__array.slice(i + 1, l));
	return o;
}

/**
 * Removes the element at the specified position in this list.
 * Shifts any subsequent elements to the left (subtracts one from their
 * indices).
 *
 * @param o the element to removed.
 */
_$proto.remove = function(o) {
	var i = this.indexOf(o);
	if (i == -1) {
		return this;
	}
	return this.removeAt(i);
}


 /**
  * Returns <tt>true</tt> if this list contains the specified element.
  *
  * @param elem element whose presence in this List is to be tested.
  * @return  <code>true</code> if the specified element is present;
  *		<code>false</code> otherwise.
  * @type boolean
  */
_$proto.contains = function(o) {
	return this.indexOf(o) != -1;
}


/**
 * Removes all of the elements from this list.  The list will
 * be empty after this call returns.
 */
_$proto.clear = function() {
	this.__array.length = 0;
}


/**
 * Returns the number of elements in this list.
 *
 * @return  the number of elements in this list.
 * @type int
 */
_$proto.size = function() {
	return this.__array.length;
}


/**
 * Returns the element at the specified position in this list.
 *
 * @param  i index of element to return.
 * @return the element at the specified position in this list.
 * @type Object
 */
_$proto.get = function(i) {
	var size = this.size();
	if (i >= 0 && i < size) {
		return this.__array[i];
	} else {
		return null;
	}
}


/**
 * Returns a shallow copy of this <tt>ArrayList</tt> instance.  (The
 * elements themselves are not copied.)
 *
 * @return  a clone of this <tt>ArrayList</tt> instance.
 * @type ArrayList
 */
_$proto.clone = function() {
	var o = new ArrayList();
	o.addAll(this.__array);
	return o;
}

/**
 * @author Liu Denggao
 * @date 2008.11.16
 * @param dataType: "String","Date","Number","Boolean"
 * @param iSortOption: 0, sort ascending; 1, sort descending; 2, sort randoming
 * @param funGetValue: optional
 */
_$proto.sort=function(dataType,iSortOption,funGetValue){
	var aTemps=[];
	if(iSortOption==2) return Math.random()>0.5?-1:1;
	switch(dataType){
		case "String":
			aTemps=this.__array.sort(function(a,b){
				var a1=Global.js.lang.natives.String(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=Global.js.lang.natives.String(typeof(funGetValue)=="function"?funGetValue(b):b);
				return iSortOption==0?a1.localeCompare(b1):b1.localeCompare(a1);
			});		
			break;
		case "Date":
			aTemps=this.__array.sort(function(a,b){
				var a1=new Global.js.lang.natives.Date(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=new Global.js.lang.natives.Date(typeof(funGetValue)=="function"?funGetValue(b):b);
				if(isNaN(a1)&&isNaN(b1)){
					return 0;
				}else if(isNaN(a1)){
					return iSortOption==0?1:-1;
				}else if(isNaN(b1)){
					return iSortOption==0?-1:1;
				}else{
					return [a1-b1,b1-a1][iSortOption];
				}
			});
			break;
		case "Number":
			aTemps=this.__array.sort(function(a,b){
				var a1=Global.js.lang.natives.Number(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=Global.js.lang.natives.Number(typeof(funGetValue)=="function"?funGetValue(b):b);
				if(isNaN(a1)&&isNaN(b1)){
					return 0;
				}else if(isNaN(a1)){
					return iSortOption==0?1:-1;
				}else if(isNaN(b1)){
					return iSortOption==0?-1:1;
				}else{
					return [a1-b1,b1-a1][iSortOption];
				}
			});
			break;
		case "Boolean":
			aTemps=this.__array.sort(function(a,b){
				var a1=Global.js.lang.natives.Boolean(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=Global.js.lang.natives.Boolean(typeof(funGetValue)=="function"?funGetValue(b):b);
				if(a1==b1){
					return 0;
				}else if(a1){
					return iSortOption==0?1:-1;
				}else{
					return iSortOption==0?-1:1;
				}
			});	
			break;
	}
	for(var i=0;i<this.__array.length;i++){
		this.__array[i]=aTemps[i];
	}
	return this.__array;
}

_$class.sort=function(aArray,dataType,iSortOption,funGetValue){
	var aTemps=[];
	if(iSortOption==2) return Math.random()>0.5?-1:1;
	switch(dataType){
		case "String":
			aTemps=aArray.sort(function(a,b){
				var a1=Global.js.lang.natives.String(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=Global.js.lang.natives.String(typeof(funGetValue)=="function"?funGetValue(b):b);
				return iSortOption==0?a1.localeCompare(b1):b1.localeCompare(a1);
			});		
			break;
		case "Date":
			aTemps=aArray.sort(function(a,b){
				var a1=new Global.js.lang.natives.Date((typeof(funGetValue)=="function"?funGetValue(a):a).replace(/-/g,"/"));
				var b1=new Global.js.lang.natives.Date((typeof(funGetValue)=="function"?funGetValue(b):b).replace(/-/g,"/"));
				if(isNaN(a1)&&isNaN(b1)){
					return 0;
				}else if(isNaN(a1)){
					return iSortOption==0?1:-1;
				}else if(isNaN(b1)){
					return iSortOption==0?-1:1;
				}else{
					return [a1-b1,b1-a1][iSortOption];
				}
			});
			break;
		case "Number":
			aTemps=aArray.sort(function(a,b){
				var a1=Global.js.lang.natives.Number(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=Global.js.lang.natives.Number(typeof(funGetValue)=="function"?funGetValue(b):b);
				if(isNaN(a1)&&isNaN(b1)){
					return 0;
				}else if(isNaN(a1)){
					return iSortOption==0?1:-1;
				}else if(isNaN(b1)){
					return iSortOption==0?-1:1;
				}else{
					return [a1-b1,b1-a1][iSortOption];
				}
			});
			break;
		case "Boolean":
			aTemps=aArray.sort(function(a,b){
				var a1=Global.js.lang.natives.Boolean(typeof(funGetValue)=="function"?funGetValue(a):a);
				var b1=Global.js.lang.natives.Boolean(typeof(funGetValue)=="function"?funGetValue(b):b);
				if(a1==b1){
					return 0;
				}else if(a1){
					return iSortOption==0?1:-1;
				}else{
					return iSortOption==0?-1:1;
				}
			});	
			break;
	}
	for(var i=0;i<aTemps.length;i++){
		aArray[i]=aTemps[i];
	}
	return aArray;
}

/**
 * @author Liu Denggao
 * @date 2008.11.16
 */ 
_$proto.toString=function(){
	return this.__array.toString();
}
