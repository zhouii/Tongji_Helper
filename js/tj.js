
chrome.storage.local.get(['username','password','enable','interval','status','mail','mail_index'],function (items) {
	if (!items['enable']) return;
	if (window.location.host.indexOf("192.168.192")==0 && $("title").html()=="同济大学上网认证系统") {
		$('#loginname').val(items['username']==null?"":items['username']).hide();
		$('#password').val(items['password']==null?"":items['password']).hide();
		$('input[alt="Submit"]').click();
		$('div[class="login-botton"]').html('Tongji Helper 正在为您自动登录…');
	}

	if (items['status']!='allow') return;
	
	if (window.location.host=="ids.tongji.edu.cn:8443" && window.location.href.indexOf("option=credential")>0) {//统一身份认证
		$('#username').val(items['username']==null?"":items['username']);
		$('#password').val(items['password']==null?"":items['password']);
		$('[name=submit]').click();
		$('body').html('<h1 align="center">Tongji Helper 正在为您自动登录…</h1>');
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
			setTimeout(function(){myeval("open11('01','/tj_xuankexjgl/score/query/student/cjcx.jsp?qxid=20051013779916&mkid=20051013779901','20051013779916','null','null');");},800);			
		}
		
		if (window.location.href.indexOf("xspj.jsp")>0) {
			if ($('option[value^=N]:selected').length==0) {
				$('option[value^=N]:first').prop('selected',true);
				$('#judge').click();
				return;
			}
			insertBS();
			$('tbody:last tr:eq(1)').after('<tr><td colspan="4"><h4 align="center">Tongji Helper 帮你点好了鼠标(⊙_⊙)~</h4></td></tr>');
			$('tbody:last tr:eq(-3) td').prepend('<center><div class="btn-group-vertical" role="group"><button type="button" class="btn btn-success" id="yj1">讲课生动，课堂气氛活跃，很优秀的老师</button><button type="button" class="btn btn-primary" id="yj2">上课总体很好，只有一小点美中不足</button><button type="button" class="btn btn-info" id="yj3">课堂质量一般，有待改进</button><button type="button" class="btn btn-warning" id="yj4">这种课听了像没听一样</button><button type="button" class="btn btn-danger" id="yj5">渣滓一个！这种人待在同济是同济之耻</button></div></center>');
			$('#yj1').click(function (){$('#yj').html($('#yj1').html());$('input[type=radio][value=A]').prop('checked',true);});
			$('#yj2').click(function (){$('#yj').html($('#yj2').html());$('input[type=radio][value=B]').prop('checked',true);});
			$('#yj3').click(function (){$('#yj').html($('#yj3').html());$('input[type=radio][value=C]').prop('checked',true);});
			$('#yj4').click(function (){$('#yj').html($('#yj4').html());$('input[type=radio][value=D]').prop('checked',true);});
			$('#yj5').click(function (){$('#yj').html($('#yj5').html());$('input[type=radio][value=E]').prop('checked',true);});
			$('input[type=radio][value=A]').prop('checked',true);
		}

		if (window.location.href.indexOf('cjcx.jsp')>0) $('body').stop().animate({scrollTop: $(window).height()},800);
		
	}
	
	if (window.location.host=="4m3.tongji.edu.cn") {
		if (window.location.href.indexOf("StdElectCourse!batchOperator.action")>0) {
			if ($('html').html().indexOf('成功')>0) {
				$('table').after('<h1 align="center" style="padding:50px">已选课成功！恭喜！——Tongji Helper</h1><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle"     style="display:block"     data-ad-client="ca-pub-4798098153916731"     data-ad-slot="6753584008"     data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script><h2 align="center" style="margin:30px">如果有帮助欢迎点击上方广告或通过微信支付宝donate以协助我做得更好(⊙v⊙)</h2><div style="max-width:700px;margin: auto;"><div style="float:left"><img src="https://www.zhouii.com/public/qr_wxpay.jpg" style="max-width: 300px;"></div><div style="float:right"><img src="https://www.zhouii.com/public/qr_alipay.jpg" style="max-width: 300px;"></div></div>');
				chrome.runtime.sendMessage({'target':'bg','action':'electSucceed','c':$('table').html()});
			}
			else setTimeout(refre,((items['interval']==null || items['interval']=='')?1500:items['interval']));
		}	
		
		if (window.location.href.indexOf("4m3.tongji.edu.cn/eams/tJStdElectCourse!defaultPage.action")>0) {
			$('#notice').after('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle"     style="display:block"     data-ad-client="ca-pub-4798098153916731"     data-ad-slot="9000006805"     data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script><p id="adtip" align="center"></p>');
			setInterval('checkandadd("tJ")',1500);
			$('#teachClass>table>thead>tr').append('<th width="6%"><img src="https://qzs.qq.com/qzone/em/e248.gif" alt="斜眼笑"></th>');
		}
		if (window.location.href.indexOf("4m3.tongji.edu.cn/eams/sJStdElectCourse!defaultPage.action")>0) {
			$('#notice').after('<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle"     style="display:block"     data-ad-client="ca-pub-4798098153916731"     data-ad-slot="9000006805"     data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script><p id="adtip" align="center"></p>');
			setInterval('checkandadd("sJ")',1500);
			$('#teachClass>table>thead>tr').append('<th width="6%"><img src="https://qzs.qq.com/qzone/em/e248.gif" alt="斜眼笑"></th>');
		}
		myeval("window.onpopstate=function(){\
			if (window.location.href.indexOf('Table')>0 && $('input[value=切换学期]').next().length==0) {\
				$('input[value=切换学期]').after('<a href=\"javascript:void(0);\" style=\"margin-left:10px\" onclick=\"javascript:$(\\\'#semesterCalendar_target\\\').val($(\\\'#semesterCalendar_target\\\').val()-1+2);$(\\\'input[value=切换学期]\\\').click();\">下一学期</a>');\
				$('input[value=切换学期]').after('<a href=\"javascript:void(0);\" style=\"margin-left:10px\" onclick=\"javascript:$(\\\'#semesterCalendar_target\\\').val($(\\\'#semesterCalendar_target\\\').val()-1);$(\\\'input[value=切换学期]\\\').click();\">上一学期</a>');\
				$('input[value=切换]').after('<a href=\"javascript:void(0);\" style=\"margin-left:10px\" onclick=\"javascript:$(\\\'#semesterCalendar_target\\\').val($(\\\'#semesterCalendar_target\\\').val()-1+2);$(\\\'input[value=切换]\\\').click();\">下一学期</a>');\
				$('input[value=切换]').after('<a href=\"javascript:void(0);\" style=\"margin-left:10px\" onclick=\"javascript:$(\\\'#semesterCalendar_target\\\').val($(\\\'#semesterCalendar_target\\\').val()-1);$(\\\'input[value=切换]\\\').click();\">上一学期</a>');\
			}\
		}");
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
		myeval("var ev = document.createEvent('KeyboardEvent');\
		ev.initKeyboardEvent('keyup', true, true, window);\
		Object.defineProperty(ev,'keyCode',{get : function() {return this.keyCodeVal;}}); \
        ev.keyCodeVal=13;\
		document.getElementsByName('password')[0].dispatchEvent(ev);");
	}

	if (window.location.host=='passport.126.com') {//126邮箱自动登录
		if (!items['mail'][items['mail_index']].mail.endsWith('@126.com')) return;
		chrome.storage.local.set({mail_index:-1});
		$('[name="email"]').val(items['mail'][items['mail_index']].mail);
		$('[name="password"]').val(items['mail'][items['mail_index']].pswd).focus();
		myeval("var ev = document.createEvent('KeyboardEvent');\
		ev.initKeyboardEvent('keyup', true, true, window);\
		Object.defineProperty(ev,'keyCode',{get : function() {return this.keyCodeVal;}}); \
        ev.keyCodeVal=13;\
		document.getElementsByName('password')[0].dispatchEvent(ev);");
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
				$('div.cld-occupy').css('font-size','16px');
				res=JSON.parse(res).data;
				for (var i in res) for (var j in res[i].ts) $('div.cld-list-qzs>div:eq('+i+')>div.cld-occupy:eq('+j+')').html(res[i].ts[j].owner);
			}});
		});
	}
	if (request.action=='refresh') window.location.reload();
});

