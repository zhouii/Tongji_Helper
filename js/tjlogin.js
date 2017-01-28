

chrome.storage.local.get(['username','password','enable'],function (items) {
	if (!items['enable']) return;
	
	if (window.location.href.indexOf("option=credential")>0) {
		$('#username').val(items['username']==null?"":items['username']).hide();
		$('#password').val(items['password']==null?"":items['password']).hide();
		$('[name=submit]').click();
		$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
	}
	
	if (window.location.href.indexOf("/ID2/loginvalidservice.aspx")>0) {
		$('#TextBox_name').val(items['username']==null?"":items['username']).hide();
		$('#TextBox_pwd').val(items['password']==null?"":items['password']).hide();
		$('#Button_ok').click();
		$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
	}
	
	if (window.location.href.indexOf("/ClientWeb/xcus")>0) {
		if ($('span[class="acc_info_id"]').html()=="") {
			$('span[class="glyphicon glyphicon-log-in"]').click();
			$('input[name=id]').val(items['username']==null?"":items['username']).hide();
			$('input[name=pwd]').val(items['password']==null?"":items['password']).hide();
			$('input[value="登录"]').click().val('Bluecat Helper 正在为您自动登录…').prop('disabled',true);
		}
	}
	
	if (window.location.href.indexOf("xuanke.tongji.edu.cn")>0) {
		if (window.location.pathname=="/" || window.location.pathname=="/index.jsp") {
			$('#username').val(items['username']==null?"":items['username']);
			$('#password').val(items['password']==null?"":items['password']);
			$('input[name="c_submit"]').prop("type","submit").click();
			$('body').html('<h1 align="center">Bluecat Helper 正在为您自动登录…</h1>');
		}
		
		if (window.location.href.indexOf("tj_login/frame.jsp")>0) {
			$('#WindowLeft').prop('cols','300,*');
			$('frame[src="loginTree.jsp"]').prop('scrolling','yes');
		}
		
		function open11(link,qxid,help_url,myxsjl){
		  var re=new RegExp("#","g");
		  link=link.replace(re,"&");
		  re=new RegExp("&","g");
		  link=link.replace(re,"$");
		  parent.detailfrm.location="redirect.jsp?link="+link+"&qxid="+qxid+"&HELP_URL="+help_url+"&MYXSJL="+myxsjl;
		  parent.where="";
			parent.savedcheckid.clear();
			parent.orderby="";
		}
		if (window.location.href.indexOf("loginTree.jsp")>0) {
			$('#navSubMenu_').hide();
			$('font[size="-1"]').hide();
			$('body').prop('scrolling','yes');
			//open11('/tj_xuankexjgl/score/query/student/cjcx.jsp?qxid=20051013779916&mkid=20051013779901','20051013779916','null','null');
		}
		
		
	}
	
		
	
});

