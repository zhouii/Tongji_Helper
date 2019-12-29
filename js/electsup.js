var v=new Vue({
	el:'#body',
	data:{
		courses:{},
		status:'w',
		failmsg:{},
		statusdict:{
			'w':'等待中……',
			'e':'选课中……',
			'f':'已完成'
		}
	},
	methods:{
		deleteSup:function(id){
			chrome.runtime.sendMessage({'target':'bg','action':'deleteSup','id':id},function(response){v.courses=response[0];v.status=response[1];v.failmsg=response[2];});
		}
	},
	computed:{
		hasfail:function(){
			return Object.keys(this.failmsg).length;
		}
	}
});

chrome.runtime.sendMessage({'target':'bg','action':'getSup'},function(response){v.courses=response[0];v.status=response[1];v.failmsg=response[2];});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='electsup') return;
	v.courses=request.data[0];
	v.status=request.data[1];
	v.failmsg=request.data[2];
});

