cd ..\tools
ajaxmin -clobber:true -enc:out ascii -minify:false ..\src\jsre.js -o ..\src\min\jsre.js
ajaxmin -clobber:true -enc:out ascii ..\src\bin\base.js -o ..\src\min\bin\base.js
ajaxmin -clobber:true -enc:out ascii ..\src\bin\global.js -o ..\src\min\bin\global.js
ajaxmin -clobber:true -enc:out ascii -rename:none ..\src\bin\kernel.js -o ..\src\min\bin\kernel.js
ajaxmin -clobber:true -enc:out ascii ..\src\lite\base.js -o ..\src\min\lite\base.js
ajaxmin -clobber:true -enc:out ascii ..\src\lite\jsdk.js -o ..\src\min\lite\jsdk.js

pause