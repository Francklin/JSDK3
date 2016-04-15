
/**
 * Defines the Object type
 * @created: 2011.7.29
 * @modified: 2012.7.21
 */
{
	"define": function(value){
		this._value=value;
		switch(typeof(value)){
			case "undefined":
				this._value={};
				return this;
			case "string":
				return new Global.String(value);
			case "number":
				return new Global.Number(value);
			case "boolean":
				return new Boolean(value);
			case "object":
				if(value instanceof jsre.getNativeClasses("String")){
					return new Global.String(value);
				}else if(value instanceof jsre.getNativeClasses("Number")){
					return new Global.Number(value);
				}else if(value instanceof jsre.getNativeClasses("Date")){
					return Global.Date.newInstanceFrom(value);
				}else if(value.constructor==jsre.getNativeClasses("Object")){
					if(this instanceof Global.Object){
						return this;
					}else{
						return new Global.Object(value);
					}
				}else{
					return value;
				}
		}
	},
	"toString_": function(){
		return ("[Object " + this.getName() + "]");
	},
	/**
	 * Returns the runtime class of an object.
	 */
	"getClass" : function() {
		return this.$class;
	},
	/**
	 * Returns a string representation of the object.
	 */
	"toString" : function () {
		return ("[object " + this.getClass().getName() + "]");
	},
	"valueOf" : function(){
		return this._value;
	},
	/**
	 * Determines whether this object is an
	 * istanceof the specified type
	 */
	"instanceOf" : function (c) {
		return (this instanceof (typeof(c)
			== "string"	? Class.forName(c) : c));
	},
	/**
	 * has event
	 * @created 2011.7.15
	 */
	"hasEvent" : function(sEvent){
		if(typeof(this[sEvent])!="function") return false;
		return true;
	},
	/**
	 * Add event listener 
	 * @created: 2011.8.11
	 */
	"addEventListener": function(sName,fnListener){
		if(typeof(fnListener)=="function") 
			this[sName] = fnListener;
	},
	/**
	 * fire event
	 * @created 2011.7.15
	 * @modified 2011.7.15
	 */
	"fireEvent" : function(sEvent,oEventObject){
		if(typeof(this[sEvent])!="function") return;
		try{
			return this[sEvent](oEventObject);
		}catch(e){
			throw new Error(1000,"Event '"+sEvent+"' of object '"+this.getClass().getName()+"' has been runned error!\nSource: "
				+e.description);
		}
	}	
}
