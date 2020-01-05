var v=new Vue({
	el:'#body',
	data:{
		courses:{},
		status:'w',
		failmsg:{},
		statusdict:{
			'w':'等待中……',
			'e':'选课中……',
			'f':'已完成',
			'p':'已暂停'
		}
	},
	methods:{
		deleteSup:function(id){
			chrome.runtime.sendMessage({'target':'bg','action':'deleteSup','id':id});
		},
		startSup:function(){
			chrome.runtime.sendMessage({'target':'bg','action':'startSup'});
		}
	},
	computed:{
		hasfail:function(){
			return Object.keys(this.failmsg).length;
		},
		tipclass:function(){
			switch(this.status) {
				case 'w':
				return 'alert alert-warning';
				case 'e':
				return 'alert alert-info';
				case 'f':
				return 'alert alert-success';
				case 'p':
				return 'alert alert-danger';
			}
		}
	}
});

chrome.runtime.sendMessage({'target':'bg','action':'getSup'});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.target!='electsup') return;
	v.courses=request.data[0];
	v.status=request.data[1];
	v.failmsg=request.data[2];
});

