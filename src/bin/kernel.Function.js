{
	/**
	 * Call constructor or method of superclass
	 * @description the constructor is not normal class function but is custom method function. 
	 * @created 2010.6.19-2010.6.20
	 */
	"$upcall" : function(oThis){
		var argn=arguments.length;
		if(argn<1){ 
			throw new Error('The first parameter must be swapped object.'); 
		} 
		var thatBase=oThis; 
		do{ 
			for(var key in thatBase){
				if(thatBase[key]==arguments.callee.caller){
					var target = thatBase;
					while(target[key] == getBase(target)[key]){ 
						target = getBase(target);
					} 
					if(("_"+target.getClass().getName())==key){	//call constructor method of superclass
						key="_"+target.getClass().getSuperclass().getName();
					}
					if(argn==1){
						return getBase(target)[key].call(oThis); 
					}else{
						var args = []; 
						for(var i=1;i<argn;i++){ 
							args.push(arguments[i]); 
						}
						return getBase(target)[key].apply(oThis, args); 
					} 
				}
			}
		}
		while(thatBase=getBase(thatBase));
		function getBase(oThat){
			return oThat.getClass().getSuperclass().prototype;
		}
	},
	/**
	 * Call constructor or method of superclass of superclass
	 * @description the constructor is not normal class function but is custom method function. 
	 * @created 2011.8.29
	 * @modified 2010.7.8
	 */
	"$uppercall" : function(oThis){
		var argn=arguments.length;
		if(argn<1){ 
			throw new Error('The first parameter must be swapped object.'); 
		} 
		var thatBase=oThis; 
		do{ 
			for(var key in thatBase){
				if(thatBase[key]==arguments.callee.caller){
					var target = thatBase;
					while(target[key] == getBase(target)[key]){ 
						target = getBase(target);
					} 
					if(("_"+target.getClass().getName())==key){	//call constructor method of superclass
						key="_"+target.getClass().getSuperclass().getSuperclass().getName();
					}
					target=getBase(getBase(target));	//get superclass of superclass
					if(argn==1){
						return target[key].call(oThis); 
					}else{
						var args = []; 
						for(var i=1;i<argn;i++){ 
							args.push(arguments[i]); 
						}
						return target[key].apply(oThis, args); 
					} 
				}
			}
		}
		while(thatBase=getBase(thatBase));
		function getBase(oThat){
			return oThat.getClass().getSuperclass().prototype;
		}
	}
}
