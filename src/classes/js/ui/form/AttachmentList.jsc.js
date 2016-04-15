/**
 * @file: AttachmentList.class.js
 * @version: 0.6 beta
 * @since: JSDK3 V1.8.10
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2013.7.1
 * @modified: 2013.7.3
 * @update:
		v0.5.1 -> v0.6
		2013.8.30 集中化了本地化字符串
 * @mail: francklin.liu@gmail.com
 ***************************************/

$package("js.ui.form");
$import("js.dom.HTMLEncoder");

/**
 * AttachmentList Class of public
 * @para id:
 * @para oTmpl:
 * @para oPara:
		{
			title: [String],
			columns: [Array],
			baseUrl: [String],
			editMode: [Number],			//0,只读模式；1,编辑模式
			embedMode: [Number],		//0,附件直接管理模式; 1,表单嵌入模式(对原附件的操作都将被挂起)
			onlySingle: [Boolean],
			data: [Object],				//额外数据	
			canAdd: [Boolean],
			canUpdate: [Boolean],
			canOpen: [Boolean],
			canDownload: [Boolean],
			canDelete: [Boolean],	
			allowExtName: [String],		//separator is ';', example: "txt;jpg;"
			uploadFile: Function,		//uploadFile(isMultiple,callback(data))
			openFile: [Function], 		//openFile(file)
			downFile: [Function],		//downFile(file)
			delFile: [Function],		//delFile(file)
			getOpenFileUrl: [Function], //getOpenFileUrl(file)
			getDownFileUrl: [Function], //getDownFileUrl(file)
			getDelFileUrl: [Function], 	//getDelFileUrl(file)	
			onValidateName: [Function],	//onValidateName(name)		
			onOpenError: [Function],	//onOpenError(file,error)
			onDownError: [Function],	//onDownError(file,error)
			onDelError: [Function],		//onDelError(file,error)
			target: [HTMLElement]
		}
 * @para data:
		[
			{
				id: String,
				name: String,
				title: [String],
				descrition: [String],
				size: [Number],
				user: [String],
				time: [Date],
				data: [Object],
				openUrl: [String],
				downUrl: [String],
				delUrl: [String]
			}
		]
 * @created: 2013.7.2
 * @modified: 2013.7.2
 */
js.ui.form.AttachmentList=function(id,oTmpl,oPara,data){
	this._id="";
	this._name="";
	this._title="";
	this._editMode=0;
	this._embedMode=0;
	this._columns=[];
	this._files=[];
	this._baseUrl="";
	this._data=null;
	this._status=0;					//0,initializing; 1, initialized
	this._onlySingle=false;
	this._canAdd=true;
	this._canUpdate=true;
	this._canOpen=true;
	this._canDownload=true;
	this._canDelete=true;
	this._allowExtName=[];
	this._parent=null;
	this._template=null;
	this._target=null;
	this._startPos=null;
	this._endPos=null;
	this._interface={};
	this._events={};
	this._AttachmentList(id,oTmpl,oPara,data);
}

var _$class = js.ui.form.AttachmentList;
_$class._localeResource={
	"onlyUploadSingle": "只能上传单个文件！",
	"fileAlreadyExists": "文件\"{0}\"已存在，不能重复上传！",
	"notAllowUploadOtherTypeFile": "不允许上传类型为\"{0}\"之外的文件！",
	"mustUpdateSameFileName": "您要更新的文件名必须与新文件名相等！"
}

