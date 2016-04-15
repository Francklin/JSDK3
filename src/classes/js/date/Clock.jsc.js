/**
 * Clock Class
 * @file: Clock.class.js
 * @version: V1.0.2 Final
 * @since: JSDK3 V1.6.5
 * @description:  时钟，以秒为单位扫描定时任务
 * @author: liu denggao
 * @created: 2011.12.20
 * @modified: 2011.12.21-2013.12.18
 * @mail: francklin.liu@gmail.com
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.date");

/**
 * Clock Class of public
 * @description: 
 * @supplement: 暂时不考虑循环触发的问题，并且必须指定日期和时间
 * @created: 2011.12.20
 * @modified: 2011.12.21
 */
js.date.Clock=function(referTime){
	this.__timer=null;
	this.__timeInterval=1000;
	this._referTime=null;
	this._referLocalTime=null;
	this._lastTriggeredTime=null;
	this._lastFinishedTime=null;
	this._enabledTrigger=false;
	this._tasks=[];
	this._taskInterval=1000*60;
	this._taskTrigger=null;
	this._proc=null;
	this._Clock(referTime);
}

var _$class = js.date.Clock;

with(_$class){
	$name="Clock";
	$extends("Object");
	
	//constructor----------------------------------------
	
	prototype._Clock=function(referTime){
		this._referLocalTime=new Global.js.lang.natives.Date();
		this._referTime=referTime!=undefined?referTime:this._referLocalTime;
		this._proc=function(){
			for(var i=0,iLen=this._tasks.length;i<iLen;i++){
				var task=this._tasks[i];
				var date=new Global.js.lang.natives.Date();
				if(task.isFinished) continue;
				else if(task.isExpired) continue;
				if(!(task.date instanceof Array)){
					date=task.date;
				}else if(!task.date[1]){	//has date only
					date=task.date[0];
					date.setHours(0);
					date.setMinutes(0);
					date.setSeconds(0);
					date.setMilliseconds(0);
				}else if(!task.date[0]){	//has time only
					date.setHours(task.date[1].getHours());
					date.setMinutes(task.date[1].getMinutes());
					date.setSeconds(task.date[1].getSeconds());
					date.setMilliseconds(task.date[1].getMilliseconds());
				}else{	//has date and time
					date=task.date[0];
					date.setHours(task.date[1].getHours());
					date.setMinutes(task.date[1].getMinutes());
					date.setSeconds(task.date[1].getSeconds());
					date.setMilliseconds(task.date[1].getMilliseconds());
				}
				if((!this._lastFinishedTime||this._lastFinishedTime<date)
					&&Math.abs(this.getCurrentTime()-date)<1.2*this._taskInterval){
					//任务执行时间没有超出范围，没有带来阻塞情况
					this._lastTriggeredTime=this.getCurrentTime();
					try{task.action.call(task);}catch(e){}
					this._lastFinishedTime=this.getCurrentTime();
					task.isFinished=true;
				}else if(this._lastTriggeredTime&&this._lastTriggeredTime<=date
					&&this._lastFinishedTime&&this._lastFinishedTime>=date){
					//任务执行时间超出了限定范围，影响了下一个任务的计划时间
					this._lastTriggeredTime=this.getCurrentTime();
					try{task.action.call(task);}catch(e){}
					this._lastFinishedTime=this.getCurrentTime();
					task.isFinished=true;
				}else if(this.getCurrentTime()>date){
					//过期了
					task.isExpired=true;
				}
			}
		}
	}
	
	//:property-------------------------------------------
	
	addProperty(false,true,"currentTime",{
		get: function(){
			var date=new Global.js.lang.natives.Date(this._referTime);
			var elapseTimes=(new Global.js.lang.natives.Date())-this._referLocalTime;
			date.setMilliseconds(date.getMilliseconds()+elapseTimes);
			return date;
		}
	});
	addProperty(false,true,"currentLocalTime",{
		get: function(){
			return new Global.js.lang.natives.Date();
		}
	});	
	addProperty(false,true,"enabledTrigger",{
		get: function(){
			return this._enabledTrigger;
		},
		set: function(bValue){
			var thisObj=this;
			if(this._enabledTrigger==bValue) return;
			if(bValue){
				this._taskTrigger=setInterval(function(){
					thisObj._proc();
				},this._taskInterval);
			}else{
				clearInterval(this._taskTrigger);
			}
			this._enabledTrigger=bValue;
		}
	});
	
	//:method--------------------------------------------
	
	/**
	 * @para vDateTime: 
	 *		1)datetime
	 *		2)[date,time]
	 * @para vData:
	 * @para fnAction:
	 */
	addMethod(false,true,"addTask",function(id,vDateTime,vData,fnAction){
		this._tasks[this._tasks.length]={
			id: id,
			date: vDateTime,
			data: vData,
			action: fnAction
		}
	});	
	addMethod(false,true,"getTask",function(index){
		return this._tasks[index];
	});
	addMethod(false,true,"getTaskById",function(id){
		for(var i=0,iLen=this._tasks.length;i<iLen;i++){
			if(this._tasks[i].id==id) return this._tasks[i];
		}
		return null;
	});
	addMethod(false,true,"getAllTasks",function(){
		return this._tasks;
	});
	addMethod(false,true,"clearTasks",function(){
		this._tasks=[];
	});
}

