/**
 * Defines the Date type.
 */
{
	"define": function(value) {
		var _class=jsre.getNativeClasses("Date");
		this._value=value==undefined?(new _class()):value;
	},
	"extend": "Object",
	/**
	 * encapsulate(class|className,mode,instanceName[,staticMembers[,instanceMembers])
	 * @para mode: 0, direct, 1, indirect
	 */	
	"base": ["Date",1,"_value",[],[
		"getDate","getDay","getFullYear","getHours","getMilliseconds","getMinutes","getMonth",
		"getSeconds","getTime","getTimezoneOffset","getUTCDate","getUTCDay","getUTCFullYear",
		"getUTCHours","getUTCMilliseconds","getUTCMinutes","getUTCMonth","getUTCSeconds","getVarDate",
		"getYear","setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth",
		"setSeconds","setTime","setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds",
		"setUTCMinutes","setUTCMonth","setUTCSeconds","setYear","toGMTString","toLocaleString","toUTCString",
		"parse","UTC","valueOf","toString"
	]],
	"newInstanceFrom_": function(nativeDate){
		var date=new this();
		date._value=nativeDate;
		return date;
	},
	/**
	 * Compare Date
	 * @para srcDate
	 * @para tarDate
	 * @para compareMethod: -3,second; -2,minute; -1,hour; 0,by time; 1,by day; 2,by month; 3,by year
	 * @para isAccurate: 
	 * @return array or number
	 * @author denggao liu
	 * @created 2011.9.21
	 * @modified 2011.9.21
	 */	
	"compareDate_": function(srcDate,tarDate,compareMethod,isAccurate){
		//to do...
	},
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
	"computeTime_": function(iValue,vFromType,vToType){
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
	},
	/**
	 * @para sPart: date,time,datetime
	 * @para sDateSep: date separator
	 * @created: 2012.5.30
	 */
	"toSTDString": function(sPart,sDateSep){
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
}
