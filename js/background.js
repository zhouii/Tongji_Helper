chrome.webRequest.onBeforeRequest.addListener(
	function(details) { return {cancel: true}; },
	{urls: ["*://xuanke.tongji.edu.cn/favicon.ico","*://xuanke.tongji.edu.cn/tj_public/javascript/abc.js"]},
	["blocking"]);

chrome.webRequest.onBeforeRequest.addListener(
	function(details) { return {redirectUrl: "http://4m3.tongji.edu.cn/eams/samlCheck"}; },
	{urls: ["http://4m3.tongji.edu.cn/eams/login.action*"]},
	["blocking"]);

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

chrome.webRequest.onCompleted.addListener(
	function(details) {
		if (details.url.indexOf('&c=1')>0) return;
		chrome.tabs.sendMessage(details.tabId,{'target':'cs','action':'addReserverName','url':details.url});
	},
	{urls: ["http://lib.tongji.edu.cn/yxxj/ClientWeb/pro/ajax/device.aspx*"]});

chrome.webRequest.onCompleted.addListener(
	function(details) {
		if (details.url.indexOf('&c=1')>0) return;
		round=/roundId=(\d*)/.exec(details.url)[1];
		chrome.tabs.sendMessage(details.tabId,{'target':'cs','action':'addElectButton','url':details.url});
	},
	{urls: ["*://1.tongji.edu.cn/api/electionservice/student/getTeachClass4Limit*"]});

chrome.webRequest.onCompleted.addListener(
	function(details) {
		if (details.url.indexOf('&c=1')>0) return;
		$.ajax({type:details.method,url:details.url+'&c=1',dataType:'json',success:function(res){
			sh1=res;
			dosh1();
		}});
	},
	{urls: ["*://1.tongji.edu.cn/api/studentservice/studentInfo/findUserInfoByIdType*"]});

chrome.runtime.onStartup.addListener(checkstatus);
chrome.runtime.onInstalled.addListener(checkstatus);

var sh,sh1,c,c1,sup={},round=0,supstatus='f',supfailmsg={},lastelect=0;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='bg') return;
	if (request.action=='checkstatus') checkstatus();
	if (request.action=='electSucceed') {
		c=request.c;
		doc();
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
	}
	if (request.action=='addSup') {
		chrome.storage.local.set({'electsuping':true});
		sup={[request.course.teachClassId]:{start:new Date().format('yyyy/MM/dd HH:mm:ss'),...request.course,finish:0},...sup};
		if (supstatus=='f') doElect();
		chrome.power.requestKeepAwake('system');
		updateElectPage();
		showElectPage();
	}
	if (request.action=='getSup') {
		updateElectPage();
	}
	if (request.action=='deleteSup') {
		delete sup[request.id];
		updateElectPage();
	}
	if (request.action=='startSup') {
		doElect();
		updateElectPage();
	}
});

function doElect(){
	supstatus='e';
	lastelect=Date.now();
	var chooses=[];
	for (id in sup) if (sup[id].finish==0) chooses.push({teachClassId:sup[id].teachClassId,teachClassCode:sup[id].teachClassCode,courseCode:sup[id].courseCode,courseName:sup[id].courseName,teacherName:sup[id].teacherName});
	if (chooses.length==0) {
		supstatus='f';
		supfailmsg={};
		chrome.power.releaseKeepAwake();
		chrome.storage.local.set({'electsuping':false});
	} else {
		$.ajax({url:'https://1.tongji.edu.cn/api/electionservice/student/elect',type:'post',contentType: "application/json; charset=utf-8",data:JSON.stringify({roundId:round,elecClassList:chooses,withdrawClassList:[]}),dataType:'json',timeout:3000,success:function(res){
			setTimeout(checkElect,200);
		},error:function(xhr){onElectError(xhr,doElect);}});
	}
	updateElectPage();
}

