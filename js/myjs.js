function logout() {
	var exp = new Date();
	exp.setTime(1);
	document.cookie="PHPSESSID=x;expires="+exp.toGMTString();
	location.reload();
}
function lock(tip) {
	$('#waiting>h1').html(tip).css('margin-top',$(window).height()/2-60);
	$('#waiting').css('display','block');
}
function unlock() {
	$('#waiting').css('display','none');
}
function redtip (txt,time) {
	$('#login_error').css({'top':$(window).height()/2,'display':'block'}).html(txt).hide().slideDown(400).delay(time).slideToggle(400);
}
function bluetip (txt,time) {
	$('#blue').css({'top':$(window).height()/2,'display':'block'}).html(txt).hide().slideDown(400).delay(time).slideToggle(400);
}
function getGet(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null) return unescape(r[2]);
	return null;
}
function getCookie(name){
	var reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	var r = document.cookie.match(reg);
	if(r!=null) return unescape(r[2]);
	return null;
}
async function getStorage(key,default_value){
	return new Promise((resolve,reject)=>{
		chrome.storage.local.get([key],items=> {
			if (items[key]==undefined) resolve(default_value);
			else resolve(items[key]);
		});
	});
}
function myalert(tip,onhidden) {
	$('#myalert').find('p').html(tip);
	$('#myalert').modal('show');
	$('#myalert').on('hidden.bs.modal', onhidden);
}
function success(tip,onhidden) {
	$('#success').find('p').html(tip);
	$('#success').modal('show');
	$('#success').on('hidden.bs.modal', onhidden);
}
function insertBS(){
	$('head').append('<link href="'+chrome.runtime.getURL('css/bootstrap.min.css')+'" rel="stylesheet"><link href="'+chrome.runtime.getURL('css/mystyle.css')+'" rel="stylesheet"><script src="'+chrome.runtime.getURL('js/jquery-3.1.1.min.js')+'"></script>');
	setTimeout(function(){$('head').append('<script src="'+chrome.runtime.getURL('js/bootstrap.min.js')+'"></script>')},100);
}
function myeval(evalstr) {
	$('body').append('<script>'+evalstr+'</script>');
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
Date.prototype.format = function(fmt) { 
	var o = { 
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"S": this.getMilliseconds() //毫秒
	}; 
	if(/(y+)/.test(fmt)) {
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	}
	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt; 
}
var server="https://1.tongji.edu.cn";
//var server="http://122.112.219.67:30669";