with(_$class){
	$name="AttachmentList";
	$extends("Object");
	
	//:constructor----------
	
	prototype._AttachmentList=function(id,oTmpl,oPara,data){
		oPara=oPara||{};
		this._id=id;
		this._template=oTmpl;
		this._title=oPara.title||"";
		this._columns=oPara.columns||[];
		this._baseUrl=oPara.baseUrl||"";
		this._editMode=oPara.editMode||0;
		this._embedMode=oPara.embedMode||0;
		this._onlySingle=oPara.onlySingle||false;
		this._canAdd=oPara.canAdd||oPara.canAdd==undefined;
		this._canUpdate=oPara.canUpdate||oPara.canUpdate==undefined;
		this._canOpen=oPara.canOpen||oPara.canOpen==undefined;
		this._canDownload=oPara.canDownload||oPara.canDownload==undefined;
		this._canDelete=oPara.canDelete||oPara.canDelete==undefined;
		this._allowExtName=(oPara.allowExtName||"").split(";").trim();
		this._interface["uploadFile"]=oPara.uploadFile;
		this._interface["openFile"]=oPara.openFile;
		this._interface["downFile"]=oPara.downFile;
		this._interface["delFile"]=oPara.delFile;
		this._interface["getOpenFileUrl"]=oPara.getOpenFileUrl;
		this._interface["getDownFileUrl"]=oPara.getDownFileUrl;
		this._interface["getDelFileUrl"]=oPara.getDelFileUrl;	
		this._events["onValidateName"]=oPara.onValidateName;		
		this._events["onOpenError"]=oPara.onOpenError;
		this._events["onDownError"]=oPara.onDownError;
		this._events["onDelError"]=oPara.onDelError;
		if(oPara.onBuild) this.addEventListener("onBuild",oPara.onBuild);
		if(oPara.onAddFile) this.addEventListener("onBuild",oPara.onBuild);
		if(oPara.onOpenFile) this.addEventListener("onBuild",oPara.onBuild);
		if(oPara.onDownFile) this.addEventListener("onBuild",oPara.onBuild);
		if(oPara.onUpdateFile) this.addEventListener("onBuild",oPara.onBuild);
		if(oPara.onDelFile) this.addEventListener("onBuild",oPara.onBuild);
		if(oPara.onRefresh) this.addEventListener("onRefresh",oPara.onRefresh);
		this._data=oPara.data;
		this._target=this._parent=oPara.target;
		if(data){
			this.addFiles(data);
			this.build();
		}
	}
	
	//:property-------------------------------------------
	
	prototype.getId=function(){
		return this._id;
	}
	prototype.getEditMode=function(){
		return this._editMode;
	}
	prototype.getEmbedMode=function(){
		return this._embedMode;
	}
	prototype.getSize=function(){
		return this._files.eval(function(sizes,size){
			return sizes+size;
		});
	}
	prototype.getCount=function(){
		return this._files.length;
	}
	prototype.getOnlySingle=function(){
		return this._onlySingle;
	}
	prototype.getBaseUrl=function(){
		return this._baseUrl;
	}
	prototype.getData=function(){
		return this._data;
	}
	prototype.setData=function(data){
		this._data=data;
	}
	prototype.getTemplate=function(){
		return this._template;
	}
	
	//:method-----------------
	
	/**
	 * @para data:
			{
				id: String,
				name: String,
				title: [String],
				descrition: [String],
				size: [Number],
				time: [Date],
				data: [Object],
				openUrl: [String],
				downUrl: [String],
				delUrl: [String]
			}
	 * @created: 2013.7.2
	 * @modified: 2013.7.3
	 */
	prototype.addFile=function(data,callback){
		var _this=this;
		var flag=this._onlySingle&&this._files.some(function(file){
			return !file.isDeleted;
		});
		if(this._status==0){
			if(flag||!data){
				if(callback) callback(0);
				return false;
			}
			this._addFile(data);
		}else if(this._editMode==0){
			if(callback) callback(0);
			return false;
		}else if(flag){
			alert(this._getLocale("onlyUploadSingle"));
			if(callback) callback(0);
			return false;
		}else{
			this._interface["uploadFile"](false,function(data1){
				if(!Global.isArray(data1)){
					//none
				}else if(data1.length){
					data1=data1.getFirst();
				}else{
					if(callback) callback(0);
					return;
				}
				var data2=_this._addFile(data1);
				_this.fireEvent("_onAddFile",data1);
				if(callback) callback(1,data2);
			});
			return true;
		}
	}
	prototype._addFile=function(data,index){
		if(!data) return;
		var data1={
			id: data.id||data.name||"",
			name: data.name||"",
			title: data.title||"",
			description: data.description||"",
			size: data.size||0,
			user: data.user||"",
			time: data.time,			
			data: data.data||"",
			openUrl: data.openUrl||"",
			downUrl: data.downUrl||"",
			delUrl: data.delUrl||""			
		}
		if(this._status==0){
			if(this._embedMode==1) data1.isNew=false;
		}else{
			if(!this.validateFileName(data1.name)) return;
			if(this._embedMode==1) data1.isNew=true;
		}
		if(index==undefined) this._files.push(data1);
		else this._files.insert(data1,index);
		return data1;
	}
	/**
	 * @created: 2013.7.2
	 */
	prototype.addFiles=function(data,callback){
		var _this=this;
		var flag=this._onlySingle&&this._files.some(function(file){
			return !file.isDeleted;
		});
		if(this._status==0){
			this._addFiles(this._onlySingle?data.slice(0,1):data);
			if(callback) callback(1);
		}else if(this._editMode==0){
			if(callback) callback(0);
			return false;
		}else if(flag){
			alert(this._getLocale("onlyUploadSingle"));
			if(callback) callback(0);
			return false;
		}else{
			this._interface["uploadFile"](!this._onlySingle,function(data1){
				if(!data1){
					if(callback) callback(0);
					return;
				}else if(!Global.isArray(data1)){
					_this._addFiles([data1]);
				}else if(_this._onlySingle){
					_this._addFiles(data1.slice(0,1));
				}else{
					_this._addFiles(data1);
				}
				if(callback) callback();
			});
			return true;
		}
	}
	prototype._addFiles=function(data){
		data.forEach(function(file){
			this._addFile(file);
			if(this._status==1) this.fireEvent("_onAddFile",file);
		},this);
	}
	prototype.getFile=function(index){
		return this._files[index];
	}
	prototype.getFileById=function(id){
		return this._files.getFirst(function(file){
			return file.id==id&&!file.isDeleted;
		});
	}
	prototype.getFileByName=function(name){
		return this._files.getFirst(function(file){
			return file.name.toLowerCase()==name.toLowerCase()&&!file.isDeleted;
		});
	}
	prototype.getFileUrl=function(file,vType){
		switch(vType){
			case "open":
				if(file.openUrl.slice(0,10).indexOf("://")>0){
					return file.openUrl;
				}else if(this._interface["getOpenFileUrl"]){
					return this._interface["getOpenFileUrl"](file);
				}else{
					return [this._baseUrl,file.openUrl].join("/");
				}
				break;
			case "download":
				if(file.downUrl.slice(0,10).indexOf("://")>0){
					return file.downUrl;
				}else if(this._interface["getDownFileUrl"]){
					return this._interface["getDownFileUrl"](file);
				}else{
					return [this._baseUrl,file.downUrl].join("/");
				}			
				break;
			case "delete":
				if(file.delUrl.slice(0,10).indexOf("://")>0){
					return file.delUrl;
				}else if(this._interface["getDelFileUrl"]){
					return this._interface["getDelFileUrl"](file);
				}else{
					return [this._baseUrl,file.delUrl].join("/");
				}				
				break;
		}
	}
	prototype.getFirstValidFile=function(){
		return this._files.getFirst(function(file){
			return !file.isDeleted;
		});
	}
	prototype.getAllFiles=function(){
		return this._files;
	}
	prototype.getAllValidFiles=function(){
		return this._files.filter(function(file){
			return !file.isDeleted;
		});
	}
	prototype.getAllChangedFiles=function(){
		if(!this._embedMode) return [];
		return this._files.filter(function(file){
			return file.isNew||file.isUpdated||file.isDeleted;
		});
	}
	prototype.getAllNewFiles=function(){
		if(!this._embedMode) return [];
		return this._files.filter(function(file){
			return file.isNew;
		});
	}
	/**
	 * for future
	 */
	prototype.getAllFilesToUpdate=function(){
		if(!this._embedMode) return [];
		return this._files.filter(function(file){
			return !file.isNew&&!file.isDeleted&&file.isUpdated;
		});
	}
	prototype.getAllFilesToDelete=function(){
		if(!this._embedMode) return [];
		return this._files.filter(function(file){
			return file.isDeleted;
		});
	}
	prototype.isExsitFileName=function(name){
		return this._files.some(function(file){
			return file.name.toLowerCase()==name.toLowerCase()&&!file.isDeleted;
		});
	}
	prototype.validateFileName=function(name){
		//校验文件扩展名
		if(this._allowExtName.length){
			if(!this._allowExtName.some(function(extName){
				return name.toLowerCase().rightBack(".")==extName;
			})){
				alert(this._getLocale("notAllowUploadOtherTypeFile",this._allowExtName.join(";")));
				return false;
			}
		}
		//检测文件名唯一性
		if(this.isExsitFileName(name)){
			alert(this._getLocale("fileAlreadyExists",name));
			return false;
		}
		//用户自定义文件名校验
		if(this._events["onValidateName"]){
			return this._events["onValidateName"](name);
		}
		return true;
	}
	prototype.openFile=function(id){
		var file=this.getFileById(id);
		if(!file) return;
		var file1={
			id: file.id,
			name: file.name,
			title: file.title,
			data: file.data,
			openUrl: this.getFileUrl(file,"open")
		}
		if(this._interface["openFile"]){		
			this._interface["openFile"].call(this,file1);
		}else{
			window.open(file1.openUrl);
		}
		this.fireEvent("_onOpenFile",file1);
	}
	/** 
	 * @created: 2013.7.2
	 */
	prototype.downFile=function(id){
		var file=this.getFileById(id);
		if(!file) return;
		var file1={
			id: file.id,
			name: file.name,
			title: file.title,
			data: file.data,
			downUrl: this.getFileUrl(file,"download")
		}
		if(this._interface["downFile"]){
			this._interface["downFile"].call(this,file1);
		}else{
			this._downloadFile(file1,this._events["onDownError"]);
		}
		this.fireEvent("_onDownFile",file1);
	}
	/**
	 * @para fnError: function for printing error
	 * @created: 2013.7.2
	 */
	prototype._downloadFile=function(sUrl,oPara,fnError){
		var htmlPara=[];
		for(var key in oPara){
			if(oPara.hasOwnProperty(key)){
				htmlPara.push("<input type=text name=\""+HTMLEncoder.encodeNodeAttrib(key)
				+"\" value=\""+HTMLEncoder.encodeNodeAttrib(oPara[key])+"\">");
			}
		}
		with(window.document.body.appendChild(document.createElement("iframe"))){
			style.display="none";
			onreadystatechange=function(){
				switch(this.readyState){
					case "interactive":
						if(typeof(this.contentWindow.document)=="object"){
							if(contentWindow.document.documentElement){
								//有内容，表示下载有错误，不会给出下载提示
							}else{
								//没有内容，表示正在下载，立刻会给出下载提示
							}
						}else{
							//打开错误
						}
						this.parentNode.removeChild(this);
						break
					case "complete":
						//没有下载，则给出错误提示
						if(typeof(fnError)=="function") fnError();
						break;
				}
			}
			with(contentWindow.document){
				with(body||appendChild(createElement("body"))){
					charset="utf-8";
					with(appendChild(createElement("form"))){
						method="post";
						action=sUrl;
						target="_self";
						with(appendChild(createElement("div"))){
							innerHTML=htmlPara.join("");
						}
						submit();
					}
				}
			}
		}	
	}
	/** 
	 * @created: 2013.7.4
	 */
	prototype.updateFile=function(id,callback){
		var _this=this;
		var file=this.getFileById(id);
		if(!file){
			if(callback) callback(0);
			return false;
		}
		if(this._status==0){
			if(callback) callback(0);
			return false;
		}else if(this._editMode==0){
			if(callback) callback(0);
			return false;
		}else if(file.isNew){
			if(callback) callback(0);
			return false;
		}else{
			this._interface["uploadFile"](false,function(data1){
				if(!Global.isArray(data1)){
					//none
				}else if(data1.length){
					data1=data1.getFirst();
				}else{
					if(callback) callback(0);
					return;
				}
				if(file.name.toLowerCase()!=data1.name.toLowerCase()){
					alert(this._getLocale("mustUpdateSameFileName"));
					if(callback) callback(0);
					return;
				}
				_this._updateFile(data1,file);
				_this.fireEvent("_onUpdateFile",data1);
			});
		}
	}
	prototype._updateFile=function(newData,oldData){
		if(!newData) return;
		if(newData.size) oldData.size=newData.size;
		if(newData.user) oldData.user=newData.user;
		if(newData.time) oldData.time=newData.time;
		if(newData.openUrl) oldData.openUrl=newData.openUrl;
		if(newData.downUrl) oldData.downUrl=newData.downUrl;
		if(newData.delUrl) oldData.delUrl=newData.delUrl;
		return oldData;
	}
	/** 
	 * @created: 2013.7.4
	 * @modified: 2013.7.5
	 */
	prototype.replaceFile=function(id,callback){
		var _this=this;
		if(this._status==0){
			if(callback) callback(0);
			return false;
		}else if(this._editMode==0){
			if(callback) callback(0);
			return false;
		}else{
			this._interface["uploadFile"](false,function(data1){
				if(!data1){
					if(callback) callback(0);
					return;
				}else if(!Global.isArray(data1)){
					//none
				}else if(data1.length){
					data1=data1.getFirst();
				}else{
					if(callback) callback(0);
					return;
				}
				var data2=_this._replaceFile(data1,id);
				if(data2) _this.fireEvent("_onAddFile",data1);
				if(data2&&callback) callback(1,data2);
				else if(callback) callback(0);
			});
			return true;
		}
	}
	/** 
	 * @created: 2013.7.4
	 */
	prototype._replaceFile=function(newData,vOldData){
		var oldData,index=-1;
		if(!vOldData){
			//none---
		}else if(typeof(vOldData)=="string"){
			var id=vOldData;
			for(var i=0;i<this._files.length;i++){
				var file=this._files[i];
				if(file.id==id&&!file.isDeleted){
					index=i;
					oldData=file;
					break;
				}
			}
		}else{
			oldData=vOldData;
		}
		if(index==-1){
			return this._addFile(newData);
		}else if(oldData.isNew){
			var newData1=this._addFile(newData,index+1);
			if(newData1) this.delFile(oldData.id);
			return newData1;
		}else{
			var newData1=this._addFile(newData,index+1);
			if(newData1) this.delFile(oldData.id);
			return newData1;
		}
	}
	/** 
	 * @created: 2013.7.2
	 */	
	prototype.delFile=function(id){
		var file=this.getFileById(id);
		if(!file||file.isDeleted) return;
		if(this._editMode==0) return;
		var file1={
			id: file.id,
			name: file.name,
			title: file.title,
			data: file.data,
			delUrl: this.getFileUrl(file,"delete")
		}
		if(this._embedMode==0||file.isNew){
			this._files.erase(file);
			if(this._interface["delFile"]){
				this._interface["delFile"].call(this,file1);
			}else if(file1.delUrl){
				Global.get(file1.delUrl,"",false,"","text");
			}
		}else{
			file.isDeleted=true;
		}
		this.fireEvent("_onDelFile",file1);
	}
	prototype.build=function(){
		if(this._status==1) return;
		this._buildPage();
		this._status=1;
		this.fireEvent("_onBuild");
		this.fireEvent("_onRefresh");
	}
	prototype._buildPage=function(){
		var code=this._template.parse({
			app: this,
			data: {
				id: this._id,
				name: this._name,
				title: this._title,
				editMode: this._editMode,
				embedMode: this._embedMode,
				columns: this._columns,
				files: this.getAllValidFiles(),
				size: this.getSize(),
				count: this._files.length,
				data: this._data,
				onlySingle: this._onlySingle,
				canAdd: this._canAdd,
				canUpdate: this._canUpdate,
				canOpen: this._canOpen,
				canDownload: this._canDownload,
				canDelete: this._canDelete
			}
		});
		if(this._target){
			this._target.innerHTML=code;
		}else if(this._status==0){
			var script=Array.getLast(document.getElementsByTagName("SCRIPT"));
			this._parent=script.parentNode;	
			this._startPos=document.createElement("div");
			this._startPos.style.display="none";
			this._startPos.title="widgets-attachmentlist-start";
			this._endPos=document.createElement("div");
			this._endPos.style.display="none";
			this._endPos.title="widgets-attachmentlist-end";
			script.insertAdjacentElement("beforeBegin",this._startPos);
			script.insertAdjacentHTML("beforeBegin",code);
			script.insertAdjacentElement("beforeBegin",this._endPos);
		}else if(this._endPos){
			for(var i=3,node;i>=0;i--){
				node=this._endPos.previousSibling;
				if(node==this._startPos) break;
				this._parent.removeChild(node);
			}
			this._endPos.insertAdjacentHTML("beforeBegin",code);
		}
	}	
	prototype.refresh=function(){
		this._buildPage();
		this.fireEvent("_onRefresh");
	}
	prototype._getLocale=function(key,value){
		var strObj=Global.Object(this.getClass()._localeResource[key]);
		return strObj.format.apply(strObj,Global.js.lang.natives.Array.from(arguments).slice(1)).valueOf();
	}	
	
	//:event-----------------
	
	prototype._onAddFile=function(file){
		this.fireEvent("onAddFile",file);
	}
	prototype._onOpenFile=function(file){
		this.fireEvent("onOpenFile",file);
	}
	prototype._onDownFile=function(file){
		this.fireEvent("onDownFile",file);
	}
	prototype._onUpdateFile=function(file){
		this.fireEvent("onUpdateFile",file);
	}	
	prototype._onDelFile=function(file){
		this.fireEvent("onDelFile",file);
	}
	prototype._onBuild=function(){
		this.fireEvent("onBuild");
	}
	prototype._onRefresh=function(){
		this.fireEvent("onRefresh");
	}
}

