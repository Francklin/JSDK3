{
	"package": "js.ui.table",
	"import": [
		"js.domx.HTMLForm","js.domx.HTMLFormField","js.domx.HTMLTextField","js.domx.HTMLSelectField",
		"js.domx.HTMLNumberField","js.domx.HTMLDateField"
	],
	"name": "TableDataEditor",
	"version": "v0.9.2 beta",
	"updated": "2014.01.03",
	"class": [
		{ 
			"name": "TableDataEditor",
			"extends": "Object",
			"constructor": [
				[
					"htmlContainer: HTMLElement",
					{
						name: "vOptions",
						type: "Object",
						para: [
							"openMode: Number[required]",
							"parentForm: HTMLElement[required]",
							"enabledNoCol: Boolean[optional]",
							"enabledSelectCol: Boolean[optional]",
							"enabledActionCol: Boolean[optional]",
							"minRowsCount: Number[optional]",
							"maxRowsCount: Number[optional]",
							"columns: { }"
						]
					},
					"vWidth: Variant"
				]
			],
			"const": [
				{
					name: "OpenModeEnum",
					members: ["Read","Edit"]
				},
				{
					name: "ColumnTypeEnum",
					members: ["Text","Number","Date"]
				},
				{
					name: "ColumnAlignEnum",
					members: ["Left","Center","Right"]
				}
			],
			"property": [
				["public","static","String","resPath",["get"]],
				["public","","Number","status",["get"]],
				["public","","String","rowsCount",["get"]],
				["public","","String","columnsCount",["get"]],
				["public","","String","minRowsCount",["get","set"]],
				["public","","String","maxRowsCount",["get","set"]],
				["public","","Number","openMode",["get"]],
				["public","","Boolean","enabledNoCol",["get"]],
				["public","","Boolean","enabledSelectCol",["get"]],
				["public","","Boolean","enabledActionCol",["get"]],
				["public","","Boolean","isImmdApply",["get"]],
				["public","","Number","immdApplyMode",["get"]],
				["public","","js.domx.HTMLForm","parentForm",["get"]],
				["public","","String","dataSeparator",["get"]],
				["public","","TableDataEditor.Row","activeRow",["get"]],
				["public","","Object","htmlElement",["get"]]
			],
			"method": [
				["public","","void","show",""],
				["public","","void","hide",""],
				["public","","TableDataEditor.Row","addRow",""],
				["public","","TableDataEditor.Row","insertRow","index"],
				["public","","TableDataEditor.Column","addColumn","sTitle,sName,sType[,vWidth[,iHeaderAlign[,iAlign]]]"],
				["public","","void","addFieldAdjustHandle","vColNames,fnHandle(oRow,colField1[,colField2[,...])"],
				["public","","TableDataEditor.Row","getRow","index"],
				["public","","TableDataEditor.Row","getRowById","id"],
				["public","","TableDataEditor.Row","getRowByEl","el"],
				["public","","TableDataEditor.Column","getColumn","index"],
				["public","","TableDataEditor.Column","getColumnByName","sName"],
				["public","","Array","getSelectedRows",""],
				["public","","void","swapRow","row1,row2"],
				["public","","void","moveUpRows","rows"],
				["public","","void","moveDownRows","rows"],
				["public","","void","setRowsCountLimit","iMin,iMax"],
				["public","","void","setIsAllRequiredFill",""],
				["public","","void","setIsAllOptionalFill",""],
				["public","","void","setStoreFieldFor","sProName,elField"],
				["public","","void","load",""],
				["public","","void","reload",""],
				["public","","void","reset",""],
				["public","","Boolean","validate",""],
				["public","","void","trim",""],
				["public","","void","selectAll","isSelect"],
				["public","","void","clearEmpty",""],
				["public","","void","removeAll",""],
				["public","","void","save",""],
				["public","","String","encodeText","text,separator"],
				["public","","String","decodeText","text,separator"],
				["public","","void","attachEvent","sEvent, fpNotify([arg1[,arg2[,...])"],
				["public","static","void","fireEvent","sEvent,oEventObject"],
				["public","static","void","addStyleSkin","sName,sPath"],
				["public","static","void","setStyleSkin","sName"]
			],
			"event": [
				["public","","void","onAddedRow","oRow"],
				["public","","void","onInsertedRow","oRow"],
				["public","","void","onRemovedRow","oRow"],
				["public","","void","onSwapRow","rows"],
				["public","","void","onLoaded","oRow"],
				["public","","void","onRowValueChanged","oRow"]
			]
		},
		{ 
			"name": "TableDataEditor.Column",
			"extends": "Object",
			"constructor": [
				"Column(htmlContainer,vOptions,vWidth,iHeaderAlign,iAlign)"
			],
			"const": [],
			"property": [
				["public","","String","title",["get"]],
				["public","","String","name",["get"]],
				["public","","String","type",["get"]],
				["public","","String","width",["get","set"]],
				["public","","Number","headerAlign",["get"]],
				["public","","Number","align",["get","set"]],
				["public","","Number","index",["get"]],
				["public","","Boolean","isHidden",["get","set"]],
				["public","","Boolean","allowEmpty",["get","set"]],
				["public","","Boolean","isReadOnly",["get"]],
				["public","","Object","inputOptions",["get","set"]],
				["public","","Array","dataFields",["get"]]
			],
			"method": [
				["public","","void","bindDataFields","elTextField,elValueField"]
				
			],
			"event": []
		},
		{ 
			"name": "TableDataEditor.Row",
			"extends": "Object",
			"constructor": [
				"Row(parentTable,index)"
			],
			"const": [],
			"property": [
				["public","","TableDataEditor","parent",["get"]],
				["public","","String","id",["get"]],
				["public","","Number","index",["get"]],
				["public","","Boolean","checked",["get","set"]],
				["public","","Object","htmlElement",["get"]]
			],
			"method": [
				["public","","HTMLFormField","getColumnField","iColumn"],
				["public","","HTMLFormField","getColumnFieldByColName","colName"],
				["public","","Variant","getColumnText","iColumn"],
				["public","","Variant","getColumnValue","iColumn"],
				["public","","void","setColumnValue","iColumn,vValue"],
				["public","","void","adjust",""],
				["public","","void","adjustByColField","sColName"],
				["public","","void","moveUp",""],
				["public","","void","moveDown",""],
				["public","","Boolean","isEmpty",""],
				["public","","void","clearEmpty",""],
				["public","","void","load",""],
				["public","","void","reload",""],
				["public","","void","activate",""],
				["public","","Boolean","validate",""],
				["public","","void","save",""],
				["public","","void","remove",""]
			],
			"event": []
		}
	]
}