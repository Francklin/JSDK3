/**
 * @author: liudenggao
 * @created: 2014.12.31
 * @modified: 2014.1.1
 */
var webloader={
	_data: {},
	_tasks: {},
	_states: {},
	"loadData": function(name,url,para,cache,callback,type){
		var _this=this;
		this._data[name]="";
		this._tasks[name]=[];
		this._states[name]=0;
		this.get(url,para,cache,function(data){
			try{
				_this._states[name]=1;
				_this._data[name]=data;
				callback&&callback(data);
				_this.fireHandler(name);
			}catch(e){
			}
		},type);
	},
	"getData": function(name){
		return this._data[name];
	},
	"addHandler": function(name,handler){
		this._tasks[name].push(handler);
		if(this._states[name]==1) this.fireHandler(name);
	},
	"fireHandler": function(name){
		var data=this._data[name],tasks=this._tasks[name];
		while(tasks.length>0){
			try{tasks.shift()(name,data);}catch(e){}
		}
	},
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
