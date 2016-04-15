CSSStyleDeclaration.prototype.__defineGetter__("styleFloat",function(){return this.cssFloat});CSSStyleDeclaration.prototype.__defineSetter__("styleFloat",function(n){this.cssFloat=n});CSSStyleDeclaration.prototype.__defineGetter__("pixelLeft",function(){return parseInt(this.left)||0});CSSStyleDeclaration.prototype.__defineSetter__("pixelLeft",function(n){this.left=n+"px"});CSSStyleDeclaration.prototype.__defineGetter__("pixelHeight",function(){return parseInt(this.height)||0});CSSStyleDeclaration.prototype.__defineSetter__("pixelHeight",function(n){this.height=n+"px"});CSSStyleDeclaration.prototype.__defineGetter__("pixelTop",function(){return parseInt(this.top)||0});CSSStyleDeclaration.prototype.__defineSetter__("pixelTop",function(n){this.top=n+"px"});CSSStyleDeclaration.prototype.__defineGetter__("pixelWidth",function(){return parseInt(this.width)||0});CSSStyleDeclaration.prototype.__defineSetter__("pixelWidth",function(n){this.width=n+"px"}),function(){window.constructor&&(window.constructor==Object?(window.attachEvent=function(n,t){this.addEventListener(n.replace(/^on/,""),t,!1)},window.dialogArguments=window.opener&&window.opener.__$activeDialog==window&&window.opener.__$activeDialogParameter.arguments||undefined):(window.constructor.prototype.attachEvent=function(n,t){this.addEventListener(n.replace(/^on/,""),t,!1)},window.constructor.prototype.__defineGetter__("dialogArguments",function(){if(this.opener&&this.opener.__$activeDialog==this)return this.opener.__$activeDialogParameter.arguments})))}();HTMLDocument.prototype.__defineGetter__("all",function(){return this.getElementsByTagName("*")});HTMLDocument.prototype.__defineGetter__("$activeElement",function(){return this.activeElement});HTMLDocument.prototype.createEventObject=function(){return document.createEvent("Events")};HTMLElement.prototype.__defineGetter__("all",function(){return this.getElementsByTagName("*")});HTMLElement.prototype.__defineGetter__("parentElement",function(){return this.parentNode==this.ownerDocument?null:this.parentNode});HTMLElement.prototype.__defineGetter__("uniqueID",function(){arguments.callee.count||(arguments.callee.count=0);var n="moz_id"+arguments.callee.count++;return window[n]=this,this.__defineGetter__("uniqueID",function(){return n}),n});HTMLElement.prototype.__defineGetter__("currentStyle",function(){return getComputedStyle(this,null)});HTMLElement.prototype.__defineGetter__("runtimeStyle",function(){return this.style});HTMLElement.prototype.__defineGetter__("canHaveChildren",function(){switch(this.tagName.toLowerCase()){case"area":case"base":case"basefont":case"col":case"frame":case"hr":case"img":case"br":case"input":case"isindex":case"link":case"meta":case"param":return!1}return!0});HTMLElement.prototype.__defineGetter__("outerHTML",function(){for(var n,r=this.attributes,t="<"+this.tagName,i=0;i<r.length;i++)n=r[i],n.specified&&(t+=" "+n.name+'="'+n.value+'"');return this.canHaveChildren?t+">"+this.innerHTML+"<\/"+this.tagName+">":t+">"});HTMLElement.prototype.__defineSetter__("outerHTML",function(n){var t=this.ownerDocument.createRange(),i;return t.setStartBefore(this),i=t.createContextualFragment(n),this.parentNode.replaceChild(i,this),n});HTMLElement.prototype.__defineGetter__("outerText",function(){var n=this.ownerDocument.createRange();return n.selectNodeContents(this),n.toString()});HTMLElement.prototype.__defineSetter__("outerText",function(n){var t=document.createTextNode(n);return this.outerHTML=t,t});HTMLElement.prototype.__defineGetter__("innerText",function(){return this.textContent});HTMLElement.prototype.__defineSetter__("innerText",function(n){this.textContent=n});HTMLElement.prototype.__defineGetter__("$firstChild",function(){for(var t=this.childNodes,n=0,i=t.length;n<i;n++)if(t[n].nodeName!="#text")return t[n]});HTMLElement.prototype.__defineGetter__("$nextSibling",function(){var n;if(this.nextSibling)n=this.nextSibling.nodeType==3?this.nextSibling.nextSibling:this.nextSibling;else return null;return n});HTMLElement.prototype.__defineGetter__("$previousSibling",function(){var n;if(this.previousSibling)n=this.previousSibling.nodeType==3?this.previousSibling.previousSibling:this.previousSibling;else return null;return n});HTMLElement.prototype.__defineGetter__("$lastChild",function(){for(var t=this.childNodes,n=t.length-1;n>=0;n--)if(t[n].nodeName!="#text")return t[n]});HTMLElement.prototype.attachEvent=function(n,t){this.addEventListener(n.replace(/^on/,""),t,!1)};HTMLElement.prototype.removeEvent=function(n,t){this.removeEventListener(n.replace(/^on/,""),t,!1)};HTMLElement.prototype.createEventObject=function(){return this.ownerDocument.createEventObject()};HTMLElement.prototype.fireEvent=function(n,t){t||(t=this.ownerDocument.createEvent("Events"));var i=null;if(t.constructor==Event)i=this.ownerDocument.createEvent("Events"),i.initEvent(n.replace(/^on/,""),t.bubbles,t.cancelable);else if(t.constructor==MouseEvent)i=this.ownerDocument.createEvent("MouseEvents"),i.initMouseEvent(n.replace(/^on/,""),t.bubbles,t.cancelable,t.view,t.detail,t.screenX,t.screenY,t.clientX,t.clientY,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,t.button,t.relatedTarget);else if(t.constructor==UIEvent)i=this.ownerDocument.createEvent("UIEvents"),i.initUIEvent(n.replace(/^on/,""),t.bubbles,t.view,t.detail);else return;this.dispatchEvent(i)};HTMLElement.prototype.contains=function(n){return Boolean(n==this||n&&this.contains(n.parentElement))};Event.prototype.__defineGetter__("srcElement",function(){return this.target.nodeType==Node.ELEMENT_NODE?this.target:this.target.parentNode});Event.prototype.__defineGetter__("fromElement",function(){return this.type=="mouseover"?this.relatedTarget:this.type=="mouseout"?this.srcElement:null});Event.prototype.__defineGetter__("toElement",function(){return this.type=="mouseout"?this.relatedTarget:this.type=="mouseover"?this.srcElement:null});Event.prototype.__defineGetter__("button",function(){return this.which==1?1:this.which==2?4:2});Event.prototype.__defineGetter__("returnValue",function(){return!0});Event.prototype.__defineSetter__("returnValue",function(n){this.cancelable&&!n&&(this.preventDefault(),this.__defineGetter__("returnValue",function(){return!1}))});Event.prototype.__defineSetter__("cancelBubble",function(n){n&&this.stopPropagation()});Event.prototype.__defineGetter__("offsetX",function(){return this.layerX});Event.prototype.__defineGetter__("offsetY",function(){return this.layerY});XMLDocument.prototype.__proto__.__defineGetter__("xml",function(){try{return(new XMLSerializer).serializeToString(this)}catch(t){var n=document.createElement("div");return n.appendChild(this.cloneNode(!0)),n.innerHTML}});XMLDocument.prototype.__proto__.__defineGetter__("text",function(){return this.firstChild.textContent.replace(/^[\s\r\n]*/g,"").replace(/[\s\r\n]*$/g,"")});XMLDocument.prototype.selectSingleNode=function(n){var t=this.selectNodes(n);return t.length?t[0]:null};XMLDocument.prototype.selectNodes=function(n){for(var t=new XPathEvaluator,u=t.createNSResolver(this.ownerDocument==null?this.documentElement:this.ownerDocument.documentElement),f=t.evaluate(n,this,u,0,null),i=[],r;r=f.iterateNext();)i.push(r);return i};XMLDocument.prototype.__proto__.__defineGetter__("$childNodes",function(){for(var t=[],i=this.childNodes,n=0,r=i.length;n<r;n++)i[n].nodeName!="#text"&&(t[t.length]=i[n]);return t});XMLDocument.prototype.__proto__.__defineGetter__("$firstChild",function(){for(var t=this.childNodes,n=0,i=t.length;n<i;n++)if(t[n].nodeName!="#text")return t[n]});XMLDocument.prototype.__proto__.__defineGetter__("$nextSibling",function(){var n;if(this.nextSibling)n=this.nextSibling.nodeType==3?this.nextSibling.nextSibling:this.nextSibling;else return null;return n});XMLDocument.prototype.__proto__.__defineGetter__("$previousSibling",function(){var n;if(this.previousSibling)n=this.previousSibling.nodeType==3?this.previousSibling.previousSibling:this.previousSibling;else return null;return n});XMLDocument.prototype.__proto__.__defineGetter__("$lastChild",function(){for(var t=this.childNodes,n=t.length-1;n>=0;n--)if(t[n].nodeName!="#text")return t[n]});XMLDocument.prototype.loadXML=function(n){for(var i=this.childNodes,t=i.length-1;t>=0;t--)this.removeChild(i[t]);var r=new DOMParser,u=r.parseFromString(n,"text/xml"),f=this.importNode(u.documentElement,!0);this.appendChild(f)};Element.prototype.__proto__.__defineGetter__("xml",function(){try{return(new XMLSerializer).serializeToString(this)}catch(t){var n=document.createElement("div");return n.appendChild(this.cloneNode(!0)),n.innerHTML}});Element.prototype.__proto__.__defineGetter__("text",function(){return this.textContent.replace(/^[\s\r\n]*/g,"").replace(/[\s\r\n]*$/g,"")});Element.prototype.selectSingleNode=XMLDocument.prototype.selectSingleNode;Element.prototype.selectNodes=XMLDocument.prototype.selectNodes;Element.prototype.__proto__.__defineGetter__("$childNodes",function(){for(var t=[],i=this.childNodes,n=0,r=i.length;n<r;n++)i[n].nodeName!="#text"&&(t[t.length]=i[n]);return t});Element.prototype.__proto__.__defineGetter__("$firstChild",function(){for(var t=this.childNodes,n=0,i=t.length;n<i;n++)if(t[n].nodeName!="#text")return t[n]});Element.prototype.__proto__.__defineGetter__("$nextSibling",function(){var n;if(this.nextSibling)n=this.nextSibling.nodeType==3?this.nextSibling.nextSibling:this.nextSibling;else return null;return n});Element.prototype.__proto__.__defineGetter__("$previousSibling",function(){var n;if(this.previousSibling)n=this.previousSibling.nodeType==3?this.previousSibling.previousSibling:this.previousSibling;else return null;return n});Element.prototype.__proto__.__defineGetter__("$lastChild",function(){for(var t=this.childNodes,n=t.length-1;n>=0;n--)if(t[n].nodeName!="#text")return t[n]})