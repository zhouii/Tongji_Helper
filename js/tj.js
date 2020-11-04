var teachers;
chrome.storage.local.get(['username','password','enable','interval','status','mail','mail_index','checkscore','setroom'],function (items) {
	if (!items['enable']) return;
	if (window.location.host.indexOf("192.168.192")==0 && $("title").html()=="同济大学上网认证系统") {
		$('#loginname').val(items['username']==null?"":items['username']).hide();
		$('#password').val(items['password']==null?"":items['password']).hide();
		setTimeout(function(){
			$('input[alt="Submit"]').click();
			$('div[class="login-botton"]').html('Tongji Helper 正在为您自动登录…');
		},500);
	}

	if (items['status']!='allow') return;

	let isPwdFailed = $('#error').text().includes("密码错误");
	if (window.location.host=="ids.tongji.edu.cn:8443" && !isPwdFailed) { //统一身份认证
		$('#username').val(items['username'] == null ? "" : items['username']).hide();
		$('#password').val(items['password'] == null ? "" : items['password']).hide();
		let $codeImg = $('#codeImg');
		$('[name=btsubmit]').val('Tongji Helper 正在为您自动登录…')
		setTimeout(async () => {
			let attr = $codeImg.attr("src");
			// 设置了一个最大尝试次数，避免网络原因导致验证码完全加载不出来的情况
			const attemptCount = 10;
			for (let i = 0; i < attemptCount; i++) {
				attr = $codeImg.attr("src");
				if (!(attr === undefined || attr === "#")) {
					break;
				}
				if (i==attemptCount-1) window.location.reload();
				await sleep(1000);
			}
			processAndPredict(attr).then(v => {
				$('#Txtidcode').val(v);
				$('form').trigger("submit");
			});
		}, 10);
	}
	
	if (window.location.host=="lib.tongji.edu.cn") {
		if (window.location.href.indexOf("/loginvalidservice.aspx")>0) {//图书馆系统
			if ($('#Label_error').html()!='') return;
			$('#TextBox_name').val(items['username']==null?"":items['username']);
			$('#TextBox_pwd').val(items['password']==null?"":items['password']);
			$('#Button_ok').click();
			$('body').html('<h1 align="center">Tongji Helper 正在为您自动登录…</h1>');
		}

		if (window.location.href.indexOf("/clientweb/xcus")>0 && $('span[class="acc_info_id"]').html()=="") {//研习室系统
			$('span[class="glyphicon glyphicon-log-in"]').click();
			$('input[name=id]').val(items['username']==null?"":items['username']).hide();
			$('input[name=pwd]').val(items['password']==null?"":items['password']).hide();
			$('input[value="登录"]').click().val('Tongji Helper 正在为您自动登录…').prop('disabled',true);
		}
	} 


	if (window.location.host=="phylab.tongji.edu.cn" && (window.location.href.indexOf("index.action")>0 || window.location.href.indexOf("login.action")>0)) {//物理实验
		$('[name="loginForm.name"]').val(items['username']==null?"":items['username']).hide();
		$('[name="loginForm.password"]').val('1');//items['password']==null?"":items['password']).hide();
		$('[name=submitButton]').click();
		$('body').html('<h1 align="center">Tongji Helper 正在为您自动登录…</h1>');
	}

	if (window.location.href=="http://yiliao.tongji.edu.cn/" || window.location.href=="http://yiliao.tongji.edu.cn/default.aspx") {//医疗报销系统
		$('#TxtLogin').val(items['username']==null?"":items['username']);
		$('#TxtPwd').val(items['password']==null?"":items['password']);
		$('#txtcode').val(getCookie('tjloginverify'));
		$('#BtnLogin').click();
		$('body').html('<h1 align="center">Tongji Helper 正在为您自动登录…</h1>');
	}

	if (window.location.href=="http://itongjis.tongji.edu.cn/Home/Public/login") {//itongjis
		$('input.sub').click();
		$('body').html('<h1 align="center">Tongji Helper 正在为您自动登录…</h1>');
	}
	
	if (window.location.host=="xuanke.tongji.edu.cn") {//辣鸡xuanke网
		if ((window.location.pathname=="/" || window.location.pathname=="/index.jsp") && window.location.href.indexOf("?flag=5")<0) {
			window.location.href=$('a').prop('href');
		}
		
		if (window.location.href.indexOf("tj_login/frame.jsp")>0) {
			$('#WindowLeft').prop('cols','300,*');
			$('frame[src="loginTree.jsp"]').attr('scrolling','yes').attr('src', $('frame[src="loginTree.jsp"]').attr('src'));
		}
		
		if (window.location.href.indexOf("loginTree.jsp")>0) {
			$('#navSubMenu_').hide();
			$('font[size="-1"]').hide();
			setTimeout(function(){
				if (items['checkscore']==1) {
					myeval("open11('01','/tj_xuankexjgl/score/query/student/cjcx.jsp?qxid=20051013779916&mkid=20051013779901','20051013779916','null','null');");
				}
			},800);
		}
		
		if (window.location.href.indexOf("xspj.jsp")>0) {
			if ($('option[value^=N]:selected').length==0) {
				$('option[value^=N]:first').prop('selected',true);
				$('#judge').click();
				return;
			}
			insertBS();
			$('tbody:last tr:eq(1)').after('<tr><td colspan="4"><h4 align="center">Tongji Helper 帮你点好了鼠标(⊙v⊙)~</h4></td></tr>');
			$('tbody:last tr:eq(-3) td').prepend('<center><div class="btn-group-vertical" role="group"><button type="button" class="btn btn-success" id="yj1">讲课生动，课堂气氛活跃，很优秀的老师</button><button type="button" class="btn btn-primary" id="yj2">上课总体很好，只有一小点美中不足</button><button type="button" class="btn btn-info" id="yj3">课堂质量一般，有待改进</button><button type="button" class="btn btn-warning" id="yj4">这种课听了像没听一样</button><button type="button" class="btn btn-danger" id="yj5">渣滓一个！这种人待在同济是同济之耻</button></div></center>');
			$('#yj1').click(function (){$('#yj').html($('#yj1').html());$('input[type=radio][value=A]').prop('checked',true);});
			$('#yj2').click(function (){$('#yj').html($('#yj2').html());$('input[type=radio][value=B]').prop('checked',true);});
			$('#yj3').click(function (){$('#yj').html($('#yj3').html());$('input[type=radio][value=C]').prop('checked',true);});
			$('#yj4').click(function (){$('#yj').html($('#yj4').html());$('input[type=radio][value=D]').prop('checked',true);});
			$('#yj5').click(function (){$('#yj').html($('#yj5').html());$('input[type=radio][value=E]').prop('checked',true);});
			$('input[type=radio][value=A]').prop('checked',true);
		}

		if (window.location.href.indexOf('cjcx.jsp')>0 && items['checkscore']==1) {
			$('body').stop().animate({scrollTop: $(window).height()},800);
			chrome.storage.local.set({checkscore:0});
		}
		
	}
	
	if (window.location.host=="4m3.tongji.edu.cn") {
		if (window.location.href.indexOf("StdElectCourse!batchOperator.action")>0) {
			if ($('html').html().indexOf('成功')>0) {
				$('table').after('<iframe src="https://www.zhouii.com/tj_helper/elected.html" style="border: none;width: 100%;height: 800px;"></iframe>');
				chrome.runtime.sendMessage({'target':'bg','action':'electSucceed','c':$('table').html()});
			}
			else setTimeout(refre,((items['interval']==null || items['interval']=='')?1500:items['interval']));
		}
		$('head').append('<style>[data-title]:after{content:attr(data-title);position:absolute;text-align:left;transform:translate(10px);color:#fff;text-shadow:0 -1px 0px black;box-shadow:4px 4px 8px rgba(0,0,0,0.3);background:#383838;border-radius:2px;padding:3px 10px;font-size:12px;white-space:pre;transition:all.3s;opacity:0;visibility:hidden;}[data-title]:hover:after{transition-delay:100ms;visibility:visible;transform:translate(10px,-6px);opacity:1;}</style>');
		if (window.location.href.indexOf("4m3.tongji.edu.cn/eams/tJStdElectCourse!defaultPage.action")>0) {
			setInterval('checkandadd("tJ")',1500);
			$('#teachClass>table>thead>tr').append('<th width="6%"><img src="https://qzs.qq.com/qzone/em/e248.gif" alt="斜眼笑"></th>');
		}
		if (window.location.href.indexOf("4m3.tongji.edu.cn/eams/sJStdElectCourse!defaultPage.action")>0) {
			$('#notice').after('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle"     style="display:block"     data-ad-client="ca-pub-4798098153916731"     data-ad-slot="9000006805"     data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script><p id="adtip" align="center"></p>');
			setInterval('checkandadd("sJ")',1500);
			$('#teachClass>table>thead>tr').append('<th width="6%"><img src="https://qzs.qq.com/qzone/em/e248.gif" alt="斜眼笑"></th>');
		}
		if (window.location.href.indexOf('courseTableForStd!courseTable.action')>0 && $('input[value=切换学期]').next().length==0) {
			$('input[value=切换学期]').after('<a href="javascript:void(0);" style="margin-left:10px" onclick="javascript:$(\'#semesterCalendar_target\').val($(\'#semesterCalendar_target\').val()-1+2);$(\'input[value=切换学期]\').click();">下一学期</a>');
			$('input[value=切换学期]').after('<a href="javascript:void(0);" style="margin-left:10px" onclick="javascript:$(\'#semesterCalendar_target\').val($(\'#semesterCalendar_target\').val()-1);$(\'input[value=切换学期]\').click();">上一学期</a>');
		}
		if (window.location.href=='http://4m3.tongji.edu.cn/eams/courseTableForStd!allTextBook.action') {
			$('tbody tr>td:last-child').each(function(){$(this).html('<a href="http://webpac.lib.tongji.edu.cn/opac/openlink.php?isbn='+$(this).html()+'&series=&callno=&keyword=&year=&doctype=ALL&lang_code=ALL&displaypg=20&showmode=list&sort=CATA_DATE&orderby=desc&location=ALL&with_ebook=on" target="_blank">'+$(this).html()+'</a>');});
			$('table').after('<p>Tip：单击书号可查看图书馆馆藏情况。——Tongji Helper</p>');
		}
	}

	if ((window.location.href.includes('http://202.120.163.129:88/buyRecord') || window.location.href.includes('http://202.120.163.129:88/usedRecord'))&&items['setroom']) {
		var room=/<h6>.*?(\d*)\s*?剩余/.exec($('html').html())[1];
		chrome.storage.local.set({room:room,setroom:0});
		chrome.runtime.sendMessage({'target':'bg','action':'setRoomSucceed','room':room});
	}

	if (window.location.host=='paycwc.tongji.edu.cn') {
		if (window.location.pathname.indexOf('/payment/pay/payment.jsp')==0) {
			$('table:first').remove();
			$('form').css('height','100%');
			$('#ext-gen13').css('overflow-y','auto');
		}
	}

	if (window.location.href=="https://courses.tongji.edu.cn/sign-in") {//同济大学云课堂自动登录跳转
		$(".login-btn").click();
	}

	if (window.location.href.indexOf('https://cdc.tongji.edu.cn/jweb/jyfx/wsdc/dywj.bo')==0) {
		$('p.title2').after('<h2 style="text-align:center;">反对强制问卷强奸用户体验！Tongji Helper帮你填好了整张问卷，如果你想自己填也可以<button type="button" onclick="javascript:$(\'input:not(:submit)\').val(\'\').attr(\'checked\',false);$(\'textarea\').val(\'\');">清空</button>后自己填</h2>');
		$('input:radio').click();
		$('input:text').val('5').blur();
		var checks=new Set();
		$('input:checkbox,.pxtbtn').each(function(){
			checks.add($(this).attr('name'));
		});console.log(checks);
		for (var check of checks) {
			$('input[name='+check+']:last').click();
		}
		$('textarea').val('建议不要强制填写问卷才能继续填写毕业去向，会造成反感！');
		$(window).scrollTop(0);
	}

	if (window.location.href.indexOf('https://idp2.tongji.edu.cn/idp/profile/SAML2/Redirect/SSO')==0 && $('.form-error').length==0) {//CARSI教育网统一认证
		$('#username').val(items['username']==null?"":items['username']);
		$('#password').val(items['password']==null?"":items['password']);
		$('button[type="submit"]').click().prop('disabled',true);
	}

	if (window.location.host=='xui.ptlogin2.qq.com' && window.location.href.indexOf('mail.qq.com')) {//qq邮箱自动登录
		if (!items['mail'][items['mail_index']].mail.endsWith('@qq.com') && !items['mail'][items['mail_index']].mail.endsWith('@foxmail.com')) return;
		chrome.storage.local.set({mail_index:-1});
		$('#u').val(items['mail'][items['mail_index']].mail);
		$('#p').val(items['mail'][items['mail_index']].pswd);
		$('#login_button').click();
	}

	if (window.location.host=='dl.reg.163.com') {//163邮箱自动登录
		if (!items['mail'][items['mail_index']].mail.endsWith('@163.com')) return;
		chrome.storage.local.set({mail_index:-1});
		$('[name="email"]').val(items['mail'][items['mail_index']].mail);
		$('[name="password"]').val(items['mail'][items['mail_index']].pswd).focus();
		setTimeout(function(){myeval("var ev = document.createEvent('KeyboardEvent');\
		ev.initKeyboardEvent('keyup', true, true, window);\
		Object.defineProperty(ev,'keyCode',{get : function() {return this.keyCodeVal;}}); \
		ev.keyCodeVal=13;\
		document.getElementsByName('password')[0].dispatchEvent(ev);");},500);
	}

	if (window.location.host=='passport.126.com') {//126邮箱自动登录
		if (!items['mail'][items['mail_index']].mail.endsWith('@126.com')) return;
		chrome.storage.local.set({mail_index:-1});
		$('[name="email"]').val(items['mail'][items['mail_index']].mail);
		$('[name="password"]').val(items['mail'][items['mail_index']].pswd).focus();
		setTimeout(function(){myeval("var ev = document.createEvent('KeyboardEvent');\
		ev.initKeyboardEvent('keyup', true, true, window);\
		Object.defineProperty(ev,'keyCode',{get : function() {return this.keyCodeVal;}}); \
		ev.keyCodeVal=13;\
		document.getElementsByName('password')[0].dispatchEvent(ev);");},500);
	}

	if (window.location.href=='https://mail.tongji.edu.cn/') {//同济邮箱自动登录
		if (!items['mail'][items['mail_index']].mail.endsWith('@tongji.edu.cn')) return;
		chrome.storage.local.set({mail_index:-1});
		$('#uid').val(items['mail'][items['mail_index']].mail);
		$('#password').val(items['mail'][items['mail_index']].pswd);
		$('button.submit').click();
	}

	if (window.location.host=='passport.alibaba.com' && window.location.href.indexOf('appName=yunmail')) {//阿里云邮箱自动登录
		if (!items['mail'][items['mail_index']].mail.endsWith('@aliyun.com')) return;
		chrome.storage.local.set({mail_index:-1});
		$('#fm-login-id').val(items['mail'][items['mail_index']].mail);
		$('#fm-login-password').val(items['mail'][items['mail_index']].pswd);
		$('#fm-login-submit').click();
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='cs') return;
	if (request.action=='addReserverName') {
		chrome.storage.local.get(['enable','status','showReserver'],function (items) {
			if (!items['enable'] || items['status']!='allow' || !items['showReserver']) return;
			$.ajax({url:request.url+'&c=1',timeout:3000,success:function (res) {
				$('div.cld-occupy').css('font-size','15px');
				res=JSON.parse(res).data;
				for (var i in res) for (var j in res[i].ts) $('div.cld-list-qzs>div:eq('+i+')>div.cld-occupy:eq('+j+')').html(res[i].ts[j].owner).attr('accno',res[i].ts[j].accno).css('padding-top','8px');
				$('div.cld-list-qzs>div>div.cld-occupy').each(function(){
					$.ajax({type:'get',url:'http://lib.tongji.edu.cn/yxxj/ClientWeb/pro/ajax/data/searchAccount.aspx?type=&&term='+$(this).html(),success:function(res){
						res=JSON.parse(res);
						for (var i in res) $('[accno="'+res[i].id+'"]').html($('[accno="'+res[i].id+'"]').html()+'-'+res[i].szLogonName);
					}});
				});
			}});
		});
	}
	if (request.action=='refresh') window.location.reload();
	if (request.action=='addElectButton') {
		chrome.storage.local.get(['enable','status'],function (items) {
			if (!items['enable'] || items['status']!='allow') return;
			attrname=Object.keys($('.el-col-13 .head').data())[0];
			$.ajax({url:request.url+'&c=1',type:'post',timeout:3000,success:function (res) {
				if ($('.el-col-13 .head :last-child[ico]').length==0)
					$('.el-col-13 .head').append('<td data-'+attrname+' ico><img src="https://qzs.qq.com/qzone/em/e248.gif"></td>');
				courses={};
				for (index in res.data) {
					$('[id^=data]:eq('+index+')').append('<td data-'+attrname+'><button courseid="'+res.data[index].teachClassId+'" class="el-button el-button--small" style="padding: 9px 5px;margin: 0 2px;">辅助</button></td>');
					courses[res.data[index].teachClassId]=res.data[index];
				}
				$('button[courseid]').click(function(){
					if ($('#data-tr').length>0) {
						myeval('vueApp.showMsgBox({message:"退课后可辅助选课——Tongji Helper"})');
						return;
					}
					chrome.runtime.sendMessage({'target':'bg','action':'addSup','course':courses[$(this).attr('courseid')]});
				});
			}});
		});
	}
	if (request.action=='refreshCourseTable')
		myeval('vueApp.$children[0].$children[0].$children[2].$children[1].$children[0].$children[0].$children[0].getData()');
});

