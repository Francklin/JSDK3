/**
 * Date of base
 * @file: base.Date.js
 * @version: V0.2
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2012.5.30
 **************************/


/**
 * compute time
 * @para iValue
 * @para vFromType
 *		(1)0|time
 *		(2)1|h
 *		(3)2|m
 *		(4)3|s
 *		(5)4|ms
 * @para vToType
 *		(1)0|hh:mm:ss:ms
 *		(2)1|h
 *		(3)2|m
 *		(4)3|s
 *		(5)4|ms
 * @return array or number
 * @author denggao liu
 * @created 2011.9.21
 * @modified 2010.11.11
 */
Date.computeTime=function(iValue,vFromType,vToType){
	var iFromType;
	var iToType;
	switch(vFromType.toString().toLowerCase()){
		case "0":
		case "time":
			iFromType=0;
			break;
		case "1":
		case "h":
			iFromType=1;
			break;
		case "2":
		case "m":
			iFromType=2;
			break;
		case "3":
		case "s":
			iFromType=3;
			break;
		case "4":
		case "ms":
			iFromType=4;
			break;
		default:
			iFromType=0;
	}
	switch(vToType.toString().toLowerCase()){
		case "0":
		case "hh:mm:ss:ms":
			iToType=0;
			break;
		case "1":
		case "h":
			iToType=1;
			break;
		case "2":
		case "m":
			iToType=2;
			break;
		case "3":
		case "s":
			iToType=3;
			break;
		case "4":
		case "ms":
			iToType=4;
			break;
		default:
			iToType=0;
	}
	if(iFromType==0){
		var iHour=iValue.getHours();
		var iMinute=iValue.getMinutes();
		var iSecond=iValue.getSeconds();
		var iMilliseconds=iValue.getMilliseconds();
		return (
			iToType==0?[iHour,iMinute,iSecond,iMilliseconds]
			:iToType==1?iHour
			:iToType==2?(iHour*60+iMinute)
			:iToType==3?(iHour*60*60+iMinute*60+iSecond)
			:iToType==4?((iHour*60*60+iMinute*60+iSecond)*1000+iMilliseconds)
			:0
		);
	}else if(iFromType<=3){
		return (
			iToType==0?[Math.floor(iValue*Math.pow(60,1-iFromType))
				,Math.floor((iValue=iValue%Math.pow(60,iFromType-1))*Math.pow(60,2-iFromType))
				,Math.floor((iValue=iValue%Math.pow(60,iFromType-2))*Math.pow(60,3-iFromType))
				,0
			]
			:iToType<=3?Math.floor(iValue*Math.pow(60,iToType-iFromType))
			:iToType==4?Math.floor(iValue*Math.pow(60,3-iFromType)*1000)
			:0
		);
	}else if(iFromType==4){
		return (
			iToType==0?[Math.floor(iValue*Math.pow(60,-2)*Math.pow(1000,-1))
				,Math.floor((iValue=iValue%(Math.pow(60,2)*Math.pow(1000,1)))*Math.pow(60,-1)*Math.pow(1000,-1))
				,Math.floor((iValue=iValue%(Math.pow(60,1)*Math.pow(1000,1)))*Math.pow(60,0)*Math.pow(1000,-1))
				,iValue%Math.pow(1000,1)
			]
			:iToType<=3?Math.floor(iValue*Math.pow(60,iToType-3)*Math.pow(1000,-1))
			:iToType==4?iValue
			:0
		);
	}else{
		return 0;
	}
}
/**
 * @para sPart: date,time,datetime
 * @para sDateSep: date separator
 * @created: 2012.5.30
 */
Date.prototype.toSTDString=function(sPart,sDateSep){
	var iYear=this.getFullYear();
	var iMonth=this.getMonth()+1;
	var iDay=this.getDate();
	var iHour=this.getHours();
	var iMinute=this.getMinutes();
	var iSecond=this.getSeconds();
	var sDate=[("0000"+iYear).slice(-4),("00"+iMonth).slice(-2),("00"+iDay).slice(-2)].join(sDateSep||"-");
	var sTime=[("00"+iHour).slice(-2),("00"+iMinute).slice(-2),("00"+iSecond).slice(-2)].join(":");
	switch(sPart&&sPart.toLowerCase()){
		case "date":
			return sDate;
		case "time":
			return sTime;
		case "datetime":
		default:
			return sDate+" "+sTime;
	}
}

