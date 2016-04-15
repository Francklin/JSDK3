/**
 * @file: FileUploader.class.js
 * @version: 1.1 beta
 * @since: JSDK3 V1.8.10
 * @support: IE6+, IE9+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2013.8.26
 * @modified: 2013.8.27
 * @updated: 
 * @mail: francklin.liu@gmail.com
 ***************************************/

$package("js.ui.form");

/**
 * FileUploader Class of public
 * @para oForm:
 * @para oButton:
 * @para oPara:
		{
			controlName: String,
			pathSeparator: String,
			onAddedFileItem: [Function],	//onAddedFileItem(oItem)
			onRemovedFileItem: [Function],	//onRemovedFileItem(oItem)
			onValidateFile: [Function],		//onValidateFile(sFile)	
		}
 * @created: 2013.8.26
 * @modified: 2013.8.26-2013.8.30
 * @update:
		2013.8.30 集中化了本地化字符串
 */
js.ui.form.FileUploader=function(oForm,oButton,oPara){
	this._form=null;
	this._button=null;
	this._files=[];
	this._status=0;					//0,initializing; 1, initialized
	this._controlName="";
	this._pathSeparator="";
	this._allowSameName=false;
	this._allowMultiple=true;
	this.__count=0;
	this._FileUploader(oForm,oButton,oPara);
}

var _$class = js.ui.form.FileUploader;
_$class._localeResource={
	"onlyUploadSingle": "只能上傳單個文件！",
	"fileAlreadyExists": "文件\"{0}\"已存在，不能重複上傳！"	
}

with(_$class){
	$name="FileUploader";
	$extends("Object");
	
	//:constructor----------
	
	prototype._FileUploader=function(oForm,oButton,oPara){
		oPara=oPara||{};
		var _this=this;
		this._form=oForm;
		this._button=oButton;
		this._controlName=oPara.controlName;
		this._pathSeparator=oPara.pathSeparator||"\\";
		this._allowSameName=oPara.allowSameName||false;
		this._allowMultiple=oPara.allowMultiple||oPara.allowMultiple==undefined;
		if(oPara.onAddedFileItem) this.addEventListener("onAddedFileItem",oPara.onAddedFileItem);
		if(oPara.onRemovedFileItem) this.addEventListener("onRemovedFileItem",oPara.onRemovedFileItem);
		if(oPara.onValidateFile) this.addEventListener("onValidateFile",oPara.onValidateFile);
		with(this._iframe=this._form.appendChild(document.createElement("iframe"))){
			style.width="0";
			style.height="0";
			style.display="none";
			contentWindow.appObj=this;
			onreadystatechange=function(){
				if(this.readyState!="complete") return;
				_this._status=1;
				with(this.contentWindow.document){
					with(body){
						var el=document.createElement("input");
						with(appendChild(el)){
							(parentWindow.eval||parentWindow.execScript)("var handler=("+_btnAddFile_onClick.toString()+");");
							onclick=parentWindow.handler;
							click();
						}
					}			
				}
			}
			onload=function(){
				if(_this._status==1) return;
				_this._status=1;
				with(this.contentWindow.document){
					with(body){
						var el=document.createElement("input");
						el.onclick=_btnAddFile_onClick;
						appendChild(el).click();
					}				
				}
			}
		}
		if(this._status==0&&Global.Browser.Engine.webkit) this._iframe.onload();
		function _btnAddFile_onClick(){
			var window=this.ownerDocument.parentWindow||this.ownerDocument.defaultView;
			var document=this.ownerDocument;
			var appObj=window.appObj;
			appObj._button.onclick=function(){
				var elFile=appObj._addFileUploader();
				elFile.onchange=function(){
					if(this.value==""){
						this.parentNode.removeChild(elFile);
						return null;
					}else{
						return appObj._addFileItem(elFile);
					}
				}
				elFile.click();
			}
		}
	}
	
	//:property-------------------------------------------
	
	prototype.getCount=function(){
		return this._files.length;
	}
	prototype.getPathSeparator=function(){
		return this._pathSeparator;
	}

	//:method-----------------
	
	prototype._addFileItem=function(elFile){
		if(!this._allowMultiple){
			alert(this._getLocale("onlyUploadSingle"));
			elFile.parentNode.removeChild(elFile);
			return;
		}else if(!this.fireEvent("_onValidateFile",elFile.value)){
			elFile.parentNode.removeChild(elFile);
			return;
		}
		this._files[this._files.length]=new (this.getClass().FileItem)(this,elFile);
		this.fireEvent("_onAddedFileItem",this._files.getLast());
	}
	prototype._addFileUploader=function(){
		var el=document.createElement("input");
		el.type="file";
		el.name=this._controlName;
		el.style.display="none";
		return this._form.appendChild(el);
	}
	prototype.getFileItem=function(index){
		return this._files[index];
	}
	prototype.getFileItemById=function(id){
		return this._files.getFirst(function(file){
			return file.getId()==id;
		});
	}
	prototype.getFileItemByName=function(name){
		return this._files.getFirst(function(file){
			return file.getName().toLowerCase()==name.toLowerCase();
		});
	}
	prototype._getLocale=function(key,value){
		var strObj=Global.Object(this.getClass()._localeResource[key]);
		return strObj.format.apply(strObj,Global.js.lang.natives.Array.from(arguments).slice(1)).valueOf();
	}
	
	//:event-----------------
	
	prototype._onAddedFileItem=function(oItem){
		this.fireEvent("onAddedFileItem",oItem);
	}
	prototype._onRemovedFile=function(oItem){
		this._files.earse(oItem);
		this.fireEvent("onRemovedFileItem",oItem);
	}
	prototype._onValidateFile=function(sFile){
		var sName=sFile.word(this.getPathSeparator(),-1);
		if(!this._allowRepeat){
			if(this._files.some(function(file){
				return file.getName().toLowerCase()==sName.toLowerCase();
			})){
				alert(this._getLocale("fileAlreadyExists",sName));
				return false;
			}
		}
		if(this.hasEvent("onValidateFile")) return this.fireEvent("onValidateFile",sFile);
		return true;
	}	
}

_$class.FileItem=function(parent,file){
	this._parent=null;
	this._id="";
	this._name="";
	this._path="";
	this._file=null;
	this._FileItem(parent,file);
}
with(_$class.FileItem){
	$name="FileItem";
	$extends("Object");
	
	//:constructor----------
	
	prototype._FileItem=function(parent,file){
		this._parent=parent;
		this._id=""+(++parent.__count);
		this._name=file.value.word(parent.getPathSeparator(),-1);
		this._path=file.value;
		this._file=file;
	}
	
	//:property-------------
	
	prototype.getId=function(){
		return this._id;
	}
	prototype.getName=function(){
		return this._name;
	}
	prototype.getPath=function(){
		return this._path;
	}
	prototype.getParent=function(){
		return this._parent;
	}
	
	//:method---------------
	
	prototype.remove=function(){
		this._parent.fireEvent("_onRemovedFileItem",this);
	}
}
