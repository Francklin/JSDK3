cd ..\tools
gzip -a -c ..\src\lib\resources\core.js > ..\src\min\lib\resources\core.js.gz
gzip -a -c ..\src\lib\resources\dom.js > ..\src\min\lib\resources\dom.js.gz
gzip -a -c ..\src\lib\resources\ui.js > ..\src\min\lib\resources\ui.js.gz
gzip -a -c ..\src\lib\resources\ui-home.js > ..\src\min\lib\resources\ui-home.js.gz
gzip -a -c ..\src\lib\resources\ui-menu.js > ..\src\min\lib\resources\ui-menu.js.gz
gzip -a -c ..\src\lib\resources\ui-table.js > ..\src\min\lib\resources\ui-table.js.gz

pause