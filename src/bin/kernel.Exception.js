/**
 * Defines the Exception type.
 */
{
	"define": function(message, cause) {
		this.number = Engine._deviceNumber * 0x10000 + 0x1;
		this.message = message || "no message";
		this.cause = cause;
	},
	/**
	 * Returns the name of this exception.
	 */
	"getName" : function () {
		return this.getClass().getName();
	},

	/**
	 * Returns the message of this exception.
	 */
	"getMessage" : function () {
		return this.message;
	},

	/**
	 * Returns the cause of this exception.
	 */
	"getCause" : function () {
		return this.cause;
	},

	/**
	 * Returns a string representation of the exception.
	 */
	"toString" : function() {
		return this.getName() + ":" + this.getMessage();
	},

	/**
	 * Prints this throwable and its backtrace
	 *  to the standard exception stream.
	 */
	"printStackTrace" : function(printer) {
		var s = this.toString();
		var e = this.cause;
		while(e != null) {
			s += "\r\n\tat ";
			if (e instanceof Error) {
					s += "Error:" + e.number 
						+ "," + e.message;
			} else {
				s += e.toString();
			}
			e = e.cause;
		}
		if (!printer) {
			//jsre.console.write(s + "\r\n");
		} else {
			//printer.println(s);
		}
	}
}
