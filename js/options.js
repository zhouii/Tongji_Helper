chrome.storage.local.get(['username','password','enable','interval','showReserver','status','elec_enable','elec_threshold','room'],function (items) {
	$('#username').val(items['username']);
	$('#password').val(items['password']);
	$('#interval').val(items['interval']);
	$('#showReserver').prop('checked',items['showReserver']==null?false:items['showReserver']);
	$('#elec_enable').prop('checked',items['elec_enable']==null?false:items['elec_enable']);
	$('#elec_threshold').val(items['elec_threshold']);
	$('#room').val(items['room']);
	// 默认是开启的
	$('#course_update_enable').prop('checked',items['course_update_enable']==null?true:items['course_update_enable']);
});

$('#save').click(save);

$('#setroom').click(function () {
	save();
	chrome.storage.local.set({setroom:1},function () {chrome.tabs.create({url:'http://202.120.163.129:88/Default.aspx'})});
});

function save () {
	chrome.storage.local.set({'username':$('#username').val(),'password':$('#password').val(),'interval':parseInt($('#interval').val()),'showReserver':$('#showReserver').prop('checked'),'elec_enable':$('#elec_enable').prop('checked'),'elec_threshold':$('#elec_threshold').val(),'course_update_enable':$('#course_update_enable').val(),'enable':true,'status':'toconnect'},function() {
		chrome.runtime.sendMessage({'target':'bg','action':'checkstatus'});
		$('#tip').html('保存成功~').fadeIn().delay(2000).fadeOut();
	});
}
