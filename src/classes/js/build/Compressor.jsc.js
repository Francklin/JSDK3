/**
 * @file Compressor.class.js
 * @support: IE, Firfox, Chrome
 * @version 1.0 alpha
 * @since JSDK3 V1.7.0
 * @author liu denggao
 * @created 2011.10.9
 * @modified 2011.10.9-2013.12.17
 */

$package("js.build");

/**
 * Create a new Packager instance.
 */
js.build.Compressor=function(mode) {
	this._mode=0;
	this._TERMINATOR_PAT = new RegExp();
	this._TERMINATOR_PAT.compile(/[\n\r\u2028\u2029]/);
	this._LITERALS = [];
	this._Compressor(mode);
}

var _$class = js.build.Compressor;
_$class.$extends("Object");
var _$proto = js.build.Compressor.prototype;

_$class.MODE={
	NONE: 0,	//none compresss, only clear commant
	SAFE: 1,	//safe, clear commant and 'enter' char and 'new line' char
	FULL: 2		//full, full compress
}

//:constructor-------------------

_$proto._Compressor=function(mode){
	this._mode=mode;
}

//:property----------------------

_$proto.getMode=function(){
	return this._mode;
}

//:method-------------------------

_$proto.compress=function(sCode){
	var thisObj=this;
	var ar=sCode.split("");
	ar.push("\n");
	this._parseInputArray(ar);
	var s = ar.join("");
	s = s.replace(/[^\S]/g, function (c) {
		return thisObj._TERMINATOR_PAT.test(c) ? "\n" : " ";
	});
	s = s.replace(/\n +/g, "\n");
	s = s.replace(/([\n ]){2,}/g, "$1");
	s = s.replace(/^[^\S]?|[^\S]?$/g, "");
	if (this._mode!=0) {
		s = s.replace(/([+-])\n\1/g, "$1 $1");
		s = s.replace(/([\u1010{()[\],<>*%&|^!~?:=.;+-])\n/g, "$1");
		s = s.replace(/\n([}:.])/g, "$1");
		if (this._mode==2) {	//full
			s = s.replace(/\n/g, " ");
		}
	}
	s = this._stripWhitespaces(s);
	s = s.replace(/\u1010/g, "/");
	s = this._insertLiterals(s);
	this._LITERALS.length = 0;
	
	return s;
}
_$proto._markDeleteElems=function(ar, startPos, endPos) {
    ++endPos;
    for (var i = startPos; i < endPos; ++i) {
        ar[i] = null;
    }
}
_$proto._isStatementStart=function(ar, curPos) {
    while (curPos--) {
        var c = ar[curPos];
        if (/\S/.test(c)) {
            return /[(;=]/.test(c);
        }
    }
    return true;
}
_$proto._parseInputArray=function(ar) {
    var len = ar.length, lenMinusOne = len - 1, i = 0, c, nextChar, targetChar, startPos, commentType, isEscape;
    for (; i < len; ++i) {
        c = ar[i];
        if (startPos > -1) {
            if (commentType) {
                if (targetChar == "*") {
                    if (i - startPos > 2 && ar[i - 1] == "*" && c == "/") {
                        this._markDeleteElems(ar, startPos, i);
                        startPos = -1;
                        commentType = false;
                    }
                } else {
                    if (this._TERMINATOR_PAT.test(c)) {
                        this._markDeleteElems(ar, startPos, i);
                        startPos = -1;
                        commentType = false;
                    }
                }
            } else {
                if (targetChar == c) {
                    if (ar[i - 1] == "\\") {
                        if (i - 2 && ar[i - 2] == "\\") {
                            this._pushLiterals(ar, startPos, i);
                            startPos = -1;
                        }
                    } else {
                        this._pushLiterals(ar, startPos, i);
                        startPos = -1;
                    }
                }
            }
        } else {
            if (i < lenMinusOne) {
                if (c == "/") {
					//2013.12.17
					isEscape=false;
					for(var j=i-1;j>=0;j--){
						if(ar[j]=='\\') isEscape=(i-j)%2==1;
						else break;
					}
					//----------
					nextChar = ar[i + 1];
                    if (!isEscape&&/[*\/]/.test(nextChar)) {
                        startPos = i++;
                        commentType = true;
                        targetChar = nextChar;
                    } else {
                        if (this._isStatementStart(ar, i)) {
                            startPos = i;
                            targetChar = c;
                        } else {
                            ar[i] = "\u1010";
                        }
                    }
                } else {
                    if (/["']/.test(c)) {
                        targetChar = c;
                        startPos = i;
                    }
                }
            }
        }
    }
}
_$proto._stripWhitespaces=function(s) {
    s = s.replace(/ ?([\n\u1000\u1010{}()[\];,<>*%&|^!~?:=]) ?/g, "$1");
    s = s.replace(/([^+]) ?([+])/g, "$1$2");
    s = s.replace(/([+]) ?([^+])/g, "$1$2");
    s = s.replace(/([^-]) ?([-])/g, "$1$2");
    s = s.replace(/([-]) ?([^-])/g, "$1$2");
    return s;
}
_$proto._insertLiterals=function(s) {
    var i = 0;
	var thisObj=this;
    return s.replace(/\u1000/g, function (c) {
        return thisObj._LITERALS[i++];
    });
}
_$proto._convertArrayPortionToString=function(ar, startPos, endPos) {
    var s = "";
    ++endPos;
    for (var i = startPos; i < endPos; ++i) {
        if (ar[i]) {
            s += ar[i];
        }
    }
    return s;
}
_$proto._pushLiterals=function(ar, startPos, endPos) {
    this._LITERALS[this._LITERALS.length] = this._convertArrayPortionToString(ar, startPos, endPos);
    ar[startPos] = "\u1000";
    this._markDeleteElems(ar, startPos + 1, endPos);
}

