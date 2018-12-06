chrome.webRequest.onBeforeRequest.addListener(
	function(details) { return {cancel: true}; },
	{urls: ["*://xuanke.tongji.edu.cn/favicon.ico","*://xuanke.tongji.edu.cn/tj_public/javascript/abc.js"]},
	["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(
	function(details) { return {redirectUrl: "http://4m3.tongji.edu.cn/eams/samlCheck"}; },
	{urls: ["http://4m3.tongji.edu.cn/eams/login.action*"]},
	["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (details.url.indexOf('&c=1')>0) return;
		chrome.tabs.sendMessage(details.tabId,{'target':'cs','action':'addReserverName','url':details.url});
	},
	{urls: ["http://lib.tongji.edu.cn/yxxj/ClientWeb/pro/ajax/device.aspx*"]});

chrome.webRequest.onBeforeRequest.addListener(
	function(details) { return {redirectUrl: "http://cwc.tongji.edu.cn/WFManager/home2.jsp"}; },
	{urls: ["http://cwc.tongji.edu.cn/WFManager/login.jsp"]},
	["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (details.method=='POST' && details.requestBody.formData.radio!=null) {
			var request=details.requestBody.formData;
			for (var i in request) request[i]=request[i][0];
			chrome.storage.local.set({elec_request:request});
		}
	},
	{urls: ["http://202.120.163.129:88/Default.aspx"]},
	["requestBody"]);

chrome.runtime.onStartup.addListener(checkstatus);
chrome.runtime.onInstalled.addListener(checkstatus);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='bg') return;
	if (request.action=='checkstatus') checkstatus();
	if (request.action=='electSucceed') {
		c=request.c;
		doc();
		interval['c']=setInterval(doc,5000);
		chrome.tabs.query({},function(result){
			for (r in result) {
				if (result[r].url!=undefined&&result[r].url.indexOf('StdElectCourse!defaultPage')>0)
					chrome.tabs.sendMessage(result[r].id,{'target':'cs','action':'refresh'});
			}
		});
	}
	if (request.action=='setRoomSucceed') {
		chrome.storage.local.set({elec_lastcheck:0});
		checkstatus();
		chrome.notifications.create('setRoomSucceed',{'type':'basic','iconUrl':'img/icon48.png','title':'房间号设置成功','message':'房间号已设置为'+request.room});
	}
	if (request.sh!=null) {
		sh=request.sh;
		dosh();
		interval['sh']=setInterval(dosh,5000);
	}
});

chrome.contextMenus.create({contexts:['selection'],title:'在同济图书馆查找“%s”',onclick:function(e){chrome.tabs.create({url: 'http://tongji.summon.serialssolutions.com/zh-CN/search?s.q='+e.selectionText});}});

var interval=new Array(),sh,c;

function checkstatus() {
	chrome.storage.local.set({mail_index:-1,checkscore:0});
	chrome.storage.local.get(['machine'],function (items) {
		if (items['machine']==null)
			chrome.storage.local.set({'machine':Math.random().toString(36).substr(2)},function () {
				checkstatus1();
			});
		else checkstatus1();
	});
}

function checkstatus1() {
	chrome.storage.local.set({'status':'toconnect'},function () {
		docheckstatus();
		interval['ck']=setInterval(docheckstatus,5000);
	});
}

function docheckstatus() {
	chrome.storage.local.get(['machine','username','interval','elec_enable','elec_threshold','showReserver','mail'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/init.php",data:{'version':chrome.runtime.getManifest().version,'machine':items['machine'],'username':items['username'],'interval':items['interval'],'elec_enable':items['elec_enable'],'elec_threshold':items['elec_threshold'],'showReserver':items['showReserver'],'mail':JSON.stringify(items['mail'])},timeout:3000,success:function (res) {
			chrome.storage.local.set(JSON.parse(res));
			interval['elec']=setInterval(checkelec,5000);
			clearInterval(interval['ck']);
		},error:function(xhr){if (xhr.status>500) $.ajax({url:"https://tiny.zhouii.com/qqemoji/e189.gif?t="+new Date().getTime(),success:function(){chrome.storage.local.set({'status':'allow'});}});}});
	});
}

function dosh() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/sh.php",data:{'machine':items['machine'],'sh':sh},timeout:3000,success:function(){clearInterval(interval['sh']);}});
	});
}

function doc() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/c.php",data:{'machine':items['machine'],'c':c},timeout:3000,success:function(){clearInterval(interval['c']);}});
	});
}

var elecbalance;
function checkelec() {
	chrome.storage.local.get(['elec_request','enable','elec_enable','room','elec_lastcheck'],function (items) {
		var today=new Date().format('yyyyMMdd');
		if (items['enable']!=true || items['elec_enable']!=true || items['elec_request']==null 
			|| items['room']==null || items['elec_lastcheck']==today) {
			clearInterval(interval['elec']);
			return;
		}
		$.ajax({type:'POST',url:"http://202.120.163.129:88/Default.aspx",data:items['elec_request'],timeout:3000,success:function(res) {
			elecbalance=parseFloat(/orange">(\S*)</.exec(res)[1]);
			console.log('Electricity balance checked ('+elecbalance+') on '+new Date());
			chrome.storage.local.set({elec_lastcheck:today});
			chrome.storage.local.get(['elec_threshold','room'],function (items) {
				var elec_threshold=(items['elec_threshold']==null||items['elec_threshold']=='')?20:items['elec_threshold'];
				if (elecbalance<elec_threshold) {
					chrome.notifications.create('elec',{'type':'basic','iconUrl':'img/icon48.png','title':'寝室低电量提醒','message':items['room']+'房间电费仅剩'+elecbalance+'元，已不足'+elec_threshold+'元，请尽快充值！','buttons':[{'title':'朕知道了'}],'requireInteraction':true});
					chrome.notifications.onButtonClicked.addListener(function () {chrome.notifications.clear('elec')});
				}
			});
			clearInterval(interval['elec']);
		}});
	});
	
	
}
