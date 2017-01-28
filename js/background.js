chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {cancel: true}; },
        {urls: ["*://xuanke.tongji.edu.cn/favicon.ico","*://xuanke.tongji.edu.cn/tj_public/javascript/abc.js"]},
        ["blocking"]);
        
chrome.webRequest.onBeforeRequest.addListener(
        function(details) { return {redirectUrl: "http://4m3.tongji.edu.cn/eams/samlCheck"}; },
        {urls: ["http://4m3.tongji.edu.cn/eams/login.action"]},
        ["blocking"]);