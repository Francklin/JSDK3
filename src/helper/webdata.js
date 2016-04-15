/**
 * @author: liudenggao
 * @created: 2014.1.22
 * @modified: 2014.4.9,2014.4.17,2014.5.22
 */
(function(window){
	var $=function(name,data){
		var len=arguments.length;
		if(len==2){
			$.set(name,data);
		}else{
			return $.get(name);
		}
	}
	$.extend=function(){
		var sources=[].concat.apply([],arguments);
		for(var i=0;i<sources.length;i++){
			for(var key in sources[i]) {
				if(sources[i].hasOwnProperty(key)) this[key] = sources[i][key]; 
			}
		}
		return this;
	}
	$.extend({
		_data: {},
		_tasks: {},
		_paras: {},
		_states: {},
		"get": function(name){
			var data={};
			if(typeof(name)=="string"){
				return this._data[name];
			}else if(name instanceof Array){
				for(var i=0;i<names.length;i++){
					if(this._data.hasOwnProperty(names[i])) data[names[i]] = this._data[names[i]]; 
				}
				return data;
			}
		},
		"set": function(name,data){
			if(this._data[name]){
				this._data[name]=data;
				this._tasks[name]=[];
				this._states[name]=1;
			}else if(this._tasks[name]){
				this._data[name]=data;
				this._states[name]=1;
				this.fireHandler(name);
			}else{
				this._data[name]=data;
				this._tasks[name]=[];
				this._states[name]=1;
			}
		},
		"load": function(name,url,para,cache,callback,type,immd){
			var _this=this;
			this._data[name]="";
			this._tasks[name]=[];
			this._paras[name]={
				url: url,
				para: para,
				cache: cache,
				callback: callback,
				type: type
			};
			this._states[name]=0;
			if(immd===false) return;	//2014.5.22
			this.ext.get(url,para,cache,function(data){
				try{
					_this._data[name]=callback?callback(data):data;
					_this._states[name]=1;
					_this.fireHandler(name);
				}catch(e){
				}
			},type);
		},
		"update": function(name){
			var _this=this;
			var para=this._paras[name];
			if(!para) return;
			if(this._states[name]!=1) return;
			this._data[name]="";
			//this._tasks[name]=[];
			this._states[name]=0;
			this.ext.get(para.url,para.para,false,function(data){
				try{
					_this._data[name]=para.callback?para.callback(data):data;
					_this._states[name]=1;
					_this.fireHandler(name);
				}catch(e){
				}
			},para.type);
		},
		"addHandler": function(name,handler){
			if(!this._tasks[name]) this._tasks[name]=[];
			this._tasks[name].push(handler);
			if(this._states[name]==1) this.fireHandler(name);
		},
		"fireHandler": function(name){
			var tasks=this._tasks[name];
			while(tasks.length>0&&this._states[name]==1){	//maybe executed update method in processing.
				try{tasks.shift()(name,this._data[name]);}catch(e){}
			}
		},
		"ext": {
			"getXMLHttpRequest": function () {
				var progId, progIds = ["MSXML2.XMLHTTP.6.0"
					, "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
				return function () {
					var flag=-1;
					if(progId){
						return new ActiveXObject(progId);
					}else if(window.location.host==""){
						flag=typeof(ActiveXObject)!="undefined"?0:1;
					}else if(typeof(XMLHttpRequest)!="undefined"){
						flag=1;
					}else if(typeof(ActiveXObject)!="undefined"){
						flag=0;
					}
					if(flag==1){
						return new XMLHttpRequest();
					}else{
						for (var i = 0; i < progIds.length; i++) {
							try	{
								return new ActiveXObject(progId = progIds[i]);
							} catch (ex) {
								progId = null;
							}
						}
					}
				};
			}(),
			"get": function(url,data,cache,callback,type){
				try{
					var _this=this;
					var xmlhttp=this.getXMLHttpRequest();
					cache=cache||cache==undefined;
					if(data) url+=(url.match(/\?/) ?"&":"?")+this.encodePRMT(data);
					xmlhttp.open("GET", url, !!callback);
					if(xmlhttp.overrideMimeType) xmlhttp.overrideMimeType("text/plain"); 
					if(!cache){
						xmlhttp.setRequestHeader("Pragma","no-cache");
						xmlhttp.setRequestHeader("If-Modified-Since","0");
					}
					xmlhttp.onreadystatechange=callback&&function(){
						if(xmlhttp.readyState == 4) {
							if(xmlhttp.status == 200) {
								try{callback(_this.format(xmlhttp,type));}catch(e){};
							}else if(xmlhttp.status == 0
								&&!xmlhttp.getAllResponseHeaders()){
								try{callback(_this.format(xmlhttp,type));}catch(e){};
							}else{
								callback();
							}
						}
					};
					xmlhttp.send(null);
					return callback?null:this.format(xmlhttp,type);
				}catch(ex){
				}
			},
			"format": function(xmlhttp,type){
				switch(type){
					case "text":
						return xmlhttp.responseText;
					case "json":
						return this.parseJSON(xmlhttp.responseText,2);
					default:
						return xmlhttp.responseText;
				}
			},
			"parseJSON": function(data$,opt$){
				try{
					if(!opt$||opt$==3){
						var func=new Function("return("+data$+");");
						return func&&func();
					}else if(opt$==2){
						return eval('('+ data$ +')');
					}else if(opt$==1){
						return (typeof JSON !== 'undefined' && typeof JSON.parse === 'function')
							? JSON.parse(data$) : eval('('+ data$ +')');
					}
				}catch(e){
				}
			},
			"encodePRMT": function(data){
				var values=[];
				for(var key in data){
					if(data.hasOwnProperty(key))
						values[values.length]=encodeURIComponent(key)+"="+encodeURIComponent(data[key].toString());
				}
				return values.join("&");
			}
		}
	});
	window[!window['$db']&&'$db'||'WEBDATA']=window[!window['webdata']&&'webdata'||'WEBDATA']=$;
})(window);