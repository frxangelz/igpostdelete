var config = {
	enable : 0,
	total : 0
}

$(document).ready(function(){
	$("btn#start").click(function(){
		var txt = $(this).text();
		if (txt==="Start"){

			config.enable = 1;
			$(this).text("Stop");
			$(this).removeClass("btn-success");
			$(this).addClass("btn-danger");
			
		} else {
			$(this).text("Start");
			$(this).removeClass("btn-danger");
			$(this).addClass("btn-success");
			config.enable = 0;
		}

		set_status();
	});
	
	get_status();
});	

function set_status(){
	
	chrome.runtime.sendMessage({action: "set",
			enable: config.enable,
		}, function(response){});		

}

function get_status(){
	var $b = $("btn#start");

	chrome.runtime.sendMessage({action: "get"}, function(response){
	
		config.enable = response.enable;
		config.total = response.total;
		
		if (config.enable == 0){
			$b.text("Start");
			$b.removeClass("btn-danger");
			$b.addClass("btn-success");
		} else {
			$b.text("Stop");
			$b.removeClass("btn-success");
			$b.addClass("btn-danger");
		}
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
				
    if (request.action == "set"){
		config.enable = request.enable;
		if (config.enable == 0){
			$b.text("Start");
			$b.removeClass("btn-danger");
			$b.addClass("btn-success");
		} else {
			$b.text("Stop");
			$b.removeClass("btn-success");
			$b.addClass("btn-danger");
		}
		
		return;
	}
	
 });