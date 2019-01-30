var v=new Vue({
	el:'#mail',
	data:{
		mails:null
	},
	methods:{
		leftClick:function(index) {
			if (v.mails[index].mail.endsWith('@qq.com')||v.mails[index].mail.endsWith('@foxmail.com')) {
				chrome.storage.local.set({mail_index:index});
				chrome.cookies.remove({url:'http://mail.qq.com',name:'p_skey'},function(){chrome.tabs.create({url:'https://mail.qq.com'});});
			} else if (v.mails[index].mail.endsWith('@163.com')) {
				chrome.storage.local.set({mail_index:index});
				chrome.cookies.remove({url:'http://mail.163.com',name:'NTES_SESS'},function(){});
				chrome.cookies.remove({url:'http://mail.163.com',name:'NTES_PASSPORT'},function(){});
				chrome.cookies.remove({url:'http://mail.163.com',name:'MAIL_SESS'},function(){chrome.tabs.create({url:'https://mail.163.com'});});
			} else if (v.mails[index].mail.endsWith('@126.com')) {
				chrome.storage.local.set({mail_index:index});
				chrome.cookies.remove({url:'http://mail.126.com',name:'NTES_SESS'},function(){});
				chrome.cookies.remove({url:'http://mail.126.com',name:'NTES_PASSPORT'},function(){});
				chrome.cookies.remove({url:'http://mail.126.com',name:'MAIL_SESS'},function(){chrome.tabs.create({url:'https://mail.126.com'});});
			} else if (v.mails[index].mail.endsWith('@tongji.edu.cn')) {
				chrome.storage.local.set({mail_index:index});
				chrome.tabs.create({url:'https://mail.tongji.edu.cn'});
			} else if (v.mails[index].mail.endsWith('@aliyun.com')) {
				chrome.storage.local.set({mail_index:index});
				chrome.tabs.create({url:'https://mail.aliyun.com'});
			}
		},
		rightClick:function(e){
			e.preventDefault();
			copy(v.mails[e.target.id].hmwk);
		}
	}
});
chrome.storage.local.get(['enable','status','msg','msg_content','mail'],function (items) {
	$('#enable').prop("checked", items['enable']==true?true:false);
	if (items['status']!='allow') {
		switch (items['status']) {
			case 'toconnect': lock('正在初始化…',true);return;
			case 'toupdate': lock(items['msg_content'],false);break;
			case 'toset': lock(items['msg_content']);
		}
		if ($('#enable').prop('checked')) $('#enable').click();
	}
	if (items['msg']!='0') $('#alert-'+items['msg']).html(items['msg_content']).show();
	v.mails=items['mail'];
	$('[data-url]').click(function(){chrome.tabs.create({url:$(this).data('url')});});
	$('#checkscore').click(function(){chrome.storage.local.set({checkscore:1});});
});

$('#enable').change(function() {
	chrome.storage.local.set({'enable':$('#enable').prop('checked')});
});

$('#otherlnk_btn').mouseover(function(){if ($('#otherlnk_div.open').length==0) $(this).click()});
$('#mail_btn').mouseover(function(){if ($('#mail_div.open').length==0) $(this).click()});

function lock(tip,showimg) {
	$('#waiting>h3').html(tip).css('margin-top',$(window).height()/2-60);
	if (showimg) $('#waiting>img').show();
	else $('#waiting>img').hide();
	$('#waiting').css('display','block');
}
function unlock() {
	$('#waiting').css('display','none');
}

function copy(txt) {
	$('body').append('<textarea id="copytxt">'+txt+'</textarea>');
	$('#copytxt')[0].select();
	document.execCommand('copy');
	$('#copytxt').remove();
}
