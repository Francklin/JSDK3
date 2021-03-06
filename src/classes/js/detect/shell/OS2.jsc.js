/**
 * Detect Operate System for current runtime environment
 * @file OS2.js
 * @version 1.0
 * @since JSDK3
 * @author Liu Denggao
 * @created 2010.06.23
 * @added 2011.5.23 
 */

$package("js.detect.shell");

js.detect.shell.OS2=function(iOptions) {
	var sUserAgent = navigator.userAgent;
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC");
	var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
	var isWin95 = isWin98 = isWinNT4 = isWin2K = isWinME = isWinXP = isWin2K3 = false;
	var isWinVista = isWin7 = false;
	var isMac68K = isMacPPC = false;
	var isSunOS = isMinSunOS4 = isMinSunOS5 = isMinSun0S5_5 = false;

	switch(iOptions){
		case 0:		//usual 
		case 1:		//lite
			if(isWin){
				isWin98 = sUserAgent.indexOf("Win98") > -1 || sUserAgent.indexOf("Windows 98") > -1;
				isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1 || sUserAgent.indexOf("Windows ME") > -1;
				isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
				isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
				isWin2K3 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
				isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
				isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
			}		
			break;
		case 2:		//full
			if(isWin){
				isWin95 = sUserAgent.indexOf("Win95") > -1 || sUserAgent.indexOf("Windows 95") > -1;
				isWin98 = sUserAgent.indexOf("Win98") > -1 || sUserAgent.indexOf("Windows 98") > -1;
				isWinME = sUserAgent.indexOf("Win 9x 4.90") > -1 || sUserAgent.indexOf("Windows ME") > -1;
				isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
				isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
				isWin2K3 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
				isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
				isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
				isWinNT4 = (sUserAgent.indexOf("WinNT") > -1
							|| sUserAgent.indexOf("Windows NT") > -1
							|| sUserAgent.indexOf("WinNT4.0") > -1
							|| sUserAgent.indexOf("Windows NT 4.0") > -1
							) && (!isWinME && !isWin2K && !isWinXP && !isWin2K3 && !isWinVista && !isWin7);		
			}
			if(isMac){
				isMac68K = sUserAgent.indexOf("Mac_68000") > -1
							|| sUserAgent.indexOf("68K") > -1;
				isMacPPC = sUserAgent.indexOf("Mac_PowerPC") > -1
							|| sUserAgent.indexOf("PPC") > -1;
			}
			if(isUnix){
				isSunOS = sUserAgent.indexOf("SunOS") > -1;
				if(isSunOS){
					var reSunOS = new RegExp("SunOS (\\d+\\.\\d+(?:\\.\\d+)?");
					reSunOS.test(sUserAgent);
					isMinSunOS4 = compareVersions(RegExp["$1"],"4.0") >= 0;
					isMinSunOS5 = compareVersions(RegExp["$1"],"5.0") >= 0;
					isMinSunOS5_5 = compareVersions(RegExp["$1"],"5.5") >= 0;
				}
			}
			break;
	}

	this.isWin=isWin;
	this.isWin95=isWin95;
	this.isWin98=isWin98;
	this.isWinME=isWinME;
	this.isWinNT4=isWinNT4;
	this.isWin2K=isWin2K;
	this.isWinXP=isWinXP;
	this.isWin2K3=isWin2K3;
	this.isWinVista=isWinVista;
	this.isWin7=isWin7;
	this.isMac=isMac;
	this.isMac68K=isMac68K;
	this.isMacPPC=isMacPPC;
	this.isUnix=isUnix;
	this.isSunOS=isSunOS;
	this.isMinSunOS4=isMinSunOS4;
	this.isMinSunOS5=isMinSunOS5;
	this.isMinSun0S5_5=isMinSun0S5_5;
}