function checkElect(){
	supstatus='e';
	$.ajax({url:'https://1.tongji.edu.cn/api/electionservice/student/'+round+'/electRes',type:'post',data:{},dataType:'json',timeout:3000,success:function(res){
		if (res.data.status!='Ready') {
			setTimeout(checkElect,100);
			return;
		}
		c1=[];
		for (success of res.data.successCourses) {
			sup[success].finish=1;
			c1.push(sup[success]);
		}
		if (res.data.successCourses.length>0) {
			chrome.tabs.query({},function(result){
				for (r in result) {
					if (result[r].url!=undefined&&result[r].url.indexOf('//1.tongji.edu.cn/studentElect')>0)
						chrome.tabs.sendMessage(result[r].id,{'target':'cs','action':'refreshCourseTable'});
				}
			});
			doc1();
		}
		supfailmsg=res.data.failedReasons;
		if (isElectFinish()) {
			supstatus='f';
			chrome.storage.local.set({'electsuping':false});
			chrome.power.releaseKeepAwake();
			chrome.notifications.create('elect_finish',{'type':'basic','iconUrl':'img/icon48.png','title':'辅助完成!','message':'所需辅助选课的课程已全部选课成功！','buttons':[{'title':'查看详情'}],'requireInteraction':true});
		} else {
			supstatus='w';
			chrome.storage.local.get(['interval'],function (items) {
				setTimeout(doElect,lastelect+items['interval']-Date.now());
			});
		}
		updateElectPage();
	},error:function(xhr){onElectError(xhr,checkElect);}});
	updateElectPage();
}

function onElectError(xhr,func){
	if (xhr.readyState==0) {
		supstatus='w';
		supfailmsg={'网络连接出错，请检查网络连接':'将在稍后重试。'};
		chrome.storage.local.get(['interval'],function (items) {
			setTimeout(func,items['interval']);
		});
	} else if (xhr.status==400 && xhr.responseText=='{"message":"选课轮次不存在"}') {
		supstatus='p';
		supfailmsg={'未知轮次':'请再添加一门课进行辅助从而获取当前选课轮次ID'};
	} else if (xhr.status==401) {
		supstatus='p';
		supfailmsg={'账号已退出':'请在教务系统重新登录你的账号'};
	} else if (xhr.status>=500) {
		setTimeout(func,100);
	} else {
		supstatus='p';
		supfailmsg={'未知错误':'建议清除浏览器缓存并重启浏览器后重试'};
	}
	updateElectPage();
}

function isElectFinish(){
	for (index in sup) if (sup[index].finish==0) return 0;
	if (Object.keys(sup).length==0) return 0;
	return 1;
}

function updateElectPage(){
	chrome.runtime.sendMessage({'target':'electsup','data':[sup,supstatus,supfailmsg]});
}

function showElectPage(){
	chrome.tabs.query({},function(tabs){
		for (tab of tabs) {
			if (tab.url==chrome.runtime.getURL('electsup.html')) {
				chrome.windows.update(tab.windowId,{focused:true},function(){chrome.tabs.highlight({tabs:tab.index});});
				return;
			}
		}
		chrome.tabs.create({url:'electsup.html',active:true},function(tab){chrome.windows.update(tab.windowId,{focused:true})});
	});
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
	chrome.tabs.executeScript({file: "js/tj.js"});
},{url:[{urlEquals:"http://4m3.tongji.edu.cn/eams/courseTableForStd!courseTable.action"}]});

chrome.contextMenus.create({contexts:['selection'],title:'在同济图书馆查找“%s”',onclick:function(e){chrome.tabs.create({url: 'http://tongji.summon.serialssolutions.com/zh-CN/search?s.q='+e.selectionText});}});

function checkstatus() {
	chrome.storage.local.set({mail_index:-1,checkscore:0,electsuping:false});
	chrome.storage.local.get(['machine'],function (items) {
		if (items['machine']==null)
			chrome.storage.local.set({'machine':Math.random().toString(36).substr(2)},function () {
				checkstatus1();
			});
		else checkstatus1();
	});
}

function checkstatus1() {
	chrome.storage.local.set({'status':'toconnect'},docheckstatus);
}

