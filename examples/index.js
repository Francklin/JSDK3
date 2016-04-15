function showAbout(){
	jsdk.PopupDialog.show(
		"about.tpl.htm",
		{
			data: {
				text: [
					"JSDK3 v1.9.1 Beta 20140814",
					"",
					"\t支持：IE6+, IE9+, IE11+, Firefox 3.6+, Chrome 13+, Safari 5.0.5+, Opera 11.11+",
					"\t作者：刘登高",
					"\t日期：2010.01.03-2014.08.14",
					"\t邮箱：francklin.liu@gmail.com",
					"\t主页：http://www.tringsoft.com",
					"",
					"版权：(C) 2007-2014 Tringsoft Studio."
				].join("\n").replace(/\t/g,"   ")
			}
		},
		{
			owner: document.body,
			event: event||window.event,
			driver: "template",
			mode: jsdk.PopupDialog.DISPLAY_MODE_POSITION
		},
		{
			width: 590,
			height: 200,
			style: "about.css"
		},
		function(vReturnValue){
			//
		}
	);
}