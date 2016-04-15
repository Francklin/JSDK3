/**
 * @file: SimpleView.class.js
 * @version: 2.6.1 beta
 * @since: JSDK3 V1.8.10
 * @support: IE6+, Firefox 5+, Chrome 14+, Safari 5+, Opera 11.11+
 * @author: liu denggao
 * @created: 2013.5.11
 * @modified: 2013.6.24
 * @updated: 
		2013.6.24 v2.5 -> v2.6
		2013.5.24 v2.0 -> v2.1
		2013.5.23 v1.2 -> v2.0
		2013.5.15 v1.1 -> v1.2
		2013.5.14 v1.0 -> v1.1
 * @mail: francklin.liu@gmail.com
 ***************************************/

$package("js.ui.view");

/**
 * SimpleView Class of public
 * @para oPara:
		{
			title: [String],
			columns: [Array],
			size: [Number],
			category: [String],
			pageNum: [Number],
			sortName: [String],
			sortSeq: [Number],
			search: {
				size: [Number],
				max: [Number],
				scope: [Variant]
			},
			target: [HTMLElement],
			data: [Object]
		}
 * @para fnGetData: 
		1)usage: fnGetData(sCategory,iStart,iCount,[sSortName],[iSortSeq])
		2)return: [allcount,rows]
 * @created: 2013.5.11
 * @modified: 2013.5.14
 */
js.ui.view.SimpleView=function(id,oTmpl,oPara,fnGetData){
	this._id="";
	this._name="";
	this._title="";
	this._size=20;
	this._columns=[];
	this._entries=[];
	this._data=null;
	this._count=0;
	this._allCount=0;
	this._pagesCount=1;
	this._currentPage=1;
	this._currentCategory="";
	this._currentSortName="";
	this._currentSortSeq=-1;		//-1,unsort; 0,ascending; 1, descending
	this._defaultSortSeq=-1;		//-1,unsort; 0,ascending; 1, descending
	this._isSearching=false;
	this._searchKey="";
	this._searchOptions={};
	this._defaultSearchOptions={};
	this._template=null;
	this._status=0;					//0,initializing; 1, initialized
	this._parent=null;
	this._target=null;
	this._startPos=null;
	this._endPos=null;
	this._interface={
		"getPageData": null
	}
	this._SimpleView(id,oTmpl,oPara,fnGetData);
}

var _$class = js.ui.view.SimpleView;