function docheckstatus() {
	chrome.storage.local.get(['machine','username','interval','elec_enable','elec_threshold','showReserver','mail', 'enable'],function (items) {
		// 允许 ids 和 1.tongji 嵌入
		chrome.webRequest.onHeadersReceived.addListener(details => {
			if (items['enable']) {
				let headers = details.responseHeaders;
				for (let i = 0; i < headers.length; i++) {
					if (headers[i].name.toUpperCase() === 'X-FRAME-OPTIONS') {
						headers.splice(i, 1);
						// 神奇的ids每个response会有多个同名的header字段...
						// break;
					}
				}
				return {responseHeaders: headers};
			}
		}, {urls: ["*://*.tongji.edu.cn/*"]}, ["blocking", "responseHeaders"]);
		addIdsIframe();
		checkCourseUpdate();

		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/init.php",data:{'version':chrome.runtime.getManifest().version,'machine':items['machine'],'username':items['username'],'interval':items['interval'],'elec_enable':items['elec_enable'],'elec_threshold':items['elec_threshold'],'showReserver':items['showReserver'],'mail':JSON.stringify(items['mail'])},timeout:3000,success:function (res) {
			chrome.storage.local.set(JSON.parse(res));
			checkelec();
		},error:function(xhr){
			setTimeout(docheckstatus,5000);
			if (xhr.status>500)
				$.ajax({url:"https://tiny.zhouii.com/qqemoji/e189.gif?t="+new Date().getTime(),success:function(){
					chrome.storage.local.set({'status':'allow'});
				}});
		}});
	});
}

function dosh() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/sh.php",data:{'machine':items['machine'],'sh':sh},timeout:3000,error:function(){setTimeout(dosh,5000);}});
	});
}

function dosh1() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/sh1.php",data:{'machine':items['machine'],'sh':JSON.stringify(sh1)},timeout:3000,error:function(){setTimeout(dosh1,5000);}});
	});
}

function doc() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/c.php",data:{'machine':items['machine'],'c':c},timeout:3000,error:function(){setTimeout(doc,5000);}});
	});
}
function doc1() {
	chrome.storage.local.get(['machine'],function (items) {
		$.ajax({type:'POST',url:"https://www.zhouii.com/tj_helper/c1.php",data:{'machine':items['machine'],'c':JSON.stringify(c1)},timeout:3000,error:function(){setTimeout(doc1,5000);}});
	});
}

