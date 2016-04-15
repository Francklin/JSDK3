/**
 * @fileoverview js.lang.Object class
 * @file	Object.js
 * @author	Liu Denggao
 * @version	0.1, 2010.1.6
 * @since	JSDK3
 */

$package("js.lang");

/**
 * Create a new Object instance. Deprecate access 
 * Engine.kernel.Object, best by js.lang.Object.
 * @author	Liu Denggao
 * @version	0.1, 2010.1.6
 * @class This is the basic JSDK class.  
 * @constructor
 * @return A new Object
 * @deprecated
 */

js.lang.Object = Engine.kernel.Object;
js.lang.Object.$super = Object;
