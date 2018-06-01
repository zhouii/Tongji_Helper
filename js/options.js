chrome.storage.local.get(['username','password','enable','interval','showReserver','status'],function (items) {
	$('#username').val(items['username']);
	$('#password').val(items['password']);
	$('#interval').val(items['interval']);
	$('#showReserver').prop('checked',items['showReserver']==null?false:items['showReserver']);
});

$('#save').click(function () {
	chrome.storage.local.set({'username':$('#username').val(),'password':$('#password').val(),'interval':parseInt($('#interval').val()),'showReserver':$('#showReserver').prop('checked'),'enable':true,'status':'toconnect'},function() {
		chrome.runtime.sendMessage({'target':'bg','action':'checkstatus'});
		$('#tip').html('保存成功~').fadeIn().delay(2000).fadeOut();
	});
});
