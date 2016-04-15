/**
 * @file: TableData.class.js
 * @version: V1.2 beta
 * @description: 表格数据，用于解析生成HTML表格，支持横向和纵向排列，并能相互嵌套。
 *			当为完全内嵌块或按另一种方式排列的块区域时，此区域块是独立的，不与外边的表格单元相互融合。
 * @since: JSDK3 V1.8.1
 * @support: all browser
 * @author: liu denggao
 * @created: 2012.3.27
 * @modified: 2012.4.4-2014.2.28
 * @log: 
		2014.2.28 修复了最大行数计算错误和修复的问题
 * @mail: francklin.liu@gmail.com 
 * @homepage: http://www.tringsoft.com
 ***************************************/

$package("js.ui.data");

/**
 * Table Class of public
 * @para data: TableData type
 * @created: 2012.3.27
 * @modified: 2012.3.27
 */
js.ui.data.TableData=function(rowCount,colCount,data){
	this._rowCount=0;
	this._colCount=0;
	this._actualRowCount=-1;
	this._actualColCount=-1;
	this._origData=null;
	this._data=null;
	this._attribsMap={
		"table": {
			"id": "id",
			"className": "class",
			"width": "width",
			"height": "height",
			"cellspacing": "cellspacing",
			"cellpadding": "cellpadding",
			"align": "align",
			"border": "border",
			"bordercolor":"bordercolor",
			"frame": "frame",
			"rules": "rules",
			"style": "style"
		},
		"thead": {
			"className": "class",
			"style": "style"
		},
		"tbody": {
			"className": "class",
			"style": "style"
		},
		"tfoot":{
			"className": "class",
			"style": "style"
		},
		"tr": {
			"className": "class",
			"style": "style"
		},
		"td": {
			"className": "class",
			"rowspan": "rowspan",	//如果为-1,则表示跨行到底
			"colspan": "colspan",	//如果为-1,则表示跨列到末
			"style": "style"
		}
	}
	this._tagsMap={			//针对行列区块的属性组合
		"table": "table",
		"range": "tbody",
		"row": "tr",		//视情况而定，如果是局部范围，则是“td”
		"column": "td"
	}
	this._rangeTagsGroup={	//针对行列区块的布局类型
		"root": ["table","row","column"],	//针对根数据块
		"rows": ["range","row","column"],	//针对全行(行左右到顶)的行区块
		"columns": ["row","column"],		//针对全列(列上下到顶)的列区块
		"part": ["row","column"]			//针对完全的内嵌区块
	}
	this._TableData(rowCount,colCount,data);
}

var _$class = js.ui.data.TableData;
var _$proto = _$class.prototype;

