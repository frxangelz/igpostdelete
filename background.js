var config = {
	enable : 0,
	total : 0
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
				
    if (request.action == "set"){
		config.enable = request.enable;
		send_enable();
		return;
	}
	
	if(request.action == "get"){
		var message = {action: "set", 
					   enable: config.enable, 
						total:config.total};
		sendResponse(message);
		return;
	}
	
	if(request.action == "inc"){
		config.total++;
		sendResponse({total:config.total});
		return;
	}
	
	if(request.action == "log"){
		
		console.log(request.log);
		return;
	}
	
 });
 
 function send_enable(){
 
		chrome.tabs.query({}, function(tabs) {
		var message = {action: "set", 
					   enable: config.enable, 
					   total:config.total};
		for (var i=0; i<tabs.length; ++i) {
			chrome.tabs.sendMessage(tabs[i].id, message);
		}
	}); 
 }
  