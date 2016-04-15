cd ..\tools
ajaxmin -clobber:true -enc:out ascii -rename:none ../src/shell/webbrowser/re.js -o ../src/min/shell/webbrowser/re.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/(webkit)/re.js -o ../src/min/shell/webbrowser/(webkit)/re.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/(webkit)/patch/patch-IE.js -o ../src/min/shell/webbrowser/(webkit)/patch/patch-IE.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/ie/re.js -o ../src/min/shell/webbrowser/ie/re.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/ie/patch/IE8+-patch-std.js -o ../src/min/shell/webbrowser/ie/patch/IE8+-patch-std.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/ie/patch/IE9+-patch-std.js	-o ../src/min/shell/webbrowser/ie/patch/IE9+-patch-std.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/ie/patch/IE11+-patch-std.js -o ../src/min/shell/webbrowser/ie/patch/IE11+-patch-std.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/ie/patch/all-patch-std.js -o ../src/min/shell/webbrowser/ie/patch/all-patch-std.js	
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/firefox/re.js -o ../src/min/shell/webbrowser/firefox/re.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/firefox/patch/patch-IE.js -o ../src/min/shell/webbrowser/firefox/patch/patch-IE.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/opera/re.js -o ../src/min/shell/webbrowser/opera/re.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/opera/patch/patch-IE.js -o ../src/min/shell/webbrowser/opera/patch/patch-IE.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/safari(ipad)/re.js -o ../src/min/shell/webbrowser/safari(ipad)/re.js
ajaxmin -clobber:true -enc:out ascii ../src/shell/webbrowser/safari(ipad)/patch/patch-IE.js -o ../src/min/shell/webbrowser/safari(ipad)/patch/patch-IE.js

pause