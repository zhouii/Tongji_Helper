$(document).ready(function() {
	chrome.storage.local.get(['enable','status','msg','msg_content'],function (items) {
		$('#enable').prop("checked", items['enable']==true?true:false);
		if (items['status']!='allow') {
			switch (items['status']) {
				case 'toconnect': lock('正在初始化…',true);return;
				case 'toupdate': lock('新版本已发布<br>请<a href="https://www.zhouii.com/tj-helper" target="_blank">更新</a>后使用',false);break;
				case 'toset': lock('请<a href="options.html" target="_blank">设置</a>后使用');
			}
			if ($('#enable').prop('checked')) $('#enable').click();
		}
		if (items['msg']!='0') {
			$('#alert-'+items['msg']).html(items['msg_content']).show();
		}
	});
  
	$('#enable').change(function() {
		chrome.storage.local.set({'enable':$('#enable').prop('checked')});
	});
});

function lock(tip,showimg) {
	$('#waiting>h3').html(tip).css('margin-top',$(window).height()/2-60);
	if (showimg) $('#waiting>img').show();
	else $('#waiting>img').hide();
	$('#waiting').css('display','block');
}
function unlock() {
	$('#waiting').css('display','none');
}


