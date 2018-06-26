chrome.storage.local.get(['username','password','enable','interval','showReserver','status','elec_enable','elec_threshold','room'],function (items) {
	$('#username').val(items['username']);
	$('#password').val(items['password']);
	$('#interval').val(items['interval']);
	$('#showReserver').prop('checked',items['showReserver']==null?false:items['showReserver']);
	$('#elec_enable').prop('checked',items['elec_enable']==null?false:items['elec_enable']);
	$('#elec_threshold').val(items['elec_threshold']);
});

$('#save').click(function () {
	chrome.storage.local.set({'username':$('#username').val(),'password':$('#password').val(),'interval':parseInt($('#interval').val()),'showReserver':$('#showReserver').prop('checked'),'elec_enable':$('#elec_enable').prop('checked'),'elec_threshold':$('#elec_threshold').val(),'enable':true,'status':'toconnect'},function() {
		chrome.runtime.sendMessage({'target':'bg','action':'checkstatus'});
		$('#tip').html('保存成功~').fadeIn().delay(2000).fadeOut();
	});
});
