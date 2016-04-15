
/**
 * @fileoverview js.lang.Exception class
 * @file Exception.jsc
 * @author	Liu Denggao
 * @version	0.1, 2010.1.6
 * @since	JSDK3
 */

$package("js.lang");

/**
 * Create a new Exception instance.
 * @class This is the basic Exception class.  
 * @extends Engine.kernel.Exception
 * @constructor
 * @return A new Exception
 */

(js.lang.Exception = function () {
	Engine.kernel.Exception.apply(this, arguments);	
}).$extends(Engine.kernel.Exception);
 