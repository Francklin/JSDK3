/**
 * @fileoverview js.lang.Date class
 * @file		Date.class.js
 * @author	Liu Denggao
 * @version	0.1
 * @since	JSDK3
 * @created 2011.9.21
 */

$package("js.lang");

/**
 * Create a new Date instance. Deprecate access 
 * Engine.kernel.Date, best by js.lang.Date.
 * @author	Liu Denggao
 * @version	0.1
 * @class This is the basic JSDK class.  
 * @constructor
 * @return A new Date
 * @deprecated
 */

js.lang.Date = Engine.kernel.Date;