with(_$class){
	$name="TableData";
	$extends("Object");
	
	//:constructor--------------------------------------------

	prototype._TableData=function(rowCount,colCount,data){
		this._rowCount=rowCount||0;
		this._colCount=colCount||0;
		this._origData=data;
		if(!data){
			this._data={
				arrangeMode: "row",
				data: []
			}
		}else {
			this._data={
				arrangeMode: "row",
				attribs: {},
				data: []
			}
			if(!Global.is(data,"Object")){
				this.addRowRange(data);
			}else {
				if(data.id) this._data.id=id;
				if(data.attribs) this._data.attribs=this._makeRangeAttribsByType("root",data.attribs);
				if((data.arrangeMode||"row")=="row"){
					this._data.arrangeMode="row";
					this.addRowRange(data.data);
				}else if(data.arrangeMode=="column"){
					this._data.arrangeMode="column";
					this.addColumnRange(data.data);
				}
			}
		}
	}

	//:property--------------------------------------------
	
	prototype.getRowCount=function(){
		return this._rowCount;
	}
	prototype.getColumnCount=function(){
		return this._columnCount;
	}
	prototype.getActualRowCount=function(){
		return this._actualRowCount;
	}
	prototype.getActualColumnCount=function(){
		return this._actualColCount;
	}
	prototype.getAttribsMap=function(){
		return this._attribsMap;
	}
	prototype.getTagsMap=function(){
		return this._tagsMap;
	}
	prototype.getRangeTagsGroup=function(){
		return this._rangeTagsGroup;
	}
	prototype.getData=function(){
		return this._data;
	}
	
	//:method--------------------------------------------
	
	prototype.addRowRange=function(data){
		if(this._data.arrangeMode!="row") return;
		this.insertRowRange(this._data.data,data,true);
	}
	/**
	 * @para isRootRow: 是否顶级行
	 */
	prototype.insertRowRange=function(target,data,isRootRow){
		for(var i=0;i<data.length;i++){
			var row=data[i];
			if(Global.isArray(row)){
				this.insertRow(target,row);
			}else {
				switch(row.arrangeMode||"row"){
					case "row":
						var innerRows=target[target.length]={
							arrangeMode: "row",
							isHeader: !!row.isHeader,
							attribs: this._makeRangeAttribsByType(isRootRow?"rows":"part",row.attribs),
							data: []
						};
						this.insertRowRange(innerRows.data,row.data,isRootRow);
						break;
					case "column":
						var innerColumns=target[target.length]={
							arrangeMode: "column",
							isHeader: !!row.isHeader,
							attribs: this._makeRangeAttribsByType("part",row.attribs),
							data: []
						};
						this.insertColumnRange(innerColumns.data,row.data,false);
						break;
				}
			}
		}
	}
	prototype.addColumnRange=function(data){
		if(this._data.arrangeMode!="column") return;
		this.insertColumnRange(this._data.data,data,true);
	}
	/**
	 * @para isRootColumn: 是否顶级列
	 */	
	prototype.insertColumnRange=function(target,data,isRootColumn){
		for(var i=0;i<data.length;i++){
			var column=data[i];
			if(Global.isArray(column)){
				this.insertColumn(target,column);
			}else {
				switch(column.arrangeMode||"column"){
					case "row":
						var innerRows=target[target.length]={
							arrangeMode: "row",
							attribs: this._makeRangeAttribsByType("part",column.attribs),
							data: []
						}; 
						this.insertRowRange(innerRows.data,column.data,false);
						break;
					case "column":
						var innerColumns=target[target.length]={
							arrangeMode: "column",
							attribs: this._makeRangeAttribsByType(isRootColumn?"columns":"part",column.attribs),
							data: []
						};
						this.insertColumnRange(innerColumns.data,column.data,isRootColumn);
						break;
				}
			}
		}
	}
	prototype._makeRangeAttribsByType=function(type,attribs){
		var tags=this._rangeTagsGroup[type];
		var attribs1={};
		for(var i=0;i<tags.length;i++){
			var tag=tags[i],actualTag=this._tagsMap[tag];
			if(attribs&&attribs[tag]){
				attribs1[tag]={};
				var attribsMap1=this._attribsMap[actualTag];
				for(var key in attribsMap1){
					if(attribsMap1.hasOwnProperty(key)){
						attribs1[tag][key]=attribs[tag][key];
					}
				}

			}
		}
		return attribs1;
	}
	prototype.addRow=function(data){
		if(this._data.arrangeMode!="row") return;
		this.insertRow(this._data.data,data);
	}
	prototype.insertRow=function(target,data){
		var cells=[];
		for(var i=0;i<data.length;i++){
			this.insertCell(cells,data[i]);
		}
		target.push(cells);
	}
	prototype.addColumn=function(data){
		if(this._data.arrangeMode!="column") return;
		this.insertColumn(this._data.data,data);
	}
	prototype.insertColumn=function(target,data){
		var cells=[];
		for(var i=0;i<data.length;i++){
			this.insertCell(cells,data[i]);
		} 
		target.push(cells);
	}
	prototype.insertCell=function(target,vData){
		if(typeof(vData)!="object"){
			target.push(vData);
		}else{
			var attribs=target[target.length]={
				text: vData.text||"",
				data: vData.data,
				isHeader: !!vData.isHeader
			};
			var attribsMap=this._attribsMap["td"];
			for(var key in attribsMap){
				if(attribsMap.hasOwnProperty(key)){
					attribs[key]=vData[key];
				}
			}
		}
	}
	/**
	 * @status: finished
	 * @created: 2012.3.29
	 */
	prototype.defineTagAttrib=function(tag,attrib,tagAttrib){
		if(!this._attribsMap[tag]) return;
		if(this._attribsMap[tag][attrib]) return;
		this._attribsMap[tag][attrib]=tagAttrib;
	}
	prototype.fix=function(){
		if(!Global.is(this._data,"Object")){
			var sizeDatas=this._getRowRangeSizeData(this._data);
			this._actualRowCount=sizeDatas[1];
			this._actualColCount=sizeDatas[2];
			this._fixRowRange(this._data,sizeDatas,sizeDatas[1],sizeDatas[2]);
		}else if(this._data.arrangeMode=="row"){
			var sizeDatas=this._getRowRangeSizeData(this._data);
			this._actualRowCount=sizeDatas[1];
			this._actualColCount=sizeDatas[2];
			this._fixRowRange(this._data,sizeDatas,sizeDatas[1],sizeDatas[2]);
		}else if(this._data.arrangeMode=="column"){
			var sizeDatas=this._getColumnRangeSizeData(this._data);
			this._actualRowCount=sizeDatas[2];
			this._actualColCount=sizeDatas[1];
			this._fixColumnRange(this._data,sizeDatas,sizeDatas[1],sizeDatas[2]);
		}
		return this;
	}
	/**
	 * @para vData:
	 * @para sizeData: contains 'sizeData', 'maxRows' and 'maxColumns' of the row range data.
	 * @para maxRows: max rows count for needing.
	 * @para maxColumns: max columns count for needing.
	 * @created: 
	 */
	prototype._fixRowRange=function(vData,sizeData,maxRows,maxColumns){
		var sizeData1=sizeData[0];
		var actualRowCount=sizeData[1];
		var actualColCount=sizeData[2];
		var rows=[],iRow=-1;
		maxColumns=maxColumns||actualColCount;
		rows=Global.is(vData,"Object")&&vData.data||vData;
		for(var i=0;i<rows.length;i++){
			var row=rows[i];
			if(Global.is(row,"Object")){
				if(row.arrangeMode=="row"){
					this._fixRowRange(row,sizeData1[i],0,maxColumns);
					iRow+=sizeData1[i][1]; 
				}else if(row.arrangeMode=="column"){
					this._fixColumnRange(row,sizeData1[i],maxColumns,0);
					iRow+=sizeData1[i][2];
				}
			}else{
				//修复行中的列数---------
				var rowCells=row;iRow++;
				var rowColCount=sizeData1[i];
				var lastCell=rowCells.length?rowCells[rowCells.length-1]:null;
				if(lastCell&&Global.is(lastCell,"Object")&&lastCell.colspan==-1){
					lastCell.colspan=maxColumns-rowColCount+1;
				}else{
					rowCells.fill("",maxColumns-rowColCount,rowCells.length);
				}
			}
		}
		//修复行数, 没有解决行中跨行的问题
		rows.fill([].fill("",maxColumns),maxRows-iRow-1,rows.length);	//2014.2.28
	}
	/**
	 * @para data:
	 * @para sizeData: contains 'sizeData', 'maxRows' and 'maxColumns' of the row range data.
	 * @para maxRows: max rows count for needing.
	 * @para maxColumns: max columns count for needing.
	 * @created: 
	 */
	prototype._fixColumnRange=function(vData,sizeData,maxColumns,maxRows){
		var sizeData1=sizeData[0];
		var actualColCount=sizeData[1];
		var actualRowCount=sizeData[2];
		var columns=[],iColumn=-1;
		maxRows=maxRows||actualRowCount;
		columns=Global.is(vData,"Object")&&vData.data||vData;
		for(var i=0;i<columns.length;i++){
			var column=columns[i];
			if(Global.is(column,"Object")){ 
				if(column.arrangeMode=="column"){
					this._fixColumnRange(column,sizeData1[i],0,maxRows);
					iColumn+=sizeData1[i][1];
				}else if(column.arrangeMode=="row"){
					this._fixRowRange(column,sizeData1[i],maxRows,0);
					iColumn+=sizeData1[i][2];
				}
			}else{ 
				//修复列中的行数---------
				var colCells=column;iColumn++;
				var colRowCount=sizeData1[i];
				var lastCell=colCells.length?colCells[colCells.length-1]:null;
				if(lastCell&&Global.is(lastCell,"Object")&&lastCell.rowspan==-1){
					lastCell.rowspan=maxRows-colRowCount+1;
				}else{
					colCells.fill("",maxRows-colRowCount,colCells.length);
				}
			}
		}
		//修复列数，没有解决列中跨列问题
		columns.fill([].fill("",maxRows),maxColumns-iColumn-1,iColumn+1);
		/* //用此代码时，必须在转换为行数据时不能按顺序填到行单元中，要进行判断
		for(var i=iColumn+1;i<maxColumns;i++){ 
			columns.push([].fill("",maxRows-(i<sizeData1.length?sizeData1[i]:0)));
		}
		*/
	}
	/**
	 * @created: 2012.3.30
	 * @updated: 2012.3.31
	 */
	prototype._getRowRangeSizeData=function(vData){
		var rowsCells=[];	//每行中有多少个列，如果为内嵌块，则直接嵌入它的尺寸数据
		var rows=[],iRow=-1,maxRows=0,maxColumns=0;
		if(Global.is(vData,"Object")){
			rows=vData.data;
		}else{
			rows=vData;
		}
		for(var i=0;i<rows.length;i++){
			var row=rows[i];
			if(Global.is(row,"Object")){
				if(row.arrangeMode=="row"){
					var sizeDatas=this._getRowRangeSizeData(row);
					var sizeData=sizeDatas[0];
					maxRows+=sizeDatas[1];
					maxColumns=Math.max(maxColumns,sizeDatas[2]);
					rowsCells[++iRow]=sizeDatas;
					/*
					for(var j=0;j<sizeData.length;j++){
						iRow++;
						rowsCells[iRow]=iRow<rowsCells.length?(rowsCells[iRow]+sizeData[j]):sizeData[j];
					}*/
				}else if(row.arrangeMode=="column"){
					var sizeDatas=this._getColumnRangeSizeData(row);
					maxRows+=sizeDatas[2];
					maxColumns=Math.max(maxColumns,sizeDatas[1]);
					rowsCells[++iRow]=sizeDatas;
				}
			}else{
				var rowCells=row;iRow++;
				if(iRow>=rowsCells.length) rowsCells[iRow]=0;
				for(var j=0;j<rowCells.length;j++){
					var cell=rowCells[j];
					rowsCells[iRow]+=1;
					if(cell&&Global.is(cell,"Object")){
						if(cell.colspan>1){
							rowsCells[iRow]+=cell.colspan-1;
						}
						if(cell.rowspan>1){
							for(var k=1;k<cell.rowspan;k++){
								rowsCells[iRow+k]=(iRow+k<rowsCells.length)?(rowsCells[iRow+k]+1):1;
							}
						}
					}
				};
				maxRows++;maxColumns=Math.max(maxColumns,rowsCells[iRow]);
			}
		}
		return [rowsCells,maxRows,maxColumns];
	}
	/**
	 * @created: 2012.3.30
	 * @updated: 2012.3.31
	 */	
	prototype._getColumnRangeSizeData=function(vData){ 
		var columnsCells=[];	//每列中有多少行，如果排列模式相反，则直接嵌入它的尺寸数据
		var columns=[],iColumn=-1,maxRows=0,maxColumns=0;
		if(Global.is(vData,"Object")){
			columns=vData.data;
		}else{
			columns=vData;
		}
		for(var i=0;i<columns.length;i++){
			var column=columns[i];
			if(Global.is(column,"Object")){
				if(column.arrangeMode=="column"){
					var sizeDatas=this._getColumnRangeSizeData(column);
					var sizeData=sizeDatas[0];
					maxColumns+=sizeDatas[1];
					maxRows=Math.max(maxRows,sizeDatas[2]);	//2014.2.28
					columnsCells[++iColumn]=sizeDatas;
					/*
					for(var j=0;j<sizeData.length;j++){
						iColumn++;
						columnsCells[iColumn]=iColumn<columnsCells.length?(columnsCells[iColumn]+sizeData[j]):sizeData[j];
					}*/
				}else if(column.arrangeMode=="row"){
					var sizeDatas=this._getRowRangeSizeData(column);
					maxColumns+=sizeDatas[2];
					maxRows=Math.max(maxRows,sizeDatas[1]);
					columnsCells[++iColumn]=sizeDatas;
				}
			}else{
				var colCells=column;iColumn++;
				if(iColumn>=columnsCells.length) columnsCells[iColumn]=0;
				for(var j=0;j<colCells.length;j++){
					var cell=colCells[j];
					columnsCells[iColumn]+=1;
					if(cell&&Global.is(cell,"Object")){
						if(cell.rowspan>1){
							columnsCells[iColumn]+=cell.rowspan-1;
						}
						if(cell.colspan>1){
							for(var k=1;k<cell.colspan;k++){
								columnsCells[iColumn+k]=(iColumn+k<columnsCells.length)?(columnsCells[iColumn+k]+1):1;
							}
						}
					}
				};
				maxColumns++;maxRows=Math.max(maxRows,columnsCells[iColumn]);
			}
		}
		return [columnsCells,maxColumns,maxRows];
	}
}

