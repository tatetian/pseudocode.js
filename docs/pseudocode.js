(function(e){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=e()}else if(typeof define==="function"&&define.amd){define([],e)}else{var t;if(typeof window!=="undefined"){t=window}else if(typeof global!=="undefined"){t=global}else if(typeof self!=="undefined"){t=self}else{t=this}t.pseudocode=e()}})(function(){var e,t,n;return function(){function e(t,n,i){function r(s,a){if(!n[s]){if(!t[s]){var h="function"==typeof require&&require;if(!a&&h)return h(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var p=n[s]={exports:{}};t[s][0].call(p.exports,function(e){var n=t[s][1][e];return r(n||e)},p,p.exports,e,t,n,i)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)r(i[s]);return r}return e}()({1:[function(e,t,n){var i=e("./src/ParseError");var r=e("./src/Lexer");var o=e("./src/Parser");var s=e("./src/Renderer");function a(e,t){var n=new r(e);var i=new o(n);return new s(i,t)}function h(e){try{MathJax.typeset([e])}catch(t){MathJax.Hub.Queue(["Typeset",MathJax.Hub,e])}}t.exports={ParseError:i,render:function(e,t,n){if(e===null||e===undefined)throw"input cannot be empty";var i=a(e,n);var r=i.toDOM();if(t)t.appendChild(r);if(i.backend.name==="mathjax"){h(r)}return r},renderToString:function(e,t){if(e===null||e===undefined)throw"input cannot be empty";var n=a(e,t);if(n.backend.name==="mathjax"){console.warn("Using MathJax backend -- math may not be rendered.")}return n.toMarkup()},renderElement:function(e,t){if(!(e instanceof Element))throw"a DOM element is required";e.style.display="none";var n=a(e.textContent,t);var i=n.toDOM();e.replaceWith(i);if(n.backend.name==="mathjax"){h(i)}}}},{"./src/Lexer":2,"./src/ParseError":3,"./src/Parser":4,"./src/Renderer":5}],2:[function(e,t,n){var i=e("./utils");var r=e("./ParseError");var o=function(e){this._input=e;this._remain=e;this._pos=0;this._nextAtom=this._currentAtom=null;this._next()};o.prototype.accept=function(e,t){if(this._nextAtom.type===e&&this._matchText(t)){this._next();return this._currentAtom.text}return null};o.prototype.expect=function(e,t){var n=this._nextAtom;if(n.type!==e)throw new r("Expect an atom of "+e+" but received "+n.type,this._pos,this._input);if(!this._matchText(t))throw new r("Expect `"+t+"` but received `"+n.text+"`",this._pos,this._input);this._next();return this._currentAtom.text};o.prototype.get=function(){return this._currentAtom};var s={exec:function(e){var t=[{start:"$",end:"$"},{start:"\\(",end:"\\)"}];var n=e.length;for(var i=0;i<t.length;i++){var o=t[i].start;if(e.indexOf(o)!==0)continue;var s=t[i].end;var a=o.length;var h=e.slice(a);while(a<n){var l=h.indexOf(s);if(l<0)throw new r("Math environment is not closed",this._pos,this._input);if(l>0&&h[l-1]==="\\"){var p=l+s.length;h=h.slice(p);a+=p;continue}var u=[e.slice(0,a+l+s.length),e.slice(o.length,a+l)];return u}}return null}};var a={special:/^(\\\\|\\{|\\}|\\\$|\\&|\\#|\\%|\\_)/,math:s,func:/^\\([a-zA-Z]+)/,open:/^\{/,close:/^\}/,quote:/^(`|``|'|'')/,ordinary:/^[^\\{}$&#%_\s]+/};var h=/^%.*/;var l=/^\s+/;o.prototype._skip=function(e){this._pos+=e;this._remain=this._remain.slice(e)};o.prototype._next=function(){var e=false;while(1){var t=l.exec(this._remain);if(t){e=true;var n=t[0].length;this._skip(n)}var i=h.exec(this._remain);if(!i)break;var o=i[0].length;this._skip(o)}this._currentAtom=this._nextAtom;if(this._remain===""){this._nextAtom={type:"EOF",text:null,whitespace:false};return false}for(var s in a){var p=a[s];var u=p.exec(this._remain);if(!u)continue;var c=u[0];var f=u[1]?u[1]:c;this._nextAtom={type:s,text:f,whitespace:e};this._pos+=c.length;this._remain=this._remain.slice(u[0].length);return true}throw new r("Unrecoganizable atom",this._pos,this._input)};o.prototype._matchText=function(e){if(e===null||e===undefined)return true;if(i.isString(e))return e.toLowerCase()===this._nextAtom.text.toLowerCase();else{e=e.map(function(e){return e.toLowerCase()});return e.indexOf(this._nextAtom.text.toLowerCase())>=0}};t.exports=o},{"./ParseError":3,"./utils":6}],3:[function(e,t,n){function i(e,t,n){var i="Error: "+e;if(t!==undefined&&n!==undefined){i+=" at position "+t+": `";n=n.slice(0,t)+"\u21b1"+n.slice(t);var r=Math.max(0,t-15);var o=t+15;i+=n.slice(r,o)+"`"}this.message=i}i.prototype=Object.create(Error.prototype);i.prototype.constructor=i;t.exports=i},{}],4:[function(e,t,n){var i=e("./utils");var r=e("./ParseError");var o=function(e,t){this.type=e;this.value=t;this.children=[]};o.prototype.toString=function(e){if(!e)e=0;var t="";for(var n=0;n<e;n++)t+="  ";var r=t+"<"+this.type+">";if(this.value)r+=" ("+i.toString(this.value)+")";r+="\n";if(this.children){for(var o=0;o<this.children.length;o++){var s=this.children[o];r+=s.toString(e+1)}}return r};o.prototype.addChild=function(e){if(!e)throw"argument cannot be null";this.children.push(e)};var s=function(e,t,n){this.type=e;this.value=t;this.children=null;this.whitespace=!!n};s.prototype=o.prototype;var a=function(e){this._lexer=e};a.prototype.parse=function(){var e=new o("root");while(true){var t=this._acceptEnvironment();if(t===null)break;var n;if(t==="algorithm")n=this._parseAlgorithmInner();else if(t==="algorithmic")n=this._parseAlgorithmicInner();else throw new r("Unexpected environment "+t);this._closeEnvironment(t);e.addChild(n)}this._lexer.expect("EOF");return e};a.prototype._acceptEnvironment=function(){var e=this._lexer;if(!e.accept("func","begin"))return null;e.expect("open");var t=e.expect("ordinary");e.expect("close");return t};a.prototype._closeEnvironment=function(e){var t=this._lexer;t.expect("func","end");t.expect("open");t.expect("ordinary",e);t.expect("close")};a.prototype._parseAlgorithmInner=function(){var e=new o("algorithm");while(true){var t=this._acceptEnvironment();if(t!==null){if(t!=="algorithmic")throw new r("Unexpected environment "+t);var n=this._parseAlgorithmicInner();this._closeEnvironment();e.addChild(n);continue}var i=this._parseCaption();if(i){e.addChild(i);continue}break}return e};a.prototype._parseAlgorithmicInner=function(){var e=new o("algorithmic");var t;while(true){t=this._parseCommand(h);if(t){e.addChild(t);continue}t=this._parseBlock();if(t.children.length>0){e.addChild(t);continue}break}return e};a.prototype._parseCaption=function(){var e=this._lexer;if(!e.accept("func","caption"))return null;var t=new o("caption");e.expect("open");t.addChild(this._parseCloseText());e.expect("close");return t};a.prototype._parseBlock=function(){var e=new o("block");while(true){var t=this._parseControl();if(t){e.addChild(t);continue}var n=this._parseFunction();if(n){e.addChild(n);continue}var i=this._parseCommand(l);if(i){e.addChild(i);continue}var r=this._parseComment();if(r){e.addChild(r);continue}break}return e};a.prototype._parseControl=function(){var e;if(e=this._parseIf())return e;if(e=this._parseLoop())return e;if(e=this._parseRepeat())return e};a.prototype._parseFunction=function(){var e=this._lexer;if(!e.accept("func",["function","procedure"]))return null;var t=this._lexer.get().text;e.expect("open");var n=e.expect("ordinary");e.expect("close");e.expect("open");var i=this._parseCloseText();e.expect("close");var r=this._parseBlock();e.expect("func","end"+t);var s=new o("function",{type:t,name:n});s.addChild(i);s.addChild(r);return s};a.prototype._parseIf=function(){if(!this._lexer.accept("func","if"))return null;var e=new o("if");this._lexer.expect("open");e.addChild(this._parseCond());this._lexer.expect("close");e.addChild(this._parseBlock());var t=0;while(this._lexer.accept("func",["elif","elsif","elseif"])){this._lexer.expect("open");e.addChild(this._parseCond());this._lexer.expect("close");e.addChild(this._parseBlock());t++}var n=false;if(this._lexer.accept("func","else")){n=true;e.addChild(this._parseBlock())}this._lexer.expect("func","endif");e.value={numElif:t,hasElse:n};return e};a.prototype._parseLoop=function(){if(!this._lexer.accept("func",["FOR","FORALL","WHILE"]))return null;var e=this._lexer.get().text.toLowerCase();var t=new o("loop",e);this._lexer.expect("open");t.addChild(this._parseCond());this._lexer.expect("close");t.addChild(this._parseBlock());var n=e!=="forall"?"end"+e:"endfor";this._lexer.expect("func",n);return t};a.prototype._parseRepeat=function(){if(!this._lexer.accept("func",["REPEAT"]))return null;var e=this._lexer.get().text.toLowerCase();var t=new o("repeat",e);t.addChild(this._parseBlock());this._lexer.expect("func","until");this._lexer.expect("open");t.addChild(this._parseCond());this._lexer.expect("close");return t};var h=["ensure","require","input","output"];var l=["state","print","return"];a.prototype._parseCommand=function(e){if(!this._lexer.accept("func",e))return null;var t=this._lexer.get().text.toLowerCase();var n=new o("command",t);n.addChild(this._parseOpenText());return n};a.prototype._parseComment=function(){if(!this._lexer.accept("func","comment"))return null;var e=new o("comment");this._lexer.expect("open");e.addChild(this._parseCloseText());this._lexer.expect("close");return e};a.prototype._parseCall=function(){var e=this._lexer;if(!e.accept("func","call"))return null;var t=e.get().whitespace;e.expect("open");var n=e.expect("ordinary");e.expect("close");var i=new o("call");i.whitespace=t;i.value=n;e.expect("open");var r=this._parseCloseText();i.addChild(r);e.expect("close");return i};a.prototype._parseCond=a.prototype._parseCloseText=function(){return this._parseText("close")};a.prototype._parseOpenText=function(){return this._parseText("open")};a.prototype._parseText=function(e){var t=new o(e+"-text");var n=false;var i;while(true){i=this._parseAtom()||this._parseCall();if(i){if(n)i.whitespace|=n;t.addChild(i);continue}if(this._lexer.accept("open")){i=this._parseCloseText();n=this._lexer.get().whitespace;i.whitespace=n;t.addChild(i);this._lexer.expect("close");n=this._lexer.get().whitespace;continue}break}return t};var p={ordinary:{tokenType:"ordinary"},math:{tokenType:"math"},special:{tokenType:"special"},"cond-symbol":{tokenType:"func",tokenValues:["and","or","not","true","false","to","downto"]},"quote-symbol":{tokenType:"quote"},"sizing-dclr":{tokenType:"func",tokenValues:["tiny","scriptsize","footnotesize","small","normalsize","large","Large","LARGE","huge","Huge"]},"font-dclr":{tokenType:"func",tokenValues:["normalfont","rmfamily","sffamily","ttfamily","upshape","itshape","slshape","scshape","bfseries","mdseries","lfseries"]},"font-cmd":{tokenType:"func",tokenValues:["textnormal","textrm","textsf","texttt","textup","textit","textsl","textsc","uppercase","lowercase","textbf","textmd","textlf"]},"text-symbol":{tokenType:"func",tokenValues:["textbackslash"]}};a.prototype._parseAtom=function(){for(var e in p){var t=p[e];var n=this._lexer.accept(t.tokenType,t.tokenValues);if(n===null)continue;var i=this._lexer.get().whitespace;if(e!=="ordinary"&&e!=="math")n=n.toLowerCase();return new s(e,n,i)}return null};t.exports=a},{"./ParseError":3,"./utils":6}],5:[function(e,t,n){var i=e("./utils");function r(e){this._css={};this._fontSize=this._outerFontSize=e!==undefined?e:1}r.prototype.outerFontSize=function(e){if(e!==undefined)this._outerFontSize=e;return this._outerFontSize};r.prototype.fontSize=function(){return this._fontSize};r.prototype._fontCommandTable={normalfont:{"font-family":"KaTeX_Main"},rmfamily:{"font-family":"KaTeX_Main"},sffamily:{"font-family":"KaTeX_SansSerif"},ttfamily:{"font-family":"KaTeX_Typewriter"},bfseries:{"font-weight":"bold"},mdseries:{"font-weight":"medium"},lfseries:{"font-weight":"lighter"},upshape:{"font-style":"normal","font-variant":"normal"},itshape:{"font-style":"italic","font-variant":"normal"},scshape:{"font-style":"normal","font-variant":"small-caps"},slshape:{"font-style":"oblique","font-variant":"normal"},textnormal:{"font-family":"KaTeX_Main"},textrm:{"font-family":"KaTeX_Main"},textsf:{"font-family":"KaTeX_SansSerif"},texttt:{"font-family":"KaTeX_Typewriter"},textbf:{"font-weight":"bold"},textmd:{"font-weight":"medium"},textlf:{"font-weight":"lighter"},textup:{"font-style":"normal","font-variant":"normal"},textit:{"font-style":"italic","font-variant":"normal"},textsc:{"font-style":"normal","font-variant":"small-caps"},textsl:{"font-style":"oblique","font-variant":"normal"},uppercase:{"text-transform":"uppercase"},lowercase:{"text-transform":"lowercase"}};r.prototype._sizingScalesTable={tiny:.68,scriptsize:.8,footnotesize:.85,small:.92,normalsize:1,large:1.17,Large:1.41,LARGE:1.58,huge:1.9,Huge:2.28};r.prototype.updateByCommand=function(e){var t=this._fontCommandTable[e];if(t!==undefined){for(var n in t)this._css[n]=t[n];return}var i=this._sizingScalesTable[e];if(i!==undefined){this._outerFontSize=this._fontSize;this._fontSize=i;return}throw new ParserError("unrecogniazed text-style command")};r.prototype.toCSS=function(){var e="";for(var t in this._css){var n=this._css[t];if(n===undefined)continue;e+=t+":"+n+";"}if(this._fontSize!==this._outerFontSize){e+="font-size:"+this._fontSize/this._outerFontSize+"em;"}return e};function o(e,t){this._nodes=e;this._textStyle=t}o.prototype._renderCloseText=function(e,t){var n=new r(this._textStyle.fontSize());var i=new o(e.children,n);if(e.whitespace)this._html.putText(" ");this._html.putHTML(i.renderToHTML(t))};o.prototype.renderToHTML=function(e){this._html=new s;var t;while((t=this._nodes.shift())!==undefined){var n=t.type;var i=t.value;if(t.whitespace)this._html.putText(" ");switch(n){case"ordinary":this._html.putText(i);break;case"math":if(typeof e==="undefined"){throw"No math backend found. Please setup KaTeX or MathJax."}else if(e.name==="katex"){this._html.putHTML(e.driver.renderToString(i))}else if(e.name==="mathjax"){this._html.putText("$"+i+"$")}else{throw"Unknown math backend "+e}break;case"cond-symbol":this._html.beginSpan("ps-keyword").putText(i.toLowerCase()).endSpan();break;case"special":if(i==="\\\\"){this._html.putHTML("<br/>");break}var a={"\\{":"{","\\}":"}","\\$":"$","\\&":"&","\\#":"#","\\%":"%","\\_":"_"};var h=a[i];this._html.putText(h);break;case"text-symbol":var l={textbackslash:"\\"};var p=l[i];this._html.putText(p);break;case"quote-symbol":var u={"`":"\u2018","``":"\u201c","'":"\u2019","''":"\u201d"};var c=u[i];this._html.putText(c);break;case"call":this._html.beginSpan("ps-funcname").putText(i).endSpan();this._html.write("(");var f=t.children[0];this._renderCloseText(f,e);this._html.write(")");break;case"close-text":this._renderCloseText(t,e);break;case"font-dclr":case"sizing-dclr":this._textStyle.updateByCommand(i);this._html.beginSpan(null,this._textStyle.toCSS());var d=new o(this._nodes,this._textStyle);this._html.putHTML(d.renderToHTML(e));this._html.endSpan();break;case"font-cmd":var _=this._nodes[0];if(_.type!=="close-text")continue;var m=new r(this._textStyle.fontSize());m.updateByCommand(i);this._html.beginSpan(null,m.toCSS());var x=new o(_.children,m);this._html.putHTML(x.renderToHTML(e));this._html.endSpan();break;default:throw new ParseError("Unexpected ParseNode of type "+t.type)}}return this._html.toMarkup()};function s(){this._body=[];this._textBuf=[]}s.prototype.beginDiv=function(e,t,n){this._beginTag("div",e,t,n);this._body.push("\n");return this};s.prototype.endDiv=function(){this._endTag("div");this._body.push("\n");return this};s.prototype.beginP=function(e,t,n){this._beginTag("p",e,t,n);this._body.push("\n");return this};s.prototype.endP=function(){this._flushText();this._endTag("p");this._body.push("\n");return this};s.prototype.beginSpan=function(e,t,n){this._flushText();return this._beginTag("span",e,t,n)};s.prototype.endSpan=function(){this._flushText();return this._endTag("span")};s.prototype.putHTML=function(e){this._flushText();this._body.push(e);return this};s.prototype.putText=function(e){this._textBuf.push(e);return this};s.prototype.write=function(e){this._body.push(e)};s.prototype.toMarkup=function(){this._flushText();var e=this._body.join("");return e.trim()};s.prototype.toDOM=function(){var e=this.toMarkup();var t=document.createElement("div");t.innerHTML=e;return t.firstChild};s.prototype._flushText=function(){if(this._textBuf.length===0)return;var e=this._textBuf.join("");this._body.push(this._escapeHtml(e));this._textBuf=[]};s.prototype._beginTag=function(e,t,n,r){var o="<"+e;if(t)o+=' class="'+t+'"';if(n){var s;if(i.isString(n))s=n;else{s="";for(var a in n){attrVal=n[a];s+=a+":"+attrVal+";"}}if(r)s+=r;o+=' style="'+s+'"'}o+=">";this._body.push(o);return this};s.prototype._endTag=function(e){this._body.push("</"+e+">");return this};var a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};s.prototype._escapeHtml=function(e){return String(e).replace(/[&<>"'/]/g,function(e){return a[e]})};function h(e){e=e||{};this.indentSize=e.indentSize?this._parseEmVal(e.indentSize):1.2;this.commentDelimiter=e.commentDelimiter||" // ";this.lineNumberPunc=e.lineNumberPunc||":";this.lineNumber=e.lineNumber!==undefined?e.lineNumber:false;this.noEnd=e.noEnd!==undefined?e.noEnd:false;if(e.captionCount!==undefined)l.captionCount=e.captionCount}h.prototype._parseEmVal=function(e){e=e.trim();if(e.indexOf("em")!==e.length-2)throw"option unit error; no `em` found";return Number(e.substring(0,e.length-2))};function l(t,n){this._root=t.parse();this._options=new h(n);this._openLine=false;this._blockLevel=0;this._textLevel=-1;this._globalTextStyle=new r;this.backend=undefined;try{if(typeof katex==="undefined")katex=e("katex")}catch(e){}try{if(typeof MathJax==="undefined")MathJax=e("mathjax")}catch(e){}if(typeof katex!=="undefined"){this.backend={name:"katex",driver:katex}}else if(typeof MathJax!=="undefined"){this.backend={name:"mathjax",driver:MathJax}}}l.captionCount=0;l.prototype.toMarkup=function(){var e=this._html=new s;this._buildTree(this._root);delete this._html;return e.toMarkup()};l.prototype.toDOM=function(){var e=this.toMarkup();var t=document.createElement("div");t.innerHTML=e;return t.firstChild};l.prototype._beginGroup=function(e,t,n){this._closeLineIfAny();this._html.beginDiv("ps-"+e+(t?" "+t:""),n)};l.prototype._endGroup=function(e){this._closeLineIfAny();this._html.endDiv()};l.prototype._beginBlock=function(){var e=this._options.lineNumber&&this._blockLevel===0?.6:0;var t=this._options.indentSize+e;this._beginGroup("block",null,{"margin-left":t+"em"});this._blockLevel++};l.prototype._endBlock=function(){this._closeLineIfAny();this._endGroup();this._blockLevel--};l.prototype._newLine=function(){this._closeLineIfAny();this._openLine=true;this._globalTextStyle.outerFontSize(1);var e=this._options.indentSize;if(this._blockLevel>0){this._numLOC++;this._html.beginP("ps-line ps-code",this._globalTextStyle.toCSS());if(this._options.lineNumber){this._html.beginSpan("ps-linenum",{left:-((this._blockLevel-1)*(e*1.25))+"em"}).putText(this._numLOC+this._options.lineNumberPunc).endSpan()}}else{this._html.beginP("ps-line",{"text-indent":-e+"em","padding-left":e+"em"},this._globalTextStyle.toCSS())}};l.prototype._closeLineIfAny=function(){if(!this._openLine)return;this._html.endP();this._openLine=false};l.prototype._typeKeyword=function(e){this._html.beginSpan("ps-keyword").putText(e).endSpan()};l.prototype._typeFuncName=function(e){this._html.beginSpan("ps-funcname").putText(e).endSpan()};l.prototype._typeText=function(e){this._html.write(e)};l.prototype._buildTreeForAllChildren=function(e){var t=e.children;for(var n=0;n<t.length;n++)this._buildTree(t[n])};l.prototype._buildCommentsFromBlock=function(e){var t=e.children;while(t.length>0&&t[0].type==="comment"){var n=t.shift();this._buildTree(n)}};l.prototype._buildTree=function(e){var t;var n;var i;switch(e.type){case"root":this._beginGroup("root");this._buildTreeForAllChildren(e);this._endGroup();break;case"algorithm":var s;for(t=0;t<e.children.length;t++){n=e.children[t];if(n.type!=="caption")continue;s=n;l.captionCount++}if(s){this._beginGroup("algorithm","with-caption");this._buildTree(s)}else{this._beginGroup("algorithm")}for(t=0;t<e.children.length;t++){n=e.children[t];if(n.type==="caption")continue;this._buildTree(n)}this._endGroup();break;case"algorithmic":if(this._options.lineNumber){this._beginGroup("algorithmic","with-linenum");this._numLOC=0}else{this._beginGroup("algorithmic")}this._buildTreeForAllChildren(e);this._endGroup();break;case"block":this._beginBlock();this._buildTreeForAllChildren(e);this._endBlock();break;case"function":var a=e.value.type.toLowerCase();var h=e.value.name;i=e.children[0];var p=e.children[1];this._newLine();this._typeKeyword(a+" ");this._typeFuncName(h);this._typeText("(");this._buildTree(i);this._typeText(")");this._buildCommentsFromBlock(p);this._buildTree(p);if(!this._options.noEnd){this._newLine();this._typeKeyword("end "+a)}break;case"if":this._newLine();this._typeKeyword("if ");ifCond=e.children[0];this._buildTree(ifCond);this._typeKeyword(" then");var u=e.children[1];this._buildCommentsFromBlock(u);this._buildTree(u);var c=e.value.numElif;for(var f=0;f<c;f++){this._newLine();this._typeKeyword("else if ");var d=e.children[2+2*f];this._buildTree(d);this._typeKeyword(" then");var _=e.children[2+2*f+1];this._buildCommentsFromBlock(_);this._buildTree(_)}var m=e.value.hasElse;if(m){this._newLine();this._typeKeyword("else");var x=e.children[e.children.length-1];this._buildCommentsFromBlock(x);this._buildTree(x)}if(!this._options.noEnd){this._newLine();this._typeKeyword("end if")}break;case"loop":this._newLine();var y=e.value;var v={for:"for",forall:"for all",while:"while"};this._typeKeyword(v[y]+" ");var b=e.children[0];this._buildTree(b);this._typeKeyword(" do");var w=e.children[1];this._buildCommentsFromBlock(w);this._buildTree(w);if(!this._options.noEnd){this._newLine();var g=y==="while"?"end while":"end for";this._typeKeyword(g)}break;case"repeat":this._newLine();this._typeKeyword("repeat");var T=e.children[0];this._buildCommentsFromBlock(T);this._buildTree(T);if(!this._options.noEnd){this._newLine();this._typeKeyword("until ");var k=e.children[1];this._buildTree(k)}break;case"command":var C=e.value;var S={state:"",ensure:"Ensure: ",require:"Require: ",input:"Input: ",output:"Output: ",print:"print ",return:"return "}[C];this._newLine();if(S)this._typeKeyword(S);i=e.children[0];this._buildTree(i);break;case"caption":this._newLine();this._typeKeyword("Algorithm "+l.captionCount+" ");i=e.children[0];this._buildTree(i);break;case"comment":i=e.children[0];this._html.beginSpan("ps-comment");this._html.putText(this._options.commentDelimiter);this._buildTree(i);this._html.endSpan();break;case"open-text":var L=new o(e.children,this._globalTextStyle);this._html.putHTML(L.renderToHTML(this.backend));break;case"close-text":var E=this._globalTextStyle.fontSize();var M=new r(E);var z=new o(e.children,M);this._html.putHTML(z.renderToHTML(this.backend));break;default:throw new ParseError("Unexpected ParseNode of type "+e.type)}};t.exports=l},{"./utils":6,katex:undefined,mathjax:undefined}],6:[function(e,t,n){function i(e){return typeof e==="string"||e instanceof String}function r(e){return typeof e==="object"&&e instanceof Object}function o(e){if(!r(e))return e+"";var t=[];for(var n in e)t.push(n+": "+o(e[n]));return t.join(", ")}t.exports={isString:i,isObject:r,toString:o}},{}]},{},[1])(1)});