if (window.location.host=="xuanke.tongji.edu.cn" && window.location.href.indexOf("o.jsp")>0) chrome.runtime.sendMessage({'target':'bg','sh':$('td[nowrap]').html()});
if (window.location.host=="4m3.tongji.edu.cn" && window.location.href.indexOf("electionP")>0) chrome.runtime.sendMessage({'target':'bg','sh':$('[id^="s"]').html()});

function refre() {
	$('table').after('<h2 align="center" style="padding:50px">Tongji Helper 正在刷新…</h2>');
	window.location.reload();
}

function checkandadd(typ) {
	var old=false;
	if ($('tr[class=red][id^=1111]').length>0) old=$('tr[class=red][id^=1111]').prop('id');
	if ($('#teachClass>table>tbody>tr>td:last>a').html()=='辅助') return;
	if (old) {
		$('#teachClass>table>tbody>tr').each(function () {
			$(this).append('<td><a href="http://4m3.tongji.edu.cn/eams/'+typ+'StdElectCourse!batchOperator.action?electLessonIds=&withdrawLessonIds=&exchangeLessonPairs='+$(this).prop('id')+'-'+old+'" onclick=\'alert("即将新建窗口用于辅助，请不要关闭新建的窗口，并请将电脑自动睡眠时间调为“从不”以防刷新停止！")\' target="_blank">辅助</a></td>');
		});
	} else {
		$('#teachClass>table>tbody>tr').each(function () {
			$(this).append('<td><a href="http://4m3.tongji.edu.cn/eams/'+typ+'StdElectCourse!batchOperator.action?electLessonIds='+$(this).prop('id')+'&withdrawLessonIds=&exchangeLessonPairs=" onclick=\'alert("即将新建窗口用于辅助，请不要关闭新建的窗口，并请将电脑自动睡眠时间调为“从不”以防刷新停止！")\' target="_blank">辅助</a></td>');
		});
	}
}

