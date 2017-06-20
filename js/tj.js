

chrome.storage.local.get(['username','password','enable','interval'],function (items) {
	if (!items['enable']) return;
	
	if (window.location.href.indexOf("option=credential")>0) {//统一身份认证
		$('#username').val(items['username']==null?"":items['username']).hide();
		$('#password').val(items['password']==null?"":items['password']).hide();
		$('[name=submit]').click();
		$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
	}
	
	if (window.location.href.indexOf("/ID2/loginvalidservice.aspx")>0) {//图书馆系统
		if ($('#Label_error').html()!='') return;
		$('#TextBox_name').val(items['username']==null?"":items['username']).hide();
		$('#TextBox_pwd').val(items['password']==null?"":items['password']).hide();
		$('#Button_ok').click();
		$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
	}
	
	if (window.location.href.indexOf("/clientweb/xcus")>0) {//研习室系统
		if ($('span[class="acc_info_id"]').html()=="") {
			$('span[class="glyphicon glyphicon-log-in"]').click();
			$('input[name=id]').val(items['username']==null?"":items['username']).hide();
			$('input[name=pwd]').val(items['password']==null?"":items['password']).hide();
			$('input[value="登录"]').click().val('Bluecat Helper 正在为您自动登录…').prop('disabled',true);
		}
	}
	
	if (window.location.href.indexOf("phylab.tongji.edu.cn/index.action")>0 || window.location.href.indexOf("phylab.tongji.edu.cn/login.action")>0) {//物理实验
		$('[name="loginForm.name"]').val(items['username']==null?"":items['username']).hide();
		$('[name="loginForm.password"]').val('1');//items['password']==null?"":items['password']).hide();
		$('[name=submitButton]').click();
		$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
	}
	
	if (window.location.host=="xuanke.tongji.edu.cn") {//辣鸡xuanke网
		if ((window.location.pathname=="/" || window.location.pathname=="/index.jsp") && window.location.href.indexOf("?flag=5")<0) {
			$('#username').val(items['username']==null?"":items['username']);
			$('#password').val(items['password']==null?"":items['password']);
			$('input[name="c_submit"]').prop("type","submit").click();
			$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
		}
		
		if (window.location.href.indexOf("tj_login/frame.jsp")>0) {
			$('#WindowLeft').prop('cols','300,*');
			$('frame[src="loginTree.jsp"]').attr('scrolling','yes').attr('src', $('frame[src="loginTree.jsp"]').attr('src'));
		}
		
		if (window.location.href.indexOf("loginTree.jsp")>0) {
			$('#navSubMenu_').hide();
			$('font[size="-1"]').hide();
			setTimeout(function(){parent.detailfrm.location="redirect.jsp?link=/tj_xuankexjgl/score/query/student/cjcx.jsp?qxid=20051013779916$mkid=20051013779901&qxid=20051013779916";},500);
		}
		
		if (window.location.href.indexOf("xspj.jsp")>0) {
			if ($('option[value^=N]:selected').length==0) {
				$('option[value^=N]:first').prop('selected',true);
				$('#judge').click();
				return;
			}
			$('tbody:last tr:eq(1)').after('<tr><td colspan="4"><h3 align="center">Bluecat Tongji Helper 帮你点好了鼠标(⊙_⊙)~</h3></td></tr>');
			$('tbody:last tr:eq(-3) td').prepend('<center><button type="button" id="yj1">讲课生动，课堂气氛活跃，很优秀的老师</button><button type="button" id="yj2">上课总体很好，只有一小点美中不足</button><button type="button" id="yj3">课堂质量一般，有待改进</button><button type="button" id="yj4">这种课听了像没听一样</button><button type="button" id="yj5">渣滓一个！这种人待在同济是同济之耻</button></center>');
			$('#yj1').click(function (){$('#yj').html($('#yj1').html());$('input[type=radio][value=A]').prop('checked',true);});
			$('#yj2').click(function (){$('#yj').html($('#yj2').html());$('input[type=radio][value=B]').prop('checked',true);});
			$('#yj3').click(function (){$('#yj').html($('#yj3').html());$('input[type=radio][value=C]').prop('checked',true);});
			$('#yj4').click(function (){$('#yj').html($('#yj4').html());$('input[type=radio][value=D]').prop('checked',true);});
			$('#yj5').click(function (){$('#yj').html($('#yj5').html());$('input[type=radio][value=E]').prop('checked',true);});
			$('input[type=radio][value=A]').prop('checked',true);
		}
		
	}
	
	if (window.location.href.indexOf("4m3.tongji.edu.cn/eams/tJStdElectCourse!batchOperator.action")>0) {
		if ($('table').html().indexOf('成功')>0) $('body').html('<h1 align="center" style="padding:50px">已选课成功！恭喜！——Bluecat Tongji Helper</h1><h2 align="center"><a href="https://www.zhouii.com/contact-me">如果有帮助欢迎donate以协助我做得更好(⊙v⊙)</a></h2>');
		else setTimeout('refre()',((items['interval']==null || items['interval']=='')?1500:items['interval']));
	}	
	
	if (window.location.href.indexOf("4m3.tongji.edu.cn/eams/tJStdElectCourse!defaultPage.action")>0) {
		setInterval('checkandadd()',1500);
		$('th[width="25%"]').prop('width','19%');
		$('#teachClass>table>thead>tr').append('<th width="6%"><img src="https://qzs.qq.com/qzone/em/e248.gif" alt="斜眼笑"></th>')
	}
	
});

function refre() {
	$('table').after('<h2 align="center" style="padding:50px">Bluecat Tongji Helper 正在刷新…</h2>');
	window.location.reload();
}

function checkandadd() {
	if (false) return;
	var old=false;
	if ($('tr[class=red][id^=1111]').length>0) old=$('tr[class=red][id^=1111]').prop('id');
	if ($('#teachClass>table>tbody>tr>td:last>a').length>0) return;
	if (old) {
		$('#teachClass>table>tbody>tr').each(function () {
			$(this).append('<td><a href="http://4m3.tongji.edu.cn/eams/tJStdElectCourse!batchOperator.action?electLessonIds=&withdrawLessonIds=&exchangeLessonPairs='+$(this).prop('id')+'-'+old+'" onclick=\'alert("即将新建窗口用于辅助，请不要关闭新建的窗口，并请将电脑自动睡眠时间调为“从不”以防刷新停止！")\' target="_blank">辅助</a></td>');
		});
	} else {
		$('#teachClass>table>tbody>tr').each(function () {
			$(this).append('<td><a href="http://4m3.tongji.edu.cn/eams/tJStdElectCourse!batchOperator.action?electLessonIds='+$(this).prop('id')+'&withdrawLessonIds=&exchangeLessonPairs=" onclick=\'alert("即将新建窗口用于辅助，请不要关闭新建的窗口，并请将电脑自动睡眠时间调为“从不”以防刷新停止！")\' target="_blank">辅助</a></td>');
		});
	}
}
