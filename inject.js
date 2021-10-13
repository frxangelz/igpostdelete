/*
	Delete all your posts on Instagram
	(c) 2021 - FreeAngel 
		
		youtube channel : http://www.youtube.com/channel/UC15iFd0nlfG_tEBrt6Qz1NQ
		PLEASE SUBSCRIBE !
		
	github : https://github.com/frxangelz/
*/

const _MAX_DELETE_TO_RELOAD = 40; // will reload page after certain amount of deletions
const _TIMEOUT_IN_SECS = 60;
const _DEFAULT_WAIT_TIME = 5;

tick_count = 0;
first = true;
delete_count = 0;

var CurActionUrl = "";
var _NO_POST_FOUND = false;

var config = {
	enable : 0,
	total : 0
}

var wait_time = _DEFAULT_WAIT_TIME;

var click_count = 0;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.action === "set") {
		config.enable = request.enable;
		tick_count = 0;
		
		if(!config.enable){
			var info = document.getElementById("info_ex");
			if(info) {
				console.log("removed");
				info.parentNode.removeChild(info);
			}
			first = true;
		}		
	}
	
});

function show_info(){

	var info = document.getElementById("info_ex");
	if(!info) {
	
		info = document.createElement('div');
		info.style.cssText = "position: fixed; bottom: 0; width:100%; z-index: 999;background-color: #F5FACA; border-style: solid;  border-width: 1px; margins: 5px; paddingLeft: 10px; paddingRight: 10px;";
		info.innerHTML = "<center><h3 id='status_ex'>active</h3></center>";
		info.id = "info_ex";
		document.body.appendChild(info);
		console.log("info_ex created");
	}
}

function info(txt){

	var info = document.getElementById("status_ex");
	if(!info) { return; }
	if(txt !== ""){	info.textContent = "Deleted : "+config.total+", "+txt; }
	else { info.textContent = "Deleted : "+config.total; }
}

article = null;

function IsDialogOpen(){
  
	var div = document.querySelector('div.pbNvD[role="dialog"]');
	if (div) {return true;}
	return false;
}

function IsInProfilePage(){
	var div = document.querySelector('div.fx7hk[role="tablist"]');
	return div != null ? true : false;
}

function ShowArticle(){
	wait_time = _DEFAULT_WAIT_TIME;

	article = document.querySelector('article.M9sTE');
	if(article) { 
	
		if (!IsDialogOpen()) {
			var btn = article.querySelector('button.wpO6b');
			if(btn) { 
					btn.click(); 
					console.log("ReClick dialog");
			}
		}
		
		return; 
	}
	
	var divs = document.querySelectorAll('div.eLAPa');
	
	if((!divs) || (divs.length < 1)){
	
		_NO_POST_FOUND = true;
		wait_time = _TIMEOUT_IN_SECS;
		console.log("No Post Found !");
		return;
	}
	
	var found = false;
	
	for(var i=0; i<divs.length; i++){
		
		if(divs[i].getAttribute('signed') == 1){ continue; }
		divs[i].setAttribute('signed',1);
		divs[i].scrollIntoView();
		divs[i].click();
		found = true;
		setTimeout(function(){
			article = document.querySelector('article.M9sTE');
			if(article){
				var btn = article.querySelector('button.wpO6b');
				if(btn) { 
					btn.click(); 
					delete_count++; 
					chrome.runtime.sendMessage({action:"inc"},function(response){
						config.total = response.total;
					})					
				}
			}
		},500);
		break;
	}
	
	if(!found) {
		_NO_POST_FOUND = true;
		wait_time = _TIMEOUT_IN_SECS;
		console.log("No Post Found ...!");
		return;
	}
}

function DeletePost(){

	var btns = document.querySelectorAll('button.aOOlW');
	if((!btns) || (btns.length < 1)){
		
		return false;
	}
	
	var b = false;
	for(var i=0; i<btns.length; i++){
	
		if(btns[i].textContent === "Delete"){
			
			console.log("found Delete Button !");
			b = true;
			btns[i].click();
			break;
		}
	}
	
	return b;
}

var loading_tick_count = 0;
var InProfilePage = false;

 	   var readyStateCheckInterval = setInterval(function() {
	       
		   if (document.readyState !== "complete") { return; }

		   if(first){
				first = false;
				chrome.runtime.sendMessage({action: "get"}, function(response){
	
					config.enable = response.enable;
					config.total = response.total;
				});
		   }

		   if(!config.enable) { return; }
		   
		   cur_url = //$(location).attr('href');		   
					 window.location.href;

           tick_count= tick_count+1; 

		   if(cur_url.indexOf("instagram.com/") === -1){
				return;
		   }

 		   show_info();

		   if(DeletePost()) {
			   return;
		   }
		   
		   if(wait_time > 0){
			    // sedang dalam proses menanti
				wait_time--;
				if(InProfilePage){ info("Wait for "+wait_time.toString()+"s"); }
				return;
		   }

		   InProfilePage = IsInProfilePage();

		   if(!InProfilePage){
			     return;
		   }
		   
		   if(_NO_POST_FOUND){
			   window.location.href = cur_url;
			   return;
		   }

		   if(delete_count >= _MAX_DELETE_TO_RELOAD){
			   
			   window.location.href = cur_url;
			   return;
		   }
		   
		   ShowArticle();
		   
		   info("");
		   
	 }, 1000);

