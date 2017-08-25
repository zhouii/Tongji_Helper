chrome.storage.local.get(['username','password','enable','interval','status'],function (items) {
	$('#username').val(items['username']==null?"":items['username']);
	$('#password').val(items['password']==null?"":items['password']);
	$('#interval').val(items['interval']==null?"":items['interval']);
});

$('#save').click(function () {
	chrome.storage.local.set({'username':$('#username').val(),'password':$('#password').val(),'interval':parseInt($('#interval').val()),'enable':true,'status':'toconnect'},function() {
		chrome.runtime.sendMessage({'target':'bg','action':'checkstatus'});
		$('#tip').html('保存成功~').fadeIn().delay(2000).fadeOut();
	});
});