with(_$class){
	$name="SimpleView";
	$extends("Object");
	
	//:constructor----------
	
	prototype._SimpleView=function(id,oTmpl,oPara,fnGetData){
		oPara=oPara||{};
		this._id=id;
		this._template=oTmpl;
		this._title=oPara.title||"";
		this._size=oPara.size||20;
		this._columns=oPara.columns||[];
		this._currentCategory=oPara.category||"";
		this._currentSortName=oPara.sortName||"";
		this._currentSortSeq=this._defaultSortSeq=!oPara.sortName?-1:(oPara.sortSeq||0);
		this._defaultSearchOptions.size=Math.min(oPara.search&&oPara.search.size||this._size,100);
		this._defaultSearchOptions.max=Math.min(oPara.search&&oPara.search.max||100,1000);
		this._defaultSearchOptions.scope=oPara.search&&oPara.search.scope||"";
		this._target=this._parent=oPara.target;
		this._data=oPara.data;
		this._interface["getPageData"]=fnGetData;
		this._load();
		this._status=1;
		if(oPara.pageNum) this.goPage(oPara.pageNum);
		else if(oPara.pageNum==undefined) this.goFirstPage();
	}
	
	//:property-------------------------------------------
	
	prototype.getId=function(){
		return this._id;
	}
	prototype.getSize=function(){
		return this._size;
	}
	prototype.getCount=function(){
		return this._count;
	}
	prototype.getAllCount=function(){
		return this._allCount;
	}
	prototype.getPagesCount=function(){
		return this._pagesCount;
	}
	prototype.getCurrentPage=function(){
		return this._currentPage;
	}
	prototype.getCurrentCategory=function(){
		return this._currentCategory;
	}
	prototype.getCurrentSortName=function(){
		return this._currentSortName;
	}
	prototype.getCurrentSortSeq=function(){
		return this._currentSortSeq;
	}
	prototype.getIsSearching=function(){
		return this._isSearching;
	}
	prototype.getSearchKey=function(){
		return this._searchKey;
	}
	prototype.getSearchOptions=function(){
		return this._searchOptions;
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
	
	prototype.locateTo=function(sCategory){
		this._currentCategory=sCategory;
		this.fireEvent("_onCategoryChanged",sCategory);
		this._load();
		this.goFirstPage();
	}
	prototype.sortBy=function(sSortName,iSortSeq){
		if(this._currentSortSeq==-1){			
			this._currentSortSeq=iSortSeq||0;	
			this._currentSortName=sSortName;
		}else if(iSortSeq!=undefined){
			this._currentSortSeq=iSortSeq;
			this._currentSortName=sSortName;
		}else if(this._currentSortName!=sSortName){
			this._currentSortSeq=0;
			this._currentSortName=sSortName;
		}else if(this._defaultSortSeq!=-1){
			this._currentSortSeq=(this._currentSortSeq+1)%2;
		}else if(this._currentSortSeq==1){
			this._currentSortSeq=-1;
			this._currentSortName="";
		}else {
			this._currentSortSeq=(this._currentSortSeq+1)%2;
		}
		this.fireEvent("_onSortStateChanged");
		this.goPage(this._currentPage);
	}
	prototype.goPage=function(pageIndex){
		if(!pageIndex.isWithin(1,this._pagesCount)) return;
		var startItem=(pageIndex-1)*this._size+1;
		try{
			var data=this._interface.getPageData.call(this,this._currentCategory
						,startItem,this._size,this._currentSortName,this._currentSortSeq);
		}catch(e){
			alert("Loaded new page fail, please contact your system administrator! ");	//装载新页面出错！请联系系统管理员！
			var data=[0,[]];
		}
		this._goPage(pageIndex,data[1]||[]);
	}
	prototype._goPage=function(pageIndex,data){
		this._entries=data||[];
		this._currentPage=pageIndex;
		this._loadPage();
		this.fireEvent("_onPageChanged",pageIndex);
	}
	prototype._loadPage=function(){
		var code=this._template.parse({
			view: {
				id: this._id,
				title: this._title,
				columns: this._columns,
				entries: this._entries,
				data: this._data,
				size: this._size,
				allCount: this._allCount,
				pagesCount: this._pagesCount,
				currentPage: this._currentPage,
				currentCategory: this._currentCategory,
				currentSortName: this._currentSortName,
				currentSortSeq: this._currentSortSeq,
				isSearching: this._isSearching
			}
		});
		if(this._target){
			this._target.innerHTML=code;
		}else if(this._status==0){
			var script=Array.getLast(document.getElementsByTagName("SCRIPT"));
			this._parent=script.parentNode;	
			this._startPos=document.createElement("div");
			this._startPos.style.display="none";
			this._startPos.title="widgets-simpleview-start";
			this._endPos=document.createElement("div");
			this._endPos.style.display="none";
			this._endPos.title="widgets-simpleview-end";
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
	prototype.goFirstPage=function(){
		this.goPage(1);
	}
	//上一页
	prototype.goPrevPage=function(){
		if(this._currentPage-1<1) return(false);
		this.goPage(this._currentPage-1);
	}	
	//下一页
	prototype.goNextPage=function(){
		if(this._currentPage+1>this._pagesCount) return(false);
		this.goPage(this._currentPage+1);
	}	
	//转到尾页
	prototype.goLastPage=function(){
		this.goPage(this._pagesCount);
	}
	prototype._load=function(){
		this._isSearching=false;
		this._allCount=this._interface.getPageData.call(this,this._currentCategory,1,0,this._currentSortName,this._currentSortSeq)[0];
		this._pagesCount=this._allCount?Math.ceil(this._allCount/this._size):1;	
		this.fireEvent("_onLoaded");
	}
	prototype.refresh=function(){
		this._load();
		this.goFirstPage();
	}
	prototype.reload=function(pageNum){
		this._load();
		this.goPage(Math.min(this._pagesCount,pageNum||this._currentPage));
	}
	prototype.search=function(key,options){
		this._searchKey=key;
		this._isSearching=!!key;
		if(!key){
			this.reload(0);
		}else{
			var options1={
				size: options&&options.size||this._defaultSearchOptions.size,
				max: options&&options.max||this._defaultSearchOptions.max,
				scope: options&&options.scope||this._defaultSearchOptions.scope
			}
			this._searchOptions=options1;
			try{
				var data=this._interface.getPageData.call(this,this._currentCategory
							,1,options1.size,this._currentSortName,this._currentSortSeq);
			}catch(e){
				data=[0,[]];
			}
			this._allCount=data[0];
			this._pagesCount=this._allCount?Math.ceil(this._allCount/this._size):1;	
			this.fireEvent("_onLoaded");
			this.fireEvent("_onSearchFinished");
			this._goPage(1,data[1]);
		}
	}
	
	//:event-----------------
	
	prototype._onLoaded=function(){
		this.fireEvent("onLoaded");
	}	
	prototype._onPageChanged=function(iPageNum){
		this.fireEvent("onPageChanged",iPageNum);
	}
	prototype._onCategoryChanged=function(sCategory){
		this.fireEvent("onCategoryChanged",sCategory);
	}
	prototype._onSortStateChanged=function(){
		this.fireEvent("onSortStateChanged",[this._currentSortName,this._currentSortSeq]);
	}
	prototype._onSearchFinished=function(){
		this.fireEvent("onSearchFinished",this._searchKey);
	}
}

