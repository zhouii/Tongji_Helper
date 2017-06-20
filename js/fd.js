

chrome.storage.local.get(['username','password','enable','interval'],function (items) {
	if (!items['enable']) return;
	
	if (window.location.href.indexOf("xk.fudan.edu.cn/xk/StdElectCourse!batchOperator.action")>0) {
		if ($('table').html().indexOf('成功')>0) $('body').html('<h1 align="center" style="padding:50px">已选课成功！恭喜！——Bluecat Tongji Helper</h1><h2 align="center"><a href="https://www.zhouii.com/contact-me">如果有帮助欢迎donate以协助我做得更好(⊙v⊙)</a></h2>');
		else setTimeout('refre()',((items['interval']==null || items['interval']=='')?1500:items['interval']));
	}	
	
	if (window.location.href.indexOf("xk.fudan.edu.cn/xk/StdElectCourse!defaultPage.action")>0) {
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
			$(this).append('<td><a href="http://xk.fudan.edu.cn/xk/StdElectCourse!batchOperator.action?electLessonIds=&withdrawLessonIds=&exchangeLessonPairs='+$(this).prop('id')+'-'+old+'" onclick=\'alert("即将新建窗口用于辅助，请不要关闭新建的窗口，并请将电脑自动睡眠时间调为“从不”以防刷新停止！")\' target="_blank">辅助</a></td>');
		});
	} else {
		$('#teachClass>table>tbody>tr').each(function () {
			$(this).append('<td><a href="http://xk.fudan.edu.cn/xk/StdElectCourse!batchOperator.action?electLessonIds='+$(this).prop('id')+'&withdrawLessonIds=&exchangeLessonPairs=" onclick=\'alert("即将新建窗口用于辅助，请不要关闭新建的窗口，并请将电脑自动睡眠时间调为“从不”以防刷新停止！")\' target="_blank">辅助</a></td>');
		});
	}
}