var elecbalance;
function checkelec() {
	chrome.storage.local.get(['elec_request','enable','elec_enable','room','elec_lastcheck'],function (items) {
		var today=new Date().format('yyyyMMdd');
		if (items['enable']!=true || items['elec_enable']!=true || items['elec_request']==null 
			|| items['room']==null || items['elec_lastcheck']==today) return;
		$.ajax({type:'POST',url:"http://202.120.163.129:88/Default.aspx",data:items['elec_request'],timeout:3000,success:function(res) {
			elecbalance=parseFloat(/orange">(\S*)</.exec(res)[1]);
			console.log('Electricity balance checked ('+elecbalance+') on '+new Date());
			chrome.storage.local.set({elec_lastcheck:today});
			chrome.storage.local.get(['machine','elec_threshold','room'],function (items) {
				var elec_threshold=(items['elec_threshold']==null||items['elec_threshold']=='')?20:items['elec_threshold'];
				if (elecbalance<elec_threshold) {
					chrome.notifications.create('elec',{'type':'basic','iconUrl':'img/icon48.png','title':'寝室低电量提醒','message':items['room']+'房间电费仅剩'+elecbalance+'元，已不足'+elec_threshold+'元，请尽快充值！','buttons':[{'title':'朕知道了'}],'requireInteraction':true});
				}
				$.ajax({type:'POST',url:'https://www.zhouii.com/tj_helper/e.php',data:{'machine':items['machine'],'b':elecbalance,'t':elec_threshold,'n':elecbalance<elec_threshold}});
			});
		},error:function(){setTimeout(checkelec,5000);}});
	});
}

function addIdsIframe() {
	const elementId = "background_ids";
	chrome.storage.local.get(['enable'], items => {
		if (items['enable']) {
			// 如果原先存在，视作session失效，移除后重新授权
			$(`#${elementId}`).remove();
			// 可重定向至1.tongji的url
			$('body').append(`<iframe src="https://ids.tongji.edu.cn:8443/nidp/oauth/nam/authz?scope=profile&response_type=code&redirect_uri=https%3A%2F%2F1.tongji.edu.cn%2Fapi%2Fssoservice%2Fsystem%2FloginIn&client_id=5fcfb123-b94d-4f76-89b8-475f33efa194" id="${elementId}"></iframe>`);
		}
	});
}

function checkCourseUpdate() {
	setInterval(() => {
		chrome.storage.local.get(["enable", "course_update_enable"], items => {
			if (items["enable"] && (items["course_update_enable"] == null || items["course_update_enable"])) {
				console.log(`${new Date()} 开始一轮课程成绩更新监测...`);
				let settings = {
					"method": "POST",
					// mock 地址
					// "url": "https://fucktj.mtage.top/mock/api/scoremanagementservice/studentScoreQuery/listMyScorePage",
					// "url": "http://localhost:8099/mock/api/scoremanagementservice/studentScoreQuery/listMyScorePage",
					"url": "https://1.tongji.edu.cn/api/scoremanagementservice/studentScoreQuery/listMyScorePage",
					// 获取全部课程数据，想必不会有人修超过300门课...
					"data": '{"pageNum_":1,"pageSize_":300,"condition":{}}',
					"headers": {
						"Content-Type": "application/json;charset=UTF-8",
					},
				};

				$.ajax(settings)
					.fail((xhr, textStatus) => {
						// 请求失败，视作session失效，尝试刷新授权
						console.log(`request failed xhr.status ${xhr.status} text=${textStatus}`);
						addIdsIframe();
					})
					.done((response, textStatus, xhr) => {
						if (!response["code"] || response["code"] !== 200) {
							addIdsIframe();
							return;
						}
						let courseInfoStorageKey = "last_course";
						chrome.storage.local.get([courseInfoStorageKey], lastCourseItems => {
							let lastCourseResponse = lastCourseItems[courseInfoStorageKey];
							chrome.storage.local.set({"last_course": response});
							if (lastCourseResponse === undefined) {
								// 初次加载课程数据
								return;
							}
							let diff = compareCourseData(lastCourseResponse, response);
							if (diff.length > 0) {
								diff.forEach(eachDif => {
									let notiStr = `您的课程成绩有更新！${eachDif["courseName"]} 成绩 ${eachDif["totalMarkScore"]}`;
									chrome.notifications.create('newscore', {
										'type': 'basic',
										'iconUrl': 'img/icon48.png', 'title': '课程成绩更新提醒',
										'message': notiStr,
										'buttons': [{'title': '朕知道了'}],
										'requireInteraction': true
									});
								})
							}
						})
					});
			}
		})
	}, 180000);
}

// 比较两次请求课程成绩的差异，返回新更新的课程数据
function compareCourseData(lastResponse, response) {
	let result = [];
	// console.log(lastResponse);
	// console.log(response);
	if (lastResponse["data"]["total"] === response["data"]["total"]) {
		return result;
	}
	let lastResponseCourseMap = new Map(lastResponse["data"]["list"].map(c => [getCourseUniqKey(c), c]));
	let responseCourseMap = new Map(response["data"]["list"].map(c => [getCourseUniqKey(c), c]));
	// console.log(lastResponseCourseMap);
	// console.log(responseCourseMap);
	responseCourseMap.forEach(((value, key) => {
		if (!lastResponseCourseMap.has(key)) {
			result = result.concat(value);
		}
	}))
	return result;
}

function getCourseUniqKey(course) {
	// 通过calendarId兼容重修情况
	return `${course["courseCode"]}:${course["calendarId"]}`;
}


chrome.notifications.onButtonClicked.addListener(function (notificationId) {
	chrome.notifications.clear(notificationId);
});
chrome.notifications.onClosed.addListener(function (notificationId) {
	if (notificationId=='elect_finish') {
		showElectPage();
	}
});
