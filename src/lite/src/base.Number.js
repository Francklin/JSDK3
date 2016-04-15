/**
 * Number of base
 * @file: base.Number.js
 * @version: V0.2
 * @author: liu denggao
 * @created: 2011.9.21
 * @modified: 2012.5.29
 **************************/

/**
 * 在一个范围中的区域
 * @return 
 *	(1)iOptions=0:  -1, n<min; 0, n>=min&&n<=max; 1, n>max;
 *	(2)iOptions=1:  -1, n<=min; 0, n>min&&n<max; 1, n>=max;
 * @created 2010.8.2
 * @modified 2010.11.10
 */
Number.prototype.atAround=function(min,max,iOptions){
	if(typeof(min)!="number"||typeof(max)!="number"||min>max){
		throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
	}
	iOptions=iOptions==undefined?0:iOptions;
	switch(iOptions){
		case 0:
			if(this<min){
				return -1;
			}else if(this>=min&&this<=max){
				return 0;
			}else if(this>max){
				return 1;
			}
			break;
		case 1:
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
/**
 * 是否在一个范围内
 * @return 
 * @created 2010.11.10
 * @modified 2010.11.10
 */
Number.prototype.isWithin=function(min,max){
	if(typeof(min)!="number"||typeof(max)!="number"||min>max){
		throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
	}
	if(this>=min&&this<=max) return true;
	else return false;
}
/**
 * 是否在一个范围外
 * @return 
 * @created 2010.11.10
 * @modified 2010.11.10
 */
Number.prototype.isWithout=function(min,max){
	if(typeof(min)!="number"||typeof(max)!="number"||min>max){
		throw new Error(1000,"Parameter of method 'atAround' of class 'Number' is invalid!");
	}
	if(this>=min&&this<=max) return false;
	else return true;
}
Number.prototype.adjust=function(num){
	return (this+num).byPrecision(this.getPrecision());
}
Number.prototype.getPrecision=function(){
	var str=this.toString();
	var at=str.indexOf(".");
	return at<0?0:(str.length-at-1);
}
Number.prototype.byPrecision=function(iBits){
	var str=this.toString();
	var at=str.indexOf(".");
	if(at<0){
		return this;
	}else if(str.length-at-1<=iBits){
		return this;
	}else{
		str=(this+5*Math.pow(10,-iBits-1)).toString();
		at=str.indexOf(".");
		if(at<0){
			return parseFloat(str);
		}else if(str.length-at-1<=iBits){
			return parseFloat(str);
		}else{
			return parseFloat(str.slice(0,at+iBits+1));
		}
	}
}
Number.prototype.toStrByPrec=function(iBits){
	var str=this.toString();
	var at=str.indexOf(".");
	if(at<0){
		return str+"."+[].fill("0",iBits).join("");
	}else if(str.length-at-1<=iBits){
		return str+[].fill("0",iBits-(str.length-at-1)).join("");
	}else{
		str=(this+5*Math.pow(10,-iBits-1)).toString();
		at=str.indexOf(".");
		if(at<0){
			return str+"."+[].fill("0",iBits).join("");
		}else if(str.length-at-1<=iBits){
			return str+[].fill("0",iBits-(str.length-at-1)).join("");
		}else{
			return str.slice(0,at+iBits+1);
		}
	}
}