function SuperUtil(){
	// Get JSON from server
	this.grabJSON = function grabJSON(address, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', address, true);
		xhr.reponseType = 'json';
		xhr.onload = function () {
			var status = xhr.status;
			if(status === 200){
				callback(status, JSON.parse(xhr.response));
			}else {
				callback(status, xhr.response);
			}
		}
		xhr.send();
	};

	// Send JSON to server
	this.sendJSON = function sendJSON(postData, address, callback, postType){
		var xhr = new XMLHttpRequest();
		var url = address;
		xhr.open(postType, url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
			var json = xhr.response;
		    if (xhr.readyState == 4 && xhr.status == 200) {
				//console.log(xhr.response);
				callback(xhr.status,json);
		    } else {
				callback(xhr.status, json);
			}
		}
		var data = JSON.stringify(postData);
		xhr.send(data);
	};
};
