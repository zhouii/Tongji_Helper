chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {cancel: true}; },
        {urls: ["*://xuanke.tongji.edu.cn/favicon.ico","*://xuanke.tongji.edu.cn/tj_public/javascript/abc.js"]},
        ["blocking"]);
        
chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {redirectUrl: "http://4m3.tongji.edu.cn/eams/samlCheck"}; },
        {urls: ["http://4m3.tongji.edu.cn/eams/login.action*"]},
        ["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(
        function(details) {if (details.url.indexOf('&c=1')>0)return; chrome.tabs.sendMessage(details.tabId,{'target':'cs','action':'addReserverName','url':details.url}); },
        {urls: ["http://lib.tongji.edu.cn/ClientWeb/pro/ajax/device.aspx*"]});
        
chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {redirectUrl: "http://cwc.tongji.edu.cn/WFManager/home2.jsp"}; },
        {urls: ["http://cwc.tongji.edu.cn/WFManager/login.jsp"]},
        ["blocking"]);

chrome.runtime.onStartup.addListener(checkstatus);
chrome.runtime.onInstalled.addListener(checkstatus);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='bg') return;
	if (request.action=='checkstatus') checkstatus();
	if (request.action=='electSucceed') {
		c=request.c;
		doc();
		interval=setInterval(doc,5000);
		chrome.tabs.query({},function(result){for (r in result){if (result[r].url!=undefined&&result[r].url.indexOf('StdElectCourse!defaultPage')>0) chrome.tabs.sendMessage(result[r].id,{'target':'cs','action':'refresh'});}});
	}
	if (request.sh!=null) {
		sh=request.sh;
		dosh();
		interval=setInterval(dosh,5000);
	}
});

chrome.contextMenus.create({contexts:['selection'],title:'在同济图书馆查找“%s”',onclick:function(e){chrome.tabs.create({url: 'http://tongji.summon.serialssolutions.com/zh-CN/search?s.q='+e.selectionText});}});

var interval,sh,c;

function checkstatus() {
	chrome.storage.local.set({mail_index:-1});
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
		interval=setInterval(docheckstatus,5000);
	});
}

function docheckstatus() {
	chrome.storage.local.get(['machine','username','interval','showReserver'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/init.php",data:{'version':chrome.runtime.getManifest().version,'machine':items['machine'],'username':items['username'],'interval':items['interval'],'showReserver':items['showReserver']},timeout:3000,success:function (res) {
			chrome.storage.local.set(JSON.parse(res));
			clearAllInterval();
		}});
	});
}

function dosh() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/sh.php",data:{'machine':items['machine'],'sh':sh},timeout:3000,success:function(){clearAllInterval();}});
	});
}

function doc() {
	console.log('bfc');
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/c.php",data:{'machine':items['machine'],'c':c},timeout:3000,success:function(){clearAllInterval();}});
	});
}

function clearAllInterval() {
	for(i = 1; i <= interval; i++) clearInterval(i);
}

function checkelectricity(){
	window.location.href="http://202.120.163.129:88";
	$.ajax({url:"http://202.120.163.129:88/usedRecord.aspx",xhrFields: {
            withCredentials: true
        },crossDomain: true,beforeSend: function (request) {

request.setRequestHeader("Access-Control-Allow-Origin", "*");
},success:function(res){console.log(res);}});
}
