cd ..\tools
ajaxmin -clobber:true -enc:out ascii ..\src\lite\base.js -o ..\src\min\lite\base.js
ajaxmin -clobber:true -enc:out ascii ..\src\lite\jsdk.js -o ..\src\min\lite\jsdk.js

pause