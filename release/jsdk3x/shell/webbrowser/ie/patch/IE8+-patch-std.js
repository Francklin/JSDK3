(function(){typeof Element!="undefined"&&(Object.defineProperty(Element.prototype,"$childNodes",{get:function(){for(var t=[],i=this.childNodes,n=0,r=i.length;n<r;n++)i[n].nodeName!="#text"&&(t[t.length]=i[n]);return t}}),Object.defineProperty(Element.prototype,"$firstChild",{get:function(){for(var t=this.childNodes,n=0,i=t.length;n<i;n++)if(t[n].nodeName!="#text")return t[n]}}),Object.defineProperty(Element.prototype,"$nextSibling",{get:function(){var n;if(this.nextSibling)n=this.nextSibling.nodeType==3?this.nextSibling.nextSibling:this.nextSibling;else return null;return n}}),Object.defineProperty(Element.prototype,"$previousSibling",{get:function(){var n;if(this.previousSibling)n=this.previousSibling.nodeType==3?this.previousSibling.previousSibling:this.previousSibling;else return null;return n}}),Object.defineProperty(Element.prototype,"$lastChild",{get:function(){for(var t=this.childNodes,n=t.length-1;n>=0;n--)if(t[n].nodeName!="#text")return t[n]}}));typeof Node!="undefined"&&(Object.defineProperty(Node.prototype,"$childNodes",{get:function(){for(var t=[],i=this.childNodes,n=0,r=i.length;n<r;n++)i[n].nodeName!="#text"&&(t[t.length]=i[n]);return t}}),Object.defineProperty(Node.prototype,"$firstChild",{get:function(){for(var t=this.childNodes,n=0,i=t.length;n<i;n++)if(t[n].nodeName!="#text")return t[n]}}),Object.defineProperty(Node.prototype,"$nextSibling",{get:function(){var n;if(this.nextSibling)n=this.nextSibling.nodeType==3?this.nextSibling.nextSibling:this.nextSibling;else return null;return n}}),Object.defineProperty(Node.prototype,"$previousSibling",{get:function(){var n;if(this.previousSibling)n=this.previousSibling.nodeType==3?this.previousSibling.previousSibling:this.previousSibling;else return null;return n}}),Object.defineProperty(Node.prototype,"$lastChild",{get:function(){for(var t=this.childNodes,n=t.length-1;n>=0;n--)if(t[n].nodeName!="#text")return t[n]}}))})()