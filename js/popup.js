$(document).ready(function() {
	$('#site').click(function() {
		chrome.tabs.create({url: 'https://www.zhouii.com/tj-helper'});
	});
	chrome.storage.local.get(['username','password','enable','interval'],function (items) {
		$('#username').val(items['username']==null?"":items['username']);
		$('#password').val(items['password']==null?"":items['password']);
		$('#enable').prop("checked", items['enable']==true?true:false);
		$('#interval').val(items['interval']==null?"":items['interval']);
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
	$('#interval').keyup(function() {
  	chrome.storage.local.set({'interval':parseInt($('#interval').val()),'enable':true});
  	$('#enable').prop("checked", true);
  	$('#tip').html('间隔时间已保存~');
	});
	$('#enable').change(function() {
		chrome.storage.local.set({'enable':$('#enable').prop('checked')});
	});
	$('#score').click(function() {
		chrome.tabs.create({url: 'http://xuanke.tongji.edu.cn/'});
	});
});

