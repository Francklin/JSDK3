/**
 * global function for id
 * @file: function.id.js
 * @author: liu denggao
 * @created: 2012.05.14
 * @modified: 2012.05.14
 **************************/

/**
 * output id number
 * @description 
 * @invoke 
 * @para iTimelyOptions: -1, only datetime; 0, universal; 1, normal; 2, timely
 * @para iLen: length of id.
 *		(1)8: for normal or timely
 *		(2)9: for normal or timely
 *		(3)10: for normal or timely
 *		(4)11: for normal or timely
 *		(5)16: only for universal
 *		(6)32: only for universal
 * @return
 * @author liudenggao
 * @origCreated 2010.12.26
 * @created 2012.05.14
 */
"newId": function(iTimelyOptions,iLen){
	var date=new Date();
	var iYear=date.getFullYear(); 
	var iCentYear=iYear%100;
	var iCent=iYear-iCentYear;
	var iMonth=date.getMonth()+1;
	var iDay=date.getDate();
	var iHour=date.getHours();
	var iMinute=date.getMinutes();
	var iSecond=date.getSeconds();
	var iMilliseconds=date.getMilliseconds();

	var retValue="";

	switch(iTimelyOptions){
		case 0:			//universal
			iLen=iLen||16;
			switch(iLen){
				case 16:		//16位十六进制=HEX(4(世纪年月日)+7(时分秒毫秒)+5(随机数))
					var dtStart=new Date(iCent,0,1);
					var iDate=Math.floor((date-dtStart)/(1000*60*60*24))+1;
					var sDate=[].fill("0",4).concat(iDate.toString(16)).join("").slice(-4);
					var iTime=iHour*60*60*1000+iMinute*60*1000+iSecond*1000+iMilliseconds;
					var sTime=[].fill("0",7).concat(iTime.toString(16)).join("").slice(-7);
					var sRandom=[].fill("0",5).concat(Math.random().toString(16).replace(".","")).join("").slice(-5);
					retValue=sDate+sTime+sRandom;
					break;
				case 32:		//32位十进制=DEC(8(年月日)+9(时分秒毫秒)+15(随机数))
					var sDate=[("0000"+iYear).slice(-4),("00"+iMonth).slice(-2),("00"+iDay).slice(-2)].join("");
					var sTime=[("00"+iHour).slice(-2),("00"+iMinute).slice(-2),("00"+iSecond).slice(-2)
							,("000"+iMilliseconds).slice(-3)].join("");
					var sRandom=[].fill("0",15).concat(Math.random().toString().replace(".","")).join("").slice(-15);
					retValue=sDate+sTime+sRandom;
					break;
			}
			break;
		case 1:			//normal	
			iLen=iLen||11;
			switch(iLen){
				case 8:		//8位三十六进制=BIN(25(月日时分秒)+16(随机数))
					var dtStart=new Date(iYear,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",25).concat(iTime.toString(2)).join("").slice(-25);
					var sRandom=[].fill("0",16).concat(Math.random().toString(2)).join("").slice(-16);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",8).concat(parseInt(sBin,2).toString(36)).join("").slice(-8);
					break;
				case 9:		//9位三十六进制=BIN(25(月日时分秒)+21(随机数))
					var dtStart=new Date(iYear,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",25).concat(iTime.toString(2)).join("").slice(-25);
					var sRandom=[].fill("0",21).concat(Math.random().toString(2)).join("").slice(-21);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",9).concat(parseInt(sBin,2).toString(36)).join("").slice(-9);
					break;
				case 10:	//10位三十六进制=BIN(32(年月日时分秒)+19(随机数))
					var dtStart=new Date(iCent,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",19).concat(Math.random().toString(2)).join("").slice(-19);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",10).concat(parseInt(sBin,2).toString(36)).join("").slice(-10);
					break;
				case 11:	//11位三十六进制=BIN(32(年月日时分秒)+24(随机数))
					var dtStart=new Date(iCent,0,1,0,0,0,0);
					var iTime=Date.computeTime(date-dtStart,"ms","s");
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",24).concat(Math.random().toString(2)).join("").slice(-24);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",11).concat(parseInt(sBin,2).toString(36)).join("").slice(-11);
					break;
			}
			break;
		case 2:			//timely
			iLen=iLen==undefined?11:iLen;
			switch(iLen){
				case 8:		//8位三十六进制=BIN(27(时分秒毫秒)+14(随机数))
					var dtStart=new Date(iYear,date.getMonth(),iDay,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",27).concat(iTime.toString(2)).join("").slice(-27);
					var sRandom=[].fill("0",14).concat(Math.random().toString(2)).join("").slice(-14);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",8).concat(parseInt(sBin,2).toString(36)).join("").slice(-8);
					break;
				case 9:		//9位三十六进制=BIN(27(时分秒毫秒)+19(随机数))
					var dtStart=new Date(iYear,date.getMonth(),iDay,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",27).concat(iTime.toString(2)).join("").slice(-27);
					var sRandom=[].fill("0",19).concat(Math.random().toString(2)).join("").slice(-19);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",9).concat(parseInt(sBin,2).toString(36)).join("").slice(-9);
					break;
				case 10:	//10位三十六进制=BIN(32(日时分秒毫秒)+19(随机数))
					var dtStart=new Date(iYear,date.getMonth(),1,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",19).concat(Math.random().toString(2)).join("").slice(-19);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",10).concat(parseInt(sBin,2).toString(36)).join("").slice(-10);
					break;
				case 11:	//11位三十六进制=BIN(32(日时分秒毫秒)+24(随机数))
					var dtStart=new Date(iYear,date.getMonth(),1,0,0,0,0);
					var iTime=date-dtStart;
					var sTime=[].fill("0",32).concat(iTime.toString(2)).join("").slice(-32);
					var sRandom=[].fill("0",24).concat(Math.random().toString(2)).join("").slice(-24);
					var sBin=sTime+sRandom;
					retValue=[].fill("0",11).concat(parseInt(sBin,2).toString(36)).join("").slice(-11);
					break;
			}
			break;
		default:
			var sDate=[("0000"+iYear).slice(-4),("00"+iMonth).slice(-2),("00"+iDay).slice(-2)].join("");
			var sTime=[("00"+iHour).slice(-2),("00"+iMinute).slice(-2),("00"+iSecond).slice(-2)
							,("000"+iMilliseconds).slice(-3)].join("");
			retValue=sDate+sTime;
	}
	return retValue.toUpperCase();
},
"newUnid": function(iBits){
	iBits=iBits||16;
	var aValues=[];
	for(var i=0;i<iBits;i++){
		aValues[i]=Math.floor(Math.random()*16.0).toString(16).toUpperCase();
	} 
	return aValues.join("");
},
"newGuid": function(){
	return [S4(),S4(),"-",S4(),"-",S4(),"-",S4(),"-",S4(),S4(),S4()].join("");   
	function S4(){   
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);   
	}
}