if (window.location.host=="xuanke.tongji.edu.cn" && window.location.href.indexOf("o.jsp")>0) chrome.runtime.sendMessage({'target':'bg','sh':$('td[nowrap]').html()});
if (window.location.host=="4m3.tongji.edu.cn" && window.location.href.indexOf("electionP")>0) chrome.runtime.sendMessage({'target':'bg','sh':$('[id^="s"]').html()});

function refre() {
	$('table').after('<h2 align="center" style="padding:50px">Tongji Helper 正在刷新…</h2>');
	window.location.reload();
}

function checkandadd(typ) {
	if ($('ins').html()=='') {
		$('#adtip').html('我做插件也很辛苦啊。。免费开源的插件就靠广告赚点微小的外快。。我辅助你选课你还屏蔽我的广告你忍心吗<img src="https://qzs.qq.com/qzone/em/e150.gif"><br>辅助按钮将在广告加载完成后显示');
		return;
	} else $('#adtip').html('');
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

var date=new Date();
Date.prototype.format = function(fmt) { 
	var o = { 
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(), //日 
        "H+": this.getHours()%12, //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "S": this.getMilliseconds() //毫秒
    }; 
    if(/(y+)/.test(fmt)) {
    	fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
    	if(new RegExp("("+ k +")").test(fmt)){
    		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    	}
    }
    return fmt; 
}

