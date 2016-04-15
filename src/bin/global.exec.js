/**
 * global function for execute
 * @file: global.exec.js
 * @version: V0.5 beta
 * @author: liu denggao
 * @created: 2013.5.31
 * @modified: 2013.6.1
 **************************/
 
 /**
 * @para func: required. func()
 *		notice:
 *		1)return 1: exit task, return not 1: wait task.
 * @pata driver: optional
 * @para para: parameter for driver
 * @author: liudenggao
 * @created: 2012.10.12
 * @modified: 2012.10.15-2013.5.31
 */
"exec" : function(){
	var _timer=null;
	var _timer1=null;
	var _drivers={};
	var _mainTasks=[];
	var _subTasks=[];
	var _doneSubTaskCount=0;
	var _backTasks=[];		//all back tasks for current task
	var _backTaskIdCount=0;	//for id of back tasks
	var _curTask=null;		//current task
	var _curSubTask=null;	//current sub task
	var _html=[];			//html to write for current task
	var _state=0;			//0, ready; 1, running
	var _flag=0;			//0, no finished main task; 1, finished main task, but not contains back tasks.
	function startNextTask(){
		if(!_mainTasks.length) return;
		_state=1;
		_timer=window.setTimeout(function(){
			doNextTask();
			_timer=null;
		},0);
	}
	function startNextSubTask(){
		if(!_subTasks.length) return;
		_timer1=window.setTimeout(function(){
			try{ 
				_doneSubTaskCount++;
				_curSubTask=_subTasks.shift();
				var ret=_curSubTask.action();
			}catch(e){
			}
			if(ret===false){
				onFinishTask();
			}else if(!_subTasks.length){
				onFinishTask();
			}else{
				startNextSubTask();
			}
		},0);
	}
	function doNextTask(){
		try{ 
			_flag=0;
			_html.clear();
			_subTasks.clear();
			_doneSubTaskCount=0;
			_backTasks.clear();
			_backTaskIdCount=0;
			_curTask=_mainTasks.shift();
			_curTask.action();
		}catch(e){
		}
	}
	/**
	 * @para func: func()
	 */
	function callBack(func){
		var id=_backTaskIdCount++;
		var task=_backTasks[_backTasks.length]={
			"id": id,
			"action": function(){
				try{func.apply(this,arguments);}catch(e){};
				onFinishBackTask(id);
			}
		}
		return task.action;
	}
	//when finished a back tasks of a main task.
	function onFinishBackTask(id){
		for(var i=0;i<_backTasks.length;i++){
			if(_backTasks[i].id==id){
				_backTasks.removeAt(i);
				break;
			}
		}
		if(_backTasks.length==0&&_flag==1) onFinishAllBackTasks();
	}
	//when finished all back tasks of a main task.
	function onFinishAllBackTasks(){
		onFinishTask();
	}
	function onFinishTask(){
		_state=0;
		if(_html.length) _curTask.container.insertAdjacentHTML("beforeBegin",_html.join(""));
		if(_curTask.onFinished) try{_curTask.onFinished(_curTask.data);}catch(e){};
		startNextTask();
	}
	_drivers={
		/**
		 * @para func: required. func(container,callBack)
		 *		notice:
		 *		1)return 1: exit task, return not 1: wait task.
		 * @para container: optional
		 *		1)when document is loading, get current script tag element.
		 * @author: liudenggao
		 * @created: 2012.10.12
		 * @modified: 2012.10.15
		 */
		"do": function(func,para){
			var container=para&&para.container;
			if(document.readyState.equal(["loading","interactive"])){
				var scripts=document.getElementsByTagName("SCRIPT");
				container=scripts[scripts.length-1];
				container.write=function(sHtml){
					_html.push(sHtml);
				}
				container.writeln=function(sHtml){
					_html.push(sHtml+"<br>");
				}
			}
			_mainTasks.push({
				"container": container,
				"data": para&&para.data,
				"onFinished": para&&para.onFinished, 
				"action":	function(){
					var ret=func(container,callBack,this.data);
					_flag=1;	//finished main task.
					if(func.length<2){	//no call back
						onFinishTask();
					}else{	//has call back
						if(ret) {						//no call back
							onFinishTask();	
						}else if(!_backTasks.length){	//no call back or finished all call back.
							onFinishTask();	
						}
					}
				}
			});
			if(!_state) startNextTask();
		},
		/**
		 * @para func: required. func(items,start,count,seq,data)
		 *		para items: Array or Collection, original data
		 *		para start: Number, index of data, start from 0
		 *		para count: Number, count of data
		 *		para seq: Number, while seq ,start from 0
		 *		notice:
		 *		1)return 1: exit task, return not 1: wait task.
		 * @pata para: required.
		 *		1)items: required, Array or Collection
		 *		2)start: optional, Number
		 *		3)count: optional, Number
		 *		4)size: optional, Number
		 *		5)data: optional, Variant, user custom data
		 *		6)onFinished: optional, Function
		 * @author: liudenggao
		 * @created: 2013.5.31
		 * @modified: 2013.5.31
		 */		
		"while": function(func,para){
			var count=para.count||para.items&&para.items.length||0;
			_mainTasks.push({
				"items": para.items,
				"start": para.start||0,
				"count": count,
				"size": para.size||Math.ceil(Math.max(count/100,5)),
				"data": para.data,
				"event": {
					"onFinished": para.onFinished
				},
				//onFinished(end,count,data)
				"onFinished": function(){
					if(this.event.onFinished) this.event.onFinished.call(this,this.start
								+_doneSubTaskCount*this.size,_doneSubTaskCount*this.size,this.data);
				},
				"action":	function(){
					if(this.size){
						for(var i=0,len=Math.ceil(this.count/this.size);i<len;i++){
							_subTasks.push({
								index: i,
								parent: this,
								action: function(){
									try{
										return func(para.items,this.parent.start+this.index*this.parent.size
												,this.parent.size,this.index,this.parent.data);
									}catch(e){
										return false;
									}
								}
							});
						}					
					}else{	//根据每个子任务执行的时间动态变化每次执行的子循环数
						//to do...
					}
					startNextSubTask();
					_flag=1;	//finished main task.
					if(!_subTasks.length) onFinishTask();
				}
			});
			if(!_state) startNextTask();
		}
	}
	return function(func,driver,para){
		_drivers[driver||"do"](func,para);
	}
}()

