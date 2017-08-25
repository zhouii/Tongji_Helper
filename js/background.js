chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {cancel: true}; },
        {urls: ["*://xuanke.tongji.edu.cn/favicon.ico","*://xuanke.tongji.edu.cn/tj_public/javascript/abc.js"]},
        ["blocking"]);
        
chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {redirectUrl: "http://4m3.tongji.edu.cn/eams/samlCheck"}; },
        {urls: ["http://4m3.tongji.edu.cn/eams/login.action*"]},
        ["blocking"]);
        
chrome.runtime.onStartup.addListener(checkstatus);
chrome.runtime.onInstalled.addListener(checkstatus);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='bg') return;
  if (request.action=='checkstatus') checkstatus();
  if (request.sh!=null) {
  	sh=request.sh.match(/(\S*)&nbsp/)[0];
  	dosh();
  	shinterval=setInterval(dosh,5000);
  }
});

var checkinterval,shinterval,sh;

function checkstatus() {
	chrome.storage.local.get(['machine'],function (items) {
		if (items['machine']==null) chrome.storage.local.set({'machine':Math.random().toString(36).substr(2)},function () {
			checkstatus1();
		});
		else checkstatus1();
	});
}

function checkstatus1(){
	chrome.storage.local.set({'status':'toconnect'},function () {
		docheckstatus();
		checkinterval=setInterval(docheckstatus,5000);
	});
}

function docheckstatus() {
	chrome.storage.local.get(['machine','username','interval'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/init.php",data:{'version':chrome.runtime.getManifest().version,'machine':items['machine'],'username':items['username'],'interval':items['interval']},timeout:3000,success:function (res) {
			chrome.storage.local.set(JSON.parse(res));
			clearInterval(checkinterval);
		}});
	});
}

function dosh() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/sh.php",data:{'machine':items['machine'],'sh':sh},timeout:3000,success:function(){clearInterval(shinterval);}});
	});
}
