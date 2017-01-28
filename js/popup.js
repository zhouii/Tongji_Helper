$(document).ready(function() {
	$('#site').click(function() {
		chrome.tabs.create({url: 'https://www.zhouii.com/2017/01/182.html'});
	});
	chrome.storage.local.get(['username','password','enable'],function (items) {
		$('#username').val(items['username']==null?"":items['username']);
		$('#password').val(items['password']==null?"":items['password']);
		$('#enable').prop("checked", items['enable']==true?true:false);
	});
  
  $('#username').keyup(function() {
  	chrome.storage.local.set({'username':$('#username').val(),'enable':true});
  	$('#enable').prop("checked", true);
  	$('#tip').html('学号已保存~');
	});
	$('#password').keyup(function() {
		chrome.storage.local.set({'password':$('#password').val(),'enable':true});
  	$('#enable').prop("checked", true);
  	$('#tip').html('密码已保存~');
	});
	$('#enable').change(function() {
		chrome.storage.local.set({'enable':$('#enable').prop('checked')});
	});
	$('#score').click(function() {
		chrome.tabs.create({url: 'http://xuanke.tongji.edu.cn/'});
	});
});

