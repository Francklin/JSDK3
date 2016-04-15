/**
 * Defines the Number type.
 */
{
	define: function(value) {
		this._value=(value||0).valueOf();
		this.MAX_VALUE=this._value.MAX_VALUE;
		this.MIN_VALUE=this._value.MIN_VALUE;
		this.NaN=this._value.NaN;
		this.NEGATIVE_INFINITY=this._value.NEGATIVE_INFINITY;
	},
	"extend": "Object",
	/**
	 * encapsulate(class|className,mode,instanceName[,staticMembers[,instanceMembers])
	 * @para mode: 0, direct, 1, indirect
	 */	
	base: ["Number",0,"_value",["POSITIVE_INFINITY"],["toFixed","toPrecision","toExponential","toLocaleString"]],
	toString : function(){
		return this._value.toString();
	},
	valueOf : function(){
		return this._value;
	},
	isWithin : function(min,max){
		if(typeof(min)!="number"||typeof(max)!="number"||min>max){
			throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
		}
		if(this>=min&&this<=max) return true;
		else return false;
	},
	isWithout : function(min,max){
		if(typeof(min)!="number"||typeof(max)!="number"||min>max){
			throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
		}
		if(this>=min&&this<=max) return false;
		else return true;
	},
	/**
	 * area in special scope
	 * @return 
	 *	(1)iOptions=0:  -1, n<min; 0, n>=min&&n<=max; 1, n>max;
	 *	(2)iOptions=1:  -1, n<=min; 0, n>min&&n<max; 1, n>=max;
	 * @created 2011.8.19
	 * @modified 2011.08.31
	 */
	atAround : function(min,max,vOptions){
		if(typeof(min)!="number"||typeof(max)!="number"||min>max){
			throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
		}
		vOptions=vOptions==undefined?0:vOptions;
		switch(vOptions){
			case 0:
			case "[]":
				if(this<min){
					return -1;
				}else if(this>=min&&this<=max){
					return 0;
				}else if(this>max){
					return 1;
				}
				break;
			case 1:
			case "()":
				if(this<=min){
					return -1;
				}else if(this>min&&this<max){
					return 0;
				}else if(this>=max){
					return 1;
				}
				break;
		}
		throw new Error(1000,"Method 'atAround' of class 'Number' run error!");
	}
}
