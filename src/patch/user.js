/**
 * @since: JSDK3 V1.9.0
 * @created: 2013.9.22
 * @modified: 2013.9.22
 */
(function(Engine,Global,rootHome){
	try{
		//code in here-----
		var cls=Engine.runtimeEnvironment.getMember(Global,"js.domx.HTMLDateField");
		if(cls){
			cls._localeResource.dateFormat=cls._localeResource.dateFormat.replace(/-/g,"/");
			cls._localeResource.timeFormat=cls._localeResource.timeFormat.replace(/-/g,"/");
		}
	}catch(ex){alert(ex.description);
		_jsre.logger.log("JSDK Initialize extension patch fail.\nSource: "+ex.message||ex);	
	}
})